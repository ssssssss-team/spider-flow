package org.spiderflow.enums;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 流程通知方式
 * 
 * @author BillDowney
 * @date 2020年4月3日 下午3:26:18
 */
public enum FlowNoticeWay {

	email("邮件通知");

	private FlowNoticeWay(String title) {
		this.title = title;
	}

	private String title;

	@Override
	public String toString() {
		return this.name() + ":" + this.title;
	}

	public static Map<String, String> getMap() {
		Map<String, String> map = new LinkedHashMap<String, String>();
		for (FlowNoticeWay type : FlowNoticeWay.values()) {
			map.put(type.name(), type.toString());
		}
		return map;
	}

}
