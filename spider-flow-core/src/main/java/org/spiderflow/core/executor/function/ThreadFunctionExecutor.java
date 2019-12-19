package org.spiderflow.core.executor.function;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

/**
 * Created on 2019-12-06
 *
 * @author YZ255027 - Octopus
 */
@Component
@Comment("thread常用方法")
public class ThreadFunctionExecutor implements FunctionExecutor {
    @Override
    public String getFunctionPrefix() {
        return "thread";
    }

    @Comment("线程休眠")
    @Example("${thread.sleep(1000L)}")
    public static void sleep(Long sleepTime){
        try {
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
