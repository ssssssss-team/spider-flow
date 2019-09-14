package org.spiderflow.core.executor.function.extension;

import java.util.List;

import org.jsoup.nodes.Element;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

@Component
public class ElementFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return Element.class;
	}
	
	public static Object xpath(Element element,String xpath){
		return ExtractUtils.getObjectValueByXPath(element, xpath);
	}
	
	public static List<Object> xpaths(Element element,String xpath){
		return ExtractUtils.getObjectValuesByXPath(element, xpath);
	}
	
	public static String regx(Element element,String regx){
		return ExtractUtils.getFirstMatcher(element.html(), regx, true);
	}
	
	public static List<String> regxs(Element element,String regx){
		return ExtractUtils.getMatchers(element.html(), regx, true);
	}

}
