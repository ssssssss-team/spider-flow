package org.spiderflow.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.Grammer;
import org.spiderflow.core.model.SpiderFlow;
import org.spiderflow.core.service.SpiderFlowService;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Shape;
import org.spiderflow.utils.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
	private List<Grammer> grammers;
	
	private Map<String,Map<String,List<String>>> keywords = new HashMap<>();
	
	@Autowired
	private SpiderFlowService spiderFlowService;
	
	@PostConstruct
	private void init(){
		for (Grammer grammer : grammers) {
			Map<String, List<String>> functions = grammer.getFunctionMap();
			if(functions != null){
				functions.entrySet().stream().forEach(e->{
					keywords.put(e.getKey(), Maps.newMap("functions", e.getValue()));
				});
			}
			Map<String, List<String>> attributes = grammer.getAttributeMap();
			if(attributes != null){
				attributes.entrySet().stream().forEach(e->{
					keywords.put(e.getKey(), Maps.newMap("attributes", e.getValue()));
				});
			}
			
		}
	}
	
	/**
	 * 爬虫列表
	 * @param page 页数
	 * @param size 每页显示条数
	 * @return Page<SpiderFlow> 所有爬虫的列表页
	 */
	@RequestMapping("/list")
	public Page<SpiderFlow> list(@RequestParam(name = "page",defaultValue = "1")Integer page,@RequestParam(name = "limit",defaultValue = "1")Integer size){
		return spiderFlowService.findAll(PageRequest.of(page - 1, size,new Sort(Direction.DESC,"createDate")));
	}
	
	@RequestMapping("/save")
	public String save(SpiderFlow spiderFlow){
		spiderFlowService.save(spiderFlow);
		return spiderFlow.getId();
	}
	
	@RequestMapping("/get")
	public SpiderFlow get(String id){
		return spiderFlowService.get(id);
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
	
	@RequestMapping("/cron")
	public void cron(String id,String cron){
		spiderFlowService.resetCornExpression(id, cron);
	}
	
	@RequestMapping("/xml")
	public String xml(String id){
		return spiderFlowService.get(id).getXml();
	}
	
	@RequestMapping("/shapes")
	public List<Shape> shapes(){
		return executors.stream().filter(e-> e.shape() !=null).map(executor -> executor.shape()).collect(Collectors.toList());
	}
	@RequestMapping("/grammers")
	public Map<String,Map<String,List<String>>> grammers(){
		return this.keywords;
	}
}
