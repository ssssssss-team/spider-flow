package org.spiderflow.core.executor.function.extension;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

@Component
public class ArrayFunctionExtension implements FunctionExtension{
	
	@Override
	public Class<?> support() {
		return Object[].class;
	}
	
	public static int size(Object[] objs){
		return objs.length;
	}
	
	public static String join(Object[] objs,String separator){
		return StringUtils.join(objs,separator);
	}
	
	public static String join(Object[] objs){
		return StringUtils.join(objs);
	}
	
	public static List<?> toList(Object[] objs){
		return Arrays.asList(objs);
	}

}
