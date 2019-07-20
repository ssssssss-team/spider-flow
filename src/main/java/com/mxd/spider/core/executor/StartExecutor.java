package com.mxd.spider.core.executor;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.model.SpiderNode;

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
