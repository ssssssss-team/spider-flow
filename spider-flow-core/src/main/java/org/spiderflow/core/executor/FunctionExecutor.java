package org.spiderflow.core.executor;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.executor.Executor;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 函数执行器
 * @author Administrator
 *
 */
@Component
public class FunctionExecutor implements Executor{
	
	public static final String FUNCTION = "function";
	
	private static Logger logger = LoggerFactory.getLogger(FunctionExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		String function = node.getStringJsonValue(FUNCTION);
		if(StringUtils.isNotBlank(function)){
			try {
				engine.execute(function, variables);
			} catch (Exception e) {
				logger.error("执行函数{}失败",function,e);
				context.log(String.format("执行函数%s失败,异常信息:%s",function,ExceptionUtils.getStackTrace(e)));
			}
		}
	}

	@Override
	public String supportShape() {
		return "function";
	}

}
