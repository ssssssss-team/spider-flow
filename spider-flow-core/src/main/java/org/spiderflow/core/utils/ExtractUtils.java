package org.spiderflow.core.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.seimicrawler.xpath.JXDocument;
import org.seimicrawler.xpath.JXNode;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSONPath;
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
		Matcher matcher = compile(regx).matcher(content);
		List<String> results = new ArrayList<>();
		while(matcher.find()){
			String group = isGroup ? matcher.group(1) : matcher.group();
			if(!StringUtils.isEmpty(group)){
				results.add(group);
			}
		}
		return results;
	}
	
	public static String getFirstMatcher(String content,String regx,boolean isGroup){
		Matcher matcher = compile(regx).matcher(content);
		while(matcher.find()){
			String group = isGroup ? matcher.group(1) : matcher.group();
			return group;
		}
		return null;
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
		JXDocument jXdocument = JXDocument.create(new Elements(element));
		List<JXNode> nodes = jXdocument.selN(xpath);
		if(nodes != null){
			List<String> result = new ArrayList<>();
			for (JXNode node : nodes) {
				result.add(node.asString());
			}
			return result;
		}
		return Collections.emptyList();
	}
	
	public static String getValueByXPath(Element element,String xpath){
		JXDocument jXdocument = JXDocument.create(new Elements(element));
		JXNode node = jXdocument.selNOne(xpath);
		if(node != null){
			return node.asString();
		}
		return null;
	}
	
	public static String getElementByXPath(Element element,String xpath){
		JXDocument jXdocument = JXDocument.create(new Elements(element));
		JXNode node = jXdocument.selNOne(xpath);
		if(node != null){
			return node.asString();
		}
		return null;
	}
	
	public static Object getObjectValueByXPath(Element element,String xpath){
		return getObjectValueByXPath(new Elements(element),xpath);
	}
	
	public static List<Object> getObjectValuesByXPath(Element element,String xpath){
		return getObjectValuesByXPath(new Elements(element),xpath);
	}
	
	public static Object getObjectValueByXPath(Elements elements,String xpath){
		JXDocument jXdocument = JXDocument.create(elements);
		return jXdocument.selOne(xpath);
	}
	
	public static List<Object> getObjectValuesByXPath(Elements elements,String xpath){
		JXDocument jXdocument = JXDocument.create(elements);
		return jXdocument.sel(xpath);
	}
	
	public static boolean isNumber(String str) {  
        return compile("^(\\-|\\+)?\\d+(\\.\\d+)?$").matcher(str).matches();  
	}
	
}
