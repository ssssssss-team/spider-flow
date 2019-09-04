package org.spiderflow.redis.executor.shape;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Shape;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisCommandExecutor implements ShapeExecutor{
	
	public static final String DATASOURCE_ID = "datasourceId";
	
	public static final String REDIS_COMMAND = "command";
	
	public static final String REDIS_OPERATION_TYPE = "operationType";
	
	public static final String REDIS_COMMAND_VAR = "___redis";
	
	@Autowired
	private ExpressionEngine engine;
	
	
	@Override
	public String supportShape() {
		return "rediscommand";
	}
	
	@Override
	public Shape shape() {
		Shape shape = new Shape();
		shape.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA7klEQVRIS93VsQ2CUBDG8f/FwtbGhE5HcATcQCdRJhAneDqRjOAI2lFaamHOQMQQo3IPnhZSw/1e3nH3CV9+5Mv1KYHI6Zgeo6DYlWOeyKECUoWlwD4EojAR2OSJpA8AiPNE4hBA5DQDsj8Ghk4nPcGdlfkpkZPvtTVe0cDpoA8Zgl6UqS/SCBQn7oKYgC6IGWiL+APCDkUuEFv6YQbKPngWv6+e5kF7VfzjzrrvHhPw7uSR0xRh9XIulHWxGkxAOWiwOcPMcufPoLkHvhNcvf+ngAqLoIGjbOt5UARNkLCp9a0InOw3od/2b7F8dwNyJQEoW0HkAAAAAABJRU5ErkJggg==");
		shape.setLabel("Redis命令");
		shape.setName("rediscommand");
		shape.setTitle("Redis命令");
		return shape;
	}

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String datasourceId = node.getStringJsonValue(DATASOURCE_ID);
		String command = node.getStringJsonValue(REDIS_COMMAND);
		String operationType = node.getStringJsonValue(REDIS_OPERATION_TYPE);
		if(!StringUtils.isNotBlank(datasourceId)){
			context.debug("Redis数据源ID为空！");
		}else if(!StringUtils.isNotBlank(command)){
			context.debug("redis命令为空！");
		}else if(!StringUtils.isNotBlank(operationType)){
			context.debug("redis命令类型为空！");
		}else{
			StringRedisTemplate redisTemplate = (StringRedisTemplate) context.get(RedisExecutor.REDIS_CONTEXT_KEY + datasourceId);
			Object operation = getOperations(redisTemplate, operationType);
			variables.put(REDIS_COMMAND_VAR, operation);
			String expression = String.format("${%s.%s}", REDIS_COMMAND_VAR,command);
			Object result = engine.execute(expression, variables);
			variables.put("rs", result);
			variables.remove(REDIS_COMMAND_VAR);
		}
		
		
	}
	
	private Object getOperations(StringRedisTemplate redisTemplate,String operationType){
		switch(operationType){
			case "list" : return redisTemplate.opsForList();
			case "value" : return redisTemplate.opsForValue();
			case "set" : return redisTemplate.opsForSet();
			case "zset" : return redisTemplate.opsForZSet();
			case "geo" : return redisTemplate.opsForGeo();
			case "hash" : return redisTemplate.opsForHash();
			case "hyperLogLog" : return redisTemplate.opsForHyperLogLog();
		}
		return redisTemplate;
	}

}
