package org.spiderflow.concurrent;

public interface ThreadSubmitStrategy {

    void add(SpiderFutureTask<?> task);

    boolean isEmpty();

    SpiderFutureTask<?> get();
}
