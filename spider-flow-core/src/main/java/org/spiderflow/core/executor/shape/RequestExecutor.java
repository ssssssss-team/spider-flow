package org.spiderflow.core.executor.shape;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.Grammer;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.io.HttpRequest;
import org.spiderflow.core.io.HttpResponse;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.utils.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 请求执行器
 * @author Administrator
 *
 */
@Component
public class RequestExecutor implements ShapeExecutor,Grammer{
	
	public static final String SLEEP = "sleep";
	
	public static final String URL = "url";
	
	public static final String PROXY = "proxy";
	
	public static final String REQUEST_METHOD = "method";
	
	public static final String PARAMETER_NAME = "parameter-name";
	
	public static final String PARAMETER_VALUE = "parameter-value";
	
	public static final String PARAMETER_FORM_NAME = "parameter-form-name";
	
	public static final String PARAMETER_FORM_VALUE = "parameter-form-value";
	
	public static final String PARAMETER_FORM_FILENAME = "parameter-form-filename";
	
	public static final String PARAMETER_FORM_TYPE = "parameter-form-type";
	
	public static final String BODY_TYPE = "body-type";
	
	public static final String BODY_CONTENT_TYPE = "body-content-type";
	
	public static final String REQUEST_BODY = "request-body";
	
	public static final String HEADER_NAME = "header-name";
	
	public static final String HEADER_VALUE = "header-value";
	
