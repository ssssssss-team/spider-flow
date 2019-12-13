package org.spiderflow.core.executor.function.extension;

import java.util.Objects;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;

@Component
public class ObjectFunctionExtension implements FunctionExtension{
	
	@Override
	public Class<?> support() {
		return Object.class;
	}
	
	@Comment("将对象转为string类型")
	@Example("${objVar.string()}")
	public static String string(Object obj){
		if (obj instanceof String) {
			return (String) obj;
		}
		return Objects.toString(obj);
	}
	
	@Comment("根据jsonpath提取内容")
	@Example("${objVar.jsonpath('$.code')}")
	public static Object jsonpath(Object obj,String path){
		if(obj instanceof String){
			return ExtractUtils.getValueByJsonPath(JSON.parse((String)obj), path);
		}
		return ExtractUtils.getValueByJsonPath(obj, path);
	}

	@Comment("睡眠等待一段时间")
	@Example("${objVar.sleep(1000)}")
	public static Object sleep(Object obj, int millis) {
		try {
			Thread.sleep(millis);
		} catch (InterruptedException ignored) {
		}
		return obj;
	}
}
