package org.spiderflow.core.freemarker;

import freemarker.template.DefaultObjectWrapper;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

@SuppressWarnings("deprecation")
public class FreemarkerObjectWrapper extends DefaultObjectWrapper{

	@Override
	public TemplateModel wrap(Object obj) throws TemplateModelException {
		if(!(obj instanceof String)){
			FreeMarkerEngine.setFreemarkerObjectValue(obj);
		}
		return super.wrap(obj);
	}

}
