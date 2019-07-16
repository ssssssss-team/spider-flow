package com.mxd.spider.core.io;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.Connection.Method;
import org.jsoup.Connection.Response;

public class HttpRequest {
	
	private String url;
	
	private Map<String,String> headers = null;
	
	private Map<String,String> data = null;
	
	private String method = "GET";
	
	public static HttpRequest create(){
		return new HttpRequest();
	}
	
	public HttpRequest url(String url){
		this.url = url;
		return this;
	}
	
	public HttpRequest headers(Map<String,String> headers){
		if(this.headers == null){
			this.headers = new HashMap<>();
		}
		this.headers.putAll(headers);
		return this;
	}
	
	public HttpRequest header(String key,String value){
		if(this.headers == null){
			this.headers = new HashMap<>();
		}
		this.headers.put(key, value);
		return this;
	}
	
	public HttpRequest header(String key,Object value){
		if(value != null){
			return header(key,data.toString());
		}
		return this;
	}
	
	public HttpRequest data(String key,String value){
		if(this.data == null){
			this.data = new HashMap<>();
		}
		this.data.put(key, value);
		return this;
	}
	
	public HttpRequest data(String key,Object value){
		if(value != null){
			return data(key,data.toString());
		}
		return this;
	}
	public HttpRequest data(Map<String,String> data){
		if(this.data == null){
			this.data = new HashMap<>();
		}
		this.data.putAll(data);
		return this;
	}
	
	public HttpRequest method(String method){
		this.method = method;
		return this;
	}
	
	public HttpResponse execute() throws IOException{
		Connection connection = Jsoup.connect(this.url);
		connection.ignoreContentType(true);
		connection.ignoreHttpErrors(true);
		connection.method(Method.GET);
		if("POST".equals(this.method)){
			connection.method(Method.POST);
		}
		if(this.headers != null){
			connection.headers(this.headers);
		}
		if(this.data != null){
			connection.data(data);
		}
		Response response = connection.execute();
		return new HttpResponse(response);
	}
	

}
