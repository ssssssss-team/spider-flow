package com.mxd.spider.core;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.executor.Executor;
import com.mxd.spider.core.freemarker.FreeMarkerEngine;
import com.mxd.spider.core.model.SpiderNode;
import com.mxd.spider.core.model.SpiderOutput;
import com.mxd.spider.core.utils.Maps;

@Component
public class Spider {
	
	private static Logger logger = LoggerFactory.getLogger(Spider.class);
	
	@Autowired
	private List<Executor> executors;
	
	@Autowired
	private FreeMarkerEngine engine;
	
	public List<SpiderOutput> runWithTest(SpiderNode root,SpiderContext context){
		//开始不允许设置任何东西
		ExecutorService threadPool = Executors.newCachedThreadPool();
		execute(threadPool,root, context);
		context.log("测试完毕！");
		return context.getOutputs();
	}
	
	private void execute(ExecutorService threadPool,SpiderNode node,SpiderContext context){
		if(logger.isDebugEnabled()){
			logger.debug("执行节点[{}:{}]",node.getNodeName(),node.getNodeId());
		}
		context.log(String.format("执行节点[%s:%s]", node.getNodeName(),node.getNodeId()));
		if(node.getCondition() != null){	//判断是否有条件
			Object result = engine.execute(node.getCondition(), Maps.add(context, "resp", node.getLastResponse()));
			if(result != null){
				boolean isContinue = "true".equals(result);
				if(logger.isDebugEnabled()){
					logger.debug("判断{}={}",node.getCondition(),isContinue);
				}
				context.log(String.format("判断%s=%s",node.getCondition(),isContinue));
				if(!isContinue){
					return;
				}
			}
		}
		CountDownLatch latch = new CountDownLatch(this.executors.size());
		for (Executor executor : executors) {
			threadPool.submit(()->{
					try {
						if(executor.supportShape().equals(node.getShape())){
							executor.execute(node, context);
						}
					} finally{
						latch.countDown();
					}
				
			});
		}
		try {
			latch.await();
		} catch (InterruptedException e) {
		}
		if(logger.isDebugEnabled()){
			logger.debug("执行节点[{}:{}]完毕",node.getNodeName(),node.getNodeId());
		}
		context.log(String.format("执行节点[%s:%s]完毕", node.getNodeName(),node.getNodeId()));
		//递归执行下一级
		List<SpiderNode> nodes = node.getNextNodes();
		for (SpiderNode nextNode : nodes) {
			execute(threadPool,nextNode,context);
		}
	}
}
