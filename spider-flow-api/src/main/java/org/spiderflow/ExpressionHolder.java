package org.spiderflow;

import java.util.Map;

public class ExpressionHolder {
	
	private static ThreadLocal<Map<String,Object>> variables =  new ThreadLocal<>();
	
	public static void setVariables(Map<String,Object> variable){
		variables.set(variable);
	}
	
	public static Object get(String key){
		Map<String, Object> variable = variables.get();
		return variable != null ? variable.get(key) : null;
	}
	
	public static void remove(){
		variables.remove();
	}

}
