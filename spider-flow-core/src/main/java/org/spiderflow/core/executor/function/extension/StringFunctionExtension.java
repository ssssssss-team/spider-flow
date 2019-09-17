package org.spiderflow.core.executor.function.extension;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.math.NumberUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spiderflow.core.executor.function.DateFunctionExecutor;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;

@Component
public class StringFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return String.class;
	}	
	
	public static String regx(String source,String pattern){
		return ExtractUtils.getFirstMatcher(source, pattern, true);
	}
	
	public static List<String> regxs(String source,String pattern){
		return ExtractUtils.getMatchers(source, pattern, true);
	}
	
	public static Object xpath(String source,String xpath){
		return ExtractUtils.getObjectValueByXPath(Jsoup.parse(source), xpath);
	}
	
	public static List<Object> xpaths(String source,String xpath){
		return ExtractUtils.getObjectValuesByXPath(Jsoup.parse(source), xpath);
	}
	
	public static Element element(String source){
		return Jsoup.parse(source);
	}
	
	public static Element selector(String source,String cssQuery){
		return element(source).selectFirst(cssQuery);
	}
	
	public static Elements selectors(String source,String cssQuery){
		return element(source).select(cssQuery);
	}
	
	public static Object json(String source){
		return JSON.parse(source);
	}
	
	public static Object jsonpath(String source,String jsonPath){
		return ExtractUtils.getValueByJsonPath(json(source), jsonPath);
	}
	
	public static Integer toInt(String source,int defaultValue){
		return NumberUtils.toInt(source, defaultValue);
	}
	
	public static Integer toInt(String source){
		return NumberUtils.toInt(source);
	}
	
	public static Double toDouble(String source){
		return NumberUtils.toDouble(source);
	}
	
	public static Long toLong(String source){
		return NumberUtils.toLong(source);
	}
	
	public static Date toDate(String source,String pattern) throws ParseException{
		return DateFunctionExecutor.parse(source, pattern);
	}
}
