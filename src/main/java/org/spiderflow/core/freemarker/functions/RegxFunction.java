package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.spiderflow.core.utils.ExtractUtils;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;

@Component
public class RegxFunction extends FreemarkerTemplateMethodModel{

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
		        System.out.println(content);
		        return ExtractUtils.getFirstMatcher(content, pattern, true);
	        }
		}
		return null;
	}

}
