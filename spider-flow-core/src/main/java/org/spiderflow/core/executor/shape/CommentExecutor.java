package org.spiderflow.core.executor.shape;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CommentExecutor implements ShapeExecutor{

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		
	}

	@Override
	public String supportShape() {
		return "comment";
	}

}
