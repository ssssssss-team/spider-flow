package com.mxd.spider.core.freemarker;

import java.io.StringReader;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.freemarker.functions.FreemarkerTemplateMethodModel;
import com.mxd.spider.core.utils.ExtractUtils;

import freemarker.template.Configuration;
import freemarker.template.Template;

@Component
public class FreeMarkerEngine {
	
	private Configuration configuration = new Configuration(Configuration.VERSION_2_3_28);
	
	@Autowired
	private List<FreemarkerTemplateMethodModel> customMethods;
	
	private static ThreadLocal<FreemarkerObject> threadLocal = new ThreadLocal<FreemarkerObject>();
	
	@PostConstruct
	private void init(){
		configuration.setDefaultEncoding("UTF-8");
		configuration.setClassicCompatible(true);
		if(customMethods != null){
			for (FreemarkerTemplateMethodModel method : customMethods) {
				configuration.setSharedVariable(method.getFunctionName(), method);
			}
		}
	}
	
	public Object execute(String expression,Map<String,Object> variables){
		StringWriter out = new StringWriter();
		try {
			Template template = new Template(expression, new StringReader(expression),configuration);
			template.process(variables, out);
			FreemarkerObject object = threadLocal.get();
			if(object != null){
				return object.getValue();
			}
			String value = out.toString();
			if(ExtractUtils.isNumber(value)){
				BigDecimal decimal = new BigDecimal(value);
				if(value.contains(".")){
					return decimal.doubleValue();
				}else{
					return decimal.longValue();
				}
			}
			return value;
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			threadLocal.remove();
		}
		return null;
	}
	
	public static void setFreemarkerObjectValue(FreemarkerObject object){
		threadLocal.set(object);
	}
}
