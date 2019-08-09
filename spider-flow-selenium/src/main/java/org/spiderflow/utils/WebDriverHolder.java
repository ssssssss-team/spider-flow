package org.spiderflow.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.openqa.selenium.WebDriver;
import org.spiderflow.context.SpiderContext;

public class WebDriverHolder {
	
	private static Map<String,List<WebDriver>> driverMap = new ConcurrentHashMap<>();
	
	private static Map<String,WebDriver> lastDriver = new ConcurrentHashMap<>();
	
	public static void clear(SpiderContext context){
		List<WebDriver> drivers = driverMap.get(context.getId());
		if(drivers != null){
			for (WebDriver driver : drivers) {
				driver.quit();
			}
		}
		driverMap.remove(context.getId());
	}
	
	public synchronized static void add(SpiderContext context,WebDriver driver){
		List<WebDriver> drivers = driverMap.get(context.getId());
		if(drivers == null){
			drivers = new ArrayList<>();
			driverMap.put(context.getId(), drivers);
		}
		drivers.add(driver);
		lastDriver.put(context.getId(), driver);
	}
	
	public static WebDriver get(SpiderContext context){
		return lastDriver.get(context.getId());
	}
}
