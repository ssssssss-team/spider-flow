package org.spiderflow.concurrent;

import org.spiderflow.model.SpiderNode;

import java.util.Comparator;
import java.util.PriorityQueue;

public class ChildPriorThreadSubmitStrategy implements ThreadSubmitStrategy{

    private Object mutex = this;

    private Comparator<SpiderNode> comparator = (o1, o2) -> {
        if(o1.hasLeftNode(o2.getNodeId())){
            return -1;
        }
        return 1;
    };

    private PriorityQueue<SpiderFutureTask<?>> priorityQueue = new PriorityQueue<>((o1, o2) -> comparator.compare(o1.getNode(),o2.getNode()));

    @Override
    public Comparator<SpiderNode> comparator() {
        return comparator;
    }

    @Override
    public void add(SpiderFutureTask<?> task) {
        synchronized (mutex){
            priorityQueue.add(task);
        }
    }

    @Override
    public boolean isEmpty() {
        synchronized (mutex){
            return priorityQueue.isEmpty();
        }
    }

    @Override
    public SpiderFutureTask<?> get() {
        synchronized (mutex){
            return priorityQueue.poll();
        }
    }
}
