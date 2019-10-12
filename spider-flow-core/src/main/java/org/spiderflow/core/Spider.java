package org.spiderflow.core;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.ExpressionHolder;
import org.spiderflow.context.SpiderContext;
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
 * 
 * @author jmxd
 *
 */
@Component
public class Spider {

	/**
	 * 节点执行器列表 当前爬虫的全部流程
	 */
	@Autowired
	private List<ShapeExecutor> executors;
	/**
	 * 选择器
	 */
	@Autowired
	private ExpressionEngine engine;

	@Autowired(required = false)
	private List<SpiderListener> listeners;

	private static Map<String, ShapeExecutor> executorMap = new HashMap<String, ShapeExecutor>();

	@PostConstruct
	private void init() {
		executorMap = executors.stream().collect(Collectors.toMap(ShapeExecutor::supportShape, v -> v));
	}

	public List<SpiderOutput> run(SpiderFlow spiderFlow, SpiderContext context,Map<String, Object> variables) {
		if (variables == null) {
			variables = new HashMap<>();
		}
		SpiderNode root = SpiderFlowUtils.loadXMLFromString(spiderFlow.getXml());
		executeRoot(root, context, variables);
		return context.getOutputs();
	}

	public List<SpiderOutput> run(SpiderFlow spiderFlow, SpiderContext context) {
		return run(spiderFlow, context, new HashMap<>());
	}

	public List<SpiderOutput> runWithTest(SpiderNode root, SpiderContext context) {
		// 开始不允许设置任何东西
		executeRoot(root, context, new HashMap<>());
		context.info("测试完毕！");
		return context.getOutputs();
	}

	private void executeRoot(SpiderNode root, SpiderContext context, Map<String, Object> variables) {
		int nThreads = NumberUtils.toInt(root.getStringJsonValue(ShapeExecutor.THREAD_COUNT), 8);
		ThreadPool pool = ThreadPool.create(nThreads);
		context.setRootNode(root);
		context.setThreadPool(pool);
		if (listeners != null) {
			listeners.forEach(listener -> listener.beforeStart(context));
		}
		try {
			executeNode(pool, null, root, context, variables);
			pool.shutdown();
		} finally {
			if (listeners != null) {
				listeners.forEach(listener -> listener.afterEnd(context));
			}
			ExpressionHolder.remove();
		}
	}

	public void execute(int nThreads, SpiderNode fromNode, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		ThreadPool pool = ThreadPool.create(nThreads);
		context.setThreadPool(pool);
		executeNode(pool, fromNode, node, context, variables);
		pool.shutdown();
	}

	private void executeaNextNodes(ThreadPool pool, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		List<SpiderNode> nextNodes = node.getNextNodes();
		if (nextNodes != null) {
			for (SpiderNode nextNode : nextNodes) {
				executeNode(pool, node, nextNode, context, variables);
			}
		}
	}

	public void executeNode(ThreadPool pool, SpiderNode fromNode, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String shape = node.getStringJsonValue("shape");
		if (StringUtils.isBlank(shape)) {
			executeaNextNodes(pool, node, context, variables);
			return;
		}
		if (!executeCondition(fromNode, node, context, variables)) {
			return;
		}
		context.debug("执行节点[{}:{}]", node.getNodeName(), node.getNodeId());
		int loopCount = 1;
		String loopCountStr = node.getStringJsonValue(ShapeExecutor.LOOP_COUNT);
		if (StringUtils.isNotBlank(loopCountStr)) {
			Object result = engine.execute(loopCountStr, variables);
			if (result != null) {
				context.debug("获取循环次数{}={}", loopCountStr, result);
				try {
					loopCount = Integer.valueOf(result.toString());
				} catch (NumberFormatException e) {
					loopCount = 0;
				}
			}
		}
		if (loopCount > 0) {
			String loopVariableName = node.getStringJsonValue(ShapeExecutor.LOOP_VARIABLE_NAME);
			ShapeExecutor executor = executorMap.get(shape);
			for (int i = 0; i < loopCount; i++) {
				if (context.isRunning()) {
					// 存入下标变量
					Map<String, Object> nVariables = Maps.add(variables, loopVariableName, i);
					Runnable runnable = () -> {
						if (context.isRunning()) {
							try {
								ExpressionHolder.setVariables(nVariables);
								executor.execute(node, context, nVariables);
								nVariables.put("ex", null);
							} catch (Exception e) {
								nVariables.put("ex", e);
								context.error("执行节点[{}:{}]出错,异常信息：{}", node.getNodeName(), node.getNodeId(), e);
							} finally {
								context.debug("执行节点[{}:{}]完毕", node.getNodeName(), node.getNodeId());
								// 递归执行下一级
								executeaNextNodes(pool, node, context, nVariables);
							}
						}
					};
					if (executor.isThread()) {
						pool.submit(runnable);
					} else {
						runnable.run();
					}
				}
			}
		}
	}

	private boolean executeCondition(SpiderNode fromNode, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		if (fromNode != null) {
			String condition = node.getCondition(fromNode.getNodeId());
			if (StringUtils.isNotBlank(condition)) { // 判断是否有条件
				Object result = null;
				try {
					result = engine.execute(condition, variables);
				} catch (Exception e) {
					context.error("判断{}出错,异常信息：{}", condition, e);
				}
				if (result != null) {
					boolean isContinue = "true".equals(result) || Objects.equals(result, true);
					context.debug("判断{}={}", condition, isContinue);
					return isContinue;
				}
				return false;
			}
		}
		return true;
	}
}
