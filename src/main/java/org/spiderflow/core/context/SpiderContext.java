package org.spiderflow.core.context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.spiderflow.core.model.SpiderNode;
import org.spiderflow.core.model.SpiderOutput;
import org.spiderflow.core.utils.ThreadPool;
/**
 * 爬虫上下文集合
 * @author jmxd
 *
 */
public class SpiderContext extends HashMap<String, Object>{
	
	private static final long serialVersionUID = 8379177178417619790L;
	/**
	 * 爬虫输出参数列表
	 */
	private List<SpiderOutput> outputs = new ArrayList<>();
	/**
	 * 数据源集合
	 */
	private Map<String,DataSource> datasources = new HashMap<>();
	
	private ThreadPool threadPool;
	
	private SpiderNode rootNode;
	
	public List<SpiderOutput> getOutputs() {
		return outputs;
	}
	
	public void addDataSource(String id,DataSource datasource){
		this.datasources.put(id, datasource);
	}
	
	public DataSource getDataSource(String id){
		return this.datasources.get(id);
	}

	public void setOutputs(List<SpiderOutput> outputs) {
		this.outputs = outputs;
	}
	
	public void addOutput(SpiderOutput output){
		this.outputs.add(output);
	}
	
	
	public ThreadPool getThreadPool() {
		return threadPool;
	}

	public void setThreadPool(ThreadPool threadPool) {
		this.threadPool = threadPool;
	}
	
	public SpiderNode getRootNode() {
		return rootNode;
	}

	public void setRootNode(SpiderNode rootNode) {
		this.rootNode = rootNode;
	}

	public void log(String message){
		
	}
}
