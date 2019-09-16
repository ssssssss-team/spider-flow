package org.spiderflow.core.executor.function.extension;

import java.util.List;

import org.jsoup.select.Elements;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

@Component
public class ElementsFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return Elements.class;
	}
	
	public static Object xpath(Elements elements,String xpath){
		return ExtractUtils.getObjectValueByXPath(elements, xpath);
	}
	
	public static List<Object> xpaths(Elements elements,String xpath){
		return ExtractUtils.getObjectValuesByXPath(elements, xpath);
	}
	
	public static String regx(Elements elements,String regx){
		return ExtractUtils.getFirstMatcher(elements.html(), regx, true);
	}
	
	public static List<String> regxs(Elements elements,String regx){
		return ExtractUtils.getMatchers(elements.html(), regx, true);
	}

}
