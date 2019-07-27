package org.spiderflow.core.io;

import java.util.Map;

import org.jsoup.Connection.Response;

import com.alibaba.fastjson.JSON;

public class HttpResponse {
	
	private Response response;

	public HttpResponse(Response response) {
		super();
		this.response = response;
	}
	
	public int getStatusCode(){
		return response.statusCode();
	}
	
	public String getHtml(){
		return response.body();
	}
	
	public Object getJson(){
		return JSON.parse(getHtml());
	}
	
	public Map<String,String> getCookies(){
		return response.cookies();
	}
	
	public Map<String,String> getHeaders(){
		return response.headers();
	}
	
	public byte[] getBytes(){
		return response.bodyAsBytes();
	}
	
	public String getContentType(){
		return response.contentType();
	}
}
