package org.spiderflow.core.utils;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spiderflow.core.model.SpiderNode;
import org.springframework.util.CollectionUtils;

import com.alibaba.fastjson.JSON;

public class SpiderFlowUtils {
	
	public static SpiderNode loadXMLFromString(String xmlString){
		Document document = Jsoup.parse(xmlString);
		Elements cells = document.getElementsByTag("mxCell");
		Map<String,SpiderNode> nodeMap = new HashMap<>();
		SpiderNode root = null;
		Map<String,Map<String,String>> edgeMap = new HashMap<>();
		for (Element element : cells) {
			Map<String, Object> jsonProperty = getSpiderFlowJsonProperty(element);
			SpiderNode node = new SpiderNode();
			node.setJsonProperty(jsonProperty);
			String nodeId = element.attr("id");
			node.setNodeName(element.attr("value"));
			node.setNodeId(nodeId);
			nodeMap.put(nodeId, node);
			if(element.hasAttr("edge")){	//判断是否是连线
				edgeMap.put(nodeId, Collections.singletonMap(element.attr("source"),element.attr("target")));
			}else if(jsonProperty != null && node.getStringJsonValue("shape") != null){
				if("start".equals(node.getStringJsonValue("shape"))){
					root = node;
				}
			}
		}
		//处理连线
		Set<String> edges = edgeMap.keySet();
		for (String edgeId : edges) {
			Set<Entry<String, String>> entries = edgeMap.get(edgeId).entrySet();
			SpiderNode edgeNode = nodeMap.get(edgeId);
			for (Entry<String, String> edge : entries) {
				SpiderNode sourceNode = nodeMap.get(edge.getKey());
				SpiderNode targetNode = nodeMap.get(edge.getValue());
				//设置流转条件
				targetNode.setCondition(sourceNode.getNodeId(),edgeNode.getStringJsonValue("condition"));
				sourceNode.addNextNode(targetNode);
			}
		}
		return root;
	}
	
	/**
	 * 提取配置的json属性
	 */
	@SuppressWarnings("unchecked")
	private static Map<String,Object> getSpiderFlowJsonProperty(Element element){
		Elements elements = element.getElementsByTag("JsonProperty");
		if(!CollectionUtils.isEmpty(elements)){
			return JSON.parseObject(elements.get(0).html(),Map.class);
		}
		return null;
	}
	
	public static SpiderNode loadXMLFromBytes(byte[] bytes){
		return loadXMLFromString(new String(bytes));
	}
}
