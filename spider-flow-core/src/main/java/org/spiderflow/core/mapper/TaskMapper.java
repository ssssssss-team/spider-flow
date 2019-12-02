package org.spiderflow.core.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.spiderflow.core.model.Task;

@Mapper
public interface TaskMapper extends BaseMapper<Task> {
}
