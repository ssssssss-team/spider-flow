package org.spiderflow.core.executor.function.extension;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;


@Component
public class ListFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return List.class;
	}
	
	public static int length(List<?> list){
		return list.size();
	}
	
	public static String join(List<?> list){
		return StringUtils.join(list.toArray());
	}
	
	public static String join(List<?> list,String separator){
		return StringUtils.join(list.toArray(),separator);
	}
	
}
