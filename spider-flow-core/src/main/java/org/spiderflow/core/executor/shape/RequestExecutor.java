package org.spiderflow.core.executor.shape;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.Grammerable;
import org.spiderflow.context.CookieContext;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.io.HttpRequest;
import org.spiderflow.core.io.HttpResponse;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.io.SpiderResponse;
import org.spiderflow.model.Grammer;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * 请求执行器
 * @author Administrator
 *
 */
@Component
public class RequestExecutor implements ShapeExecutor,Grammerable{
	
	public static final String SLEEP = "sleep";
	
	public static final String URL = "url";
	
	public static final String PROXY = "proxy";
	
	public static final String REQUEST_METHOD = "method";
	
	public static final String PARAMETER_NAME = "parameter-name";
	
	public static final String PARAMETER_VALUE = "parameter-value";

	public static final String COOKIE_NAME = "cookie-name";

	public static final String COOKIE_VALUE = "cookie-value";

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
	
	public static final String RESPONSE_CHARSET = "response-charset";
	
	public static final String FOLLOW_REDIRECT = "follow-redirect";
	
	public static final String TLS_VALIDATE = "tls-validate";

	public static final String LAST_EXECUTE_TIME = "__last_execute_time_";

	public static final String COOKIE_AUTO_SET = "cookie-auto-set";
	
	@Autowired
	private ExpressionEngine engine;

	@Override
	public String supportShape() {
		return "request";
	}

	@PostConstruct
	void init(){
		//允许设置被限制的请求头
		System.setProperty("sun.net.http.allowRestrictedHeaders", "true");
	}

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		CookieContext cookieContext = context.getCookieContext();
		String sleepCondition = node.getStringJsonValue(SLEEP);
		if(StringUtils.isNotBlank(sleepCondition)){
			try {
				Object value = engine.execute(sleepCondition, variables);
				if(value != null){
					long sleepTime = NumberUtils.toLong(value.toString(), 0L);
					synchronized (node.getNodeId().intern()){
						//实际等待时间 = 上次执行时间 + 睡眠时间 - 当前时间
						sleepTime = context.get(LAST_EXECUTE_TIME + node.getNodeId(), 0L) + sleepTime - System.currentTimeMillis();
						if(sleepTime > 0){
							context.info("设置延迟时间:{}ms", sleepTime);
							Thread.sleep(sleepTime);
						}
						context.put(LAST_EXECUTE_TIME + node.getNodeId(),System.currentTimeMillis());
					}
				}
			} catch (Throwable t) {
				context.error("设置延迟时间失败:{}", t);
			}
		}
		HttpRequest request = HttpRequest.create();
		//设置请求url
		String url = null;
		try {
			url = engine.execute(node.getStringJsonValue(URL), variables).toString();
		} catch (Exception e) {
			context.error("设置请求url出错，异常信息：{}", e);
			ExceptionUtils.wrapAndThrow(e);
		}
		context.debug("设置请求url:{}", url);
		request.url(url);
		//设置请求超时时间
		int timeout = NumberUtils.toInt(node.getStringJsonValue(TIMEOUT), 60000);
		context.debug("设置请求超时时间:{}", timeout);
		request.timeout(timeout);
		
		String method = Objects.toString(node.getStringJsonValue(REQUEST_METHOD), "GET");
		//设置请求方法
		request.method(method);
		context.debug("设置请求方法:{}", method);
		
		//是否跟随重定向
		boolean followRedirects = !"0".equals(node.getStringJsonValue(FOLLOW_REDIRECT));
		request.followRedirect(followRedirects);
		context.debug("设置跟随重定向：{}", followRedirects);
		
		//是否验证TLS证书,默认是验证
		if("0".equals(node.getStringJsonValue(TLS_VALIDATE))){
			request.validateTLSCertificates(false);
			context.debug("设置TLS证书验证：{}", false);
		}
		SpiderNode root = context.getRootNode();
		//设置请求header
		setRequestHeader(request, root.getListJsonValue(HEADER_NAME,HEADER_VALUE), context, variables);
		setRequestHeader(request, node.getListJsonValue(HEADER_NAME,HEADER_VALUE), context, variables);

		//设置全局Cookie
		Map<String, String> cookies = getRequestCookie(request, root.getListJsonValue(COOKIE_NAME, COOKIE_VALUE), context, variables);
		if(!cookies.isEmpty()){
			context.debug("设置全局Cookie：{}", cookies);
			request.cookies(cookies);
		}
		//设置自动管理的Cookie
		boolean cookieAutoSet = !"0".equals(node.getStringJsonValue(COOKIE_AUTO_SET));
		if(cookieAutoSet){
			request.cookies(cookieContext);
			context.debug("自动设置Cookie：{}", cookieContext);
		}
		//设置本节点Cookie
		cookies = getRequestCookie(request, node.getListJsonValue(COOKIE_NAME, COOKIE_VALUE), context, variables);
		if(!cookies.isEmpty()){
			context.debug("设置Cookie：{}", cookies);
			request.cookies(cookies);
		}
		if(cookieAutoSet){
			cookieContext.putAll(cookies);
		}

