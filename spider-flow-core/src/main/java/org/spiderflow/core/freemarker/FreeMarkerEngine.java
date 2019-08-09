package org.spiderflow.core.freemarker;

import java.io.StringReader;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.ExpressionHolder;
import org.spiderflow.core.freemarker.functions.FreemarkerTemplateMethodModel;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import freemarker.ext.beans.BeansWrapper;
import freemarker.ext.beans.BeansWrapperBuilder;
import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapperBuilder;
import freemarker.template.ObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateHashModel;
import freemarker.template.TemplateModelException;
/**
 * 选择器
 * @author jmxd
 *
 */
@Component
public class FreeMarkerEngine implements ExpressionEngine{
	
	
	private static Logger logger = LoggerFactory.getLogger(FreeMarkerEngine.class);
	
	/**
	 * 生成指定版本配置的模板模型
	 */
	private Configuration configuration = new Configuration(Configuration.VERSION_2_3_28);
	/**
	 * 选择器自定义方法列表
	 */
	@Autowired
	private List<FreemarkerTemplateMethodModel> customMethods;
	
	@Autowired
	private List<FunctionExecutor> functionExecutors;
	/**
	 * 线程内共享的选择器目标对象
	 */
	private static ThreadLocal<FreemarkerObject> threadLocal = new ThreadLocal<FreemarkerObject>();
	/**
	 * 初始化方法
	 * @throws TemplateModelException 模板模型异常 由loadStaticFunctions()方法抛出
	 */
	@PostConstruct
	private void init() throws TemplateModelException{
		configuration.setDefaultEncoding("UTF-8");
		//设置兼容性 经典兼容性
		configuration.setClassicCompatible(true);
		//如果自定义方法不为空 就将自定义方法列表中的方法循环添加到模板模型
		if(customMethods != null){
			for (FreemarkerTemplateMethodModel method : customMethods) {
				configuration.setSharedVariable(method.getFunctionName(), method);
			}
		}
		//加载静态方法
		loadStaticFunctions();
	}
	
	/**
	 * 加载静态方法
	 */
	private void loadStaticFunctions() throws TemplateModelException{
		BeansWrapperBuilder builder = new BeansWrapperBuilder(Configuration.VERSION_2_3_28);
		ObjectWrapper wrapper = new DefaultObjectWrapperBuilder(Configuration.VERSION_2_3_28).build();
		builder.setOuterIdentity((obj)->{
			if(!(obj instanceof String)){
				threadLocal.set(new FreemarkerObject(obj));
			}
			if(obj instanceof List){
				return null;
			}
			return wrapper.wrap(obj);
		});
		BeansWrapper beansWrapper = builder.build();
		TemplateHashModel model = beansWrapper.getStaticModels();
		for (FunctionExecutor executor : functionExecutors) {
			logger.info("注册方法{}:{}",executor.getFunctionPrefix(),executor.getClass().getName());
			configuration.setSharedVariable(executor.getFunctionPrefix(), model.get(executor.getClass().getName()));
		}
	}
	
	public Object execute(String expression,Map<String,Object> variables){
		ExpressionHolder.setVariables(variables);
		StringWriter out = new StringWriter();
		try {
			Template template = new Template(expression, new StringReader(expression),configuration);
			template.process(variables, out);
			FreemarkerObject object = threadLocal.get();
			String value = out.toString();
			if(object != null && object.getValue() != variables){
				return object.getValue();
			}
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
			ExpressionHolder.remove();
			threadLocal.remove();
		}
		return null;
	}
	
	public static void setFreemarkerObjectValue(FreemarkerObject object){
		threadLocal.set(object);
	}
}
