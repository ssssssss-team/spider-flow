package com.mxd.spider.core.executor;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.freemarker.FreeMarkerEngine;
import com.mxd.spider.core.io.HttpRequest;
import com.mxd.spider.core.io.HttpResponse;
import com.mxd.spider.core.model.SpiderJsonProperty;
import com.mxd.spider.core.model.SpiderNameValue;
import com.mxd.spider.core.model.SpiderNode;

@Component
public class RequestExecutor implements Executor{
	
	private static Logger logger = LoggerFactory.getLogger(RequestExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public String supportShape() {
		return "rectangle";
	}

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		HttpRequest request = HttpRequest.create();
		SpiderJsonProperty property = node.getJsonProperty();
		List<SpiderNameValue> parameters = property.getParameters();
		//设置请求url
		String url = null;
		try {
			url = engine.execute(property.getUrl(), variables).toString();
		} catch (Exception e) {
			context.log("设置请求url出错，异常信息：" + ExceptionUtils.getStackTrace(e));
			logger.error("设置请求url出错",e);
			ExceptionUtils.wrapAndThrow(e);
		}
		if(logger.isDebugEnabled()){
			logger.debug("设置请求url:{}" + url);
		}
		context.log(String.format("设置请求url:%s", url));
		request.url(url);
		String method = Objects.toString(property.getMethod(), "GET");
		//设置请求方法
		request.method(method);
		if(logger.isDebugEnabled()){
			logger.debug("设置请求方法:{}" + method);
		}
		context.log(String.format("设置请求方法:%s", method));
		//设置请求参数
		if(parameters != null){
			for (SpiderNameValue nameValue : parameters) {
				Object value = null;
				try {
					value = engine.execute(nameValue.getValue(), variables);
					context.log(String.format("设置请求参数:%s=%s", nameValue.getName(),value));
					if(logger.isDebugEnabled()){
						logger.debug("设置请求参数：%s=%s",nameValue.getName(),value);
					}
				} catch (Exception e) {
					context.log(String.format("设置请求参数:%s出错，异常信息：%s", nameValue.getName(),ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求参数：%s出错",nameValue.getName(),e);
				}
				request.data(nameValue.getName(), value);
			}
		}
		//设置请求header
		List<SpiderNameValue> headers = property.getHeaders();
		if(headers != null){
			for (SpiderNameValue nameValue : headers) {
				Object value = null;
				try {
					value = engine.execute(nameValue.getValue(), variables);
					context.log(String.format("设置请求Header:%s=%s", nameValue.getName(),value));
					if(logger.isDebugEnabled()){
						logger.debug("设置请求Header：%s=%s",nameValue.getName(),value);
					}
				} catch (Exception e) {
					context.log(String.format("设置请求Header:%s出错，异常信息：%s", nameValue.getName(),ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求Header：%s出错",nameValue.getName(),e);
				}
				request.header(nameValue.getName(),value);
			}
		}
		try {
			HttpResponse response = request.execute();
			//结果存入变量
			variables.put("resp", response);
		} catch (IOException e) {
			logger.error("请求{}出错",url,e);
			context.log(String.format("请求%s出错,异常信息:%s", url,ExceptionUtils.getStackTrace(e)));
			ExceptionUtils.wrapAndThrow(e);
			
		}
	}

}
