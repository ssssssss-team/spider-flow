package org.spiderflow.model;

public class JsonBean<T> {
	
	private int code = 1;
	
	private String msg = "执行成功";
	
	private T data;

	public JsonBean(int code, String msg) {
		super();
		this.code = code;
		this.msg = msg;
	}

	public JsonBean(T data) {
		super();
		this.data = data;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
}
