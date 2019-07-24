package com.mxd.spider.core.model;

import java.util.List;

public class SpiderJsonProperty{

	private String shape;
	
	
	private List<SpiderNameValue> variables;
	
	private List<SpiderNameValue> outputs;

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
	
	private String url;
	
	private String method;
	
	private List<SpiderNameValue> headers;
	
	private List<SpiderNameValue> parameters;
	
	/**
	 * 代理
	 */
	private String proxy;
	
	/*爬取参数--end*/
	
	/*数据源参数--start*/
	
	private String datasourceType;
	
	private String datasourceUrl;
	
	private String datasourceUsername;
	
	private String datasourcePassword;
	
	/*数据源参数--end*/
	
	/*执行sql--start*/
	
	private String datasourceId;
	
	private String statementType;
	
	private String sql;
	
	/*执行sql--end*/
	
	
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

	@Override
	public String toString() {
		return "SpiderJsonProperty [shape=" + shape + ", variables=" + variables + ", outputs=" + outputs + ", sleep="
				+ sleep + ", condition=" + condition + ", loopCount=" + loopCount + ", loopVariableName="
				+ loopVariableName + ", url=" + url + ", method=" + method + ", headers=" + headers + ", parameters="
				+ parameters + ", proxy=" + proxy + ", datasourceType=" + datasourceType + ", datasourceUrl="
				+ datasourceUrl + ", datasourceUsername=" + datasourceUsername + ", datasourcePassword="
				+ datasourcePassword + ", datasourceId=" + datasourceId + ", statementType=" + statementType + ", sql="
				+ sql + "]";
	}
}
