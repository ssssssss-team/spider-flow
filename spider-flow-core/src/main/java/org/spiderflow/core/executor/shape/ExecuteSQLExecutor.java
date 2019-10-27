package org.spiderflow.core.executor.shape;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.Grammerable;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.utils.DataSourceUtils;
import org.spiderflow.core.utils.ExtractUtils;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Grammer;
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
public class ExecuteSQLExecutor implements ShapeExecutor,Grammerable{
	
	public static final String DATASOURCE_ID = "datasourceId";
	
	public static final String SQL = "sql";
	
	public static final String STATEMENT_TYPE = "statementType";
	
	public static final String STATEMENT_SELECT = "select";
	
	public static final String STATEMENT_INSERT = "insert";
	
	public static final String STATEMENT_UPDATE = "update";
	
	public static final String STATEMENT_DELETE = "delete";
	
	@Autowired
	private ExpressionEngine engine;

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		String dsId = node.getStringJsonValue(DATASOURCE_ID);
		String sql = node.getStringJsonValue(SQL);
		if(!StringUtils.isNotBlank(dsId)){
			context.debug("数据源ID为空！");
		}else if(!StringUtils.isNotBlank(sql)){
			context.debug("sql为空！");
		}else{
			JdbcTemplate template = new JdbcTemplate(DataSourceUtils.getDataSource(dsId));
			//把变量替换成占位符
			List<String> parameters = ExtractUtils.getMatchers(sql, "#(.*?)#", true);
			sql = sql.replaceAll("#(.*?)#", "?");
			int size = parameters.size();
			Object[] params = new Object[size];
			boolean hasList = false;
			int parameterSize = 0;
			//当参数中存在List或者数组时，认为是批量操作
			for (int i = 0;i<size;i++) {
				Object parameter = engine.execute(parameters.get(i), variables);
				if(parameter != null){
					if(parameter instanceof List){
						hasList = true;
						parameterSize = Math.max(parameterSize, ((List<?>)parameter).size());
					}else if((parameter!= null && parameter.getClass().isArray())){
						hasList = true;
						parameterSize = Math.max(parameterSize, Array.getLength(parameter));
					}
				}
				
				params[i] = parameter;
			}
			String statementType = node.getStringJsonValue(STATEMENT_TYPE);
			context.debug("执行sql：{}",sql);
			if(STATEMENT_SELECT.equals(statementType)){
				List<Map<String, Object>> rs = null;
				try{
					rs = template.queryForList(sql, params);
					rs = rs == null ? new ArrayList<>() : rs;
					variables.put("rs", rs);
				}catch(Exception e){
					context.error("执行sql出错,异常信息:{}",e);
					ExceptionUtils.wrapAndThrow(e);
				}
			}else if(STATEMENT_UPDATE.equals(statementType) || STATEMENT_INSERT.equals(statementType) || STATEMENT_DELETE.equals(statementType)){
				try{
					int updateCount = 0;
					if(hasList){
						/**
						 * 批量操作时，将参数Object[]转化为List<Object[]>
						 * 当参数不为数组或List时，自动转为Object[]
						 * 当数组或List长度不足时，自动取最后一项补齐
						 */
						int[] rs = template.batchUpdate(sql, convertParameters(params,parameterSize));
						if(rs != null){
							updateCount = Arrays.stream(rs).sum();
						}
					}else{
						updateCount = template.update(sql, params);
					}
					variables.put("rs", updateCount);
				}catch(Exception e){
					context.error("执行sql出错,异常信息:{}",e);
					variables.put("rs", -1);
					ExceptionUtils.wrapAndThrow(e);
				}
			}
		}
	}
	
	private List<Object[]> convertParameters(Object[] params,int length){
		List<Object[]> result = new ArrayList<>(length);
		int size = params.length;
		for (int i = 0; i < length; i++) {
			Object[] parameters = new Object[size];
			for (int j = 0; j < size; j++) {
				parameters[j] = getValue(params[j], i);
			}
			result.add(parameters);
		}
		return result;
	}
	
	private Object getValue(Object object,int index){
		if(object == null){
			return null;
		}else if(object instanceof List){
			List<?> list = (List<?>) object;
			int size = list.size();
			if(size > 0){
				return list.get(Math.min(list.size() - 1, index));
			}
		}else if(object.getClass().isArray()){
			int size = Array.getLength(object);
			if(size > 0){
				Array.get(object, Math.min( - 1, index));
			}
		}else{
			return object;
		}
		return null;
	}

	@Override
	public String supportShape() {
		return "executeSql";
	}

	@Override
	public List<Grammer> grammers() {
		Grammer grammer = new Grammer();
		grammer.setComment("执行SQL结果");
		grammer.setFunction("rs");
		grammer.setReturns(Arrays.asList("List<Map<String,Object>>","int"));
		return Arrays.asList(grammer);
	}

	
}
