package org.spiderflow.web.repository;

import java.util.Date;

import org.spiderflow.web.model.SpiderFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SpiderFlowRepository extends JpaRepository<SpiderFlow, String>{

	@Modifying
	@Query(value = "insert into sp_flow(id,name,xml,enabled) values(?1,?2,?3,'0')",nativeQuery = true)
	public int insertSpiderFlow(String id,String name,String xml);
	
	@Modifying
	@Query(value = "update sp_flow set name = ?2,xml = ?3 where id = ?1",nativeQuery = true)
	public int updateSpiderFlow(String id,String name,String xml);
	
	@Modifying
	@Query(value = "update sp_flow set execute_count = 0 where id = ?1",nativeQuery = true)
	public int resetExecuteCount(String id);
	
	@Modifying
	@Query(value = "update sp_flow set execute_count = execute_count + 1,last_execute_time = ?2,next_execute_time = ?3 where id = ?1",nativeQuery = true)
	public int executeCountIncrement(String id,Date lastExecuteTime,Date nextExecuteTime);
	
	@Modifying
	@Query(value = "update sp_flow set cron = ?2,next_execute_time = ?3 where id = ?1",nativeQuery = true)
	public int resetCornExpression(String id,String cron,Date nextExecuteTime);
	
	@Modifying
	@Query(value = "update sp_flow set enabled = ?2 where id = ?1",nativeQuery = true)
	public int resetSpiderStatus(String id,String enabled);
}
