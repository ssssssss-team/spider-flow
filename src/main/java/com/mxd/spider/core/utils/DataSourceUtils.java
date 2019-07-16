package com.mxd.spider.core.utils;

import javax.sql.DataSource;

import com.alibaba.druid.pool.DruidDataSource;

public class DataSourceUtils {
	
	public static String getDriverClassByDataBaseType(String databaseType){
		if("mysql".equalsIgnoreCase(databaseType)){
			return "com.mysql.jdbc.Driver";
		}else if("oracle".equalsIgnoreCase(databaseType)){
			return "oracle.jdbc.driver.OracleDriver";
		}
		return null;
	}
	
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

}
