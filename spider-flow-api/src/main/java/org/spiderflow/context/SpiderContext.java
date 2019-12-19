package org.spiderflow.context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.concurrent.CountableThreadPool;
import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor.SubThreadPoolExecutor;
import org.spiderflow.model.SpiderLog;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;

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
	 * 流程执行线程(异步执行)
	 */
	private SubThreadPoolExecutor flowPool;

	/**
	 * 末端任务执行线程(同步执行)
	 */
	private CountableThreadPool taskPool;

	/**
	 * 处理流程同步锁
	 */
	private ReentrantLock lock = new ReentrantLock();

	private SpiderNode rootNode;
	
	private boolean running = true;

	private CookieContext cookieContext = new CookieContext();
	
	public List<SpiderOutput> getOutputs() {
		return outputs;
	}

	public <T> T get(String key){
		return (T) super.get(key);
	}

	public <T> T get(String key,T defaultValue){
		T value = this.get(key);
		return value == null ? defaultValue : value;
	}
	
	public boolean isRunning() {
		return running;
	}

	public void setRunning(boolean running) {
		this.running = running;
	}

	public void setOutputs(List<SpiderOutput> outputs) {
		this.outputs = outputs;
	}
	
	public void addOutput(SpiderOutput output){
		this.outputs.add(output);
	}

	public SubThreadPoolExecutor getFlowPool() {
		return flowPool;
	}

	public void setFlowPool(SubThreadPoolExecutor flowPool) {
		this.flowPool = flowPool;
	}

	public CountableThreadPool getTaskPool() {
		return taskPool;
	}

	public void setTaskPool(CountableThreadPool taskPool) {
		this.taskPool = taskPool;
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

	public void warn(String message, Object... variables) {
		log("warn", message, variables);
	}
	
	public void error(String message,Object ... variables){
		log("error",message,variables);
	}

	public void log(String level,String message,Object ... variables){
		if("info".equals(level)){
			log.info(message,variables);
		}else if("debug".equals(level) && log.isDebugEnabled()){
			log.debug(message,variables);
		}else if("warn".equals(level)){
			log.warn(message, variables);
		}else if("error".equals(level)){
			log.error(message, variables);
		}
		this.log(new SpiderLog(level, message, variables));
	}

	public CookieContext getCookieContext() {
		return cookieContext;
	}

	public void log(SpiderLog log){
		
	}

	public void lock(){
		lock.lock();
	}

	public void unlock(){
		lock.unlock();
	}
}
