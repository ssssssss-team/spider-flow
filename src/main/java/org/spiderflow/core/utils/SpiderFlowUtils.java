package org.spiderflow.core.utils;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.text.StringEscapeUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spiderflow.core.model.SpiderJsonProperty;
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
			SpiderJsonProperty jsonProperty = getSpiderFlowJsonProperty(element);
			SpiderNode node = new SpiderNode();
			node.setJsonProperty(jsonProperty);
			String nodeId = element.attr("id");
			node.setNodeName(element.attr("value"));
			node.setNodeId(nodeId);
			nodeMap.put(nodeId, node);
			if(element.hasAttr("edge")){	//判断是否是连线
				edgeMap.put(nodeId, Collections.singletonMap(element.attr("source"),element.attr("target")));
			}else if(jsonProperty != null && jsonProperty.getShape() != null){
				if("start".equals(node.getJsonProperty().getShape())){
					root = node;
				}
				if(jsonProperty.getLoopCount() != null){
					node.setLoopCount(jsonProperty.getLoopCount());
					node.setLoopVariableName(jsonProperty.getLoopVariableName());
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
				targetNode.setCondition(edgeNode.getJsonProperty() == null ? null : edgeNode.getJsonProperty().getCondition());
				sourceNode.addNextNode(targetNode);
			}
		}
		return root;
	}
	
	/**
	 * 提取配置的json属性
	 */
	private static SpiderJsonProperty getSpiderFlowJsonProperty(Element element){
		Elements elements = element.getElementsByTag("JsonProperty");
		if(!CollectionUtils.isEmpty(elements)){
			SpiderJsonProperty jsonProperty = JSON.parseObject(StringEscapeUtils.unescapeXml(elements.get(0).html()),SpiderJsonProperty.class);
			return jsonProperty;
		}
		return null;
	}
	
	public static SpiderNode loadXMLFromBytes(byte[] bytes){
		return loadXMLFromString(new String(bytes));
	}
}
