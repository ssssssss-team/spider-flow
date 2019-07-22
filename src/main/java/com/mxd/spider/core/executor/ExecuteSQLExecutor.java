package com.mxd.spider.core.executor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.freemarker.FreeMarkerEngine;
import com.mxd.spider.core.model.SpiderJsonProperty;
import com.mxd.spider.core.model.SpiderNode;
import com.mxd.spider.core.utils.ExtractUtils;

@Component
public class ExecuteSQLExecutor implements Executor{
	
	private static Logger logger = LoggerFactory.getLogger(ExecuteSQLExecutor.class);
	
	@Autowired
	private FreeMarkerEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderJsonProperty property = node.getJsonProperty();
		if(property != null){
			if(StringUtils.isEmpty(property.getDatasourceId())){
				context.log("数据源ID为空！");
				if(logger.isDebugEnabled()){
					logger.debug("数据库ID为空！");	
				}
			}else if(StringUtils.isEmpty(property.getSql())){
				context.log("sql为空！");
				if(logger.isDebugEnabled()){
					logger.debug("sql为空！");	
				}
			}else{
				JdbcTemplate template = new JdbcTemplate(context.getDataSource(property.getDatasourceId()));
				//把变量替换成占位符
				String sql = property.getSql().replaceAll("#(.*?)#", "?");
				List<String> parameters = ExtractUtils.getMatchers(property.getSql(), "#(.*?)#", true);
				int size = parameters.size();
				Object[] params = new Object[size];
				for (int i = 0;i<size;i++) {
					params[i] = engine.execute(parameters.get(i), variables);
				}
				String statementType = property.getStatementType();
				context.log(String.format("执行sql：%s", sql));
				if("select".equals(statementType)){
					List<Map<String, Object>> rs = null;
					try{
						rs = template.queryForList(sql, params);
						rs = rs == null ? new ArrayList<>() : rs;
					}catch(Exception e){
						context.log(String.format("执行sql出错,异常信息:%s", ExceptionUtils.getStackTrace(e)));
						logger.error("执行sql出错,异常信息:{}",e);
					}
					variables.put("rs", rs);
				}else if("update".equals(statementType) || "insert".equals(statementType) || "delete".equals(statementType)){
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
	}

	@Override
	public String supportShape() {
		return "executeSql";
	}

}
