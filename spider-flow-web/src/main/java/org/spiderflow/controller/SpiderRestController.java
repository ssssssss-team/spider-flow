package org.spiderflow.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.Spider;
import org.spiderflow.core.job.SpiderJob;
import org.spiderflow.core.job.SpiderJobContext;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.model.Task;
import org.spiderflow.core.service.SpiderFlowService;
import org.spiderflow.core.service.TaskService;
import org.spiderflow.model.JsonBean;
import org.spiderflow.model.SpiderOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rest")
public class SpiderRestController {
	
	private static Logger logger = LoggerFactory.getLogger(SpiderRestController.class);
	
	@Autowired
	private SpiderFlowService spiderFlowService;
	
	@Autowired
	private Spider spider;
	
	@Value("${spider.workspace}")
	private String workspace;

	@Autowired
	private SpiderJob spiderJob;

	@Autowired
	private TaskService taskService;

	/**
	 * 异步运行
	 * @param id
	 * @return
	 */
	@RequestMapping("/runAsync/{id}")
	public JsonBean<Integer> runAsync(@PathVariable("id")String id){
		SpiderFlow flow = spiderFlowService.getById(id);
		if(flow == null){
			return new JsonBean<>(0, "找不到此爬虫信息");
		}
		Task task = new Task();
		task.setFlowId(flow.getId());
		task.setBeginTime(new Date());
		taskService.save(task);
		Spider.executorInstance.submit(()->{
			spiderJob.run(flow,task,null);
		});
		return new JsonBean<>(task.getId());
	}

	/**
	 * 停止运行任务
	 * @param taskId
	 */
	@RequestMapping("/stop/{taskId}")
	public JsonBean<Void> stop(@PathVariable("taskId")Integer taskId){
		SpiderContext context = SpiderJob.getSpiderContext(taskId);
		if(context == null){
			return new JsonBean<>(0,"任务不存在！");
		}
		context.setRunning(false);
		return new JsonBean<>(1,"停止成功！");

	}

	/**
	 * 查询任务状态
	 * @param taskId
	 */
	@RequestMapping("/status/{taskId}")
	public JsonBean<Integer> status(@PathVariable("taskId")Integer taskId){
		SpiderContext context = SpiderJob.getSpiderContext(taskId);
		if(context == null){
			return new JsonBean<>(0);	//
		}
		return new JsonBean<>(1);	//正在运行中
	}

	/**
	 * 同步运行
	 * @param id
	 * @param params
	 * @return
	 */
	@RequestMapping("/run/{id}")
	public JsonBean<List<SpiderOutput>> run(@PathVariable("id")String id,@RequestBody(required = false)Map<String,Object> params){
		SpiderFlow flow = spiderFlowService.getById(id);
		if(flow == null){
			return new JsonBean<>(0, "找不到此爬虫信息");
		}
		List<SpiderOutput> outputs;
		Integer maxId = spiderFlowService.getFlowMaxTaskId(id);
		SpiderJobContext context = SpiderJobContext.create(workspace, id,maxId,true);
		try{
			outputs = spider.run(flow,context, params);	
		}catch(Exception e){
			logger.error("执行爬虫失败",e);
			return new JsonBean<>(-1, "执行失败");
		} finally{
			context.close();
		}
		return new JsonBean<>(outputs);
	}
	
}
