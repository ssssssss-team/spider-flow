package org.spiderflow.core;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor.SubThreadPoolExecutor;
import org.spiderflow.context.RunnableNode;
import org.spiderflow.context.RunnableTreeNode;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.context.SpiderContextHolder;
import org.spiderflow.core.executor.shape.LoopExecutor;
import org.spiderflow.core.executor.shape.LoopJoinExecutor;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.utils.SpiderFlowUtils;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.listener.SpiderListener;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * 爬虫的核心类
 *
 * @author jmxd
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

	@Value("${spider.thread.max:64}")
	private Integer totalThreads;

	@Value("${spider.thread.default:8}")
	private Integer defaultThreads;

	@Value("${spider.detect.dead-cycle:5000}")
	private Integer deadCycle;

	private static Map<String, ShapeExecutor> executorMap = new HashMap<>();

	private static SpiderFlowThreadPoolExecutor executor;

	private static final String ATOMIC_DEAD_CYCLE = "__atomic_dead_cycle";

	private static Logger logger = LoggerFactory.getLogger(Spider.class);

	@PostConstruct
	private void init() {
		executorMap = executors.stream().collect(Collectors.toMap(ShapeExecutor::supportShape, v -> v));
		executor = new SpiderFlowThreadPoolExecutor(totalThreads);
	}

	public List<SpiderOutput> run(SpiderFlow spiderFlow, SpiderContext context, Map<String, Object> variables) {
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

	public void runWithTest(SpiderNode root, SpiderContext context) {
		SpiderContextHolder.set(context);
		AtomicInteger executeCount = new AtomicInteger(0);
		context.put(ATOMIC_DEAD_CYCLE, executeCount);
		executeRoot(root, context, new HashMap<>());
		if (executeCount.get() > deadCycle) {
			logger.error("检测到可能出现死循环,测试终止");
		} else {
			logger.info("测试完毕！");
		}
		SpiderContextHolder.remove();
	}

	private void executeRoot(SpiderNode root, SpiderContext context, Map<String, Object> variables) {
		int nThreads = NumberUtils.toInt(root.getStringJsonValue(ShapeExecutor.THREAD_COUNT), defaultThreads);
		SubThreadPoolExecutor pool = executor.createSubThreadPoolExecutor(nThreads);
		context.setRootNode(root);
		context.setThreadPool(pool);
		if (listeners != null) {
			listeners.forEach(listener -> listener.beforeStart(context));
		}
		try {
			executeNode(null, root, context, variables);
			pool.awaitTermination();
		} finally {
			if (listeners != null) {
				listeners.forEach(listener -> listener.afterEnd(context));
			}
		}
	}

	public void execute(int nThreads, SpiderNode fromNode, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		SubThreadPoolExecutor pool = executor.createSubThreadPoolExecutor(nThreads);
		context.setThreadPool(pool);
		executeNode(fromNode, node, context, variables);
		pool.awaitTermination();
	}

	private void executeNextNodes(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		List<SpiderNode> nextNodes = node.getNextNodes();
		if (nextNodes != null) {
			for (SpiderNode nextNode : nextNodes) {
				executeNode(node, nextNode, context, variables);
			}
		}
	}

	public void executeNode(SpiderNode fromNode, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String shape = node.getStringJsonValue("shape");
		if (StringUtils.isBlank(shape)) {
			executeNextNodes(node, context, variables);
			return;
		}
		//判断条件，如果不成立则不执行
		if (!executeCondition(fromNode, node, variables)) {
			return;
		}
		logger.debug("执行节点[{}:{}]", node.getNodeName(), node.getNodeId());
		ShapeExecutor executor = executorMap.get(shape);
		if (executor == null) {
			logger.error("执行失败,找不到对应的执行器:{}", shape);
			context.setRunning(false);
		}
		int loopCount = 1;
		String loopCountStr = node.getStringJsonValue(ShapeExecutor.LOOP_COUNT);
		if (StringUtils.isNotBlank(loopCountStr)) {
			try {
				Object result = engine.execute(loopCountStr, variables);
				result = result == null ? 0 : result;
				logger.info("获取循环次数{}={}", loopCountStr, result);
				loopCount = Integer.parseInt(result.toString());
			} catch (Throwable t) {
				loopCount = 0;
				logger.error("获取循环次数失败,异常信息：{}", t);
			}
		}
		if (loopCount > 0) {
			String loopVariableName = node.getStringJsonValue(ShapeExecutor.LOOP_VARIABLE_NAME);
			RunnableTreeNode treeNode = new RunnableTreeNode(node.getNodeId());
			RunnableTreeNode parentNode = (RunnableTreeNode) variables.get(LoopExecutor.LOOP_NODE_KEY);
			if (parentNode != null) {
				parentNode.add(treeNode);
			}
			if (executor instanceof LoopExecutor) {
				variables.put(LoopExecutor.LOOP_NODE_KEY + node.getNodeId(), treeNode);
				variables.put(LoopExecutor.LOOP_NODE_KEY, treeNode);
				variables.put(LoopExecutor.BEFORE_LOOP_VARIABLE + node.getNodeId(), variables);
				variables.put(LoopJoinExecutor.VARIABLE_CONTEXT + node.getNodeId(), new LinkedBlockingQueue<>());
			}
			List<Runnable> runnables = new ArrayList<>();
			for (int i = 0; i < loopCount; i++) {
				if (context.isRunning()) {
					RunnableNode runnableNode = new RunnableNode();
					treeNode.add(new RunnableTreeNode("loop-" + node.getNodeId(), runnableNode));
					Map<String, Object> nVariables = new HashMap<>(variables);
					// 存入下标变量
					if (!StringUtils.isBlank(loopVariableName)) {
						nVariables.put(loopVariableName, i);
					}
					runnables.add(() -> {
						runnableNode.setState(RunnableNode.State.RUNNING);
						if (context.isRunning()) {
							try {
								SpiderContextHolder.set(context);
								//死循环检测，当执行节点次数大于阈值时，结束本次测试
								AtomicInteger executeCount = context.get(ATOMIC_DEAD_CYCLE);
								if (executeCount != null && executeCount.incrementAndGet() > deadCycle) {
									context.setRunning(false);
									//设置当前线程为已完成状态
									runnableNode.setState(RunnableNode.State.DONE);
									return;
								}
								//执行节点具体逻辑
								executor.execute(node, context, nVariables);
							} catch (Throwable t) {
								nVariables.put("ex", t);
								logger.error("执行节点[{}:{}]出错,异常信息：{}", node.getNodeName(), node.getNodeId(), t);
							} finally {
								if (node.isSync()) {
									context.lock();
								}
								//设置当前线程为已完成状态
								runnableNode.setState(RunnableNode.State.DONE);
								//判断是否允许执行后续节点
								if (executor.allowExecuteNext(node, context, nVariables)) {
									logger.debug("执行节点[{}:{}]完毕", node.getNodeName(), node.getNodeId());
									// 递归执行下一级节点
									executeNextNodes(node, context, nVariables);
								} else {
									logger.debug("执行节点[{}:{}]完毕，忽略执行下一节点", node.getNodeName(), node.getNodeId());
								}
								if (node.isSync()) {
									context.unlock();
								}
								SpiderContextHolder.remove();
							}
						}
					});
				}
			}
			runnables.forEach(executor.isThread() ? context.getThreadPool()::submit : Runnable::run);
		}
	}

	private boolean executeCondition(SpiderNode fromNode, SpiderNode node, Map<String, Object> variables) {
		if (fromNode != null) {
			String condition = node.getCondition(fromNode.getNodeId());
			if (StringUtils.isNotBlank(condition)) { // 判断是否有条件
				Object result = null;
				try {
					result = engine.execute(condition, variables);
				} catch (Exception e) {
					logger.error("判断{}出错,异常信息：{}", condition, e);
				}
				if (result != null) {
					boolean isContinue = "true".equals(result) || Objects.equals(result, true);
					logger.debug("判断{}={}", condition, isContinue);
					return isContinue;
				}
				return false;
			}
		}
		return true;
	}
}
