package org.spiderflow.proxypool;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.RandomUtils;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.proxypool.model.Proxy;
import org.spiderflow.proxypool.service.ProxyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProxyPoolManager {
	
	@Autowired
	private ProxyService proxyService;

	private List<Proxy> proxys = Collections.emptyList();
	
	private static Logger logger = LoggerFactory.getLogger(ProxyPoolManager.class);
	
	@PostConstruct
	private void init(){
		//读取全部代理存到内存中
		this.proxys = new CopyOnWriteArrayList<>(proxyService.findAll());
	}
	
	public void remove(Proxy proxy){
		this.proxys.remove(proxy);
		this.proxyService.remove(proxy);
	}
	
	public boolean add(Proxy proxy){
		if(this.proxys.contains(proxy)){
			return true;
		}
		if(check(proxy) != -1){
			boolean flag = proxyService.insert(proxy);
			if(flag){
				this.proxys.add(proxy);
			}
			return flag;
		}
		return false;
	}
	
	/**
	 * 随机获取一个http代理
	 * @return
	 */
	public Proxy getHttpProxy(){
		return getHttpProxy(true);
	}
	
	/**
	 * 随机获取一个https代理
	 * @return
	 */
	public Proxy getHttpsProxy(){
		return getHttpsProxy(true);
	}
	
	/**
	 * 随机获取一个HTTP代理
	 * @return
	 */
	public Proxy getHttpProxy(boolean anonymous){
		return random(get("http", anonymous));
	}
	
	/**
	 * 随机获取一个HTTPS代理
	 * @return
	 */
	public Proxy getHttpsProxy(boolean anonymous){
		return random(get("https", anonymous));
	}
	
	private Proxy random(List<Proxy> proxys){
		int size = 0;
		if(proxys != null && (size = proxys.size()) > 0){
			return proxys.get(RandomUtils.nextInt(0, size));
		}
		return null;
	}
	
	private List<Proxy> get(String type,boolean anonymous){
		List<Proxy> nProxys = new ArrayList<>();
		if(this.proxys != null){
			for (Proxy proxy : proxys) {
				if(type.equals(proxy.getType())){
					if((anonymous && proxy.getAnonymous() == 1)||(proxy.getAnonymous() == 0 && !anonymous)){
						nProxys.add(proxy);
					}
				}
			}
		}
		return nProxys;
	}
	
	/**
	 * 检测代理
	 * @param proxy
	 * @return
	 */
	public long check(Proxy proxy){
		try {
			long st = System.currentTimeMillis();
			Jsoup.connect("https://www.baidu.com")
				.ignoreContentType(true)
				.ignoreHttpErrors(true)
				.timeout(3000)
				.proxy(proxy.getIp(), proxy.getPort())
				.execute();
			st =  System.currentTimeMillis() - st;
			logger.info("检测代理：{}:{},延迟:{}",proxy.getIp(),proxy.getPort(),st);
			return st;
		} catch (Exception e) {
			logger.info("检测代理：{}:{},超时",proxy.getIp(),proxy.getPort());
			return -1;
		}
	}
}
