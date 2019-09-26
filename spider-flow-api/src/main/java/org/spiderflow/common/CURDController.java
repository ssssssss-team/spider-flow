package org.spiderflow.common;

import org.spiderflow.model.JsonBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

public abstract class CURDController<S extends ServiceImpl<M, T>,M extends BaseMapper<T>,T> {
	
	@Autowired
	private S service;
	
	@RequestMapping("/list")
	public IPage<T> list(@RequestParam(name = "page",defaultValue = "1")Integer page, @RequestParam(name = "limit",defaultValue = "1")Integer size){
		return service.page(new Page<T>(page, size), new QueryWrapper<T>().orderByDesc("create_date"));
	}
	
	@RequestMapping("get")
	public JsonBean<T> get(String id) {
		return new JsonBean<T>(service.getById(id));
	}
	
	@RequestMapping("delete")
	public JsonBean<Boolean> delete(String id){
		return new JsonBean<Boolean>(service.removeById(id));
	}
	
	@RequestMapping("save")
	public JsonBean<Boolean> save(T t){
		return new JsonBean<Boolean>(service.saveOrUpdate(t));
	}
	
}