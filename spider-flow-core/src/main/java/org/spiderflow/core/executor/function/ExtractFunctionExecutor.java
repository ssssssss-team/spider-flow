package org.spiderflow.core.executor.function;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.spiderflow.Grammer;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.utils.Maps;
import org.springframework.stereotype.Component;

@Component
public class ExtractFunctionExecutor implements FunctionExecutor,Grammer{

	@Override
	public String getFunctionPrefix() {
		return "extract";
	}
	
	public static Object jsonpath(Object root,String jsonpath){
		return ExtractUtils.getValueByJsonPath(root, jsonpath);
	}
	
	public static String regx(String content,String pattern){
		return ExtractUtils.getFirstMatcher(content, pattern, true);
	}
	
	public static List<String> regxs(String content,String pattern){
		return ExtractUtils.getMatchers(content, pattern, true);
	}
	
	public static String xpath(Element element,String xpath){
		return ExtractUtils.getValueByXPath(element, xpath);
	}
	
	public static String xpath(String content,String xpath){
		return xpath(Jsoup.parse(content),xpath);
	}
	
	public static List<String> xpaths(Element element,String xpath){
		return ExtractUtils.getValuesByXPath(element, xpath);
	}
	
	public static List<String> xpaths(String content,String xpath){
		return xpaths(Jsoup.parse(content),xpath);
	}
	
	public static Object selector(Object ... args){
		if(args != null && args.length > 1 &&args[0] != null && args[1] != null){
			Element element = null;
			if(args[0] instanceof Element){
				element = (Element) args[0];
			}else{
				element = Jsoup.parse(args[0].toString());
			}
			String selector = (String) args[1];
			if(args.length == 2){
				return ExtractUtils.getFirstHTMLBySelector(element, selector);
			}
			String type = (String) args[2];
			if("text".equals(type)){
				return ExtractUtils.getFirstTextBySelector(element, selector);
			}
			if("attr".equals(type) && args.length == 4){
				return ExtractUtils.getFirstAttrBySelector(element, selector,(String) args[3]);
			}
			if("outerhtml".equals(type)){
				return ExtractUtils.getFirstOuterHTMLBySelector(element, selector);
			}
			if("element".equals(type)){
				return ExtractUtils.getFirstElement(element, selector);
			}
		}
		return null;
	}
	
	public static Object selectors(Object object,String selector){
		return ExtractUtils.getHTMLBySelector(getElement(object), selector);
	}
	
	public static Object selector(Object object,String selector,String type){
		if("element".equals(type)){
			return ExtractUtils.getFirstElement(getElement(object), selector);
		}else if("text".equals(type)){
			return ExtractUtils.getFirstTextBySelector(getElement(object), selector);
		}else if("outerhtml".equals(type)){
			return ExtractUtils.getFirstOuterHTMLBySelector(getElement(object), selector);
		}
		return null;
	}
	
	public static Object selector(Object object,String selector,String type,String attrValue){
		if("attr".equals(type)){
			return ExtractUtils.getFirstAttrBySelector(getElement(object), selector,attrValue);
		}
		return null;
	}
	
	public static Object selector(Object object,String selector){
		return ExtractUtils.getFirstHTMLBySelector(getElement(object), selector);
	}
	
	public static Object selectors(Object object,String selector,String type){
		if("element".equals(type)){
			return ExtractUtils.getElements(getElement(object), selector);
		}else if("text".equals(type)){
			return ExtractUtils.getTextBySelector(getElement(object), selector);
		}else if("outerhtml".equals(type)){
			return ExtractUtils.getOuterHTMLBySelector(getElement(object), selector);
		}
		return null;
	}
	
	public static Object selectors(Object object,String selector,String type,String attrValue){
		if("attr".equals(type)){
			return ExtractUtils.getAttrBySelector(getElement(object), selector,attrValue);
		}
		return null;
	}
	
	private static Element getElement(Object object){
		if(object != null){
			return object instanceof Element ? (Element)object:Jsoup.parse((String) object);
		}
		return null;
	}
	
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("extract", Arrays.asList("jsonpath","regx","regxs","selector","selectors","xpath","xpaths"));
	}
}
