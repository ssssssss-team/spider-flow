package com.mxd.spider.core.executor;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.freemarker.FreeMarkerEngine;
import com.mxd.spider.core.model.SpiderJsonProperty;
import com.mxd.spider.core.model.SpiderNode;

@Component
public class FunctionExecutor implements Executor{
	
	private static Logger logger = LoggerFactory.getLogger(FunctionExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderJsonProperty property = node.getJsonProperty();
		if(property != null && StringUtils.isNotBlank(property.getFunction())){
			try {
				engine.execute(property.getFunction(), variables);
			} catch (Exception e) {
				logger.error("执行函数{}失败",property.getFunction(),e);
				context.log(String.format("执行函数%s失败,异常信息:%s",property.getFunction(),ExceptionUtils.getStackTrace(e)));
			}
		}
	}

	@Override
	public String supportShape() {
		return "function";
	}

}
