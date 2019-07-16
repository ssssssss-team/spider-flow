package com.mxd.spider.core.executor;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.model.SpiderNode;

public interface Executor {
	
	public String supportShape();

	public void execute(SpiderNode node,SpiderContext context);
}
