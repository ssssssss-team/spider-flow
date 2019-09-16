package org.spiderflow.executor.function.extension;

import org.openqa.selenium.WebElement;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

@Component
public class WebElementFunctionExtension implements FunctionExtension{
	
	@Override
	public Class<?> support() {
		return WebElement.class;
	}
	
	public static WebElement sendKeys(WebElement element,String keys){
		element.sendKeys(keys);
		return element;
	}
	
	public static WebElement click(WebElement element){
		element.click();
		return element;
	}

}
