package org.spiderflow.core.executor.shape;

import org.spiderflow.context.RunnableTreeNode;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 等待循环结束执行器
 * 
 * @author Administrator
 *
 */
@Component
public class LoopJoinExecutor implements ShapeExecutor {

	public static final String JOIN_NODE_ID = "joinNode";
	
	public static final String VARIABLE_CONTEXT = "__variable_context";
	
	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
	}

	@Override
	public String supportShape() {
		return "loopJoin";
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean allowExecuteNext(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String joinNodeId = node.getStringJsonValue(JOIN_NODE_ID);
		Collection<Map<String, Object>> variableCollection = (Collection<Map<String, Object>>) variables.get(VARIABLE_CONTEXT + joinNodeId);
		variableCollection.add(variables);
		RunnableTreeNode treeNode = (RunnableTreeNode) variables.get(LoopExecutor.LOOP_NODE_KEY + joinNodeId);
		if(treeNode != null){
 			boolean isDone = treeNode.isDone();
			if(isDone){
				Map<String, Object> beforeLoopVariable = (Map<String, Object>) variables.get(LoopExecutor.BEFORE_LOOP_VARIABLE + joinNodeId);
				variableCollection.stream()
						.flatMap(map -> map.entrySet().stream())
						.collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.mapping(Map.Entry::getValue, Collectors.toList())))
						.forEach((k,v)->{
							String key = "@" + k;
							if(variables.containsKey(key) == false || k.startsWith("@")){
								if(key.startsWith("@@")){
									key = k;
								}
								//清除掉原有变量
								variables.remove(k);
								variables.put(key, v);
							}
						});
				//与循环前的变量进行合并
				variables.putAll(beforeLoopVariable);
				//删除掉多余出来的聚合变量
				beforeLoopVariable.forEach((k,v)->{
					variables.remove("@" + k);
				});
				variables.remove(VARIABLE_CONTEXT + joinNodeId);
				beforeLoopVariable.clear();
			}
			return isDone;
		} else {
			context.warn("找不到等待节点：{}" + node.getStringJsonValue(JOIN_NODE_ID));
		}
		return false;
	}
}
