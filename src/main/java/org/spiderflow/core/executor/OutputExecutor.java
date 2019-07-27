package org.spiderflow.core.executor;

import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.model.SpiderJsonProperty;
import org.spiderflow.core.model.SpiderNameValue;
import org.spiderflow.core.model.SpiderNode;
import org.spiderflow.core.model.SpiderOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OutputExecutor implements Executor{
	
	@Autowired
	private FreeMarkerEngine engine;
	
	private static Logger logger = LoggerFactory.getLogger(OutputExecutor.class);

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderJsonProperty property = node.getJsonProperty();
		SpiderOutput output = new SpiderOutput();
		output.setNodeName(node.getNodeName());
		output.setNodeId(node.getNodeId());
		if(property != null){
			for (SpiderNameValue nameValue : property.getOutputs()) {
				Object value = null;
				try {
					value = engine.execute(nameValue.getValue(), variables);
					if(logger.isDebugEnabled()){
						logger.debug("输出{}={}",nameValue.getName(),value);
					}
					context.log(String.format("输出%s=%s", nameValue.getName(),value));
				} catch (Exception e) {
					logger.error("输出{}出错，异常信息：",nameValue.getName(),e);
					context.log(String.format("输出%s出错,异常信息：%s", nameValue.getName(),ExceptionUtils.getStackTrace(e)));
					ExceptionUtils.wrapAndThrow(e);
				}
				output.addOutput(nameValue.getName(), value);
			}
		}
		context.addOutput(output);
	}

	@Override
	public String supportShape() {
		return "output";
	}

}
