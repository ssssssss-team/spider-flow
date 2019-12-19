package org.spiderflow.core.executor.function.extension;

import java.util.List;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.annotation.Return;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

@Component
public class ElementsFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return Elements.class;
	}
	
	@Comment("根据xpath提取内容")
	@Example("${elementsVar.xpath('//title/text()')}")
	@Return({Element.class,String.class})
	public static String xpath(Elements elements,String xpath){
		return ExtractUtils.getValueByXPath(elements, xpath);
	}
	
	@Comment("根据xpath提取内容")
	@Example("${elementsVar.xpaths('//h2/text()')}")
	@Return({Element.class,String.class})
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
	
	@Comment("根据css选择器提取内容")
	@Example("${elementsVar.selectors('div > a')}")
	public static Elements selectors(Elements elements,String selector){
		return elements.select(selector);
	}
}
