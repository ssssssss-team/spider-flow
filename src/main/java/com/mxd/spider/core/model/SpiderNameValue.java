package com.mxd.spider.core.model;
/**
 * 参数NV对
 * @author Administrator
 *
 */
public class SpiderNameValue {
	/**
	 * 参数名称
	 */
	private String name;
	/**
	 * 参数值
	 */
	private String value;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "SpiderFlowNodeVariable [name=" + name + ", value=" + value + "]";
	}
}
