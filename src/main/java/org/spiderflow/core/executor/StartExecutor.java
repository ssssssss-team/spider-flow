package org.spiderflow.core.executor;

import java.util.Map;

import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.model.SpiderNode;
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
