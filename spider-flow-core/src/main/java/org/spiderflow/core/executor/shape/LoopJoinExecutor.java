package org.spiderflow.core.executor.shape;

import java.util.Map;
import java.util.concurrent.CountDownLatch;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.stereotype.Component;

/**
 * 等待循环结束执行器
 * 
 * @author Administrator
 *
 */
@Component
public class LoopJoinExecutor implements ShapeExecutor {

	private static final String JOIN_NODE_ID = "joinNode";

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {

	}

	@Override
	public String supportShape() {
		return "loopJoin";
	}

	@Override
	public boolean allowExecuteNext(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String joinNodeId = node.getStringJsonValue(JOIN_NODE_ID);
		CountDownLatch countDownLatch = (CountDownLatch) variables.get(LoopExecutor.LOOP_NODE_KEY + joinNodeId);
		if (countDownLatch != null) {
			countDownLatch.countDown();
			return countDownLatch.getCount() == 0L;
		} else {
			context.error("找不到等待节点：{}" + node.getStringJsonValue(JOIN_NODE_ID));
		}
		return false;
	}
}
