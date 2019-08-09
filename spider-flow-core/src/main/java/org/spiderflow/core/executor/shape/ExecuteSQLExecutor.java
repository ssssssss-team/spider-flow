package org.spiderflow.core.executor.shape;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.freemarker.FreeMarkerEngine;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * SQL执行器
 * @author jmxd
 *
 */
@Component
public class ExecuteSQLExecutor implements ShapeExecutor{
	
	public static final String DATASOURCE_ID = "datasourceId";
	
	public static final String SQL = "sql";
	
	public static final String STATEMENT_TYPE = "statementType";
	
	public static final String STATEMENT_SELECT = "select";
	
	public static final String STATEMENT_INSERT = "insert";
	
	public static final String STATEMENT_UPDATE = "update";
	
	public static final String STATEMENT_DELETE = "delete";
	
	private static Logger logger = LoggerFactory.getLogger(ExecuteSQLExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		if(StringUtils.isNotBlank(node.getStringJsonValue(DATASOURCE_ID))){
			context.log("数据源ID为空！");
			if(logger.isDebugEnabled()){
				logger.debug("数据库ID为空！");	
			}
		}else if(StringUtils.isNotBlank(node.getStringJsonValue(SQL))){
			context.log("sql为空！");
			if(logger.isDebugEnabled()){
				logger.debug("sql为空！");	
			}
		}else{
			JdbcTemplate template = new JdbcTemplate(context.getDataSource(node.getStringJsonValue(DATASOURCE_ID)));
			//把变量替换成占位符
			String sql = node.getStringJsonValue(SQL);
			List<String> parameters = ExtractUtils.getMatchers(sql, "#(.*?)#", true);
			sql = sql.replaceAll("#(.*?)#", "?");
			int size = parameters.size();
			Object[] params = new Object[size];
			for (int i = 0;i<size;i++) {
				params[i] = engine.execute(parameters.get(i), variables);
			}
			String statementType = node.getStringJsonValue(STATEMENT_TYPE);
			context.log(String.format("执行sql：%s", sql));
			if(STATEMENT_SELECT.equals(statementType)){
				List<Map<String, Object>> rs = null;
				try{
					rs = template.queryForList(sql, params);
					rs = rs == null ? new ArrayList<>() : rs;
				}catch(Exception e){
					context.log(String.format("执行sql出错,异常信息:%s", ExceptionUtils.getStackTrace(e)));
					logger.error("执行sql出错,异常信息:{}",e);
				}
				variables.put("rs", rs);
			}else if(STATEMENT_UPDATE.equals(statementType) || STATEMENT_INSERT.equals(statementType) || STATEMENT_DELETE.equals(statementType)){
				int rs = -1;
				try{
					rs = template.update(sql, params);	
				}catch(Exception e){
					context.log(String.format("执行sql出错,异常信息:%s", ExceptionUtils.getStackTrace(e)));
					logger.error("执行sql出错,异常信息:{}",e);
				}
				variables.put("rs", rs);
			}
		}
	}

	@Override
	public String supportShape() {
		return "executeSql";
	}

}
