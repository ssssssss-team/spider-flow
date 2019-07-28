package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;

import freemarker.template.TemplateModelException;
/**
 * 封装Json对象的选择器方法类
 * @author jmxd
 *
 */
@Component
public class JsonObjectFunction extends FreemarkerTemplateMethodModel {

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 2) {
			JSONObject jsonObject = (JSONObject) getObjectValue(args.get(0));
			String key = getStringValue(args.get(1));
			return jsonObject.get(key);
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "jsonobject";
	}

}
