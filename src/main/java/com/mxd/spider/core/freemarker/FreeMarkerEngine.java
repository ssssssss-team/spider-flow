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
import com.mxd.spider.core.freemarker.functions.utils.*;
import com.mxd.spider.core.utils.ExtractUtils;

import freemarker.ext.beans.BeansWrapper;
import freemarker.ext.beans.BeansWrapperBuilder;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateHashModel;
import freemarker.template.TemplateModelException;

@Component
public class FreeMarkerEngine {
	
	private Configuration configuration = new Configuration(Configuration.VERSION_2_3_28);
	
	@Autowired
	private List<FreemarkerTemplateMethodModel> customMethods;
	
	private static ThreadLocal<FreemarkerObject> threadLocal = new ThreadLocal<FreemarkerObject>();
	
	@PostConstruct
	private void init() throws TemplateModelException{
		configuration.setDefaultEncoding("UTF-8");
		configuration.setClassicCompatible(true);
		if(customMethods != null){
			for (FreemarkerTemplateMethodModel method : customMethods) {
				configuration.setSharedVariable(method.getFunctionName(), method);
			}
		}
		loadStaticFunctions();
	}
	
	/**
	 * 加载静态方法
	 */
	private void loadStaticFunctions() throws TemplateModelException{
		BeansWrapperBuilder builder = new BeansWrapperBuilder(Configuration.VERSION_2_3_28);
		builder.setOuterIdentity((obj)->{
			threadLocal.set(new FreemarkerObject(obj));
			return null;
		});
		BeansWrapper beansWrapper = builder.build();
		TemplateHashModel model = beansWrapper.getStaticModels();
		configuration.setSharedVariable("string", model.get(StringFunctionUtils.class.getName()));
		configuration.setSharedVariable("date", model.get(DateFunctionUtils.class.getName()));
		configuration.setSharedVariable("random", model.get(RandomFunctionUtils.class.getName()));
		configuration.setSharedVariable("base64", model.get(Base64FunctionUtils.class.getName()));
		configuration.setSharedVariable("list", model.get(ListFunctionUtils.class.getName()));
		//Math采用jdk自带的类
		configuration.setSharedVariable("math", model.get(Math.class.getName()));
		configuration.setSharedVariable("url", model.get(UrlFunctionUtils.class.getName()));
		configuration.setSharedVariable("file", model.get(FileFunctionUtils.class.getName()));
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
