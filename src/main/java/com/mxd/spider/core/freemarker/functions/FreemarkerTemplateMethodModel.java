package com.mxd.spider.core.freemarker.functions;

import java.util.List;

import com.mxd.spider.core.freemarker.FreeMarkerEngine;
import com.mxd.spider.core.freemarker.FreemarkerObject;

import freemarker.ext.util.WrapperTemplateModel;
import freemarker.template.TemplateMethodModelEx;
import freemarker.template.TemplateModelException;
import freemarker.template.TemplateScalarModel;

public abstract class FreemarkerTemplateMethodModel implements TemplateMethodModelEx{
	
	@Override
	public Object exec(@SuppressWarnings("rawtypes") List arguments) throws TemplateModelException{
		Object value = process(arguments);
		if(value != null){
			if(value instanceof String){
				return value;
			}else{
				FreeMarkerEngine.setFreemarkerObjectValue(new FreemarkerObject(value));
			}
		}
		return null;
	}
	
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
	
	protected abstract Object process(List<?> args) throws TemplateModelException;
	
	public abstract String getFunctionName();

}
