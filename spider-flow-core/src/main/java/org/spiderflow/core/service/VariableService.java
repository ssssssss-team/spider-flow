package org.spiderflow.core.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.spiderflow.core.expression.ExpressionGlobalVariables;
import org.spiderflow.core.mapper.VariableMapper;
import org.spiderflow.core.model.Variable;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VariableService extends ServiceImpl<VariableMapper, Variable> {

	@Override
	public boolean removeById(Serializable id) {
		boolean ret = super.removeById(id);
		this.resetGlobalVariables();
		return  ret;
	}

	@Override
	public boolean saveOrUpdate(Variable entity) {
		boolean ret =  super.saveOrUpdate(entity);
		this.resetGlobalVariables();
		return ret;
	}

	@PostConstruct
	private void resetGlobalVariables(){
		Map<String, Object> variables = this.list().stream().collect(Collectors.toMap(Variable::getName, Variable::getValue));
		ExpressionGlobalVariables.reset(variables);
	}
}
