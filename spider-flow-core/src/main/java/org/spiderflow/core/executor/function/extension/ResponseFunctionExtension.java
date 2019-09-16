package org.spiderflow.core.executor.function.extension;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.spiderflow.io.SpiderResponse;
import org.springframework.stereotype.Component;

@Component
public class ResponseFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return SpiderResponse.class;
	}
	
	public static Element element(SpiderResponse response){
		return Jsoup.parse(response.getHtml());
	}
	
	public static Object xpath(SpiderResponse response,String xpath){
		return ExtractUtils.getObjectValueByXPath(element(response), xpath);
	}
	
	public static List<Object> xpaths(SpiderResponse response,String xpath){
		return ExtractUtils.getObjectValuesByXPath(element(response), xpath);
	}
	
	public static String regx(SpiderResponse response,String pattern){
		return ExtractUtils.getFirstMatcher(response.getHtml(), pattern, true);
	}
	
	public static List<String> regxs(SpiderResponse response,String pattern){
		return ExtractUtils.getMatchers(response.getHtml(), pattern, true);
	}
	
	public static Object jsonpath(SpiderResponse response,String path){
		return ExtractUtils.getValueByJsonPath(response.getJson(), path);
	}

}
