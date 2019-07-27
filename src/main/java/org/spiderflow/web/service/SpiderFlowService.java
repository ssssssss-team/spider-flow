package org.spiderflow.web.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.TriggerBuilder;
import org.spiderflow.job.SpiderJobManager;
import org.spiderflow.web.model.SpiderFlow;
import org.spiderflow.web.repository.SpiderFlowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SpiderFlowService {
	
	@Autowired
	private SpiderFlowRepository repository;
	
	@Autowired
	private SpiderJobManager spiderJobManager;
	
	@PostConstruct
	private void initJobs(){
		SpiderFlow spiderFlow = new SpiderFlow();
		spiderFlow.setEnabled("1");
		List<SpiderFlow> spiderFlows = repository.findAll(Example.of(spiderFlow));
		if(spiderFlows != null){
			for (SpiderFlow sf : spiderFlows) {
				if(StringUtils.isNotEmpty(sf.getCron())){
					spiderJobManager.addJob(sf);
				}
			}
		}
	}
	
	public Page<SpiderFlow> findAll(Pageable pageable){
		return repository.findAll(pageable);
	}
	
	@Transactional
	public int executeCountIncrement(String id, Date lastExecuteTime, Date nextExecuteTime){
		return repository.executeCountIncrement(id, lastExecuteTime, nextExecuteTime);
	}
	@Transactional
	public void resetCornExpression(String id, String cron){
		CronTrigger trigger = TriggerBuilder.newTrigger()
				.withIdentity("Caclulate Next Execute Date")
				.withSchedule(CronScheduleBuilder.cronSchedule(cron))
				.build();
		repository.resetCornExpression(id, cron, trigger.getStartTime());
		spiderJobManager.remove(id);
		SpiderFlow spiderFlow = get(id);
		if("1".equals(spiderFlow.getEnabled()) && StringUtils.isNotEmpty(spiderFlow.getCron())){
			spiderJobManager.addJob(spiderFlow);
		}
	}
	
	@Transactional
	public void save(SpiderFlow spiderFlow){
		if(StringUtils.isNotEmpty(spiderFlow.getCron())){
			CronTrigger trigger = TriggerBuilder.newTrigger()
							.withIdentity("Caclulate Next Execute Date")
							.withSchedule(CronScheduleBuilder.cronSchedule(spiderFlow.getCron()))
							.build();
			spiderFlow.setNextExecuteTime(trigger.getStartTime());
		}
		if(StringUtils.isNotEmpty(spiderFlow.getId())){	//修改
			repository.updateSpiderFlow(spiderFlow.getId(), spiderFlow.getName(), spiderFlow.getXml());
			spiderJobManager.remove(spiderFlow.getId());
			spiderFlow = get(spiderFlow.getId());
			if("1".equals(spiderFlow.getEnabled()) && StringUtils.isNotEmpty(spiderFlow.getCron())){
				spiderJobManager.addJob(spiderFlow);
			}
			
		}else{
			String id = UUID.randomUUID().toString().replace("-", "");
			repository.insertSpiderFlow(id, spiderFlow.getName(), spiderFlow.getXml());
			spiderFlow.setId(id);
		}
	}
	@Transactional
	public void stop(String id){
		repository.resetSpiderStatus(id,"0");
		spiderJobManager.remove(id);
	}
	@Transactional
	public void start(String id){
		spiderJobManager.remove(id);
		SpiderFlow spiderFlow = get(id);
		spiderJobManager.addJob(spiderFlow);
		repository.resetSpiderStatus(id,"1");
	}
	@Transactional
	public void resetExecuteCount(String id){
		repository.resetExecuteCount(id);
	}
	public void remove(String id){
		repository.deleteById(id);
		spiderJobManager.remove(id);
	}
	
	public SpiderFlow get(String id){
		return repository.getOne(id);
	}

}
