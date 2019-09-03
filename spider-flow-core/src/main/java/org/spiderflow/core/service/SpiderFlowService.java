package org.spiderflow.core.service;

import org.apache.commons.lang3.StringUtils;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerUtils;
import org.quartz.spi.OperableTrigger;
import org.spiderflow.core.job.SpiderJobManager;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.repository.SpiderFlowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 爬虫流程执行服务
 * @author Administrator
 *
 */
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
		if(nextExecuteTime == null){
			return repository.executeCountIncrement(id, lastExecuteTime);
		}
		return repository.executeCountIncrementAndExecuteTime(id, lastExecuteTime, nextExecuteTime);
		
	}
	
	/**
	 * 重置定时任务
	 * @param id 爬虫的ID
	 * @param cron 定时器
	 */
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
	public void run(String id){
		spiderJobManager.run(id);
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
	
	public List<SpiderFlow> selectOtherFlows(String id){
		return repository.selectOtherFlows(id);
	}
	
	public List<SpiderFlow> selectFlows(){
		return repository.selectFlows();
	}

    /**
     * 根据表达式获取最近几次运行时间
	 * @param cron 表达式
	 * @param numTimes 几次
	 * @return
     */
	public List<String> getRecentTriggerTime(String cron,int numTimes) {
		List<String> list = new ArrayList<String>();
		CronTrigger trigger = null;
		try {
			trigger = TriggerBuilder.newTrigger()
					.withSchedule(CronScheduleBuilder.cronSchedule(cron))
					.build();
		}catch (Exception e) {
			list.add("cron表达式 "+cron+" 有误：" + e.getCause());
			return list;
		}
		List<Date> dates = TriggerUtils.computeFireTimes((OperableTrigger) trigger, null, numTimes);
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Date date : dates) {
			list.add(dateFormat.format(date));
		}
		return list;
	}

}
