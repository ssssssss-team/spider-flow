package org.spiderflow.core.service;

import java.util.List;

import org.spiderflow.core.model.DataSource;
import org.spiderflow.core.repository.DataSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DataSourceService {
	
	@Autowired
	private DataSourceRepository repository;
	
	public Page<DataSource> findAll(Pageable pageable){
		return repository.findAll(pageable);
	}
	
	public List<DataSource> selectAll(){
		return repository.selectAll();
	}

	public DataSource get(String id){
		return repository.getOne(id);
	}
	
	public DataSource save(DataSource datasource){
		return repository.saveAndFlush(datasource);
	}
	
	public void remove(String id){
		repository.deleteById(id);
	}
}
