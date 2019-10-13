package org.spiderflow.concurrent;

import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class SpiderFlowThreadPoolExecutor {
	
	private int maxThreads;
	
	private ThreadPoolExecutor executor;
	
	private final AtomicInteger poolNumber = new AtomicInteger(1);
	
	private static final ThreadGroup SPIDER_FLOW_THREAD_GROUP = new ThreadGroup("spider-flow-group");
	
	private static final String THREAD_POOL_NAME_PREFIX = "spider-flow-";
	
	public SpiderFlowThreadPoolExecutor(int maxThreads) {
		super();
		this.maxThreads = maxThreads;
		this.executor = new ThreadPoolExecutor(maxThreads, maxThreads, 10, TimeUnit.MILLISECONDS, new LinkedBlockingDeque<>(),new ThreadFactory() {
			
			@Override
			public Thread newThread(Runnable runnable) {
				return new Thread(SPIDER_FLOW_THREAD_GROUP, runnable, THREAD_POOL_NAME_PREFIX + poolNumber.getAndIncrement());
			}
		});
	}
	
	
	public SubThreadPoolExecutor createSubThreadPoolExecutor(int threads){
		return new SubThreadPoolExecutor(Math.min(maxThreads, threads));
	}
	
	
	public class SubThreadPoolExecutor{
		
		private int threads;
		
		private Future<?>[] futures;
		
		private AtomicInteger executing = new AtomicInteger(0);

		public SubThreadPoolExecutor(int threads) {
			super();
			this.threads = threads;
			this.futures = new Future[threads];
		}
		
		/**
		 * 等待所有线程执行完毕
		 */
		public void awaitTermination(){
			while(executing.get() > 0){
				removeDoneFuture();
			}
		}
		
		private int index(){
			for (int i = 0; i < threads; i++) {
				if(futures[i] == null || futures[i].isDone()){
					return i;
				}
			}
			return -1;
		}
		
		/**
		 * 清除已完成的任务
		 */
		private void removeDoneFuture(){
			for (int i = 0; i < threads; i++) {
				try {
					if(futures[i] != null && futures[i].get(10,TimeUnit.MILLISECONDS) == null){
						futures[i] = null;
					}
				} catch (Throwable t) {
					//忽略异常
				} 
			}
		}
		
		private void await(){
			while(index() == -1){
				removeDoneFuture();
			}
		}
		
		public void submit(Runnable runnable){
			//正在执行的线程数+1
			executing.incrementAndGet();
			Runnable task = ()->{
				try{
					//执行任务
					runnable.run();
				} finally{
					//正在执行的线程数-1
					executing.decrementAndGet();
				}
			};
			//如果没有空闲线程且在线程池中提交，则直接运行
			if(index() == -1 && Thread.currentThread().getThreadGroup() == SPIDER_FLOW_THREAD_GROUP){
				task.run();
				return;
			}
			//等待有空闲线程时在提交
			await();
			futures[index()] = executor.submit(task);
		}
	}

}
