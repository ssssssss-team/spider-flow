package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.freemarker.FreemarkerObject;

import freemarker.ext.util.WrapperTemplateModel;
import freemarker.template.TemplateMethodModelEx;
import freemarker.template.TemplateModelException;
import freemarker.template.TemplateScalarModel;
/**
 * 选择器模版方法模型抽象类
 * @author Administrator
 *
 */
public abstract class FreemarkerTemplateMethodModel implements TemplateMethodModelEx{
	/**
	 * 参数执行器
	 * @param arguments 泛型 参数/对象 列表
	 * @throws TemplateModelException 模版模型异常 由process(arguments)抛出
	 * @return Object 传入一个泛型对象根据对象类型返回不同结果 String类型直接返回封装后value的对象 其他类型通过构造器生成该对象封装后的选择器对象
	 */
	@Override
	public Object exec(@SuppressWarnings("rawtypes") List arguments) throws TemplateModelException{
		Object value = process(arguments);
		if(value != null && value instanceof String){
			return value;
		}
		FreeMarkerEngine.setFreemarkerObjectValue(new FreemarkerObject(value));
		return null;
	}
	/**
	 * 值对象转String
	 * @param value 预期应该是process封装后的值对象?
	 * @return String
	 */
	protected String getStringValue(Object value){
		if(value != null){
			try {
				if(value instanceof TemplateScalarModel){
					TemplateScalarModel model = (TemplateScalarModel) value;
					return model.getAsString();
				}
			} catch (Exception e) {
				return null;
			}
		}
		return null;
	}
	/**
	 * 值对象转Object
	 * @param value 预期应该是process封装后的值对象?
	 * @return Object
	 */
	protected Object getObjectValue(Object value){
		if(value != null){
			try {
				if(value instanceof WrapperTemplateModel){
					WrapperTemplateModel model = (WrapperTemplateModel) value;
					return model.getWrappedObject();
				}
			} catch (Exception e) {
				return null;
			}
		}
		return null;
	}
	/**
	 * 流程
	 * @param args 泛型参数列表 
	 * @return 参数值/对象
	 * @throws TemplateModelException
	 */
	protected abstract Object process(List<?> args) throws TemplateModelException;
	/**
	 * 获取函数方法名
	 * @return String 函数方法名
	 */
	public abstract String getFunctionName();

}
