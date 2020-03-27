package org.spiderflow.concurrent;

import org.spiderflow.model.SpiderNode;

import java.util.Comparator;

public interface ThreadSubmitStrategy {

    Comparator<SpiderNode> comparator();

    void add(SpiderFutureTask<?> task);

    boolean isEmpty();

    SpiderFutureTask<?> get();
}
