package org.spiderflow.expression;

import java.util.List;

public interface DynamicMethod {
	
	Object execute(String methodName, List<Object> parameters);

}