		String bodyType = node.getStringJsonValue(BODY_TYPE);
		List<InputStream> streams = null;
		if("raw".equals(bodyType)){
			String contentType = node.getStringJsonValue(BODY_CONTENT_TYPE);
			request.contentType(contentType);
			try {
				Object requestBody = engine.execute(node.getStringJsonValue(REQUEST_BODY), variables);
				request.data(requestBody);
				context.debug("设置请求Body:{}", requestBody);
			} catch (Exception e) {
				context.debug("设置请求Body出错:{}", e);
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
				Object value = engine.execute(proxy, variables);
				if(value != null){
					String[] proxyArr = value.toString().split(":");
					if(proxyArr != null && proxyArr.length == 2){
						request.proxy(proxyArr[0], Integer.parseInt(proxyArr[1]));
						context.debug("设置代理：{}",proxy);
					}
				}
			} catch (Exception e) {
				context.error("设置代理出错，异常信息:{}",e);
			}
		}
		try {
			HttpResponse response = request.execute();
			String charset = node.getStringJsonValue(RESPONSE_CHARSET);
			if(StringUtils.isNotBlank(charset)){
				response.setCharset(charset);
				context.debug("设置response charset:{}",charset);
			}
			//cookie存入cookieContext
			cookieContext.putAll(response.getCookies());
			//结果存入变量
			variables.put("resp", response);
		} catch (IOException e) {
			context.debug("请求{}出错,异常信息:{}",url,e);
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
				if(StringUtils.isNotBlank(parameterName)){
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
								context.debug("设置请求参数：{}={}",parameterName,parameterFilename);
							}else{
								context.debug("设置请求参数：{}失败，无二进制内容",parameterName);
							}
						}else{
							request.data(parameterName, value);
							context.debug("设置请求参数：{}={}",parameterName,value);
						}
						
					} catch (Exception e) {
						context.error("设置请求参数：{}出错,异常信息:{}",parameterName,e);
					}
				}
			}
		}
		return streams;
	}

	private Map<String,String> getRequestCookie(HttpRequest request, List<Map<String, String>> cookies, SpiderContext context, Map<String, Object> variables) {
		Map<String,String> cookieMap = new HashMap<>();
		if (cookies != null) {
			for (Map<String, String> nameValue : cookies) {
				Object value = null;
				String cookieName = nameValue.get(COOKIE_NAME);
				if (StringUtils.isNotBlank(cookieName)) {
					String cookieValue = nameValue.get(COOKIE_VALUE);
					try {
						value = engine.execute(cookieValue, variables);
						if (value != null) {
							cookieMap.put(cookieName, cookieValue);
							context.debug("设置请求Cookie：{}={}", cookieName, value);
						}
					} catch (Exception e) {
						context.error("设置请求Cookie：{}出错,异常信息：{}", cookieName, e);
					}
				}
			}
		}
		return cookieMap;
	}

	private void setRequestParameter(HttpRequest request, List<Map<String, String>> parameters, SpiderContext context, Map<String, Object> variables) {
		if (parameters != null) {
			for (Map<String, String> nameValue : parameters) {
				Object value = null;
				String parameterName = nameValue.get(PARAMETER_NAME);
				if (StringUtils.isNotBlank(parameterName)) {
					String parameterValue = nameValue.get(PARAMETER_VALUE);
					try {
						value = engine.execute(parameterValue, variables);
						context.debug("设置请求参数：{}={}", parameterName, value);
					} catch (Exception e) {
						context.error("设置请求参数：{}出错,异常信息：{}", parameterName, e);
					}
					request.data(parameterName, value);
				}
			}
		}
	}

	private void setRequestHeader(HttpRequest request, List<Map<String, String>> headers, SpiderContext context, Map<String, Object> variables) {
		if (headers != null) {
			for (Map<String, String> nameValue : headers) {
				Object value = null;
				String headerName = nameValue.get(HEADER_NAME);
				if (StringUtils.isNotBlank(headerName)) {
					String headerValue = nameValue.get(HEADER_VALUE);
					try {
						value = engine.execute(headerValue, variables);
						context.debug("设置请求Header：{}={}", headerName, value);
					} catch (Exception e) {
						context.error("设置请求Header：{}出错,异常信息：{}", headerName, e);
					}
					request.header(headerName, value);
				}
			}
		}
	}

	@Override
	public List<Grammer> grammers() {
		List<Grammer> grammers = Grammer.findGrammers(SpiderResponse.class,"resp" , "SpiderResponse", false);
		Grammer grammer = new Grammer();
		grammer.setFunction("resp");
		grammer.setComment("抓取结果");
		grammer.setOwner("SpiderResponse");
		grammers.add(grammer);
		return grammers;
	}
}
