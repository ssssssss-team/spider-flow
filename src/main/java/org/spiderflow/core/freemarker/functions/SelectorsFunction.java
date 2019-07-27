package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.spiderflow.core.utils.ExtractUtils;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;

@Component
public class SelectorsFunction extends FreemarkerTemplateMethodModel{

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if(args != null && args.size() > 1){
			String content = getStringValue(args.get(0));
			String selector = getStringValue(args.get(1));
			Document document = Jsoup.parse(content);
			if(args.size() == 2){
				return ExtractUtils.getHTMLBySelector(document, selector);
			}
			String type = getStringValue(args.get(2));
			if("text".equals(type)){
				return ExtractUtils.getTextBySelector(document, selector);
			}
			if("attr".equals(type) && args.size() == 4){
				return ExtractUtils.getAttrBySelector(document, selector,getStringValue(args.get(3)));
			}
			if("outerhtml".equals(type)){
				return ExtractUtils.getOuterHTMLBySelector(document, selector);
			}
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "selectors";
	}

}
