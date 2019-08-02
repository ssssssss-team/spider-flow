package org.spiderflow.job;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.web.model.SpiderFlow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 爬虫定时执行管理
 * @author Administrator
 *
 */
@Component
public class SpiderJobManager {
	
	private static Logger logger = LoggerFactory.getLogger(SpiderJobManager.class);
	
	private final static String JOB_NAME = "SPIDER_TASK_";
	
	public final static String JOB_PARAM_NAME = "SPIDER_FLOW";
	
	/**
	 * 调度器
	 */
	@Autowired
	private Scheduler scheduler;
	
	private JobKey getJobKey(String id){
		return JobKey.jobKey(JOB_NAME + id);
	}
	
	/**
	 * 获取定时任务触发器Cron
	 * @param id CronTrigger的ID
	 * @return CronTrigger触发器
	 */
	public CronTrigger getCronTrigger(String id) {
        try {
            return (CronTrigger) scheduler.getTrigger(getTriggerKey(id));
        } catch (SchedulerException e) {
        	logger.error("获取CronTrigger出错",e);
            return null;
        }
    }

	private TriggerKey getTriggerKey(String id){
		return TriggerKey.triggerKey(JOB_NAME + id);
	}
	
	/**
	 * 新建定时任务
	 * @param spiderFlow 爬虫流程图
	 * @return boolean true/false
	 */
	public boolean addJob(SpiderFlow spiderFlow){
		try {
			JobDetail job = JobBuilder.newJob(SpiderJob.class).withIdentity(getJobKey(spiderFlow.getId())).build();
			job.getJobDataMap().put(JOB_PARAM_NAME, spiderFlow);
			
			CronScheduleBuilder cronScheduleBuilder = CronScheduleBuilder.cronSchedule(spiderFlow.getCron()).withMisfireHandlingInstructionDoNothing();
			
			CronTrigger trigger = TriggerBuilder.newTrigger().withIdentity(getTriggerKey(spiderFlow.getId())).withSchedule(cronScheduleBuilder).build();
			
			scheduler.scheduleJob(job,trigger);
			
			return true;
		} catch (SchedulerException e) {
			logger.error("创建定时任务出错",e);
			return false;
		}
	}
	
	public boolean updateJob(SpiderFlow spiderFlow){
		try {
			if(getCronTrigger(spiderFlow.getId()) != null){
				TriggerKey triggerKey = getTriggerKey(spiderFlow.getId());
				CronScheduleBuilder cronScheduleBuilder = CronScheduleBuilder.cronSchedule(spiderFlow.getCron())
			    		.withMisfireHandlingInstructionDoNothing();
				CronTrigger trigger = TriggerBuilder.newTrigger().withIdentity(getTriggerKey(spiderFlow.getId())).withSchedule(cronScheduleBuilder).build();
				trigger.getJobDataMap().put(JOB_PARAM_NAME, spiderFlow);
				scheduler.rescheduleJob(triggerKey, trigger);
			}
			return true;
		} catch (SchedulerException e) {
			logger.error("修改定时任务失败",e);
			return false;
		}
	}
	
	public boolean run(SpiderFlow spiderFlow){
		try {
			JobDataMap dataMap = new JobDataMap();
			dataMap.put(JOB_PARAM_NAME, spiderFlow);
			scheduler.triggerJob(getJobKey(spiderFlow.getId()),dataMap);
			return true;
		} catch (SchedulerException e) {
			logger.error("执行定时任务失败",e);
			return false;
		}
	}
	
	public boolean remove(String id){
		try {
			scheduler.deleteJob(getJobKey(id));
			return true;
		} catch (SchedulerException e) {
			logger.error("删除定时任务失败",e);
			return false;
		}
	}

}
