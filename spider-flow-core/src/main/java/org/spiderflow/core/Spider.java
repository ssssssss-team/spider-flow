package org.spiderflow.core;

import com.alibaba.ttl.TtlRunnable;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor.SubThreadPoolExecutor;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.context.SpiderContextHolder;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.utils.ExecutorsUtils;
import org.spiderflow.core.utils.ExpressionUtils;
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
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 爬虫的核心类
 *
 * @author jmxd
 */
@Component
public class Spider {

	@Autowired(required = false)
	private List<SpiderListener> listeners;

	@Value("${spider.thread.max:64}")
	private Integer totalThreads;

	@Value("${spider.thread.default:8}")
	private Integer defaultThreads;

	@Value("${spider.detect.dead-cycle:5000}")
	private Integer deadCycle;

	private static SpiderFlowThreadPoolExecutor threadPoolExecutor;

	private static final String ATOMIC_DEAD_CYCLE = "__atomic_dead_cycle";

	private static Logger logger = LoggerFactory.getLogger(Spider.class);

	@PostConstruct
	private void init() {
		threadPoolExecutor = new SpiderFlowThreadPoolExecutor(totalThreads);
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
		//将上下文存到ThreadLocal里，以便后续使用
		SpiderContextHolder.set(context);
		//死循环检测的计数器（死循环检测只在测试时有效）
		AtomicInteger executeCount = new AtomicInteger(0);
		//存入到上下文中，以供后续检测
		context.put(ATOMIC_DEAD_CYCLE, executeCount);
		//执行根节点
		executeRoot(root, context, new HashMap<>());
		//当爬虫任务执行完毕时,判断是否超过预期
		if (executeCount.get() > deadCycle) {
			logger.error("检测到可能出现死循环,测试终止");
		} else {
			logger.info("测试完毕！");
		}
		//将上下文从ThreadLocal移除，防止内存泄漏
		SpiderContextHolder.remove();
	}

	/**
	 * 执行根节点
	 */
	private void executeRoot(SpiderNode root, SpiderContext context, Map<String, Object> variables) {
		//获取当前流程执行线程数
		int nThreads = NumberUtils.toInt(root.getStringJsonValue(ShapeExecutor.THREAD_COUNT), defaultThreads);
		//创建子线程池，采用一父多子的线程池,子线程数不能超过总线程数（超过时进入队列等待）,+1是因为会占用一个线程用来调度执行下一级
		SubThreadPoolExecutor pool = threadPoolExecutor.createSubThreadPoolExecutor(Math.max(nThreads,1) + 1);
		context.setRootNode(root);
		context.setThreadPool(pool);
		//触发监听器
		if (listeners != null) {
			listeners.forEach(listener -> listener.beforeStart(context));
		}
		//启动一个线程开始执行任务,并监听其结束并执行下一级
		Future<?> f = pool.submitAsync(TtlRunnable.get(() -> {
			try {
				//执行具体节点
				Spider.this.executeNode(null, root, context, variables);
				Queue<Future<?>> queue = context.getFutureQueue();
				//循环从队列中获取Future,直到队列为空结束,当任务完成时，则执行下一级，如未完成，把Future加到队列末尾
				while (!queue.isEmpty()) {
					try {
						Future<?> future = queue.poll();
						if (future.isDone()) {	//判断任务是否完成
							if (context.isRunning()) {	//检测是否运行中(当在页面中点击"停止"时,此值为false,其余为true)
								SpiderTask task = (SpiderTask) future.get();
								task.node.decrement();	//任务执行完毕,计数器减一(该计数器是给Join节点使用)
								if (task.executor.allowExecuteNext(task.node, context, task.variables)) {	//判断是否允许执行下一级
									logger.debug("执行节点[{}:{}]完毕", task.node.getNodeName(), task.node.getNodeId());
									//执行下一级
									Spider.this.executeNextNodes(task.node, context, task.variables);
								} else {
									logger.debug("执行节点[{}:{}]完毕，忽略执行下一节点", task.node.getNodeName(), task.node.getNodeId());
								}
							}
						} else {
							//将Future加到队列末尾
							queue.add(future);
						}
						//睡眠1ms,让出cpu
						Thread.sleep(1);
					} catch (InterruptedException | ExecutionException ignored) {
					}
				}
				//等待线程池结束
				pool.awaitTermination();
			} finally {
				//触发监听器
				if (listeners != null) {
					listeners.forEach(listener -> listener.afterEnd(context));
				}
			}
		}), null);
		try {
			f.get();	//阻塞等待所有任务执行完毕
		} catch (InterruptedException | ExecutionException ignored) {}
	}

