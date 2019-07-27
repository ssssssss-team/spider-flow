package org.spiderflow.core.freemarker.functions.utils;

import org.apache.commons.codec.binary.Base64;

public class Base64FunctionUtils {
	
	public static String encode(byte[] bytes){
		return bytes != null ? Base64.encodeBase64String(bytes) : null;
	}
	
	public static String encode(String content,String charset){
		return encode(StringFunctionUtils.bytes(content,charset));
	}
	
	public static String encode(String content){
		return encode(StringFunctionUtils.bytes(content));
	}
	
	public static byte[] encodeBytes(byte[] bytes){
		return bytes != null ? Base64.encodeBase64(bytes) : null;
	}
	
	public static byte[] encodeBytes(String content,String charset){
		return encodeBytes(StringFunctionUtils.bytes(content,charset));
	}
	
	public static byte[] encodeBytes(String content){
		return encodeBytes(StringFunctionUtils.bytes(content));
	}
	
	public static byte[] decode(String base64){
		return base64  != null ? Base64.decodeBase64(base64) :null;
	}
	
	public static byte[] decode(byte[] base64){
		return base64  != null ? Base64.decodeBase64(base64) :null;
	}
	
	public static String decodeString(String base64){
		return base64  != null ? new String(Base64.decodeBase64(base64)) :null;
	}
	
	public static String decodeString(byte[] base64){
		return base64  != null ? new String(Base64.decodeBase64(base64)) :null;
	}
	
	public static String decodeString(byte[] base64,String charset){
		return base64  != null ? StringFunctionUtils.newString(Base64.decodeBase64(base64),charset) :null;
	}

}
