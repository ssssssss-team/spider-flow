package org.spiderflow.core.freemarker.functions;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.spiderflow.Grammer;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.utils.Maps;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;
/**
 * 封装Json路径的选择器方法类
 * @author jmxd
 *
 */
@Component
public class JsonPathFunction extends FreemarkerTemplateMethodModel implements Grammer{

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
	
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("jsonpath", Collections.emptyList());
	}
}
