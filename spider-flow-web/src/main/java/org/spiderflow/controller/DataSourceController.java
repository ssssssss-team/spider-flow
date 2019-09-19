package org.spiderflow.controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.core.model.DataSource;
import org.spiderflow.core.service.DataSourceService;
import org.spiderflow.model.JsonBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/datasource")
public class DataSourceController {
	
	@Autowired
	private DataSourceService dataSourceService;
	
	@RequestMapping("/list")
	public Page<DataSource> list(@RequestParam(name = "page",defaultValue = "1")Integer page, @RequestParam(name = "limit",defaultValue = "1")Integer size){
		return dataSourceService.findAll(PageRequest.of(page - 1, size,new Sort(Direction.DESC,"createDate")));
	}
	
	@RequestMapping("/all")
	public List<DataSource> all(){
		return dataSourceService.selectAll();
	}
	
	@RequestMapping("/save")
	public String save(DataSource dataSource){
		return dataSourceService.save(dataSource).getId();
	}
	
	@RequestMapping("/get")
	public DataSource get(String id){
		return dataSourceService.get(id);
	}
	
	@RequestMapping("/remove")
	public void remove(String id){
		dataSourceService.remove(id);
	}
	
	@RequestMapping("/test")
	public JsonBean<Void> test(DataSource dataSource){
		if(StringUtils.isBlank(dataSource.getDriverClassName())){
			return new JsonBean<>(0, "DriverClassName不能为空！");
		}
		if(StringUtils.isBlank(dataSource.getJdbcUrl())){
			return new JsonBean<>(0, "jdbcUrl不能为空！");
		}
		Connection connection = null;
		try {
			Class.forName(dataSource.getDriverClassName());
			String url = dataSource.getJdbcUrl();
			String username = dataSource.getUsername();
			String password = dataSource.getPassword();
			if(StringUtils.isNotBlank(username)){
				connection = DriverManager.getConnection(url,username,password);
			}else{
				connection = DriverManager.getConnection(url);
			}
			return new JsonBean<>(1, "测试连接成功");
		} catch (ClassNotFoundException e) {
			return new JsonBean<>(0, "找不到驱动包：" + dataSource.getDriverClassName());
		} catch (Exception e){
			return new JsonBean<>(0, "连接失败，"+ e.getMessage());
		} finally{
			if(connection != null){
				try {
					connection.close();
				} catch (Exception e) {
				}
			}
		}
	}
	
	

}
