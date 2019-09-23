package org.spiderflow.mongodb.model;

public class MongoDto {
	
	/**
	 * 用户名
	 */
	private static String userName;
	
	/**
	 * 密码
	 */
	private static String pwd;
	
	/**
	 * 主机地址
	 */
	private static String[] host;
	
	/**
	 * 端口地址
	 */
	private static int[] port;
	
	/**
	 * 数据库名
	 */
	private static String dbName;
	
	/**
	 * 每台主机最大连接数
	 */
	private static int connectionsPerHost = 20;
	
	/**
	 * 线程队列数
	 */
	private static int threadsAllowedToBlockForConnectionMultiplier = 10;
	
	/**
	 * 是否需要身份验证
	 */
	private static boolean authentication = false;
	
	public static String getUserName() {
		return userName;
	}
	public static void setUserName(String userName) {
		MongoDto.userName = userName;
	}
	public static String getPwd() {
		return pwd;
	}
	public static void setPwd(String pwd) {
		MongoDto.pwd = pwd;
	}
	public static String[] getHost() {
		return host;
	}
	public static void setHost(String[] host) {
		MongoDto.host = host;
	}
	public static int[] getPort() {
		return port;
	}
	public static void setPort(int[] port) {
		MongoDto.port = port;
	}
	public static String getDbName() {
		return dbName;
	}
	public static void setDbName(String dbName) {
		MongoDto.dbName = dbName;
	}
	public static int getConnectionsPerHost() {
		return connectionsPerHost;
	}
	public static void setConnectionsPerHost(int connectionsPerHost) {
		MongoDto.connectionsPerHost = connectionsPerHost;
	}
	public static int getThreadsAllowedToBlockForConnectionMultiplier() {
		return threadsAllowedToBlockForConnectionMultiplier;
	}
	public static void setThreadsAllowedToBlockForConnectionMultiplier(
			int threadsAllowedToBlockForConnectionMultiplier) {
		MongoDto.threadsAllowedToBlockForConnectionMultiplier = threadsAllowedToBlockForConnectionMultiplier;
	}
	public static boolean isAuthentication() {
		return authentication;
	}
	public static void setAuthentication(boolean authentication) {
		MongoDto.authentication = authentication;
	}
}
