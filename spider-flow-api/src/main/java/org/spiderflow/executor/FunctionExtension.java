package org.spiderflow.executor;

import java.util.Arrays;
import java.util.List;

public interface FunctionExtension {
	
	default Class<?> support(){
		return Object.class;
	}
	
	default List<Class<?>> supports(){
		return Arrays.asList(support());
	}
}