	/**
	 * 执行下一级节点
	 */
	private void executeNextNodes(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		List<SpiderNode> nextNodes = node.getNextNodes();
		if (nextNodes != null) {
			for (SpiderNode nextNode : nextNodes) {
				executeNode(node, nextNode, context, variables);
			}
		}
	}

	/**
	 * 执行节点
	 */
	public void executeNode(SpiderNode fromNode, SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String shape = node.getStringJsonValue("shape");
		if (StringUtils.isBlank(shape)) {
			executeNextNodes(node, context, variables);
			return;
		}
		//判断箭头上的条件，如果不成立则不执行
		if (!executeCondition(fromNode, node, variables)) {
			return;
		}
		logger.debug("执行节点[{}:{}]", node.getNodeName(), node.getNodeId());
		//找到对应的执行器
		ShapeExecutor executor = ExecutorsUtils.get(shape);
		if (executor == null) {
			logger.error("执行失败,找不到对应的执行器:{}", shape);
			context.setRunning(false);
		}
		//循环次数默认为1,如果节点有循环属性且填了循环次数,则取出循环次数
		int loopCount = 1;
		String loopCountStr = node.getStringJsonValue(ShapeExecutor.LOOP_COUNT);
		if (StringUtils.isNotBlank(loopCountStr)) {
			try {
				Object result = ExpressionUtils.execute(loopCountStr, variables);
				result = result == null ? 0 : result;
				logger.info("获取循环次数{}={}", loopCountStr, result);
				loopCount = Integer.parseInt(result.toString());
			} catch (Throwable t) {
				loopCount = 0;
				logger.error("获取循环次数失败,异常信息：{}", t);
			}
		}
		if (loopCount > 0) {
			//获取循环下标的变量名称
			String loopVariableName = node.getStringJsonValue(ShapeExecutor.LOOP_VARIABLE_NAME);
			List<SpiderTask> tasks = new ArrayList<>();
			for (int i = 0; i < loopCount; i++) {
				node.increment();	//节点执行次数+1(后续Join节点使用)
				if (context.isRunning()) {
					Map<String, Object> nVariables = new HashMap<>(variables);
					// 存入下标变量
					if (!StringUtils.isBlank(loopVariableName)) {
						nVariables.put(loopVariableName, i);
					}
					tasks.add(new SpiderTask(TtlRunnable.get(() -> {
						if (context.isRunning()) {
							try {
								//死循环检测，当执行节点次数大于阈值时，结束本次测试
								AtomicInteger executeCount = context.get(ATOMIC_DEAD_CYCLE);
								if (executeCount != null && executeCount.incrementAndGet() > deadCycle) {
									context.setRunning(false);
									return;
								}
								//执行节点具体逻辑
								executor.execute(node, context, nVariables);
							} catch (Throwable t) {
								nVariables.put("ex", t);
								logger.error("执行节点[{}:{}]出错,异常信息：{}", node.getNodeName(), node.getNodeId(), t);
							}
						}
					}), node, nVariables, executor));
				}
			}
			LinkedBlockingQueue<Future<?>> futureQueue = context.getFutureQueue();
			for (SpiderTask task : tasks) {
				if(executor.isThread()){	//【判断节点是否是异步运行
					//提交任务至线程池中,并将Future添加到队列末尾
					futureQueue.add(context.getThreadPool().submitAsync(task.runnable, task));
				}else{
					FutureTask<SpiderTask> futureTask = new FutureTask<>(task.runnable, task);
					futureTask.run();
					futureQueue.add(futureTask);
				}
			}
		}
	}

	/**
	 *	判断箭头上的表达式是否成立
	 */
	private boolean executeCondition(SpiderNode fromNode, SpiderNode node, Map<String, Object> variables) {
		if (fromNode != null) {
			String condition = node.getCondition(fromNode.getNodeId());
			if (StringUtils.isNotBlank(condition)) { // 判断是否有条件
				Object result = null;
				try {
					result = ExpressionUtils.execute(condition, variables);
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

	class SpiderTask{

		Runnable runnable;

		SpiderNode node;

		Map<String,Object> variables;

		ShapeExecutor executor;

		public SpiderTask(Runnable runnable, SpiderNode node, Map<String, Object> variables,ShapeExecutor executor) {
			this.runnable = runnable;
			this.node = node;
			this.variables = variables;
			this.executor = executor;
		}
	}
}
