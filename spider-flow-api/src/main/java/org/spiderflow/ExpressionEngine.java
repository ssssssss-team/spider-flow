package org.spiderflow;

import java.util.Map;

/**
 * 表达式引擎
 */
public interface ExpressionEngine {

	/**
	 * 执行表达式
	 * @param expression	表达式
	 * @param variables	变量
	 * @return
	 */
	Object execute(String expression, Map<String, Object> variables);

}
