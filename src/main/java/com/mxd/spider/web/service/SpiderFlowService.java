package com.mxd.spider.web.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mxd.spider.web.model.SpiderFlow;
import com.mxd.spider.web.repository.SpiderFlowRepository;

@Service
public class SpiderFlowService {
	
	@Autowired
	private SpiderFlowRepository repository;
	
	public List<SpiderFlow> findAll(){
		return repository.findAll();
	}
	
	public void save(SpiderFlow spiderFlow){
		repository.save(spiderFlow);
	}
	
	public SpiderFlow get(String id){
		return repository.getOne(id);
	}

}
