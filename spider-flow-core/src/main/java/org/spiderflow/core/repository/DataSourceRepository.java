package org.spiderflow.core.repository;

import java.util.List;

import org.spiderflow.core.model.DataSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DataSourceRepository extends JpaRepository<DataSource, String>{
	
	@Query(value = "select new DataSource(id,name) from DataSource")
	public List<DataSource> selectAll();

}
