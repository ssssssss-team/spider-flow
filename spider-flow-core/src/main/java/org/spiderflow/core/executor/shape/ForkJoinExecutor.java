package org.spiderflow.core.executor.shape;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 等待执行结束执行器
 * 
 */
@Component
public class ForkJoinExecutor implements ShapeExecutor {

	/**
	 * 缓存已完成节点的变量
	 */
	private Map<String, Map<String, Object>> cachedVariables = new HashMap<>();
	
	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
	}

	@Override
	public String supportShape() {
		return "forkJoin";
	}

	@Override
	public boolean allowExecuteNext(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String key = context.getId() + "-" + node.getNodeId();
		synchronized (node){
			boolean isDone = node.isDone();
			Map<String, Object> cached = cachedVariables.get(key);
			if(!isDone){
				if(cached == null){
					cached = new HashMap<>();
					cachedVariables.put(key, cached);
				}
				cached.putAll(variables);
			}else if(cached != null){
				//将缓存的变量存入到当前变量中,传递给下一级
				variables.putAll(cached);
				cachedVariables.remove(key);
			}
			return isDone;
		}
	}
}
