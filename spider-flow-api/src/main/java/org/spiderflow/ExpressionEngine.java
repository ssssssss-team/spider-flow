package org.spiderflow;

import java.util.Map;

public interface ExpressionEngine {
	
	public Object execute(String expression,Map<String,Object> variables);

}
