package org.spiderflow.core.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;
import org.spiderflow.core.model.DataSource;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

public interface DataSourceMapper extends BaseMapper<DataSource>{
	
	@Select("select id,name from sp_datasource")
	public List<DataSource> selectAll();

}
