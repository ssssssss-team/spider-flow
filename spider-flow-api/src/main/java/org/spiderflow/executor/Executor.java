package org.spiderflow.executor;

import java.util.Map;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.model.Shape;
import org.spiderflow.model.SpiderNode;
/**
 * 执行器接口
 * @author jmxd
 *
 */
public interface Executor {
	
	public static final String LOOP_VARIABLE_NAME = "loopVariableName";
	
	public static final String LOOP_COUNT = "loopCount";
	
	public static final String THREAD_COUNT = "threadCount";
	
	
	default Shape shape(){
		return null;
	}
	
	/**
	 * 节点形状
	 * @return 节点形状名称
	 */
	public String supportShape();
	/**
	 * 执行器具体的功能实现
	 * @param node 当前要执行的爬虫节点
	 * @param context 爬虫上下文
	 * @param variables 节点流程的全部变量的集合
	 */
	public void execute(SpiderNode node,SpiderContext context,Map<String,Object> variables);
}
