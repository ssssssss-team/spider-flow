package org.spiderflow.core;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.utils.SpiderFlowUtils;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.listener.SpiderListener;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;
import org.spiderflow.utils.Maps;
import org.spiderflow.utils.ThreadPool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 爬虫的核心类
 * @author jmxd
 *
 */
@Component
public class Spider {
	
	private static Logger logger = LoggerFactory.getLogger(Spider.class);
	/**
	 * 节点执行器列表 当前爬虫的全部流程
	 */
	@Autowired
	private List<ShapeExecutor> executors;
	/**
	 * 选择器
	 */
	@Autowired
	private FreeMarkerEngine engine;
	
	
	@Autowired(required = false)
	private List<SpiderListener> listeners;
	
	
	public List<SpiderOutput> run(SpiderFlow spiderFlow,Map<String,Object> variables){
		if(variables == null){
			variables = new HashMap<>();
		}
		SpiderNode root = SpiderFlowUtils.loadXMLFromString(spiderFlow.getXml());
		SpiderContext context = new SpiderContext();
		executeRoot(root, context,variables);
		return context.getOutputs();
	}
	
	public List<SpiderOutput> run(SpiderFlow spiderFlow){
		return run(spiderFlow,new HashMap<>());
	}
	
	public List<SpiderOutput> runWithTest(SpiderNode root,SpiderContext context){
		//开始不允许设置任何东西
		executeRoot(root, context,new HashMap<>());
		context.log("测试完毕！");
		return context.getOutputs();
	}
	
	private void executeRoot(SpiderNode root,SpiderContext context,Map<String,Object> variables){
		int nThreads = NumberUtils.toInt(root.getStringJsonValue(ShapeExecutor.THREAD_COUNT), 8);
		ThreadPool pool = ThreadPool.create(nThreads);
		context.setRootNode(root);
		context.setThreadPool(pool);
		if(listeners != null){
			listeners.forEach(listener->listener.beforeStart(context));
		}
		try {
			executeNode(pool,null,root,context,variables);
			pool.shutdown();
		} finally {
			if(listeners != null){
				listeners.forEach(listener->listener.afterEnd(context));
			}
		}
	}
	
	public void execute(int nThreads,SpiderNode fromNode,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		ThreadPool pool = ThreadPool.create(nThreads);
		context.setThreadPool(pool);
		executeNode(pool,fromNode,node,context,variables);
		pool.shutdown();
	}
	
	private void executeaNextNodes(ThreadPool pool,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		List<SpiderNode> nextNodes = node.getNextNodes();
		if(nextNodes != null){
			for (SpiderNode nextNode : nextNodes) {
				executeNode(pool,node,nextNode,context,variables);
			}
		}
	}
	
	public void executeNode(ThreadPool pool,SpiderNode fromNode,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		String shape = node.getStringJsonValue("shape");
		if(StringUtils.isBlank(shape)){
			executeaNextNodes(pool, node, context, variables);
			return;
		}
		if(!executeCondition(fromNode,node,context,variables)){
			return;
		}
		if(logger.isDebugEnabled()){
			logger.debug("执行节点[{}:{}]",node.getNodeName(),node.getNodeId());
		}
		context.log(String.format("执行节点[%s:%s]", node.getNodeName(),node.getNodeId()));
		int loopCount = 1;
		String loopCountStr = node.getStringJsonValue(ShapeExecutor.LOOP_COUNT);
		if(StringUtils.isNotBlank(loopCountStr)){
			Object result = engine.execute(loopCountStr, variables);
			if(result != null){
				if(logger.isDebugEnabled()){
					logger.debug("获取循环次数{}={}",loopCountStr,result);
				}
				context.log(String.format("获取循环次数%s=%s",loopCountStr,result));
				loopCount = ((Long)result).intValue();
			}
		}
		if(loopCount > 0){
			String loopVariableName = node.getStringJsonValue(ShapeExecutor.LOOP_VARIABLE_NAME);
			for (ShapeExecutor executor : executors) {
				if(executor.supportShape().equals(shape)){
					for (int i = 0; i < loopCount; i++) {
						//存入下标变量
						Map<String, Object> nVariables = Maps.add(variables, loopVariableName, i);
						pool.submit(()->{
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
								executeaNextNodes(pool, node, context, nVariables);
							}
						});
					}
				}
			}
		}
	}
		
	private boolean executeCondition(SpiderNode fromNode,SpiderNode node,SpiderContext context,Map<String,Object> variables){
		if(fromNode != null){
			String condition = node.getCondition(fromNode.getNodeId());
			if(StringUtils.isNotBlank(condition)){	//判断是否有条件
				Object result = engine.execute(condition, variables);
				if(result != null){
					boolean isContinue = "true".equals(result) || Objects.equals(result, true);
					if(logger.isDebugEnabled()){
						logger.debug("判断{}={}",condition,isContinue);
					}
					context.log(String.format("判断%s=%s",condition,isContinue));
					return isContinue;
				}
				return false;
			}
		}
		return true;
	}
}
