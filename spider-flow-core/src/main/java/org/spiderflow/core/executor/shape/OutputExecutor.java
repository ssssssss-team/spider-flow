package org.spiderflow.core.executor.shape;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.context.RunnableTreeNode;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.serializer.FastJsonSerializer;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.io.SpiderResponse;
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

	public static final String OUTPUT_ALL = "output-all";
	
	public static final String OUTPUT_NAME = "output-name";
	
	public static final String OUTPUT_VALUE = "output-value";

	private static Logger logger = LoggerFactory.getLogger(OutputExecutor.class);
	
	@Autowired
	private ExpressionEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderOutput output = new SpiderOutput();
		output.setNodeName(node.getNodeName());
		output.setNodeId(node.getNodeId());
		boolean outputAll = !"0".equals(node.getStringJsonValue(OUTPUT_ALL));
		if (outputAll) {
			outputAll(output, variables);
		}
		List<Map<String, String>> outputs = node.getListJsonValue(OUTPUT_NAME, OUTPUT_VALUE);
		for (Map<String, String> item : outputs) {
			Object value = null;
			String outputValue = item.get(OUTPUT_VALUE);
			String outputName = item.get(OUTPUT_NAME);
			try {
				value = engine.execute(outputValue, variables);
				logger.debug("输出{}={}", outputName,value);
			} catch (Exception e) {
				logger.error("输出{}出错，异常信息：{}", outputName,e);
			}
			output.addOutput(outputName, value);
		}
		context.addOutput(output);
	}

	/**
	 * 输出所有参数
	 * @param output
	 * @param variables
	 */
	private void outputAll(SpiderOutput output,Map<String,Object> variables){
		for (Map.Entry<String, Object> item : variables.entrySet()) {
			Object value = item.getValue();
			if (value instanceof SpiderResponse) {
				SpiderResponse resp = (SpiderResponse) value;
				output.addOutput("resp.html", resp.getHtml());
				continue;
			}
			//去除不输出的信息
			if ("ex".equals(item.getKey()) || value instanceof RunnableTreeNode) {
				continue;
			}
			//去除不能序列化的参数
			try {
				JSON.toJSONString(value, FastJsonSerializer.serializeConfig);
			} catch (Exception e) {
				continue;
			}
			//输出信息
			output.addOutput(item.getKey(), item.getValue());
		}
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
