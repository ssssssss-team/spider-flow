package org.spiderflow.core.executor;

import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.model.SpiderNode;
import org.spiderflow.core.utils.DataSourceUtils;
import org.springframework.stereotype.Component;
/**
 * 数据源执行器
 * @author jmxd
 *
 */
@Component
public class DataSourceExecutor implements Executor{
	
	public static final String DATASOURCE_TYPE = "datasourceType";
	
	public static final String DATASOURCE_URL = "datasourceUrl";
	
	public static final String DATASOURCE_USERNAME = "datasourceUsername";
	
	public static final String DATASOURCE_PASSWORD = "datasourcePassword";
	
	private static Logger logger = LoggerFactory.getLogger(DataSourceExecutor.class);

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		if(node.getStringJsonValue(DATASOURCE_TYPE) == null){
			context.log("数据库类型为空！");
			if(logger.isDebugEnabled()){
				logger.debug("数据库类型为空！");
			}
		}else{
			String className = DataSourceUtils.getDriverClassByDataBaseType(node.getStringJsonValue(DATASOURCE_TYPE));
			String username = node.getStringJsonValue(DATASOURCE_USERNAME);
			String password = node.getStringJsonValue(DATASOURCE_PASSWORD);
			String url = node.getStringJsonValue(DATASOURCE_URL);
			DataSource datasource = DataSourceUtils.createDataSource(className, url, username, password);
			context.addDataSource(node.getNodeId(), datasource);
			context.log(String.format("定义数据源%s成功", node.getNodeName()));
			if(logger.isDebugEnabled()){
				logger.debug("创建数据源{}成功！",node.getNodeName());
			}
		}
	}

	@Override
	public String supportShape() {
		return "datasource";
	}

}
