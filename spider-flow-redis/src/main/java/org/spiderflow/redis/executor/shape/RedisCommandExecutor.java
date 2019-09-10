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
		shape.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC9UlEQVRYR+2YP0zUUBjAf9+RKJPgQK6THptxERPiZOTUxEUj/tlMjCS62xoT3YARl5bJTXByBGcHISQmxhjQ6A6TPRg8JrnE62de6Z0Htne9XhMw4W1N3/u+X7//rwJgzeokygRQMs+HYSksBsr0liNrYrk6gTB3GMBiGNZ9W4al6OqiCOOqfFGYKkD1oIEVRkRwQw5l2FhyCWEMZdp3ZOqgARv6LU/1CDIPbxxZMg8rhmUxj5gcdHWw6khiJSh6+lVgAGXMd2S90/79H9czpOXpd+CsKk7FEe8fBab2whwCdeF6n/ISOFUPuLT1RFbSWLsnSMvTOVUmREJVM74tz1uVGov1C6tR9/rs2zJqefoL6FfYDpSy6SKdQDNDGkAI2yeqvKk4ci/GilMIk40aZ1w95OpIQVgWOKFQDZTLnUAzQbYCorz2HQlhW5flakmFVYFBVWYrjtiN9yEoLIkwkAa0a0jL0x8m4SLrxAKGGenqPMIDVbZrUNqfWE1Qk1AFqAc83HLkVZzrs0AGgKhQDwJG41xluVpGeB99SGKLtTx9i3LTJFUAC5u23MkFcsjTZwWYFjie5CrLUwNYRtnwHYkd+fbENHyr/eZG9als5AJphLSLqdZxL1BubzqyGFP3mkmXFNN74jtrMW8FRdgB7u4EfGiWHGXZd6QcA7iCcBEz1yQkXa7F3ID2wUeEY0HATJ9wRoVxo6SunI+N18gqCu8qtlzrVCNzaYtFVx8BVwJ4UYB5Ec4pfKrYciEOoOiqjXC1ptxv10pzcXccQBQC5VqdhaQkSGO5XN2dRWGWM13XySxKej1zBNmrBRvnYy25fyDIS1kWOdG49zNqseG92xPhcSRsqWuhgoXSn3jOFH3F71Kuaatha91RTpp7d0lhzYxQXQra3W66yO4AHL86vW+nNOpOofgI9JaZAzOAmt80p9tAmgFivlu5Aaw1ZoB2Nkglt/kHJNmSsf08lfBoU2pIy9W/14JuNCTs9e3olpRC1n8B+Qd0Dhp9ddQMugAAAABJRU5ErkJggg==");
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
