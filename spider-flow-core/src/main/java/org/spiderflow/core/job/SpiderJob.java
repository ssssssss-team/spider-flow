package org.spiderflow.core.job;

import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.Spider;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.service.SpiderFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

/**
 * 爬虫定时执行
 * @author Administrator
 *
 */
@Component
public class SpiderJob extends QuartzJobBean{
	
	private static Logger logger = LoggerFactory.getLogger(SpiderJob.class);
	
	private static Spider spider;
	
	private static SpiderFlowService spiderFlowService;
	
	@Value("${spider.job.enable:true}")
	private boolean spiderJobEnable;

	@Override
	protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
		if(!spiderJobEnable){
			return;
		}
		JobDataMap dataMap = context.getMergedJobDataMap();
		SpiderFlow spiderFlow = (SpiderFlow) dataMap.get(SpiderJobManager.JOB_PARAM_NAME);
		run(spiderFlow,context.getNextFireTime());
	}
	
	public void run(String id){
		run(spiderFlowService.get(id),null);
	}
	
	public void run(SpiderFlow spiderFlow,Date nextExecuteTime){
		Date now = new Date();
		try {
			logger.info("开始执行任务{}",spiderFlow.getName());
			spider.run(spiderFlow);
			logger.info("执行任务{}完毕，下次执行时间：{}",spiderFlow.getName(),nextExecuteTime == null ? null: DateFormatUtils.format(nextExecuteTime, "yyyy-MM-dd HH:mm:ss"));
		} catch (Exception e) {
			logger.error("执行任务{}出错",spiderFlow.getName(),e);
		}
		spiderFlowService.executeCountIncrement(spiderFlow.getId(), now, nextExecuteTime);
	}

	@Autowired
	public void setSpider(Spider spider) {
		SpiderJob.spider = spider;
	}

	@Autowired
	public void setSpiderFlowService(SpiderFlowService spiderFlowService) {
		SpiderJob.spiderFlowService = spiderFlowService;
	}

}
