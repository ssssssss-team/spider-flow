package org.spiderflow.core.executor.shape;

import java.util.List;
import java.util.Map;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.executor.ShapeExecutor;
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
public class OutputExecutor implements ShapeExecutor{
	
	public static final String OUTPUT_NAME = "output-name";
	
	public static final String OUTPUT_VALUE = "output-value";
	
	@Autowired
	private FreeMarkerEngine engine;

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
				context.debug("输出{}={}", outputName,value);
			} catch (Exception e) {
				context.debug("输出{}出错，异常信息：", outputName,e);
			}
			output.addOutput(outputName, value);
		}
		context.addOutput(output);
	}

	@Override
	public String supportShape() {
		return "output";
	}

	@Override
	public boolean isThread() {
		return false;
	}
}
