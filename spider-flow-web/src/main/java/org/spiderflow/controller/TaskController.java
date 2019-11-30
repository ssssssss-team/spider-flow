package org.spiderflow.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.job.SpiderJob;
import org.spiderflow.core.model.Task;
import org.spiderflow.core.service.TaskService;
import org.spiderflow.model.JsonBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/task")
public class TaskController {

	@Autowired
	private TaskService taskService;

	@RequestMapping("/list")
	public IPage<Task> list(@RequestParam(name = "page", defaultValue = "1") Integer page, @RequestParam(name = "limit", defaultValue = "1") Integer size,String flowId){
		return taskService.page(new Page<>(page,size),new QueryWrapper<Task>().eq("flow_id",flowId).last("order by isnull(end_time) desc,end_time desc"));
	}

	/**
	 * 停止执行任务
	 * @param id
	 * @return
	 */
	@RequestMapping("/stop")
	public JsonBean<Boolean> stop(Integer id){
		SpiderContext context = SpiderJob.getSpiderContext(id);
		if(context != null){
			context.setRunning(false);
		}
		return new JsonBean<>(context != null);
	}

	@RequestMapping("/remove")
	public JsonBean<Boolean> remove(Integer id){
		return new JsonBean<>(taskService.removeById(id));
	}
}
