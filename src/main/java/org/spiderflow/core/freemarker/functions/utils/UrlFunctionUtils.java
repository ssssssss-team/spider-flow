package org.spiderflow.core.freemarker.functions.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;

public class UrlFunctionUtils {
	
	public static String encode(String url){
		return encode(url,Charset.defaultCharset().name());
	}
	
	public static String encode(String url,String charset){
		try {
			return url != null ? URLEncoder.encode(url,charset) : null;
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
	
	public static String decode(String url){
		return decode(url,Charset.defaultCharset().name());
	}
	
	public static String decode(String url,String charset){
		try {
			return url != null ? URLDecoder.decode(url, charset) : null;
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
}
