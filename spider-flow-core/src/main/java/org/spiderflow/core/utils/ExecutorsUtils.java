package org.spiderflow.core.utils;

import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Shape;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created on 2020-03-11
 *
 * @author Octopus
 */
@Component
public class ExecutorsUtils implements ApplicationContextAware {

    /**
     * 节点执行器列表 当前爬虫的全部流程
     */
    private static List<ShapeExecutor> executors;

    private static Map<String, ShapeExecutor> executorMap;

    private static ApplicationContext applicationContext;

    @Autowired
    ExecutorsUtils(List<ShapeExecutor> executors){
        ExecutorsUtils.executors = executors;
    }

    @PostConstruct
    private void init() {
        executorMap = executors.stream().collect(Collectors.toMap(ShapeExecutor::supportShape, v -> v));
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ExecutorsUtils.applicationContext = applicationContext;
    }

    public static List<Shape> shapes(){
        return executors.stream().filter(e-> e.shape() !=null).map(executor -> executor.shape()).collect(Collectors.toList());
    }

    public static ShapeExecutor get(String shape){
        return executorMap.get(shape);
    }
}
