package org.spiderflow.core.executor.shape;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.context.SpiderContext;
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

	private static final Logger logger = LoggerFactory.getLogger(FunctionExecutor.class);
	
	@Autowired
	private ExpressionEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		List<Map<String, String>> functions = node.getListJsonValue(FUNCTION);
		for (Map<String, String> item : functions) {
			String function = item.get(FUNCTION);
			if(StringUtils.isNotBlank(function)){
				try {
					engine.execute(function, variables);
				} catch (Exception e) {
					logger.error("执行函数{}失败,异常信息:{}",function,e);
					ExceptionUtils.wrapAndThrow(e);
				}
			}
		}
	}

	@Override
	public String supportShape() {
		return "function";
	}

}
