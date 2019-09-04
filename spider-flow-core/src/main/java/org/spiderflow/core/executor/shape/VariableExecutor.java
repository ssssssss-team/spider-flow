package org.spiderflow.core.executor.shape;

import java.util.List;
import java.util.Map;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 定义变量执行器
 * @author Administrator
 *
 */
@Component
public class VariableExecutor implements ShapeExecutor{
	
	private static final String VARIABLE_NAME = "variable-name";
	
	private static final String VARIABLE_VALUE = "variable-value";
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		List<Map<String, String>> variableList = node.getListJsonValue(VARIABLE_NAME,VARIABLE_VALUE);
		for (Map<String, String> nameValue : variableList) {
			Object value = null;
			String variableName = nameValue.get(VARIABLE_NAME);
			String variableValue = nameValue.get(VARIABLE_VALUE);
			try {
				value = engine.execute(variableValue, variables);
				context.debug("设置变量{}={}",variableName,value);
			} catch (Exception e) {
				context.error("设置变量{}出错，异常信息：{}",variableName,e);
			}
			variables.put(variableName, value);
		}
	}

	@Override
	public String supportShape() {
		return "variable";
	}
	
	@Override
	public boolean isThread() {
		return false;
	}

}
