package com.mxd.spider.core.model;

import java.util.ArrayList;
import java.util.List;

import com.mxd.spider.core.io.HttpResponse;


public class SpiderNode {
	
	private SpiderJsonProperty jsonProperty;
	
	private List<SpiderNode> nextNodes = new ArrayList<>();
	
	private String condition;
	
	private HttpResponse lastResponse;
	
	private String nodeName;
	
	private String nodeId;
	
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

	public String getShape(){
		return jsonProperty == null ? null : jsonProperty.getShape();
	}
	
	public SpiderJsonProperty getJsonProperty() {
		return jsonProperty;
	}

	public void setJsonProperty(SpiderJsonProperty jsonProperty) {
		this.jsonProperty = jsonProperty;
	}

	public void addNextNode(SpiderNode nextNode){
		this.nextNodes.add(nextNode);
	}
	
	public List<SpiderNode> getNextNodes() {
		return nextNodes;
	}

	public void setNextNodes(List<SpiderNode> nextNodes) {
		this.nextNodes = nextNodes;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}
	
	public HttpResponse getLastResponse() {
		return lastResponse;
	}

	public void setLastResponse(HttpResponse lastResponse) {
		this.lastResponse = lastResponse;
	}

	@Override
	public String toString() {
		return "SpiderNode [jsonProperty=" + jsonProperty + ", nextNodes=" + nextNodes + ", condition=" + condition
				+ ", lastResponse=" + lastResponse + ", nodeName=" + nodeName + ", nodeId=" + nodeId + "]";
	}
	
}
