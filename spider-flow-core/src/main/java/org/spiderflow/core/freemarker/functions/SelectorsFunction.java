package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.spiderflow.core.utils.ExtractUtils;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;

/**
 * 封装多个选择器(Selector)的选择器(Freemarker)方法类
 * @author Administrator
 *
 */
@Component
public class SelectorsFunction extends FreemarkerTemplateMethodModel{

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
				return ExtractUtils.getHTMLBySelector(element, selector);
			}
			String type = getStringValue(args.get(2));
			if("text".equals(type)){
				return ExtractUtils.getTextBySelector(element, selector);
			}
			if("attr".equals(type) && args.size() == 4){
				return ExtractUtils.getAttrBySelector(element, selector,getStringValue(args.get(3)));
			}
			if("outerhtml".equals(type)){
				return ExtractUtils.getOuterHTMLBySelector(element, selector);
			}
			if("element".equals(type)){
				return ExtractUtils.getElements(element, selector);
			}
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "selectors";
	}

}
