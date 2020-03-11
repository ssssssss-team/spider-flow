package org.spiderflow.core.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.alibaba.fastjson.JSONPath;
import us.codecraft.xsoup.Xsoup;

/**
 * 抽取数据工具类
 * @author jmxd
 *
 */
public class ExtractUtils {
	
	private static Map<String,Pattern> patterns = new HashMap<>();
	
	private static Pattern compile(String regx){
		Pattern pattern = patterns.get(regx);
		if(pattern == null){
			pattern = Pattern.compile(regx,Pattern.DOTALL);
			patterns.put(regx, pattern);
		}
		return pattern;
	}
	
	public static List<String> getMatchers(String content,String regx,boolean isGroup){
		return getMatchers(content,regx,isGroup ? 1: 0);
	}
	
	public static List<String> getMatchers(String content,String regx,int groupIndex){
		Matcher matcher = compile(regx).matcher(content);
		List<String> results = new ArrayList<>();
		while(matcher.find()){
			results.add(matcher.group(groupIndex));
		}
		return results;
	}
	
	public static List<List<String>> getMatchers(String content,String regx,List<Integer> groups){
		Matcher matcher = compile(regx).matcher(content);
		List<List<String>> results = new ArrayList<>();
		while(matcher.find()){
			List<String> matches = new ArrayList<>();
			for (Integer groupIndex : groups) {
				matches.add(matcher.group(groupIndex));
			}
			results.add(matches);
		}
		return results;
	}
	
	public static String getFirstMatcher(String content,String regx,boolean isGroup){
		
		return getFirstMatcher(content,regx,isGroup ? 1 : 0);
	}
	
	public static String getFirstMatcher(String content,String regx,int groupIndex){
		Matcher matcher = compile(regx).matcher(content);
		if(matcher.find()){
			return matcher.group(groupIndex);
		}
		return null;
	}
	
	public static List<String> getFirstMatcher(String content,String regx,List<Integer> groups){
		Matcher matcher = compile(regx).matcher(content);
		List<String> matches = new ArrayList<>();
		if(matcher.find()){
			for (Integer groupIndex : groups) {
				matches.add(matcher.group(groupIndex));
			}
		}
		return matches;
	}
	
	public static String getHostFromURL(String url){
		return getFirstMatcher(url, "(?<=//|)((\\w)+\\.)+\\w+", false);
	}
	
	public static String getFirstHTMLBySelector(Element element,String selector){
		element = getFirstElement(element,selector);
		return element == null ? null : element.html();
	}

	public static String getFirstOuterHTMLBySelector(Element element,String selector){
		element = getFirstElement(element,selector);
		return element == null ? null : element.outerHtml();
	}
	
	public static String getFirstTextBySelector(Element element,String selector){
		element = getFirstElement(element,selector);
		return element == null ? null : element.text();
	}
	
	public static String getFirstAttrBySelector(Element element,String selector,String attr){
		element = getFirstElement(element,selector);
		return element == null ? null : element.attr(attr);
	}
	
	public static Element getFirstElement(Element element,String selector){
		return element.selectFirst(selector);
	}
	
	public static List<Element> getElements(Element element,String selector){
		return element.select(selector);
	}
	
	public static List<String> getHTMLBySelector(Element element,String selector){
		Elements elements = element.select(selector);
		List<String> result = new ArrayList<>();
		for (Element elem : elements) {
			result.add(elem.html());
		}
		return result;
	}
	
	public static List<String> getOuterHTMLBySelector(Element element,String selector){
		Elements elements = element.select(selector);
		List<String> result = new ArrayList<>();
		for (Element elem : elements) {
			result.add(elem.outerHtml());
		}
		return result;
	}
	
	public static List<String> getTextBySelector(Element element,String selector){
		Elements elements = element.select(selector);
		List<String> result = new ArrayList<>();
		for (Element elem : elements) {
			result.add(elem.text());
		}
		return result;
	}
	
	public static List<String> getAttrBySelector(Element element,String selector,String attr){
		Elements elements = element.select(selector);
		List<String> result = new ArrayList<>();
		for (Element elem : elements) {
			result.add(elem.attr(attr));
		}
		return result;
	}
	
	public static Object getValueByJsonPath(Object root,String jsonPath){
		return JSONPath.eval(root, jsonPath);
	}
	
	public static List<String> getValuesByXPath(Element element,String xpath){
		return Xsoup.select(element,xpath).list();
	}

	public static List<String> getValuesByXPath(Elements elements,String xpath){
		return Xsoup.select(elements.html(),xpath).list();
	}
	
	public static String getValueByXPath(Element element,String xpath){
		return Xsoup.select(element,xpath).get();
	}

	public static String getValueByXPath(Elements elements,String xpath){
		return Xsoup.select(elements.html(),xpath).get();
	}
	
	public static String getElementByXPath(Element element,String xpath){
		return Xsoup.select(element,xpath).get();
	}
	
	public static boolean isNumber(String str) {
        return compile("^(\\-|\\+)?\\d+(\\.\\d+)?$").matcher(str).matches();  
	}
	
}
