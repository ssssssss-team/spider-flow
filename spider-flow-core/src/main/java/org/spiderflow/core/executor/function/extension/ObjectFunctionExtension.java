package org.spiderflow.core.executor.function.extension;

import java.util.Objects;

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
	
	public static String string(Object obj){
		if (obj instanceof String) {
			return (String) obj;
		}
		return Objects.toString(obj);
	}
	
	public static Object jsonpath(Object obj,String path){
		if(obj instanceof String){
			return ExtractUtils.getValueByJsonPath(JSON.parse((String)obj), path);
		}
		return ExtractUtils.getValueByJsonPath(obj, path);
	}

}
