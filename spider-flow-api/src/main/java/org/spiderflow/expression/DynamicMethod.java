package org.spiderflow.expression;

import java.util.List;

public interface DynamicMethod {
	
	public Object execute(String methodName,List<Object> parameters);

}
