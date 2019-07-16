package com.mxd.spider.core.freemarker.functions;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.utils.ExtractUtils;

import freemarker.template.TemplateModelException;

@Component
public class XPathFunction extends FreemarkerTemplateMethodModel{

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 2){
			if (args.get(0) != null && args.get(1) != null) {
		        String content = getStringValue(args.get(0));
		        String xpath = getStringValue(args.get(1));
		        Document document = Jsoup.parse(content);
		        return ExtractUtils.getValueByXPath(document, xpath);
	        }
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "xpath";
	}

}
