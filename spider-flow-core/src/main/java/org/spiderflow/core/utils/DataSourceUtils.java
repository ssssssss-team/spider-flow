package org.spiderflow.core.utils;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.spiderflow.core.repository.DataSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.druid.pool.DruidDataSource;

/**
 * 数据库连接工具类
 * @author jmxd
 *
 */
@Component
public class DataSourceUtils {
	
	private static final Map<String,DataSource> datasources = new HashMap<>();
	
	private static DataSourceRepository dataSourceRepository;
	
	public static DataSource createDataSource(String className,String url,String username,String password){
		DruidDataSource datasource = new DruidDataSource();
		datasource.setDriverClassName(className);
		datasource.setUrl(url);
		datasource.setUsername(username);
		datasource.setPassword(password);
		datasource.setDefaultAutoCommit(true);
		datasource.setMinIdle(1);
		datasource.setInitialSize(2);
		return datasource;
	}
	
	public static void remove(String dataSourceId){
		DataSource dataSource = datasources.get(dataSourceId);
		if(dataSource != null){
			DruidDataSource ds = (DruidDataSource) dataSource;
			ds.close();
			datasources.remove(dataSourceId);
		}
	}
	
	public synchronized static DataSource getDataSource(String dataSourceId){
		DataSource dataSource = datasources.get(dataSourceId);
		if(dataSource == null){
			org.spiderflow.core.model.DataSource ds = dataSourceRepository.getOne(dataSourceId);
			if(ds != null){
				dataSource = createDataSource(ds.getDriverClassName(), ds.getJdbcUrl(), ds.getUsername(), ds.getPassword());
				datasources.put(dataSourceId, dataSource);
			}
		}
		return dataSource;
	}

	@Autowired
	public void setDataSourceRepository(DataSourceRepository dataSourceRepository) {
		DataSourceUtils.dataSourceRepository = dataSourceRepository;
	}

}
