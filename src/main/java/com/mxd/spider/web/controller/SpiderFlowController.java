package com.mxd.spider.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mxd.spider.web.model.SpiderFlow;
import com.mxd.spider.web.service.SpiderFlowService;

@RestController
@RequestMapping("/spider")
public class SpiderFlowController {
	
	@Autowired
	private SpiderFlowService spiderFlowService;
	
	@RequestMapping("/list")
	public Page<SpiderFlow> list(@RequestParam(name = "page",defaultValue = "1")Integer page,@RequestParam(name = "limit",defaultValue = "1")Integer size){
		return spiderFlowService.findAll(PageRequest.of(page - 1, size,new Sort(Direction.DESC,"createDate")));
	}
	
	@RequestMapping("/save")
	public void save(SpiderFlow spiderFlow){
		spiderFlowService.save(spiderFlow);
	}
	
	@RequestMapping("/get")
	public SpiderFlow get(String id){
		return spiderFlowService.get(id);
	}
	
	@RequestMapping("/remove")
	public void remove(String id){
		spiderFlowService.remove(id);
	}
	
	@RequestMapping("/xml")
	public String xml(String id){
		return spiderFlowService.get(id).getXml();
	}
}
