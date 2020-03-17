package org.spiderflow.concurrent;

import java.util.concurrent.FutureTask;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor.SubThreadPoolExecutor;

public class SpiderFutureTask<V> extends FutureTask {

    private SubThreadPoolExecutor executor;

    public SpiderFutureTask(Runnable runnable, V result, SubThreadPoolExecutor executor) {
        super(runnable,result);
        this.executor = executor;
    }

    public SubThreadPoolExecutor getExecutor() {
        return executor;
    }
}
