package org.spiderflow.core.executor.function.extension;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ElementsFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return Elements.class;
	}
	
	@Comment("根据xpath提取内容")
	@Example("${elementsVar.xpath('//title/text()')}")
	public static String xpath(Elements elements,String xpath){
		return ExtractUtils.getValueByXPath(elements, xpath);
	}
	
	@Comment("根据xpath提取内容")
	@Example("${elementsVar.xpaths('//h2/text()')}")
	public static List<String> xpaths(Elements elements,String xpath){
		return ExtractUtils.getValuesByXPath(elements, xpath);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${elementsVar.regx('<title>(.*?)</title>')}")
	public static String regx(Elements elements,String regx){
		return ExtractUtils.getFirstMatcher(elements.html(), regx, true);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${elementsVar.regx('<title>(.*?)</title>',1)}")
	public static String regx(Elements elements,String regx,int groupIndex){
		return ExtractUtils.getFirstMatcher(elements.html(), regx, groupIndex);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${elementsVar.regx('<a href=\"(.*?)\">(.*?)</a>',[1,2])}")
	public static List<String> regx(Elements elements,String regx,List<Integer> groups){
		return ExtractUtils.getFirstMatcher(elements.html(), regx, groups);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${elementsVar.regxs('<h2>(.*?)</h2>')}")
	public static List<String> regxs(Elements elements,String regx){
		return ExtractUtils.getMatchers(elements.html(), regx, true);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${elementsVar.regxs('<h2>(.*?)</h2>',1)}")
	public static List<String> regxs(Elements elements,String regx,int groupIndex){
		return ExtractUtils.getMatchers(elements.html(), regx, groupIndex);
	}
	
	@Comment("根据正则表达式提取内容")
	@Example("${elementsVar.regxs('<a href=\"(.*?)\">(.*?)</a>',[1,2])}")
	public static List<List<String>> regxs(Elements elements,String regx,List<Integer> groups){
		return ExtractUtils.getMatchers(elements.html(), regx, groups);
	}
	
	@Comment("根据css选择器提取内容")
	@Example("${elementsVar.selector('div > a')}")
	public static Element selector(Elements elements,String selector){
		Elements foundElements = elements.select(selector);
		if(foundElements.size() > 0){
			return foundElements.get(0);
		}
		return null;
	}

	@Comment("返回所有attr")
	@Example("${elementsVar.attrs('href')}")
	public static List<String> attrs(Elements elements,String key){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.attr(key));
		}
		return list;
	}

	@Comment("返回所有value")
	@Example("${elementsVar.vals()}")
	public static List<String> vals(Elements elements){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.val());
		}
		return list;
	}

	@Comment("返回所有text")
	@Example("${elementsVar.texts()}")
	public static List<String> texts(Elements elements){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.text());
		}
		return list;
	}

	@Comment("返回所有html")
	@Example("${elementsVar.htmls()}")
	public static List<String> htmls(Elements elements){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.html());
		}
		return list;
	}

	@Comment("返回所有outerHtml")
	@Example("${elementsVar.outerHtmls()}")
	public static List<String> outerHtmls(Elements elements){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.outerHtml());
		}
		return list;
	}

	@Comment("返回所有ownTexts")
	@Example("${elementsVar.ownTexts()}")
	public static List<String> ownTexts(Elements elements){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.ownText());
		}
		return list;
	}

	@Comment("返回所有wholeText")
	@Example("${elementsVar.wholeTexts()}")
	public static List<String> wholeTexts(Elements elements){
		List<String> list = new ArrayList<>(elements.size());
		for (Element element : elements) {
			list.add(element.wholeText());
		}
		return list;
	}
	
	@Comment("根据css选择器提取内容")
	@Example("${elementsVar.selectors('div > a')}")
	public static Elements selectors(Elements elements,String selector){
		return elements.select(selector);
	}

	@Comment("获取上级节点")
	@Example("${elementsVar.parents()}")
	public static Elements parents(Elements elements){
		return elements.parents();
	}

}
