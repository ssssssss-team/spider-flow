package com.mxd.spider.core.freemarker.functions.utils;

import com.alibaba.fastjson.JSON;

public class JsonFunctionUtils {

	public static Object parse(String jsonString){
		return jsonString != null ? JSON.parse(jsonString) : null;
	}
	
	public static String stringify(Object object){
		return object != null ? JSON.toJSONString(object) : null;
	}
	
}
