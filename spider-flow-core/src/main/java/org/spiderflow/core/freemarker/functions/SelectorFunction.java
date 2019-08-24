package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.spiderflow.core.utils.ExtractUtils;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;

/**
 * 封装选择器(Selector)的选择器(Freemarker)方法类
 * @author Administrator
 *
 */
@Component
public class SelectorFunction extends FreemarkerTemplateMethodModel{

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if(args != null && args.size() > 1){
			String selector = getStringValue(args.get(1));
			Element element = null;
			if(canGetStringValue(args.get(0))){
				element = Jsoup.parse(getStringValue(args.get(0)));
			}else{
				element = (Element) getObjectValue(args.get(0));
			}
			if(args.size() == 2){
				return ExtractUtils.getFirstHTMLBySelector(element, selector);
			}
			String type = getStringValue(args.get(2));
			if("text".equals(type)){
				return ExtractUtils.getFirstTextBySelector(element, selector);
			}
			if("attr".equals(type) && args.size() == 4){
				return ExtractUtils.getFirstAttrBySelector(element, selector,getStringValue(args.get(3)));
			}
			if("outerhtml".equals(type)){
				return ExtractUtils.getFirstOuterHTMLBySelector(element, selector);
			}
			if("element".equals(type)){
				return ExtractUtils.getFirstElement(element, selector);
			}
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "selector";
	}

}
