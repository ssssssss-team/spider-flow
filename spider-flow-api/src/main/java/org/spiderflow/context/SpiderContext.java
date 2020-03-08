package org.spiderflow.context;

import org.spiderflow.concurrent.SpiderFlowThreadPoolExecutor.SubThreadPoolExecutor;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.model.SpiderOutput;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 爬虫上下文集合
 * @author jmxd
 *
 */
public class SpiderContext extends HashMap<String, Object>{
	
	private String id = UUID.randomUUID().toString().replace("-", "");
	
	private static final long serialVersionUID = 8379177178417619790L;
	/**
	 * 爬虫输出参数列表
	 */
	private List<SpiderOutput> outputs = new ArrayList<>();

	/**
	 * 流程执行线程
	 */
	private SubThreadPoolExecutor threadPool;

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

	public void addOutput(SpiderOutput output){
		synchronized (this.outputs){
			this.outputs.add(output);
		}
	}

	public SubThreadPoolExecutor getThreadPool() {
		return threadPool;
	}

	public void setThreadPool(SubThreadPoolExecutor threadPool) {
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
	
	public CookieContext getCookieContext() {
		return cookieContext;
	}

	public void lock(){
		lock.lock();
	}

	public void unlock(){
		lock.unlock();
	}

}
