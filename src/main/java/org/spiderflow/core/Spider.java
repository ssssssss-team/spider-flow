package org.spiderflow.core;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.executor.Executor;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.model.SpiderNode;
import org.spiderflow.core.model.SpiderOutput;
import org.spiderflow.core.utils.Maps;
import org.spiderflow.core.utils.SpiderFlowUtils;
import org.spiderflow.web.model.SpiderFlow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
/**
 * 爬虫的核心类
 * @author Administrator
 *
 */
@Component
public class Spider {
	
	private static Logger logger = LoggerFactory.getLogger(Spider.class);
	/**
	 * 节点执行器列表 当前爬虫的全部流程
	 */
	@Autowired
	private List<Executor> executors;
	/**
	 * 选择器
	 */
	@Autowired
	private FreeMarkerEngine engine;
	/**
	 * 
	 * @param spiderFlow
	 */
	public void run(SpiderFlow spiderFlow){
		SpiderNode root = SpiderFlowUtils.loadXMLFromString(spiderFlow.getXml());
		SpiderContext context = new SpiderContext();
		execute(8,root, context,new HashMap<>());
	}
	
	public List<SpiderOutput> runWithTest(SpiderNode root,SpiderContext context){
		//开始不允许设置任何东西
		execute(8,root, context,new HashMap<>());
		context.log("测试完毕！");
		return context.getOutputs();
	}
	
	private void execute(int nThreads,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		ThreadPoolExecutor pool = new ThreadPoolExecutor(0, Integer.MAX_VALUE,60L, TimeUnit.SECONDS,new LinkedBlockingQueue<Runnable>());
		LinkedBlockingQueue<Runnable> queue = new LinkedBlockingQueue<Runnable>(nThreads);
		executeNode(queue,node,context,variables);
		for (int i = 0; i < nThreads; i++) {
			pool.execute(()->{
				try {
					Runnable runnable = null;
					while((runnable = queue.take()) != null){
						runnable.run();
					}
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			});
		}
		pool.shutdown();
		//等待线程执行完毕
		try {
			while(!pool.awaitTermination(60, TimeUnit.SECONDS)){
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	private void executeaNextNodes(LinkedBlockingQueue<Runnable> queue,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		List<SpiderNode> nextNodes = node.getNextNodes();
		if(nextNodes != null){
			for (SpiderNode nextNode : nextNodes) {
				executeNode(queue,nextNode,context,variables);
			}
		}
	}
	
	private void executeNode(LinkedBlockingQueue<Runnable> queue,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		if(!executeCondition(node,context,variables)){
			return;
		}
		if(logger.isDebugEnabled()){
			logger.debug("执行节点[{}:{}]",node.getNodeName(),node.getNodeId());
		}
		context.log(String.format("执行节点[%s:%s]", node.getNodeName(),node.getNodeId()));
		int loopCount = 1;
		if(StringUtils.isNotEmpty(node.getLoopCount())){
			Object result = engine.execute(node.getLoopCount(), variables);
			if(result != null){
				if(logger.isDebugEnabled()){
					logger.debug("获取循环次数{}={}",node.getLoopCount(),result);
				}
				context.log(String.format("获取循环次数%s=%s",node.getLoopCount(),result));
				loopCount = ((Long)result).intValue();
			}
		}
		if(loopCount > 0){
			for (Executor executor : executors) {
				if(executor.supportShape().equals(node.getShape())){
					for (int i = 0; i < loopCount; i++) {
						//存入下标变量
						Map<String, Object> nVariables = Maps.add(variables, node.getLoopVariableName(), i);
						try {
							queue.put(()->{
								try {
									executor.execute(node, context,nVariables);
								} catch (Exception e) {
									logger.error("执行节点[{}:{}]出错",node.getNodeName(),node.getNodeId(),e);
								} finally{
									if(logger.isDebugEnabled()){
										logger.debug("执行节点[{}:{}]完毕",node.getNodeName(),node.getNodeId());
									}
									context.log(String.format("执行节点[%s:%s]完毕", node.getNodeName(),node.getNodeId()));
									//递归执行下一级
									CompletableFuture.runAsync(()->{
										executeaNextNodes(queue, node, context, nVariables);
									});
								}
							});
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
	}
	
	private boolean executeCondition(SpiderNode node,SpiderContext context,Map<String,Object> variables){
		if(node.getCondition() != null){	//判断是否有条件
			Object result = engine.execute(node.getCondition(), variables);
			if(result != null){
				boolean isContinue = "true".equals(result);
				if(logger.isDebugEnabled()){
					logger.debug("判断{}={}",node.getCondition(),isContinue);
				}
				context.log(String.format("判断%s=%s",node.getCondition(),isContinue));
				return isContinue;
			}
		}
		return true;
	}
}
