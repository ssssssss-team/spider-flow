package org.spiderflow.core.freemarker.functions;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.spiderflow.Grammer;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.utils.Maps;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateModelException;

/**
 * 封装多个路径表达式(XML路径语言)的选择器方法类
 * @author Administrator
 *
 */
@Component
public class XPathsFunction extends FreemarkerTemplateMethodModel implements Grammer{

	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 2){
			if (args.get(0) != null && args.get(1) != null) {
		        String content = getStringValue(args.get(0));
		        String xpath = getStringValue(args.get(1));
		        Document document = Jsoup.parse(content);
		        return ExtractUtils.getValuesByXPath(document, xpath);
	        }
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "xpaths";
	}
	
	@Override
	public Map<String, List<String>> getFunctionMap() {
		return Maps.newMap("xpaths", Collections.emptyList());
	}

}
