package org.spiderflow.core.job;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.Spider;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.model.Task;
import org.spiderflow.core.service.SpiderFlowService;
import org.spiderflow.core.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

/**
 * 爬虫定时执行
 *
 * @author Administrator
 */
@Component
public class SpiderJob extends QuartzJobBean {

	@Autowired
	private Spider spider;

	@Autowired
	private SpiderFlowService spiderFlowService;

	@Autowired
	private TaskService taskService;

	private static Map<Integer, SpiderContext> contextMap = new HashMap<>();

	@Value("${spider.job.enable:true}")
	private boolean spiderJobEnable;

	@Value("${spider.job.log.path:./}")
	private String spiderLogPath;

	@Override
	protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
		if (!spiderJobEnable) {
			return;
		}
		JobDataMap dataMap = context.getMergedJobDataMap();
		SpiderFlow spiderFlow = (SpiderFlow) dataMap.get(SpiderJobManager.JOB_PARAM_NAME);
		run(spiderFlow, context.getNextFireTime());
	}

	public void run(String id) {
		run(spiderFlowService.getById(id), null);
	}

	public void run(SpiderFlow spiderFlow, Date nextExecuteTime) {
		Date now = new Date();
		SpiderJobContext context = SpiderJobContext.create(this.spiderLogPath, spiderFlow.getId() + ".log");
		Task task = new Task();
		task.setFlowId(spiderFlow.getId());
		task.setBeginTime(new Date());
		try {
			taskService.save(task);
			contextMap.put(task.getId(), context);
			context.info("开始执行任务{}", spiderFlow.getName());
			spider.run(spiderFlow, context);
			context.info("执行任务{}完毕，下次执行时间：{}", spiderFlow.getName(), nextExecuteTime == null ? null : DateFormatUtils.format(nextExecuteTime, "yyyy-MM-dd HH:mm:ss"));
		} catch (Exception e) {
			context.error("执行任务{}出错", spiderFlow.getName(), e);
		} finally {
			context.close();
			task.setEndTime(new Date());
			taskService.saveOrUpdate(task);
			contextMap.remove(task.getId());
		}
		spiderFlowService.executeCountIncrement(spiderFlow.getId(), now, nextExecuteTime);
	}

	public static SpiderContext getSpiderContext(Integer taskId){
		return contextMap.get(taskId);
	}
}
