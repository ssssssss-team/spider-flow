package org.spiderflow.context;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class RunnableTreeNode {

	private String id;

	private RunnableNode node;

	private List<RunnableTreeNode> children = new CopyOnWriteArrayList<>();

	private boolean cleared = false;

	public RunnableTreeNode(String id, RunnableNode node) {
		this.id = id;
		this.node = node;
	}

	public RunnableTreeNode(String id) {
		this.id = id;
	}


	public void add(String id){
		this.children.add(new RunnableTreeNode(id));
	}

	public void add(RunnableTreeNode node){
		this.children.add(node);
	}

	public void add(String id, RunnableNode child){
		this.children.add(new RunnableTreeNode(id, child));
	}

	public void clear(){
		children.clear();
		cleared = true;
	}

	public String getId() {
		return id;
	}

	public synchronized boolean isDone(){
		if(cleared){
			return false;
		}
		for (RunnableTreeNode child : children) {
			if(!child.isDone()){
				return false;
			}
		}
		children.clear();
		return this.node == null || this.node.isDone();
	}
}
