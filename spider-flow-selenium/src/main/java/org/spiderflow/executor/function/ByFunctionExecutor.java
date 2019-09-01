package org.spiderflow.executor.function;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.spiderflow.Grammer;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.utils.Maps;
import org.springframework.stereotype.Component;

@Component
public class ByFunctionExecutor implements FunctionExecutor,Grammer{

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
	
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("By", Arrays.asList("id","name","tagName","className","css","xpath"));
	}
}
