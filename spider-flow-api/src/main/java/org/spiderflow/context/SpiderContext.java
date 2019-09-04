package org.spiderflow.context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.model.SpiderLog;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;
import org.spiderflow.utils.ThreadPool;

/**
 * 爬虫上下文集合
 * @author jmxd
 *
 */
public class SpiderContext extends HashMap<String, Object>{
	
	private static final Logger log = LoggerFactory.getLogger(SpiderContext.class);
	
	private String id = UUID.randomUUID().toString().replace("-", "");
	
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
	
	public String getId() {
		return id;
	}
	
	public void info(String message,Object ... variables){
		log("info",message,variables);
	}
	
	public void debug(String message,Object ... variables){
		log("debug",message,variables);
	}
	
	public void error(String message,Object ... variables){
		log("error",message,variables);
	}

	public void log(String level,String message,Object ... variables){
		if("info".equals(level)){
			log.info(message,variables);
		}else if("debug".equals(level) && log.isDebugEnabled()){
			log.debug(message,variables);
		}else if("error".equals(level)){
			log.error(message, variables);
		}
		this.log(new SpiderLog(level, message, variables));
	}
	
	public void log(SpiderLog log){
		
	}
}
