package com.mxd.spider.core.model;

import java.util.ArrayList;
import java.util.List;


public class SpiderNode {
	
	private SpiderJsonProperty jsonProperty;
	
	private List<SpiderNode> nextNodes = new ArrayList<>();
	
	private String condition;
	
	private String nodeName;
	
	private String nodeId;
	
	private String loopCount;
	
	private String loopVariableName;
	
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
	
	public String getLoopCount() {
		return loopCount;
	}

	public void setLoopCount(String loopCount) {
		this.loopCount = loopCount;
	}

	public String getLoopVariableName() {
		return loopVariableName;
	}
	
	

	public void setLoopVariableName(String loopVariableName) {
		this.loopVariableName = loopVariableName;
	}

	@Override
	public String toString() {
		return "SpiderNode [jsonProperty=" + jsonProperty + ", nextNodes=" + nextNodes + ", condition=" + condition
				+ ", nodeName=" + nodeName + ", nodeId=" + nodeId + ", loopCount=" + loopCount + ", loopVariableName="
				+ loopVariableName + "]";
	}
	
}
