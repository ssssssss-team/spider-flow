package org.spiderflow.model;

import java.util.ArrayList;
import java.util.List;

public class SpiderOutput {
	
	/**
	 * 节点名称
	 */
	private String nodeName;
	
	/**
	 * 节点Id
	 */
	private String nodeId;
	
	/**
	 * 输出项的名
	 */
	private List<String> outputNames = new ArrayList<>();
	
	
	/**
	 * 输出项的值
	 */
	private List<Object> values = new ArrayList<>();


	public String getNodeName() {
		return nodeName;
	}


	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}


	public List<String> getOutputNames() {
		return outputNames;
	}


	public void setOutputNames(List<String> outputNames) {
		this.outputNames = outputNames;
	}


	public List<Object> getValues() {
		return values;
	}


	public void setValues(List<Object> values) {
		this.values = values;
	}
	
	public void addOutput(String name,Object value){
		this.outputNames.add(name);
		this.values.add(value);
	}


	public String getNodeId() {
		return nodeId;
	}


	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}


	@Override
	public String toString() {
		return "SpiderOutput [nodeName=" + nodeName + ", nodeId=" + nodeId + ", outputNames=" + outputNames
				+ ", values=" + values + "]";
	}
}
