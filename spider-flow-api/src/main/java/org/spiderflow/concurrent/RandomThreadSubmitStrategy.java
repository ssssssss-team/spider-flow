package org.spiderflow.concurrent;

import org.apache.commons.lang3.RandomUtils;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class RandomThreadSubmitStrategy implements ThreadSubmitStrategy{

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
        return taskList.remove(RandomUtils.nextInt(0, taskList.size()));
    }
}
