package org.spiderflow;

import java.util.List;
import java.util.Map;

public interface Grammer {

	default Map<String,List<String>> getFunctionMap(){
		return null;
	}
	
	default Map<String,List<String>> getAttributeMap(){
		return null;
	}
	
}
