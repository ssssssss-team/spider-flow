package org.spiderflow.proxypool.service;

import java.util.List;

import org.spiderflow.proxypool.model.Proxy;
import org.spiderflow.proxypool.repository.ProxyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProxyService {
	
	@Autowired
	private ProxyRepository proxyRepository;

	public boolean insert(Proxy proxy){
		try {
			proxyRepository.save(proxy);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public void remove(Proxy proxy){
		proxyRepository.deleteById(proxy.getId());
	}
	
	public List<Proxy> findAll(){
		return proxyRepository.findAll();
	}
}
