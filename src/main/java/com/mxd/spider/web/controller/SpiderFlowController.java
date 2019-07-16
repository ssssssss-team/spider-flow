package com.mxd.spider.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mxd.spider.web.model.SpiderFlow;
import com.mxd.spider.web.service.SpiderFlowService;

@RestController
@RequestMapping("/")
public class SpiderFlowController {
	
	@Autowired
	private SpiderFlowService spiderFlowService;
	
	@RequestMapping("/list")
	public List<SpiderFlow> list(){
		return spiderFlowService.findAll();
	}
	
	@RequestMapping("/save")
	public void save(@RequestBody SpiderFlow spiderFlow){
		spiderFlowService.save(spiderFlow);
	}
	
	@RequestMapping("/get")
	public SpiderFlow get(String id){
		return spiderFlowService.get(id);
	}
}
