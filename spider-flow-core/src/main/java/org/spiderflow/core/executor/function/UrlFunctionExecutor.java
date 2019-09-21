package org.spiderflow.core.executor.function;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;

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
