package org.spiderflow.model;

import java.util.List;
/**
 * 节点的Json属性
 * @author jmxd
 *
 */
public class SpiderJsonProperty{
	/**
	 * 形状
	 */
	private String shape;
	
	/**
	 * 入参列表
	 */
	private List<SpiderNameValue> variables;
	/**
	 * 输出列表
	 */
	private List<SpiderNameValue> outputs;
	/**
	 * 间歇时间
	 */
	private String sleep;
	
	/**
	 * 条件判断表达式
	 */
	private String condition;

	/**
	 * 循环次数
	 */
	private String loopCount;
	
	/**
	 * 循环变量
	 */
	private String loopVariableName;
	
	/*爬取参数--start*/
	/**
	 * 需要爬取的目标地址
	 */
	private String url;
	/**
	 * 爬取所采用的方法
	 */
	private String method;
	/**
	 * 头文件列表
	 */
	private List<SpiderNameValue> headers;
	/**
	 * 参数设置列表
	 */
	private List<SpiderNameValue> parameters;
	
	/**
	 * 代理
	 */
	private String proxy;
	
	/*爬取参数--end*/
	
	/*数据源参数--start*/
	/**
	 * 数据库类型
	 */
	private String datasourceType;
	/**
	 * 数据库地址
	 */
	private String datasourceUrl;
	/**
	 * 数据库名称
	 */
	private String datasourceUsername;
	/**
	 * 数据库密码
	 */
	private String datasourcePassword;
	
	/*数据源参数--end*/
	
	/*执行sql--start*/
	/**
	 * 数据库ID
	 */
	private String datasourceId;
	/**
	 * 语句类型 DML
	 */
	private String statementType;
	/**
	 * 具体的sql语句
	 */
	private String sql;
	
	/*执行sql--end*/
	/**
	 * sql执行后的回调方法?
	 */
	private String function;
	
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public String getShape() {
		return shape;
	}

	public void setShape(String shape) {
		this.shape = shape;
	}

	public List<SpiderNameValue> getVariables() {
		return variables;
	}

	public void setVariables(List<SpiderNameValue> variables) {
		this.variables = variables;
	}
	
	public List<SpiderNameValue> getHeaders() {
		return headers;
	}
	
	public void setHeaders(List<SpiderNameValue> headers) {
		this.headers = headers;
	}

	public List<SpiderNameValue> getParameters() {
		return parameters;
	}

	public void setParameters(List<SpiderNameValue> parameters) {
		this.parameters = parameters;
	}
	
	public List<SpiderNameValue> getOutputs() {
		return outputs;
	}

	public void setOutputs(List<SpiderNameValue> outputs) {
		this.outputs = outputs;
	}
	
	public String getDatasourceType() {
		return datasourceType;
	}

	public void setDatasourceType(String datasourceType) {
		this.datasourceType = datasourceType;
	}

	public String getDatasourceUsername() {
		return datasourceUsername;
	}

	public void setDatasourceUsername(String datasourceUsername) {
		this.datasourceUsername = datasourceUsername;
	}

	public String getDatasourcePassword() {
		return datasourcePassword;
	}

	public void setDatasourcePassword(String datasourcePassword) {
		this.datasourcePassword = datasourcePassword;
	}
	
	public String getDatasourceUrl() {
		return datasourceUrl;
	}

	public void setDatasourceUrl(String datasourceUrl) {
		this.datasourceUrl = datasourceUrl;
	}
	
	public String getDatasourceId() {
		return datasourceId;
	}

	public void setDatasourceId(String datasourceId) {
		this.datasourceId = datasourceId;
	}

	public String getStatementType() {
		return statementType;
	}

	public void setStatementType(String statementType) {
		this.statementType = statementType;
	}

	public String getSql() {
		return sql;
	}

	public void setSql(String sql) {
		this.sql = sql;
	}

	public String getLoopCount() {
		return loopCount;
	}

	public void setLoopCount(String loopCount) {
		this.loopCount = loopCount;
	}
	
	public String getLoopVariableName() {
		return loopVariableName;
	}

	public void setLoopVariableName(String loopVariableName) {
		this.loopVariableName = loopVariableName;
	}
	
	public String getProxy() {
		return proxy;
	}

	public void setProxy(String proxy) {
		this.proxy = proxy;
	}
	
	public String getSleep() {
		return sleep;
	}

	public void setSleep(String sleep) {
		this.sleep = sleep;
	}

	public String getFunction() {
		return function;
	}

	public void setFunction(String function) {
		this.function = function;
	}

}
