package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.spiderflow.core.utils.ExtractUtils;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;
/**
 * 封装Json路径的选择器方法类
 * @author Administrator
 *
 */
@Component
public class JsonPathFunction extends FreemarkerTemplateMethodModel{

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 2){
			if (args.get(0) != null && args.get(1) != null) {
				Object root = getObjectValue(args.get(0));
				String jsonpath = getStringValue(args.get(1));
		        return ExtractUtils.getValueByJsonPath(root, jsonpath);
	        }
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "jsonpath";
	}

}
