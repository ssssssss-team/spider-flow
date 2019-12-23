package org.spiderflow.core.executor.shape;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializeConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.context.RunnableTreeNode;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.io.HttpResponse;
import org.spiderflow.core.serializer.FastJsonSerializer;
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

	public static SerializeConfig serializeConfig;

	static {
		serializeConfig = new SerializeConfig();
		FastJsonSerializer serializer = new FastJsonSerializer();
		serializeConfig.put(Long.TYPE, serializer);
		serializeConfig.put(Long.class, serializer);
		serializeConfig.put(BigDecimal.class, serializer);
		serializeConfig.put(BigInteger.class, serializer);
	}

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
			for (Map.Entry<String, Object> item : variables.entrySet()) {
				Object value = item.getValue();
				//去除不能序列化的参数
				try {
					JSON.toJSONString(value, serializeConfig);
				} catch (Exception e) {
					continue;
				}
				//其他不输出的信息
				if("ex".equals(item.getKey()) || value instanceof RunnableTreeNode || value instanceof HttpResponse) {
					continue;
				}
				try {
					logger.debug("输出{}={}", item.getKey(), item.getValue());
				} catch (Exception e) {
					logger.error("输出{}出错，异常信息：{}", item.getKey(), e);
				}
				output.addOutput(item.getKey(), item.getValue());
			}
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

	@Override
	public String supportShape() {
		return "output";
	}

	@Override
	public boolean isThread() {
		return false;
	}
}
