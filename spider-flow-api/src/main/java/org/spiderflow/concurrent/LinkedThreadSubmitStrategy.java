package org.spiderflow.concurrent;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class LinkedThreadSubmitStrategy implements ThreadSubmitStrategy{

    private List<SpiderFutureTask<?>> taskList = new CopyOnWriteArrayList<>();

    @Override
    public void add(SpiderFutureTask<?> task) {
        taskList.add(task);
    }

    @Override
    public boolean isEmpty() {
        return taskList.isEmpty();
    }

    @Override
    public SpiderFutureTask<?> get() {
        return taskList.remove(0);
    }
}
