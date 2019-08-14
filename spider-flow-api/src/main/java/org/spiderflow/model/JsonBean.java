package org.spiderflow.model;

public class JsonBean<T> {

	private Integer code = 1;
	
	private String message = "执行成功";
	
	private T data;

	public JsonBean(Integer code, String message, T data) {
		super();
		this.code = code;
		this.message = message;
		this.data = data;
	}

	public JsonBean(Integer code, String message) {
		super();
		this.code = code;
		this.message = message;
	}

	public JsonBean(T data) {
		super();
		this.data = data;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
}
