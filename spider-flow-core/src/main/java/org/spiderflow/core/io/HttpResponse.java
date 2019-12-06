package org.spiderflow.core.io;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.jsoup.Connection.Response;
import org.jsoup.nodes.Document;
import org.spiderflow.io.SpiderResponse;

import com.alibaba.fastjson.JSON;

/**
 * 响应对象包装类
 * @author Administrator
 *
 */
public class HttpResponse implements SpiderResponse{

	private Response response;

	private int statusCode;

	private String urlLink;

	private Document document;

	private String htmlValue;

	private String titleName;

	private Object jsonValue;

	public HttpResponse(Response response) throws IOException {
		super();
		this.response = response;
		this.statusCode = response.statusCode();
		this.urlLink = response.url().toExternalForm();
		document = response.parse();
	}
	
	@Override
	public int getStatusCode(){
		return statusCode;
	}

	@Override
	public String getTitle() {
		if (titleName == null) {
			titleName = document.title();
		}
		return titleName;
	}

	@Override
	public String getHtml(){
		if(htmlValue == null){
			htmlValue = document.body().html();
		}
		return htmlValue;
	}
	
	@Override
	public Object getJson(){
		if(jsonValue == null){
			jsonValue = JSON.parse(getHtml());
		}
		return jsonValue;
	}
	
	@Override
	public Map<String,String> getCookies(){
		return response.cookies();
	}
	
	@Override
	public Map<String,String> getHeaders(){
		return response.headers();
	}
	
	@Override
	public byte[] getBytes(){
		return response.bodyAsBytes();
	}
	
	@Override
	public String getContentType(){
		return response.contentType();
	}

	@Override
	public void setCharset(String charset) {
		this.response.charset(charset);
	}

	@Override
	public String getUrl() {
		return urlLink;
	}

	@Override
	public InputStream getStream() {
		return response.bodyStream();
	}
}
