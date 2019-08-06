package org.spiderflow.core.executor;

import java.util.Map;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.Executor;
import org.spiderflow.model.SpiderNode;
import org.springframework.stereotype.Component;

/**
 * 开始执行器
 * @author Administrator
 *
 */
@Component
public class StartExecutor implements Executor{

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		
	}

	@Override
	public String supportShape() {
		return "start";
	}

}
