package org.spiderflow.ocr.model;

public class Ocr {

	private String appId;
	
	private String apiKey;
	
	private String secretKey;
	
	public Ocr() {
		super();
	}

	public Ocr(String appId, String apiKey, String secretKey) {
		super();
		this.appId = appId;
		this.apiKey = apiKey;
		this.secretKey = secretKey;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}
	
	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}
	
}