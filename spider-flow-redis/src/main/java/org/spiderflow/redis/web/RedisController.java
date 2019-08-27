package org.spiderflow.redis.web;

import org.spiderflow.model.JsonBean;
import org.spiderflow.redis.utils.RedisUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/redis")
public class RedisController {
	
	@RequestMapping("/test")
	public JsonBean<String> test(String host,Integer port,String password,Integer database){
		try {
			StringRedisTemplate redisTemplate = RedisUtils.createRedisTemplate(host, port, password, database, 1, 1, 0);
			ValueOperations<String, String> operation = redisTemplate.opsForValue();
			String testKey = "____spider_flow_redis_test";
			operation.set(testKey, "1");
			if (redisTemplate.hasKey(testKey)) {
				redisTemplate.delete(testKey);
				return new JsonBean<String>(1,"测试成功");
			}
			return new JsonBean<String>(0,"测试失败");
		} catch (Exception e) {
			e.printStackTrace();
			return new JsonBean<String>(-1,e.getMessage());
		}
	}

}
