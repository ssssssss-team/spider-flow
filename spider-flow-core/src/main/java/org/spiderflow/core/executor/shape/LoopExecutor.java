package org.spiderflow.core.executor.shape;

import java.util.Map;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.stereotype.Component;

/**
 * 循环执行器
 * @author Administrator
 *
 */
@Component
public class LoopExecutor implements ShapeExecutor{
	
	public static final String LOOP_NODE_KEY = "__loop_node_";
	
	public static final String BEFORE_LOOP_VARIABLE = "__loop_before_variable_";
	
	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
	}

	@Override
	public String supportShape() {
		return "loop";
	}
}
