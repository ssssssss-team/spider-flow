package org.spiderflow.io;

import java.util.Map;

import com.alibaba.fastjson.JSON;

public interface SpiderResponse {
	
	public int getStatusCode();
	
	public String getHtml();
	
	default Object getJson(){
		return JSON.parse(getHtml());
	}
	
	public Map<String,String> getCookies();
	
	public Map<String,String> getHeaders();
	
	public byte[] getBytes();
	
	public String getContentType();
	

}
