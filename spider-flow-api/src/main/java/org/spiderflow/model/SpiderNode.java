package org.spiderflow.model;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import org.apache.commons.text.StringEscapeUtils;

import com.alibaba.fastjson.JSONArray;


/**
 * 爬虫节点
 * @author jmxd
 *
 */
public class SpiderNode {
	/**
	 * 节点的Json属性
	 */
	private Map<String,Object> jsonProperty = new HashMap<>();
	/**
	 * 节点列表中的下一个节点
	 */
	private List<SpiderNode> nextNodes = new ArrayList<>();

	/**
	 * 节点列表中的上一个节点
	 */
	private List<SpiderNode> prevNodes = new ArrayList<>();
	/**
	 * 节点流转条件
	 */
	private Map<String,String> condition = new HashMap<>();

	/**
	 * 异常流转
	 */
	private Map<String,String> exception = new HashMap<>();

	/**
	 * 传递变量
	 */
	private Map<String,String> transmitVariable = new HashMap<>();
	/**
	 * 节点名称
	 */
	private String nodeName;
	/**
	 * 节点ID
	 */
	private String nodeId;

	/**
	 * 计数器,用来计算当前节点执行中的个数
	 */
	private AtomicInteger counter = new AtomicInteger();

	public String getNodeId() {
		return nodeId;
	}

	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}

	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	public String getStringJsonValue(String key){
		String value = (String) this.jsonProperty.get(key);
		if(value != null){
			value = StringEscapeUtils.unescapeHtml4(value);
		}
		return value;
	}
	
	public List<Map<String,String>> getListJsonValue(String ... keys){
		List<JSONArray> arrays = new ArrayList<>();
		int size = -1;
		List<Map<String,String>> result = new ArrayList<>();
		for (int i = 0; i < keys.length; i++) {
			JSONArray jsonArray = (JSONArray) this.jsonProperty.get(keys[i]);
			if(jsonArray != null){
				if(size == -1){
					size = jsonArray.size();
				}else if(size != jsonArray.size()){
					throw new ArrayIndexOutOfBoundsException();
				}
				arrays.add(jsonArray);
			}
		}
		for (int i = 0;i < size;i++) {
			Map<String,String> item = new HashMap<>();
			for (int j = 0; j < keys.length; j++) {
				String val = arrays.get(j).getString(i);
				if(val != null){
					val = StringEscapeUtils.unescapeHtml4(val);
				}
				item.put(keys[j],val);
			}
			result.add(item);
		}
		return result;
	}
	public void setJsonProperty(Map<String, Object> jsonProperty) {
		this.jsonProperty = jsonProperty;
	}

	public void addNextNode(SpiderNode nextNode){
		nextNode.prevNodes.add(this);
		this.nextNodes.add(nextNode);
	}

	public String getExceptionFlow(String fromNodeId) {
		return exception.get(fromNodeId);
	}

	public boolean isTransmitVariable(String fromNodeId) {
		String value = transmitVariable.get(fromNodeId);
		return value == null || "1".equalsIgnoreCase(value);
	}

	public void setTransmitVariable(String fromNodeId,String value){
		this.transmitVariable.put(fromNodeId,value);
	}

	public void setExceptionFlow(String fromNodeId,String value){
		this.exception.put(fromNodeId,value);
	}

	public List<SpiderNode> getNextNodes() {
		return nextNodes;
	}

	public String getCondition(String fromNodeId) {
		return condition.get(fromNodeId);
	}

	public void setCondition(String fromNodeId,String condition) {
		this.condition.put(fromNodeId, condition);
	}

	public void increment(){
		counter.incrementAndGet();
	}

	public void decrement(){
		counter.decrementAndGet();
	}

	public boolean isDone(){
		return isDone(new HashSet<>());
	}
	public boolean isDone(Set<String> visited){
		if(this.counter.get() == 0){
			for (SpiderNode prevNode : prevNodes) {
				if(visited.add(nodeId)&&!prevNode.isDone(visited)){
					return false;
				}
			}
			return true;
		}
		return false;
	}

	@Override
	public String toString() {
		return "SpiderNode [jsonProperty=" + jsonProperty + ", nextNodes=" + nextNodes + ", condition=" + condition
				+ ", nodeName=" + nodeName + ", nodeId=" + nodeId + "]";
	}
}
