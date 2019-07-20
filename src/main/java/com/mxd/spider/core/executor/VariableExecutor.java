package com.mxd.spider.core.executor;

import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.freemarker.FreeMarkerEngine;
import com.mxd.spider.core.model.SpiderJsonProperty;
import com.mxd.spider.core.model.SpiderNameValue;
import com.mxd.spider.core.model.SpiderNode;

@Component
public class VariableExecutor implements Executor{
	
	private static Logger logger = LoggerFactory.getLogger(VariableExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderJsonProperty property = node.getJsonProperty();
		if(property != null){
			for (SpiderNameValue nameValue : property.getVariables()) {
				Object value = null;
				try {
					value = engine.execute(nameValue.getValue(), variables);
					context.log(String.format("设置变量%s=%s", nameValue.getName(),value));
					if (logger.isDebugEnabled()) {
						logger.debug("设置变量{}={}",nameValue.getName(),value);
					}
				} catch (Exception e) {
					logger.error("设置变量{}出错，异常信息：",nameValue.getName(),e);
					context.log(String.format("设置变量%s出错,异常信息：%s", nameValue.getName(),ExceptionUtils.getStackTrace(e)));
					ExceptionUtils.wrapAndThrow(e);
				}
				variables.put(nameValue.getName(), value);
			}
		}
	}

	@Override
	public String supportShape() {
		return "parallelogram";
	}

}
