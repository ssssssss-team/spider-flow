package org.spiderflow.concurrent;

import java.util.concurrent.FutureTask;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor.SubThreadPoolExecutor;
import org.spiderflow.model.SpiderNode;

public class SpiderFutureTask<V> extends FutureTask {

    private SubThreadPoolExecutor executor;

    private SpiderNode node;

    public SpiderFutureTask(Runnable runnable, V result, SpiderNode node,SubThreadPoolExecutor executor) {
        super(runnable,result);
        this.executor = executor;
        this.node = node;
    }

    public SubThreadPoolExecutor getExecutor() {
        return executor;
    }

    public SpiderNode getNode() {
        return node;
    }
}
