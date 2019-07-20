package com.mxd.spider.core.executor;

import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.model.SpiderJsonProperty;
import com.mxd.spider.core.model.SpiderNode;
import com.mxd.spider.core.utils.DataSourceUtils;

@Component
public class DataSourceExecutor implements Executor{
	
	private static Logger logger = LoggerFactory.getLogger(DataSourceExecutor.class);

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String,Object> variables) {
		SpiderJsonProperty property = node.getJsonProperty();
		if(property != null){
			if(property.getDatasourceType() == null){
				context.log("数据库类型为空！");
				if(logger.isDebugEnabled()){
					logger.debug("数据库类型为空！");	
				}
			}else{
				String className = DataSourceUtils.getDriverClassByDataBaseType(property.getDatasourceType());
				String username = property.getDatasourceUsername();
				String password = property.getDatasourcePassword();
				String url = property.getDatasourceUrl();
				DataSource datasource = DataSourceUtils.createDataSource(className, url, username, password);
				context.addDataSource(node.getNodeId(), datasource);
				context.log(String.format("定义数据源%s成功", node.getNodeName()));
				if(logger.isDebugEnabled()){
					logger.debug("创建数据源{}成功！",node.getNodeName());
				}
			}
		}
	}

	@Override
	public String supportShape() {
		return "datasource";
	}

}
