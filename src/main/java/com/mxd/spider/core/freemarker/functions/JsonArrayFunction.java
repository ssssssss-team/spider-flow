package com.mxd.spider.core.freemarker.functions;

import java.util.List;

import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;

import freemarker.template.TemplateModelException;

@Component
public class JsonArrayFunction extends FreemarkerTemplateMethodModel {

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 1) {
			String content = getStringValue(args.get(0));
			JSONArray jsonArray = JSONArray.parseArray(content);
			return jsonArray;
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "jsonarray";
	}

}
