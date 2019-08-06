package org.spiderflow.core.executor;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.executor.Executor;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 输出执行器
 * @author Administrator
 *
 */
@Component
public class OutputExecutor implements Executor{
	
	public static final String OUTPUT_NAME = "output-name";
	
	public static final String OUTPUT_VALUE = "output-value";
	
	@Autowired
	private FreeMarkerEngine engine;
	
	private static Logger logger = LoggerFactory.getLogger(OutputExecutor.class);

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderOutput output = new SpiderOutput();
		output.setNodeName(node.getNodeName());
		output.setNodeId(node.getNodeId());
		List<Map<String, String>> outputs = node.getListJsonValue(OUTPUT_NAME,OUTPUT_VALUE);
		for (Map<String, String> item : outputs) {
			Object value = null;
			String outputValue = item.get(OUTPUT_VALUE);
			String outputName = item.get(OUTPUT_NAME);
			try {
				value = engine.execute(outputValue, variables);
				if(logger.isDebugEnabled()){
					logger.debug("输出{}={}",outputName,value);
				}
				context.log(String.format("输出%s=%s", outputName,value));
			} catch (Exception e) {
				logger.error("输出{}出错，异常信息：",outputName,e);
				context.log(String.format("输出%s出错,异常信息：%s", outputName,ExceptionUtils.getStackTrace(e)));
				ExceptionUtils.wrapAndThrow(e);
			}
			output.addOutput(outputName, value);
		}
		context.addOutput(output);
	}

	@Override
	public String supportShape() {
		return "output";
	}

}
