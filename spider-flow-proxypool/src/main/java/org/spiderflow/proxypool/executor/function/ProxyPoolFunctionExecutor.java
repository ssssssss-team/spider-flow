package org.spiderflow.proxypool.executor.function;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.spiderflow.Grammer;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.proxypool.ProxyPoolManager;
import org.spiderflow.proxypool.model.Proxy;
import org.spiderflow.utils.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProxyPoolFunctionExecutor implements FunctionExecutor,Grammer{
	
	private static ProxyPoolManager proxyPoolManager;

	@Override
	public String getFunctionPrefix() {
		return "proxypool";
	}
	
	public static String http(boolean anonymous){
		return convertToString(proxyPoolManager.getHttpProxy(anonymous));
	}
	
	public static String http(){
		return http(true);
	}
	
	public static String https(boolean anonymous){
		return convertToString(proxyPoolManager.getHttpsProxy(anonymous));
	}
	
	public static String https(){
		return https(true);
	}
	
	private static String convertToString(Proxy proxy){
		if(proxy == null){
			return null;
		}
		return String.format("%s:%s", proxy.getIp(),proxy.getPort());
	}
	
	public static void add(String ip,Integer port,String type,boolean anonymous){
		Proxy proxy = new Proxy();
		proxy.setIp(ip);
		proxy.setPort(Integer.valueOf(port));
		proxy.setType(type);
		proxy.setAnonymous(anonymous ? 1: 0);
		proxyPoolManager.add(proxy);
	}

	@Autowired
	public void setProxyPoolManager(ProxyPoolManager proxyPoolManager) {
		ProxyPoolFunctionExecutor.proxyPoolManager = proxyPoolManager;
	}
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("proxypool", Arrays.asList("http","https","add"));
	}
}
