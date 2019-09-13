package org.spiderflow.core.expression;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DefaultExpressionEngine implements ExpressionEngine{
	
	@Autowired
	private List<FunctionExecutor> functionExecutors;
	
	@Override
	public Object execute(String expression, Map<String, Object> variables) {
		if(StringUtils.isBlank(expression)){
			return expression;
		}
		ExpressionTemplateContext context = new ExpressionTemplateContext(variables);
		for (FunctionExecutor executor : functionExecutors) {
			context.set(executor.getFunctionPrefix(), executor);
		}
		Object value = ExpressionTemplate.create(expression).render(context);
		return value;
	}
	
}
