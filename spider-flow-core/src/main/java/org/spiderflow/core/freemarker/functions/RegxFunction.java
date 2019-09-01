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
 * 封装正则表达式的选择器方法类
 * @author Administrator
 *
 */
@Component
public class RegxFunction extends FreemarkerTemplateMethodModel implements Grammer{

	@Override
	public String getFunctionName() {
		return "regx";
	}


	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 2){
			if (args.get(0) != null && args.get(1) != null) {
		        String content = getStringValue(args.get(0));
		        String pattern = getStringValue(args.get(1));
		        return ExtractUtils.getFirstMatcher(content, pattern, true);
	        }
		}
		return null;
	}
	
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("regx", Collections.emptyList());
	}

}
