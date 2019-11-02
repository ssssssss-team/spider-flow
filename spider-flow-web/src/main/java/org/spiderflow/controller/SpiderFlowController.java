package org.spiderflow.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.Grammerable;
import org.spiderflow.annotation.Comment;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.service.SpiderFlowService;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.executor.FunctionExtension;
import org.spiderflow.executor.PluginConfig;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Grammer;
import org.spiderflow.model.JsonBean;
import org.spiderflow.model.Plugin;
import org.spiderflow.model.Shape;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 爬虫Controller
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/spider")
public class SpiderFlowController {
	
	@Autowired
	private List<ShapeExecutor> executors;
	
	@Autowired
	private List<FunctionExecutor> functionExecutors;
	
	@Autowired
	private List<FunctionExtension> functionExtensions;
	
	@Autowired
	private List<Grammerable> grammerables;
	
	@Autowired
	private SpiderFlowService spiderFlowService;
	
	@Autowired(required = false)
	private List<PluginConfig> pluginConfigs;
	
	@Value("${spider.job.log.path:./}")
	private String spiderLogPath;
	
	private final List<Grammer> grammers = new ArrayList<Grammer>();
	
	private static Logger logger = LoggerFactory.getLogger(SpiderFlowController.class);
	
	@PostConstruct
	private void init(){
		for (FunctionExecutor executor : functionExecutors) {
			String function = executor.getFunctionPrefix();
			grammers.addAll(Grammer.findGrammers(executor.getClass(),function,function,true));
			Comment comment = executor.getClass().getAnnotation(Comment.class);
			Grammer grammer = new Grammer();
			if(comment!= null){
				grammer.setComment(comment.value());
			}
			grammer.setFunction(function);
			grammers.add(grammer);
		}
		
		for (FunctionExtension extension : functionExtensions) {
			String owner = extension.support().getSimpleName();
			grammers.addAll(Grammer.findGrammers(extension.getClass(),null,owner,true));
		}
		for (Grammerable grammerable : grammerables) {
			grammers.addAll(grammerable.grammers());
		}
	}
	
	/**
	 * 爬虫列表
	 * @param page 页数
	 * @param size 每页显示条数
	 * @return Page<SpiderFlow> 所有爬虫的列表页
	 */
	@RequestMapping("/list")
	public IPage<SpiderFlow> list(@RequestParam(name = "page", defaultValue = "1") Integer page, @RequestParam(name = "limit", defaultValue = "1") Integer size, @RequestParam(name = "name", defaultValue = "") String name) {
		return spiderFlowService.page(new Page<>(page, size), new QueryWrapper<SpiderFlow>().like("name", name).orderByDesc("create_date"));
	}
	
	@RequestMapping("/save")
	public String save(SpiderFlow spiderFlow){
		spiderFlowService.save(spiderFlow);
		return spiderFlow.getId();
	}
	
	@RequestMapping("/get")
	public SpiderFlow get(String id){
		return spiderFlowService.getById(id);
	}
	
	@RequestMapping("/other")
	public List<SpiderFlow> other(String id){
		if(StringUtils.isBlank(id)){
			return spiderFlowService.selectFlows();
		}
		return spiderFlowService.selectOtherFlows(id);
	}
	
	@RequestMapping("/remove")
	public void remove(String id){
		spiderFlowService.remove(id);
	}
	
	@RequestMapping("/start")
	public void start(String id){
		spiderFlowService.start(id);
	}
	
	@RequestMapping("/stop")
	public void stop(String id){
		spiderFlowService.stop(id);
	}
	
	@RequestMapping("/run")
	public void run(String id){
		spiderFlowService.run(id);
	}
	
	@RequestMapping("/cron")
	public void cron(String id,String cron){
		spiderFlowService.resetCornExpression(id, cron);
	}
	
	@RequestMapping("/xml")
	public String xml(String id){
		return spiderFlowService.getById(id).getXml();
	}
	
	@RequestMapping("/log")
	public String log(String id){
		SpiderFlow flow = spiderFlowService.getById(id);
		if(flow == null){
			return "未找到此爬虫";
		}
		try {
			return FileUtils.readFileToString(new File(spiderLogPath,id + ".log"), "UTF-8");
		} catch (IOException e) {
			logger.error("读取日志文件出错",e);
			return "读取日志文件出错，" + e.getMessage();
		}
	}
	
	@RequestMapping("/shapes")
	public List<Shape> shapes(){
		return executors.stream().filter(e-> e.shape() !=null).map(executor -> executor.shape()).collect(Collectors.toList());
	}
	
	@RequestMapping("/pluginConfigs")
	public List<Plugin> pluginConfigs(){
		return null == pluginConfigs ? Collections.emptyList() : pluginConfigs.stream().filter(e-> e.plugin() != null).map(plugin -> plugin.plugin()).collect(Collectors.toList());
	}
	
	@RequestMapping("/grammers")
	public JsonBean<List<Grammer>> grammers(){
		return new JsonBean<>(this.grammers);
	}

	@GetMapping("/recent5TriggerTime")
	public List<String> getRecent5TriggerTime(String cron){
		return spiderFlowService.getRecentTriggerTime(cron,5);
	}
}
