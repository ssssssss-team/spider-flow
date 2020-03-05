package org.spiderflow.core.executor.shape;

import java.io.IOException;
import java.util.*;

import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.context.RunnableTreeNode;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.executor.function.FileFunctionExecutor;
import org.spiderflow.core.serializer.FastJsonSerializer;
import org.spiderflow.core.utils.DataSourceUtils;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.io.SpiderResponse;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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

	public static final String DATASOURCE_ID = "datasourceId";

	public static final String OUTPUT_DATABASE = "output-database";

	public static final String OUTPUT_CSV = "output-csv";

	public static final String TABLE_NAME = "tableName";

	public static final String CSV_NAME = "csvName";

	private static Logger logger = LoggerFactory.getLogger(OutputExecutor.class);
	
	@Autowired
	private ExpressionEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderOutput output = new SpiderOutput();
		output.setNodeName(node.getNodeName());
		output.setNodeId(node.getNodeId());
		boolean outputAll = "1".equals(node.getStringJsonValue(OUTPUT_ALL));
		boolean databaseFlag = "1".equals(node.getStringJsonValue(OUTPUT_DATABASE));
		boolean csvFlag = "1".equals(node.getStringJsonValue(OUTPUT_CSV));
		if (outputAll) {
			outputAll(output, variables);
		}
		List<Map<String, String>> outputs = node.getListJsonValue(OUTPUT_NAME, OUTPUT_VALUE);
		Map<String, Object> outputData = null;
		if (databaseFlag || csvFlag) {
			outputData = new HashMap<>(outputs.size());
		}
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
			if ((databaseFlag || csvFlag) && value != null) {
				outputData.put(outputName, value.toString());
			}
		}
		if(databaseFlag){
			String dsId = node.getStringJsonValue(DATASOURCE_ID);
			String tableName = node.getStringJsonValue(TABLE_NAME);
			outputDB(dsId, tableName, outputData);
		}
		if (csvFlag) {
			String csvName = node.getStringJsonValue(CSV_NAME);
			outputCSV(csvName, outputData);
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
				output.addOutput(item.getKey() + ".html", resp.getHtml());
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

	private void outputDB(String databaseId, String tableName, Map<String, Object> data) {
		if (data == null || data.isEmpty()) {
			return;
		}
		JdbcTemplate template = new JdbcTemplate(DataSourceUtils.getDataSource(databaseId));
		Set<String> keySet = data.keySet();
		Object[] params = new Object[data.size()];
		SQL sql = new SQL();
		//设置表名
		sql.INSERT_INTO(tableName);
		int index = 0;
		//设置字段名
		for (String key : keySet) {
			sql.VALUES(key, "?");
			params[index] = data.get(key);
			index++;
		}
		try {
			//执行sql
			int update = template.update(sql.toString(), params);
		} catch (Exception e) {
			logger.error("执行sql出错,异常信息:{}", e.getMessage(), e);
			ExceptionUtils.wrapAndThrow(e);
		}
	}

	private void outputCSV(String csvName, Map<String, Object> data) {
		if (data == null || data.isEmpty()) {
			return;
		}
		Set<Map.Entry<String, Object>> entries = data.entrySet();
		StringBuffer sb = new StringBuffer();
		int i = 1 ;
		for (Map.Entry<String,Object> item : entries) {
			if (item.getValue() != null) {
				sb.append(item.getValue().toString());
			}
			if (i < data.size()) {
				sb.append(",");
			}
			i++;
		}
		sb.append("\r\n");
		System.out.println(sb.toString());
		try {
			FileFunctionExecutor.write(csvName, sb.toString().getBytes(),true);
		} catch (IOException e) {
			logger.error("文件输出错误,异常信息:{}", e.getMessage(), e);
			ExceptionUtils.wrapAndThrow(e);
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
