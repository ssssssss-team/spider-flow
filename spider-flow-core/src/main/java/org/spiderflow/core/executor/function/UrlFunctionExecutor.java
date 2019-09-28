package org.spiderflow.core.executor.function;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

/**
 * url 按指定字符集进行编码/解码 默认字符集(UTF-8) 工具类 防止NPE 
 * @author Administrator
 *
 */
@Component
public class UrlFunctionExecutor implements FunctionExecutor{
	
	@Override
	public String getFunctionPrefix() {
		return "url";
	}
	
	@Comment("获取url后面的参数")
	@Example("${url.getParameters('http://www.baidu.com/s?wd=spider-flow')}")
	public static Map<String,String> getParameters(String url){
		int index = url.indexOf("?");
        String param = url.substring(index+1);
        String[] params = param.split("&");
        Map<String,String> map = new HashMap<String,String>();
        for (String item:params) {
            String[] kv = item.split("=");
            map.put(kv[0],kv[1]);
        }
		return map;
	}
	
	@Comment("url编码")
	@Example("${url.encode('http://www.baidu.com/s?wd=spider-flow')}")
	public static String encode(String url){
		return encode(url,Charset.defaultCharset().name());
	}
	
	@Comment("url编码")
	@Example("${url.encode('http://www.baidu.com/s?wd=spider-flow','UTF-8')}")
	public static String encode(String url,String charset){
		try {
			return url != null ? URLEncoder.encode(url,charset) : null;
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
	
	@Comment("url解码")
	@Example("${url.decode(strVar)}")
	public static String decode(String url){
		return decode(url,Charset.defaultCharset().name());
	}
	
	@Comment("url解码")
	@Example("${url.decode(strVar,'UTF-8')}")
	public static String decode(String url,String charset){
		try {
			return url != null ? URLDecoder.decode(url, charset) : null;
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
}
