package org.spiderflow.oss.model;

public class Oss {

	private String endpoint;
	
	private String accessKeyId;
	
	private String accessKeySecret;
	
	private String bucketName;
	
	public Oss(String endpoint, String accessKeyId, String accessKeySecret, String bucketName) {
		super();
		this.endpoint = endpoint;
		this.accessKeyId = accessKeyId;
		this.accessKeySecret = accessKeySecret;
		this.bucketName = bucketName;
	}
	
	public Oss() {
		super();
	}

	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}

	public String getAccessKeyId() {
		return accessKeyId;
	}

	public void setAccessKeyId(String accessKeyId) {
		this.accessKeyId = accessKeyId;
	}

	public String getAccessKeySecret() {
		return accessKeySecret;
	}

	public void setAccessKeySecret(String accessKeySecret) {
		this.accessKeySecret = accessKeySecret;
	}

	public String getBucketName() {
		return bucketName;
	}

	public void setBucketName(String bucketName) {
		this.bucketName = bucketName;
	}
	
}