package org.spiderflow.core.freemarker;

import java.io.StringReader;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.spiderflow.core.freemarker.functions.FreemarkerTemplateMethodModel;
import org.spiderflow.core.freemarker.functions.utils.Base64FunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.DateFunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.FileFunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.JsonFunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.ListFunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.RandomFunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.StringFunctionUtils;
import org.spiderflow.core.freemarker.functions.utils.UrlFunctionUtils;
import org.spiderflow.core.utils.ExtractUtils;
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
public class FreeMarkerEngine {
	/**
	 * 生成指定版本配置的模板模型
	 */
	private Configuration configuration = new Configuration(Configuration.VERSION_2_3_28);
	/**
	 * 选择器自定义方法列表
	 */
	@Autowired
	private List<FreemarkerTemplateMethodModel> customMethods;
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
			threadLocal.set(new FreemarkerObject(obj));
			return wrapper.wrap(obj);
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
		configuration.setSharedVariable("json", model.get(JsonFunctionUtils.class.getName()));
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
