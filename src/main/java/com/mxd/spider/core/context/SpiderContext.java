package com.mxd.spider.core.context;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import com.mxd.spider.core.model.SpiderOutput;

public class SpiderContext extends HashMap<String, Object>{
	
	private static final long serialVersionUID = 8379177178417619790L;
	
	private List<SpiderOutput> outputs = new ArrayList<>();
	
	private Map<String,DataSource> datasources = new HashMap<>();

	public List<SpiderOutput> getOutputs() {
		return outputs;
	}
	
	public void addDataSource(String id,DataSource datasource){
		this.datasources.put(id, datasource);
	}
	
	public DataSource getDataSource(String id){
		return this.datasources.get(id);
	}

	public void setOutputs(List<SpiderOutput> outputs) {
		this.outputs = outputs;
	}
	
	public void addOutput(SpiderOutput output){
		this.outputs.add(output);
	}
	
	public void log(String message){
		
	}
}
