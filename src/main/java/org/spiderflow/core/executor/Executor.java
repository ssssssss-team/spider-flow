package org.spiderflow.core.executor;

import java.util.Map;

import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.model.SpiderNode;
/**
 * 执行器接口
 * @author Administrator
 *
 */
public interface Executor {
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
