package org.spiderflow.core.model;

import java.util.ArrayList;
import java.util.List;

public class TreeNode<T> {

    private T node;

    private List<TreeNode<T>> children;

    public TreeNode(T node) {
        this.node = node;
    }

    public T getNode() {
        return node;
    }

    public void setNode(T node) {
        this.node = node;
    }

    public List<TreeNode<T>> getChildren() {
        return children;
    }

    public void setChildren(List<TreeNode<T>> children) {
        this.children = children;
    }

    public void addNode(TreeNode<T> node){
        if(this.children == null){
            this.children = new ArrayList<>();
        }
        this.children.add(node);
    }
}
