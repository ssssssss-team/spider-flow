package org.spiderflow.io;

import java.util.Map;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;

import com.alibaba.fastjson.JSON;

public interface SpiderResponse {
	
	@Comment("获取返回状态码")
	@Example("${resp.statusCode}")
	public int getStatusCode();
	
	@Comment("获取网页html")
	@Example("${resp.html}")
	public String getHtml();
	
	@Comment("获取json")
	@Example("${resp.json}")
	default Object getJson(){
		return JSON.parse(getHtml());
	}
	@Comment("获取cookies")
	@Example("${resp.cookies}")
	public Map<String,String> getCookies();
	
	@Comment("获取headers")
	@Example("${resp.headers}")
	public Map<String,String> getHeaders();
	
	@Comment("获取byte[]")
	@Example("${resp.bytes}")
	public byte[] getBytes();
	
	@Comment("获取ContentType")
	@Example("${resp.contentType}")
	public String getContentType();
	
	@Comment("获取当前url")
	@Example("${resp.url}")
	default String getUrl(){
		return null;
	}
	
	@Example("${resp.setCharset('UTF-8')}")
	default void setCharset(String charset){
		
	}
}
