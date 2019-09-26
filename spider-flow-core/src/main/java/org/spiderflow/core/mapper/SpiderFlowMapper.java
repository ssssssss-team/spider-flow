package org.spiderflow.core.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.spiderflow.core.model.SpiderFlow;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 爬虫资源库 实现爬虫的入库
 * @author Administrator
 *
 */
public interface SpiderFlowMapper extends BaseMapper<SpiderFlow>{

	@Insert("insert into sp_flow(id,name,xml,enabled) values(#{id},#{name},#{xml},'0')")
	public int insertSpiderFlow(@Param("id") String id,@Param("name") String name,@Param("xml") String xml);
	
	@Update("update sp_flow set name = #{name},xml = #{xml} where id = #{id}")
	public int updateSpiderFlow(@Param("id") String id,@Param("name") String name,@Param("xml") String xml);
	
	@Update("update sp_flow set execute_count = 0 where id = #{id}")
	public int resetExecuteCount(@Param("id") String id);
	
	@Update("update sp_flow set execute_count = ifnull(execute_count,0) + 1,last_execute_time = #{lastExecuteTime},next_execute_time = #{nextExecuteTime} where id = #{id}")
	public int executeCountIncrementAndExecuteTime(@Param("id") String id,@Param("lastExecuteTime") Date lastExecuteTime,@Param("nextExecuteTime") Date nextExecuteTime);
	
	@Update("update sp_flow set execute_count = ifnull(execute_count,0) + 1,last_execute_time = #{lastExecuteTime} where id = #{id}")
	public int executeCountIncrement(@Param("id") String id,@Param("lastExecuteTime") Date lastExecuteTime);
	
	@Update("update sp_flow set cron = #{cron},next_execute_time = #{nextExecuteTime} where id = #{id}")
	public int resetCornExpression(@Param("id") String id,@Param("cron") String cron,@Param("nextExecuteTime") Date nextExecuteTime);
	
	@Update("update sp_flow set enabled = #{enabled} where id = #{id}")
	public int resetSpiderStatus(@Param("id") String id,@Param("enabled") String enabled);
	
	@Select("select id,name from sp_flow")
	public List<SpiderFlow> selectFlows();
	
	@Select("select id,name from sp_flow where id != #{id}")
	public List<SpiderFlow> selectOtherFlows(@Param("id") String id);
}
