package org.spiderflow.core.executor.function.extension;

import java.util.Objects;

import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

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

}
