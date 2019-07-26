package com.mxd.spider.core.freemarker;
/**
 * 选择器对象
 * @author Administrator
 *
 */
public class FreemarkerObject {
	/**
	 * 选择器所选择的 对象/值
	 */
	private Object value;
	/**
	 * 构造器
	 * @param value
	 */
	public FreemarkerObject(Object value) {
		super();
		this.value = value;
	}

	public Object getValue() {
		return value;
	}
}
