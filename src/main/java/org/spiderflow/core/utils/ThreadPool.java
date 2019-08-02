package org.spiderflow.core.utils;

import java.util.NoSuchElementException;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * 线程池
 * @author Administrator
 *
 */
public class ThreadPool implements Runnable{
	
	private ThreadPoolExecutor executor;
	
	private LinkedBlockingQueue<ExecutingRunnable> threadQueue;
	
	private LinkedBlockingQueue<ExecutingRunnable> executingQueue;
	
	private boolean running = true;
	
	private ThreadPool(int nThreads){
		executingQueue = new LinkedBlockingQueue<>();
		threadQueue = new LinkedBlockingQueue<>(nThreads << 3);
		//实际线程数=提交任务线程+线程数
		this.executor = new ThreadPoolExecutor(nThreads + 1, nThreads + 1, 60, TimeUnit.SECONDS,new LinkedBlockingQueue<>());
		this.executor.submit(this);
	}
	
	public static ThreadPool create(int nThreads){
		return new ThreadPool(nThreads);
	}
	
	public void submit(Runnable runnable){
		try {
			/**
			 * 提交任务时，重新建立ExecutingRunnable对象，放入到线程队列、执行队列中
			 */
			ExecutingRunnable executingRunnable = new ExecutingRunnable(runnable);
			executingQueue.put(executingRunnable);
			threadQueue.put(executingRunnable);
		} catch (InterruptedException e) {
		}
	}
	
	public void shutdown(){
		ExecutingRunnable runnable;
		try {
			/**
			 * 循环从执行队列中取正在执行的线程，当线程状态不在执行中时，则从队列中移除，直到队列为空
			 */
			while((runnable= executingQueue.peek()) != null){
				if(!runnable.isExecuting()){
					executingQueue.remove();
				}
			}
		} catch (NoSuchElementException e) {
			
		}
		running = false;
		this.executor.shutdown();
		while(!this.executor.isTerminated()){
			try {
				this.executor.awaitTermination(50, TimeUnit.MILLISECONDS);
			} catch (InterruptedException e) {
			}
		}
	}
	
	@Override
	public void run() {
		ExecutingRunnable runnable;
		try {
			/**
			 * 循环从线程队列中取要执行的任务提交到线程池中
			 * 当调用shutdown之后且执行队列为空则退出当前线程
			 */
			while(running){
				if((runnable = threadQueue.poll(100, TimeUnit.MILLISECONDS)) != null && running){
					executor.submit(runnable);
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	class ExecutingRunnable implements Runnable{
		
		private boolean executing = true;
		
		private Runnable runnable;
		
		public ExecutingRunnable(Runnable runnable) {
			super();
			this.runnable = runnable;
		}
		public boolean isExecuting() {
			return executing;
		}
		@Override
		public void run() {
			try {
				runnable.run();
			} finally{
				//当线程执行完毕时设置当前线程状态
				this.executing = false;	
			}
			
		}
		
	}
}
