package org.spiderflow.core.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.spiderflow.core.mapper.TaskMapper;
import org.spiderflow.core.model.Task;
import org.springframework.stereotype.Service;

@Service
public class TaskService extends ServiceImpl<TaskMapper, Task> {

}
