package org.spiderflow.core.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerUtils;
import org.quartz.spi.OperableTrigger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.job.SpiderJobManager;
import org.spiderflow.core.mapper.FlowNoticeMapper;
import org.spiderflow.core.mapper.SpiderFlowMapper;
import org.spiderflow.core.model.SpiderFlow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 爬虫流程执行服务
 * @author Administrator
 *
 */
@Service
public class SpiderFlowService extends ServiceImpl<SpiderFlowMapper, SpiderFlow> {
	
	@Autowired
	private SpiderFlowMapper sfMapper;
	
	@Autowired
	private SpiderJobManager spiderJobManager;
	
	@Autowired
	private FlowNoticeMapper flowNoticeMapper;

	private static Logger logger = LoggerFactory.getLogger(SpiderFlowService.class);

	@Value("${spider.workspace}")
	private String workspace;

	//项目启动后自动查询需要执行的任务进行爬取
	@PostConstruct
	private void initJobs(){
		//清空所有任务下次执行时间
		sfMapper.resetNextExecuteTime();
		//获取启用corn的任务
		List<SpiderFlow> spiderFlows = sfMapper.selectList(new QueryWrapper<SpiderFlow>().eq("enabled", "1"));
		if(spiderFlows != null && !spiderFlows.isEmpty()){
			for (SpiderFlow sf : spiderFlows) {
				if(StringUtils.isNotEmpty(sf.getCron())){
					Date nextExecuteTimt = spiderJobManager.addJob(sf);
					if (nextExecuteTimt != null) {
						sf.setNextExecuteTime(nextExecuteTimt);
						sfMapper.updateById(sf);
					}
				}
			}
		}
	}

	public IPage<SpiderFlow> selectSpiderPage(Page<SpiderFlow> page, String name){
		return sfMapper.selectSpiderPage(page,name);
	}
	
	public int executeCountIncrement(String id, Date lastExecuteTime, Date nextExecuteTime){
		if(nextExecuteTime == null){
			return sfMapper.executeCountIncrement(id, lastExecuteTime);
		}
		return sfMapper.executeCountIncrementAndExecuteTime(id, lastExecuteTime, nextExecuteTime);
		
	}
	
	/**
	 * 重置定时任务
	 * @param id 爬虫的ID
	 * @param cron 定时器
	 */
	public void resetCornExpression(String id, String cron){
		CronTrigger trigger = TriggerBuilder.newTrigger()
				.withIdentity("Caclulate Next Execute Date")
				.withSchedule(CronScheduleBuilder.cronSchedule(cron))
				.build();
		sfMapper.resetCornExpression(id, cron, trigger.getFireTimeAfter(null));
		spiderJobManager.remove(id);
		SpiderFlow spiderFlow = getById(id);
		if("1".equals(spiderFlow.getEnabled()) && StringUtils.isNotEmpty(spiderFlow.getCron())){
			spiderJobManager.addJob(spiderFlow);
		}
	}

	@Override
	public boolean save(SpiderFlow spiderFlow){
		//解析corn,获取并设置任务的开始时间
		if(StringUtils.isNotEmpty(spiderFlow.getCron())){
			CronTrigger trigger = TriggerBuilder.newTrigger()
							.withIdentity("Caclulate Next Execute Date")
							.withSchedule(CronScheduleBuilder.cronSchedule(spiderFlow.getCron()))
							.build();
			spiderFlow.setNextExecuteTime(trigger.getStartTime());
		}
		if(StringUtils.isNotEmpty(spiderFlow.getId())){	//update 任务
			sfMapper.updateSpiderFlow(spiderFlow.getId(), spiderFlow.getName(), spiderFlow.getXml());
			spiderJobManager.remove(spiderFlow.getId());
			spiderFlow = getById(spiderFlow.getId());
			if("1".equals(spiderFlow.getEnabled()) && StringUtils.isNotEmpty(spiderFlow.getCron())){
				spiderJobManager.addJob(spiderFlow);
			}
		}else{//insert 任务
			String id = UUID.randomUUID().toString().replace("-", "");
			sfMapper.insertSpiderFlow(id, spiderFlow.getName(), spiderFlow.getXml());
			spiderFlow.setId(id);
		}
		File file = new File(workspace,spiderFlow.getId() + File.separator + "xmls" + File.separator + System.currentTimeMillis() + ".xml");
		try {
			FileUtils.write(file,spiderFlow.getXml(),"UTF-8");
		} catch (IOException e) {
			logger.error("保存历史记录出错",e);
		}
		return true;
	}
	
	public void stop(String id){
		sfMapper.resetSpiderStatus(id,"0");
		sfMapper.resetNextExecuteTime(id);
		spiderJobManager.remove(id);
	}
	
	public void start(String id){
		spiderJobManager.remove(id);
		SpiderFlow spiderFlow = getById(id);
		Date nextExecuteTime = spiderJobManager.addJob(spiderFlow);
		if (nextExecuteTime != null) {
			spiderFlow.setNextExecuteTime(nextExecuteTime);
			sfMapper.updateById(spiderFlow);
			sfMapper.resetSpiderStatus(id, "1");
		}
	}
	
	public void run(String id){
		spiderJobManager.run(id);
	}
	
	public void resetExecuteCount(String id){
		sfMapper.resetExecuteCount(id);
	}
	public void remove(String id){
		sfMapper.deleteById(id);
		spiderJobManager.remove(id);
		flowNoticeMapper.deleteById(id);
	}
	
	public List<SpiderFlow> selectOtherFlows(String id){
		return sfMapper.selectOtherFlows(id);
	}
	
	public List<SpiderFlow> selectFlows(){
		return sfMapper.selectFlows();
	}

    /**
     * 根据表达式获取最近几次运行时间
	 * @param cron 表达式
	 * @param numTimes 几次
	 * @return
     */
	public List<String> getRecentTriggerTime(String cron,int numTimes) {
		List<String> list = new ArrayList<>();
		CronTrigger trigger;
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

	public List<Long> historyList(String id){
		File directory = new File(workspace, id + File.separator + "xmls");
		if(directory.exists() && directory.isDirectory()){
			File[] files = directory.listFiles((dir, name) -> name.endsWith(".xml"));
			if(files != null && files.length > 0){
				return Arrays.stream(files).map(f-> Long.parseLong(f.getName().replace(".xml",""))).sorted().collect(Collectors.toList());
			}
		}
		return Collections.emptyList();
	}

	public String readHistory(String id,String timestamp){
		File file = new File(workspace, id + File.separator + "xmls" + File.separator + timestamp + ".xml");
		if(file.exists()){
			try {
				return FileUtils.readFileToString(file,"UTF-8");
			} catch (IOException e) {
				logger.error("读取历史版本出错",e);
			}
		}
		return null;
	}

	public Integer getFlowMaxTaskId(String flowId){
		return sfMapper.getFlowMaxTaskId(flowId);
	}
}