	public static final String TIMEOUT = "timeout";
	
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
			logger.debug("设置请求url:{}" , url);
		}
		context.log(String.format("设置请求url:%s", url));
		request.url(url);
		//设置请求超时时间
		int timeout = NumberUtils.toInt(node.getStringJsonValue(TIMEOUT), 60000);
		if(logger.isDebugEnabled()){
			logger.debug("设置请求超时时间:{}" , timeout);
		}
		context.log(String.format("设置请求超时时间:%s", timeout));
		request.timeout(timeout);
		
		String method = Objects.toString(node.getStringJsonValue(REQUEST_METHOD), "GET");
		//设置请求方法
		request.method(method);
		if(logger.isDebugEnabled()){
			logger.debug("设置请求方法:{}" + method);
		}
		context.log(String.format("设置请求方法:%s", method));
		SpiderNode root = context.getRootNode();
		//设置请求header
		setRequestHeader(request, root.getListJsonValue(HEADER_NAME,HEADER_VALUE), context, variables);
		setRequestHeader(request, node.getListJsonValue(HEADER_NAME,HEADER_VALUE), context, variables);
		String bodyType = node.getStringJsonValue(BODY_TYPE);
		List<InputStream> streams = null;
		if("raw".equals(bodyType)){
			String contentType = node.getStringJsonValue(BODY_CONTENT_TYPE);
			request.contentType(contentType);
			try {
				Object requestBody = engine.execute(node.getStringJsonValue(REQUEST_BODY), variables);
				request.data(requestBody);
				if(logger.isDebugEnabled()){
					logger.debug("设置请求Body:{}" + requestBody);
				}
				context.log(String.format("设置请求Body:%s", requestBody));
			} catch (Exception e) {
				context.log("设置请求Body出错，异常信息：" + ExceptionUtils.getStackTrace(e));
				logger.error("设置请求Body出错",e);
			}
		}else if("form-data".equals(bodyType)){
			List<Map<String, String>> formParameters = node.getListJsonValue(PARAMETER_FORM_NAME,PARAMETER_FORM_VALUE,PARAMETER_FORM_TYPE,PARAMETER_FORM_FILENAME);
			streams = setRequestFormParameter(request,formParameters,context,variables);
		}else{
			//设置请求参数
			setRequestParameter(request,root.getListJsonValue(PARAMETER_NAME,PARAMETER_VALUE), context, variables);
			setRequestParameter(request,node.getListJsonValue(PARAMETER_NAME,PARAMETER_VALUE),context,variables);
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
		} finally{
			if(streams != null){
				for (InputStream is : streams) {
					try {
						is.close();
					} catch (Exception e) {
					}
				}
			}
		}
	}
	
	private List<InputStream> setRequestFormParameter(HttpRequest request,List<Map<String, String>> parameters,SpiderContext context,Map<String,Object> variables){
		List<InputStream> streams = new ArrayList<>();
		if(parameters != null){
			for (Map<String,String> nameValue : parameters) {
				Object value = null;
				String parameterName = nameValue.get(PARAMETER_FORM_NAME);
				String parameterValue = nameValue.get(PARAMETER_FORM_VALUE);
				String parameterType = nameValue.get(PARAMETER_FORM_TYPE);
				String parameterFilename = nameValue.get(PARAMETER_FORM_FILENAME);
				boolean hasFile = "file".equals(parameterType);
				try {
					value = engine.execute(parameterValue, variables);
					if(hasFile){
						InputStream stream = null;
						if(value instanceof byte[]){
							stream = new ByteArrayInputStream((byte[]) value);
						}else if(value instanceof String){
							stream = new ByteArrayInputStream(((String)value).getBytes());
						}else if(value instanceof InputStream){
							stream = (InputStream) value;
						}
						if(stream != null){
							streams.add(stream);
							request.data(parameterName, parameterFilename, stream);
							context.log(String.format("设置请求参数:%s=%s", parameterName,parameterFilename));
							if(logger.isDebugEnabled()){
								logger.debug("设置请求参数：{}={}",parameterName,parameterFilename);
							}
						}else{
							context.log(String.format("设置请求参数:%s失败,无二进制内容", parameterName));
							if(logger.isDebugEnabled()){
								logger.debug("设置请求参数：{}失败，无二进制内容",parameterName);
							}
						}
					}else{
						request.data(parameterName, parameterValue);
						context.log(String.format("设置请求参数:%s=%s", parameterName,value));
						if(logger.isDebugEnabled()){
							logger.debug("设置请求参数：{}={}",parameterName,value);
						}
					}
				} catch (Exception e) {
					context.log(String.format("设置请求参数:%s出错，异常信息：%s", parameterName,ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求参数：{}出错",parameterName,e);
				}
			}
		}
		return streams;
	}
	
	private void setRequestParameter(HttpRequest request,List<Map<String, String>> parameters,SpiderContext context,Map<String,Object> variables){
		if(parameters != null){
			for (Map<String,String> nameValue : parameters) {
				Object value = null;
				String parameterName = nameValue.get(PARAMETER_NAME);
				String parameterValue = nameValue.get(PARAMETER_VALUE);
				try {
					value = engine.execute(parameterValue, variables);
					context.log(String.format("设置请求参数:%s=%s", parameterName,value));
					if(logger.isDebugEnabled()){
						logger.debug("设置请求参数：{}={}",parameterName,value);
					}
				} catch (Exception e) {
					context.log(String.format("设置请求参数:%s出错，异常信息：%s", parameterName,ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求参数：{}出错",parameterName,e);
				}
				request.data(parameterName, value);
			}
		}
	}
	
	private void setRequestHeader(HttpRequest request,List<Map<String, String>> headers,SpiderContext context,Map<String,Object> variables){
		if(headers != null){
			for (Map<String,String> nameValue : headers) {
				Object value = null;
				String headerName = nameValue.get(HEADER_NAME);
				String headerValue = nameValue.get(HEADER_VALUE);
				try {
					value = engine.execute(headerValue, variables);
					context.log(String.format("设置请求Header:%s=%s", headerName,value));
					if(logger.isDebugEnabled()){
						logger.debug("设置请求Header：{}={}",headerName,value);
					}
				} catch (Exception e) {
					context.log(String.format("设置请求Header:%s出错，异常信息：%s", headerName,ExceptionUtils.getStackTrace(e)));
					logger.error("设置请求Header：{}出错",headerName,e);
				}
				request.header(headerName,value);
			}
		}
	}
	@Override
	public Map<String, List<String>> getAttributeMap() {
		return Maps.newMap("resp", Arrays.asList("json","html","statusCode","cookies","headers","bytes","contentType"));
	}
}
