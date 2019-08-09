package org.spiderflow.executor.function;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.spiderflow.ExpressionHolder;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.executor.shape.SeleniumExecutor;
import org.springframework.stereotype.Component;

@Component
public class SeleniumFunctionExecutor implements FunctionExecutor{

	@Override
	public String getFunctionPrefix() {
		return "selenium";
	}
	
	public static WebElement element(By by){
		WebDriver driver = getDriver();
		if(driver != null){
			try {
				return driver.findElement(by);
			} catch (Exception e) {
				//忽略异常
			}
		}
		return null;
	}
	
	public static WebElement element(WebElement element,By by){
		try {
			return element.findElement(by);
		} catch (Exception e) {
			return null;
		}
	}
	
	public static List<WebElement> elements(By by){
		WebDriver driver = getDriver();
		if(driver != null){
			try {
				return driver.findElements(by);
			} catch (Exception e) {
				e.printStackTrace();
				//忽略异常
			}
		}
		return null;
	}
	
	public static List<WebElement> elements(WebElement element,By by){
		try {
			return element.findElements(by);
		} catch (Exception e) {
			return null;
		}
	}
	
	public static List<WebElement> elements(List<WebElement> elements,By by){
		List<WebElement> nElements = new ArrayList<>();
		for (WebElement element : elements) {
			nElements.add(element(element,by));
		}
		return nElements;
	}
	
	public static String attribute(WebElement element,String attribute){
		return element != null ? element.getAttribute(attribute) : null;
	}
	
	public static String text(WebElement element){
		return element != null ? element.getText() : null;
	}
	
	public static List<String> text(List<WebElement> elements){
		if(elements == null){
			return null;
		}
		List<String> values = new ArrayList<String>();
		for (WebElement element : elements) {
			values.add(text(element));
		}
		return values;
	}
	
	public static String html(WebElement element){
		return attribute(element, "innerHTML");
	}
	
	public static List<String> html(List<WebElement> elements){
		if(elements == null){
			return null;
		}
		List<String> values = new ArrayList<String>();
		for (WebElement element : elements) {
			values.add(html(element));
		}
		return values;
	}
	
	public static List<String> attribute(List<WebElement> elements,String attribute){
		if(elements == null){
			return null;
		}
		List<String> values = new ArrayList<String>();
		for (WebElement element : elements) {
			values.add(attribute(element, attribute));
		}
		return values;
	}
	
	public static byte[] screenshot(WebElement element){
		byte[] bytes = element.getScreenshotAs(OutputType.BYTES);
		return bytes;
	}
	
	private static WebDriver getDriver(){
		return (WebDriver) ExpressionHolder.get(SeleniumExecutor.DRIVER_VAR_NAME);
	}
}
