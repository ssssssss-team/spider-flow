package com.mxd.spider.core.freemarker.functions;

import java.util.List;

import org.springframework.stereotype.Component;

import com.mxd.spider.core.utils.ExtractUtils;

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
		        return ExtractUtils.getFirstMatcher(content, pattern, true);
	        }
		}
		return null;
	}

}
