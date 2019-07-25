package com.mxd.spider.core.freemarker.functions.utils;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class StringFunctionUtils {

	public static String substring(String content, int beginIndex) {
		return content != null ? content.substring(beginIndex) : null;
	}

	public static String substring(String content, int beginIndex, int endIndex) {
		return content != null ? content.substring(beginIndex, endIndex) : null;
	}

	public static String lower(String content) {
		return content != null ? content.toLowerCase() : null;
	}

	public static String upper(String content) {
		return content != null ? content.toUpperCase() : null;
	}

	public static int indexOf(String content, String str) {
		return content != null ? content.indexOf(str) : -1;
	}

	public static int indexOf(String content, String str, int fromIndex) {
		return content != null ? content.indexOf(str, fromIndex) : -1;
	}
	
	public static String replace(String content,String source,String target){
		return content != null ? content.replace(source, target): null;
	}
	
	public static String replaceAll(String content,String regx,String target){
		return content != null ? content.replaceAll(regx, target): null;
	}
	
	public static String replaceFirst(String content,String regx,String target){
		return content != null ? content.replaceFirst(regx, target): null;
	}
	
	public static int length(String content){
		return content != null ? content.length() : -1;
	}
	
	public static String trim(String content){
		return content != null ? content.trim() : null;
	}
	
	public static List<String> split(String content,String regx){
		return content != null ? Arrays.asList(content.split(regx)) : new ArrayList<>(0);
	}
	
	public static byte[] bytes(String content){
		return content != null ? content.getBytes() : null;
	}
	
	public static byte[] bytes(String content,String charset){
		try {
			return content != null ? content.getBytes(charset) : null;
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
	
	public static String newString(byte[] bytes){
		return bytes != null ? new String(bytes) : null;
	}
	
	public static String newString(byte[] bytes,String charset){
		try {
			return bytes != null ? new String(bytes,charset) : null;
		} catch (UnsupportedEncodingException e) {
			return null;
		}
	}
}
