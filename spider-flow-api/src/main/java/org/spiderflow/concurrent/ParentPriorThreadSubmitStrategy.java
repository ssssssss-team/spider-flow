package org.spiderflow.concurrent;

import java.util.PriorityQueue;

public class ParentPriorThreadSubmitStrategy implements ThreadSubmitStrategy{

    private Object mutex = this;

    private PriorityQueue<SpiderFutureTask<?>> priorityQueue = new PriorityQueue<>((o1, o2) -> {
        if(o1.getNode().hasLeftNode(o2.getNode().getNodeId())){
            return 1;
        }
        return -1;
    });

    @Override
    public void add(SpiderFutureTask<?> task) {
        synchronized (mutex) {
            priorityQueue.add(task);
        }
    }

    @Override
    public boolean isEmpty() {
        synchronized (mutex) {
            return priorityQueue.isEmpty();
        }
    }

    @Override
    public SpiderFutureTask<?> get() {
        synchronized (mutex) {
            return priorityQueue.poll();
        }
    }

}
