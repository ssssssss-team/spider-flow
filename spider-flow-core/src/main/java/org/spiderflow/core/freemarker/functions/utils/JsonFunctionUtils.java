package org.spiderflow.core.freemarker.functions.utils;

import com.alibaba.fastjson.JSON;

/**
 * Json和String互相转换 工具类 防止NPE 
 * @author Administrator
 *
 */
public class JsonFunctionUtils {

	public static Object parse(String jsonString){
		return jsonString != null ? JSON.parse(jsonString) : null;
	}
	
	public static String stringify(Object object){
		return object != null ? JSON.toJSONString(object) : null;
	}
	
}
