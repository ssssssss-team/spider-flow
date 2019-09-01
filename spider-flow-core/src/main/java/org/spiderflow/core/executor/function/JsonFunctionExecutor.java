package org.spiderflow.core.executor.function;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.spiderflow.Grammer;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.utils.Maps;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;

/**
 * Json和String互相转换 工具类 防止NPE 
 * @author Administrator
 *
 */
@Component
public class JsonFunctionExecutor implements FunctionExecutor,Grammer{
	
	@Override
	public String getFunctionPrefix() {
		return "json";
	}

	public static Object parse(String jsonString){
		return jsonString != null ? JSON.parse(jsonString) : null;
	}
	
	public static String stringify(Object object){
		return object != null ? JSON.toJSONString(object) : null;
	}
	
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("json", Arrays.asList("parse","stringify"));
	}
}
