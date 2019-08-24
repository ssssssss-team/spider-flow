package org.spiderflow.proxypool;

import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.proxypool.model.Proxy;
import org.spiderflow.proxypool.service.ProxyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ProxyPoolCleanTask {
	
	@Autowired
	private ProxyService proxyService;
	
	@Autowired
	private ProxyPoolManager proxyPoolManager;
	
	private static Logger logger = LoggerFactory.getLogger(ProxyPoolCleanTask.class);
	
	@Scheduled(initialDelay = 10000,fixedDelay = 10000)
	public void clean(){
		logger.info("开始检测代理IP有效性");
		List<Proxy> proxys = proxyService.findAll();
		ThreadPoolExecutor pool = new ThreadPoolExecutor(8, 8, 60, TimeUnit.SECONDS, new LinkedBlockingQueue<>());
		for (Proxy proxy : proxys) {
			pool.submit(()->{
				if(proxyPoolManager.check(proxy) == -1){
					proxyPoolManager.remove(proxy);
				}
			});
		}
		pool.shutdown();
		while(!pool.isTerminated()){
			try {
				pool.awaitTermination(50, TimeUnit.MILLISECONDS);
			} catch (InterruptedException e) {
			}
		}
		logger.info("检测代理IP有效性完毕");
	} 

}
