package com.mxd.spider.web.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mxd.spider.web.model.SpiderFlow;
import com.mxd.spider.web.repository.SpiderFlowRepository;

@Service
public class SpiderFlowService {
	
	@Autowired
	private SpiderFlowRepository repository;
	
	public Page<SpiderFlow> findAll(Pageable pageable){
		return repository.findAll(pageable);
	}
	
	@Transactional
	public void save(SpiderFlow spiderFlow){
		if(StringUtils.isNotEmpty(spiderFlow.getId())){	//修改
			repository.updateSpiderFlow(spiderFlow.getId(), spiderFlow.getName(), spiderFlow.getXml());
		}else{
			String id = UUID.randomUUID().toString().replace("-", "");
			repository.insertSpiderFlow(id, spiderFlow.getName(), spiderFlow.getXml());
		}
	}
	
	public void remove(String id){
		repository.deleteById(id);
	}
	
	public SpiderFlow get(String id){
		return repository.getOne(id);
	}

}
