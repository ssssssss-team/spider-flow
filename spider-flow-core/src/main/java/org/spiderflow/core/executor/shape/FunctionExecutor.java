package org.spiderflow.core.executor.shape;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 函数执行器
 * @author Administrator
 *
 */
@Component
public class FunctionExecutor implements ShapeExecutor{
	
	public static final String FUNCTION = "function";
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		String function = node.getStringJsonValue(FUNCTION);
		if(StringUtils.isNotBlank(function)){
			try {
				engine.execute(function, variables);
			} catch (Exception e) {
				context.error("执行函数%s失败,异常信息:{}",e);
			}
		}
	}

	@Override
	public String supportShape() {
		return "function";
	}

}
