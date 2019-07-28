package org.spiderflow.core.executor;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.io.HttpRequest;
import org.spiderflow.core.io.HttpResponse;
import org.spiderflow.core.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RequestExecutor implements Executor{
	
	public static final String SLEEP = "sleep";
	
	public static final String URL = "url";
	
	public static final String PROXY = "proxy";
	
	public static final String REQUEST_METHOD = "method";
	
	public static final String PARAMETER_NAME = "parameter-name";
	
	public static final String PARAMETER_VALUE = "parameter-value";
	
	public static final String HEADER_NAME = "header-name";
	
	public static final String HEADER_VALUE = "header-value";
	
	private static Logger logger = LoggerFactory.getLogger(RequestExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public String supportShape() {
		return "request";
	}

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		String sleepCondition = node.getStringJsonValue(SLEEP);
		if(StringUtils.isNotBlank(sleepCondition)){
			try {
				Object value = engine.execute(sleepCondition, variables);
				long sleepTime = ((Long)value).longValue();
				Thread.sleep(sleepTime);
			} catch (InterruptedException e) {
				
			}
		}
		HttpRequest request = HttpRequest.create();
		
		List<Map<String, String>> parameters = node.getListJsonValue(PARAMETER_NAME,PARAMETER_VALUE);
		//设置请求url
		String url = null;
		try {
			url = engine.execute(node.getStringJsonValue(URL), variables).toString();
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
		String method = Objects.toString(node.getStringJsonValue("METHOD"), "GET");
		//设置请求方法
		request.method(method);
		if(logger.isDebugEnabled()){
			logger.debug("设置请求方法:{}" + method);
		}
		context.log(String.format("设置请求方法:%s", method));
		//设置请求参数
		if(parameters != null){
			for (Map<String,String> nameValue : parameters) {
				Object value = null;
				String parameterName = nameValue.get(PARAMETER_NAME);
				String parameterValue = nameValue.get(PARAMETER_VALUE);
				try {
					value = engine.execute(parameterValue, variables);
					context.log(String.format("设置请求参数:%s=%s", parameterName,value));
					if(logger.isDebugEnabled()){
						logger.debug("设置请求参数：%s=%s",parameterName,value);
					}
				} catch (Exception e) {
					context.log(String.format("设置请求参数:%s出错，异常信息：%s", parameterName,ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求参数：%s出错",parameterName,e);
				}
				request.data(parameterName, value);
			}
		}
		//设置请求header
		List<Map<String,String>> headers = node.getListJsonValue(HEADER_NAME,HEADER_VALUE);
		if(headers != null){
			for (Map<String,String> nameValue : headers) {
				Object value = null;
				String headerName = nameValue.get(HEADER_NAME);
				String headerValue = nameValue.get(HEADER_VALUE);
				try {
					value = engine.execute(headerValue, variables);
					context.log(String.format("设置请求Header:%s=%s", headerName,value));
					if(logger.isDebugEnabled()){
						logger.debug("设置请求Header：%s=%s",headerName,value);
					}
				} catch (Exception e) {
					context.log(String.format("设置请求Header:%s出错，异常信息：%s", headerName,ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求Header：%s出错",headerName,e);
				}
				request.header(headerName,value);
			}
		}
		//设置代理
		String proxy = node.getStringJsonValue(PROXY);
		if(proxy != null){
			try {
				proxy = engine.execute(proxy, variables).toString();
				String[] proxyArr = proxy.split(":");
				if(proxyArr != null && proxyArr.length == 2){
					request.proxy(proxyArr[0], Integer.parseInt(proxyArr[1]));
					context.log(String.format("设置代理：%s", proxy));
					if(logger.isDebugEnabled()){
						logger.debug("设置代理：{}",proxy);
					}
				}
			} catch (Exception e) {
				context.log("设置代理出错，异常信息：" + ExceptionUtils.getStackTrace(e));
				logger.error("设置代理出错",e);
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
