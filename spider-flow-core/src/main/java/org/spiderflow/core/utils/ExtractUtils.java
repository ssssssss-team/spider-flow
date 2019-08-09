package org.spiderflow.core.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.nodes.Document;
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
	
	public static String getFirstHTMLBySelector(Document document,String selector){
		return document.selectFirst(selector).html();
	}
	
	public static String getFirstOuterHTMLBySelector(Document document,String selector){
		return document.selectFirst(selector).outerHtml();
	}
	
	public static String getFirstTextBySelector(Document document,String selector){
		return document.selectFirst(selector).text();
	}
	
	public static String getFirstAttrBySelector(Document document,String selector,String attr){
		return document.selectFirst(selector).attr(attr);
	}
	
	public static List<String> getHTMLBySelector(Document document,String selector){
		Elements elements = document.select(selector);
		List<String> result = new ArrayList<>();
		for (Element element : elements) {
			result.add(element.html());
		}
		return result;
	}
	
	public static List<String> getOuterHTMLBySelector(Document document,String selector){
		Elements elements = document.select(selector);
		List<String> result = new ArrayList<>();
		for (Element element : elements) {
			result.add(element.outerHtml());
		}
		return result;
	}
	
	public static List<String> getTextBySelector(Document document,String selector){
		Elements elements = document.select(selector);
		List<String> result = new ArrayList<>();
		for (Element element : elements) {
			result.add(element.text());
		}
		return result;
	}
	
	public static List<String> getAttrBySelector(Document document,String selector,String attr){
		Elements elements = document.select(selector);
		List<String> result = new ArrayList<>();
		for (Element element : elements) {
			result.add(element.attr(attr));
		}
		return result;
	}
	
	public static Object getValueByJsonPath(Object root,String jsonPath){
		return JSONPath.eval(root, jsonPath);
	}
	
	public static List<String> getValuesByXPath(Document document,String xpath){
		JXDocument jXdocument = JXDocument.create(document);
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
	
	public static String getValueByXPath(Document document,String xpath){
		JXDocument jXdocument = JXDocument.create(document);
		JXNode node = jXdocument.selNOne(xpath);
		if(node != null){
			return node.asString();
		}
		return null;
	}
	
	public static boolean isNumber(String str) {  
        return compile("^(\\-|\\+)?\\d+(\\.\\d+)?$").matcher(str).matches();  
	}
	
}
