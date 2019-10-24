package org.spiderflow;

import java.util.Map;

public interface ExpressionEngine {
	
	Object execute(String expression, Map<String, Object> variables);

}
