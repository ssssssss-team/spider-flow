package org.spiderflow.redis.utils;

import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

import redis.clients.jedis.JedisPoolConfig;

public class RedisUtils {
	
	public static StringRedisTemplate createRedisTemplate(String host,int port,String password,int database,int poolMaxActive,int poolMaxIdle,int poolMinIdle){
		JedisPoolConfig poolConfig = new JedisPoolConfig();
		poolConfig.setMaxTotal(poolMaxActive);
		poolConfig.setMaxIdle(poolMaxIdle);
		poolConfig.setMinIdle(poolMinIdle);
		JedisClientConfiguration jedisConfigConfiguration = JedisClientConfiguration.builder().usePooling().poolConfig(poolConfig).build();
		RedisStandaloneConfiguration standaloneConfiguration = new RedisStandaloneConfiguration();
		standaloneConfiguration.setDatabase(database);
		standaloneConfiguration.setHostName(host);
		standaloneConfiguration.setPassword(RedisPassword.of(password));
		standaloneConfiguration.setPort(port);
		StringRedisTemplate redisTemplate = new StringRedisTemplate(new JedisConnectionFactory(standaloneConfiguration,jedisConfigConfiguration));
		return redisTemplate;
	}

}
