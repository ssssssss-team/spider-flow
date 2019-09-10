package org.spiderflow.redis.executor.shape;

import java.util.Map;

import org.apache.commons.lang3.math.NumberUtils;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Shape;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.redis.utils.RedisUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisExecutor implements ShapeExecutor{
	
	public static final String DATABASE_INDEX = "database";
	
	public static final String REDIS_HOST = "host";
	
	public static final String REDIS_PORT = "port";
	
	public static final String REDIS_PASSWORD = "password";
	
	public static final String REDIS_POOL_MAX_ACTIVE = "poolMaxActive";

	public static final String REDIS_POOL_MAX_IDLE = "poolMaxIdle";
	
	public static final String REDIS_POOL_MIN_IDLE = "poolMinIdle";
	
	public static final String REDIS_CONTEXT_KEY = "$redis_";
	
	@Override
	public String supportShape() {
		return "redis";
	}
	
	@Override
	public Shape shape() {
		Shape shape = new Shape();
		shape.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAgCAYAAACVU7GwAAAFcElEQVRYR61XXWwUVRg9352ZXaBsKeW/qF2T/gBiqAIPhgcBow8+wCY8aGJMK9GYmBjbB6IvJn3zxaTAA/Enxq1/zwuJr0gTEkxEXRIlFJpYRFsRCnULaDsz9zPf3U6ZmZ3ZbdGbbLrbuXPvueec79x7Cf+xnevZkmfQQUAVqkPxNIFKy3D35BPl8ekHGZ4e5KUfe/It/6DpoAb3E6gnaQwGpgEuATi2p3yxvJR5lgTqXM+WvRqql0B9wSSt+/bDWpnDrTOnzb9a9+433/2ZmQUcDC4TuLgcfw8vhr2GoEQeQPUy0AdQPr7iFd3d2P7xp7ByzebR7OQEfnj+uVRiGFxU0MNPlS+dSeuUCupcz2O9DC4ANO+V6BDZtjZseullNHVvMR9hK2h3Ry/htw9P4NY3VfaSG48TUEQV4Hi4TwRU1bTWW8IKAS1BRwGQ3dRmfla+P584R/7I22jd9wwuvHAoIp10nmPGlK8xOeuic5mDnGXFxuASA8U95Ysn5YEBJazETStAHn79DRjPzEsTZuLGqRImv/piYXArl8OqXbsj7Nz2NaZ9xl2udvu2csf8bc/YBlw+m4mA08AdC/w+jfRsu+qAHokvv3vouDFtvfbza6+gcv67mi7CzC+uhjsPJugQgJLfKxXhyaYsupZlI+97zKDPtnZzPmPBpqi9xMCPHnkHzTt310zq35nB5Jef49oHJ+qCTmKqMysM2WiPsSQD3fQ0rrk+6FhXF9sErLYU2hyFTAycyCJGDpo3U8G90dEaMLIIe2UOzSLhmdORPsJcRTNyBGSVqmHmuqfxp6fhzTNrQIV7NVuE9bYyINOaTNy8c5fxkPgtDPre5VH89GpfjdnjY93TbIDc8HTNNHS0s3OaiFbFn2QJWGMrbLBVjbTSV4BJJMR9d+HFQ4lMBuOLRFKJFT9muKAD8wgN5fN5J5P5yAeeTWNmna2wxiLkEtiTKl1/oIB1BwqQikzymZhXJJryNGZTsOSUjI+zDzn0Lo3s2PaJQ3R4VjN+d31Twn4KOmGvzbHQYlEie/HXxEsTbrJEQV9ZrCw6vGA6tX0rr7Xv+8dnxm2/CnAuZVX1CkMmm/E1Jrx0iSQ6NzgKay2FrLpf9bKIX+fmqy/N3DK4GHEqTX9I1RKE+hWKTIUJ02LipLZcETbaCmESgkXIHIHpI9Un8oixxeDh3BL2/vC0yZE09uoFVpJEQS4lmb4mEqRzII9EgzAQbiLtddfHTAobQV+RSBiRRYYlamR6Zv6Lhrq6Cop5GETVs0esCSgZOE65FIZUlLAXLowMVcGITFYoiOvlUjDlKoWxjco+TGd3bHvPA96s+NzUyNxrLcIGx4qkvkhb0cCc1obVeGw0yqXA9OFF0NePb+Vweou5xT9i2NREb5D6IpFkkjCZlktJpq+pvrZYVog8N32N625UnjDQoDBW29U9UySa8nzc9HlhH4svLMn08TyLGD3wTzwcRQL5NDJ3GrNpuSSnCNn/4ltOavUl+WcxqR8GJqbf7FiRImkkram+4x0d/ZpoMGlTNhtvgn8apb6E6WYnunUEEgk7wRGlhlnmYe26gyaEhvL5FpXJ9MPcWNCeJENwapB9KnzmksKQ7BI/5SwyR55wtjXacgwzQFG77tGB8XFzgai5zQx1dvYpAUf09IOcGoJ3xIMTrp9afQCuauZBuG5pYDx6k069YsmRRjnOIAOFNGnjhSESmb2yThSAeUTADIyNLf3eF6xYpIXjFBSRyLuj3h6X9mxeopL4JZCo3jgNb8jhl4c6OvYqIpG2d5HgrpLWR33PK8Yl+t9AhdmrWxgiEVAcuHKluEjwkW5LYippArOhS2Ewy426rJlL9fyyGJD/As7NyerqquODAAAAAElFTkSuQmCC");
		shape.setLabel("Redis");
		shape.setName("redis");
		shape.setTitle("Redis");
		return shape;
	}

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		int database = NumberUtils.toInt(node.getStringJsonValue(DATABASE_INDEX),0);
		String host = node.getStringJsonValue(REDIS_HOST);
		String password = node.getStringJsonValue(REDIS_PASSWORD);
		int port = NumberUtils.toInt(node.getStringJsonValue(REDIS_PORT),6379);
		int poolMaxActive = NumberUtils.toInt(node.getStringJsonValue(REDIS_POOL_MAX_ACTIVE),8);
		int poolMaxIdle = NumberUtils.toInt(node.getStringJsonValue(REDIS_POOL_MAX_IDLE),8);
		int poolMinIdle = NumberUtils.toInt(node.getStringJsonValue(REDIS_POOL_MIN_IDLE),0);
		StringRedisTemplate redisTemplate = RedisUtils.createRedisTemplate(host, port, password, database, poolMaxActive, poolMaxIdle, poolMinIdle);
		context.put(REDIS_CONTEXT_KEY + node.getNodeId(), redisTemplate);
	}

}
