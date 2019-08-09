package org.spiderflow.executor.function;

import org.openqa.selenium.By;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

@Component
public class ByFunctionExecutor implements FunctionExecutor{

	@Override
	public String getFunctionPrefix() {
		return "By";
	}

	public static By xpath(String xpath){
		return By.xpath(xpath);
	}
	
	public static By css(String css){
		return By.cssSelector(css);
	}
	
	public static By className(String className){
		return By.className(className);
	}
	
	public static By tagName(String tag){
		return By.tagName(tag);	
	}
	
	public static By id(String id){
		return By.id(id);
	}
	
	public static By name(String name){
		return By.name(name);
	}


}
