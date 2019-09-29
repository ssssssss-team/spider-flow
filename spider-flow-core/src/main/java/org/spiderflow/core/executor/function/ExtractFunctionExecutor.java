package org.spiderflow.core.executor.function;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

@Component
@Comment("数据抽取常用方法")
public class ExtractFunctionExecutor implements FunctionExecutor{

	@Override
	public String getFunctionPrefix() {
		return "extract";
	}
	
	@Comment("根据jsonpath提取内容")
	@Example("${extract.jsonpath(resp.json,'$.code')}")
	public static Object jsonpath(Object root,String jsonpath){
		return ExtractUtils.getValueByJsonPath(root, jsonpath);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${extract.regx(resp.html,'<title>(.*?)</title>')}")
	public static String regx(String content,String pattern){
		return ExtractUtils.getFirstMatcher(content, pattern, true);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${extract.regxs(resp.html,'<h2>(.*?)</h2>')}")
	public static List<String> regxs(String content,String pattern){
		return ExtractUtils.getMatchers(content, pattern, true);
	}
	
	@Comment("根据xpath提取内容")
	@Example("${extract.xpath(resp.element(),'//title/text()')}")
	public static String xpath(Element element,String xpath){
		return ExtractUtils.getValueByXPath(element, xpath);
	}
	
	@Comment("根据xpath提取内容")
	@Example("${extract.xpath(resp.html,'//title/text()')}")
	public static String xpath(String content,String xpath){
		return xpath(Jsoup.parse(content),xpath);
	}
	
	@Comment("根据xpaths提取内容")
	@Example("${extract.xpaths(resp.element(),'//h2/text()')}")
	public static List<String> xpaths(Element element,String xpath){
		return ExtractUtils.getValuesByXPath(element, xpath);
	}
	
	@Comment("根据xpaths提取内容")
	@Example("${extract.xpaths(resp.html,'//h2/text()')}")
	public static List<String> xpaths(String content,String xpath){
		return xpaths(Jsoup.parse(content),xpath);
	}
	
	@Comment("根据css选择器提取内容")
	@Example("${extract.selectors(resp.html,'div > a')}")
	public static List<String> selectors(Object object,String selector){
		return ExtractUtils.getHTMLBySelector(getElement(object), selector);
	}
	
	@Comment("根据css选择器提取内容")
	@Example("${extract.selector(resp.html,'div > a','text')}")
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
	
	@Comment("根据css选择器提取内容")
	@Example("${extract.selector(resp.html,'div > a','attr','href')}")
	public static String selector(Object object,String selector,String type,String attrValue){
		if("attr".equals(type)){
			return ExtractUtils.getFirstAttrBySelector(getElement(object), selector,attrValue);
		}
		return null;
	}
	
	@Comment("根据css选择器提取内容")
	@Example("${extract.selector(resp.html,'div > a')}")
	public static String selector(Object object,String selector){
		return ExtractUtils.getFirstHTMLBySelector(getElement(object), selector);
	}
	
	@Comment("根据css选择器提取内容")
	@Example("${extract.selectors(resp.html,'div > a','element')}")
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
	
	@Comment("根据css选择器提取内容")
	@Example("${extract.selectors(resp.html,'div > a','attr','href')}")
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
}
