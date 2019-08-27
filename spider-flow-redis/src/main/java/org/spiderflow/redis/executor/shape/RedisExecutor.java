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
		shape.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAEMUlEQVRIS5VWS28bVRT+zp0ZO48676RtoMRIdR6tlBqpRSAWpGFPIrFBQojsaBHQZI2Euq1AciqxY2OrqtQNwvyBPhZQQUGkG5QQFu4ixiFJG+I87bn3oDPxjJ2x3YYrWX7de875HufMJfyP9TA5GmfQFKCmAUwAuA+YbCv2Mq8t5DaPE4qOs+lh8twMA1MATbeNjGB3ack7Fh0cxEE+731mcBpA9q2FP354XsymCQ/RWNcYmCGgyw9y+oMPcebjq9jP57H75xL++vKLUHzOEZAGTObNhcVcOPmRhL8n4137aJ8y4FkCJcObey5Pon1kFD2X30Hb8Ai2fnuEp/fu4u/bt5qA4iwD6VrUXsIfk+ck+DWhTNAIbT0Tk+i8eMkLtLO0iKf372Hr10fedysWw5krnyD31Q3vu2bGlgE2tMHKfglRxTjfGkXMsvz/CxbRHYK+SXfHx35uUep1v0RJduHOdw0rzn19ow7NujZYcw00DskqHBwgd1BGhIA3TrRguCUaxNo1vEmZsREechQiSgV/iE4+fdaJmEedoMvfvgVdLNYVs2cMNjSwZQy23TK6LIWhiINoJWbJGKxpRr5sQDeHh1kidFmEU7ZCzKomro0sjoyeHvQ0lM/yDiIszn3esAg5u2sYq2WNde2l8BbNJxKbRNTp/yBUSOI+W8Giqqc6Ll6Ch3xiMjj8+P33ghapLW7dNVh3NYombGDOUObVl8fLTuu3O6BAR88YYHRbCicdC22qmljQDbw7DbdYPKKnGKfgJTIoVQF5GWMK6LdppddWn9KD8bFtR6n2A08HRqGsAwP49cmBPtvyUIeX6LNSNnimq8apLXjQUYGWK2UN+mY4wa9EbHRbFFC45mpsuKaOEqFbknYogsuMTc1H9JFEsqffVhiwFeyKJIJagOwxqqYRCiWY6Oc7dscY/NOg+kY9Iyz02gr9dtB7DSkWly4AuFAbRBzbZxG6K4cFjSAWjcL6yD5J1FFxdzOKwbxtgM/op+TYbKFkrq9q7gwHa+RY0WrPHLqi16JAn2euxmoTGXyK9xm/0PfnR1mcKGtLG++QaBNegiTsWNkj+ogZGjmzluKiNnhS0ocaCpKXHCswzoscK8NB2kCS+SPNL1AKG3AU2itTJtyTwaTxrRw2TjPH1jIghjvlWIEzn9OTjymVSMjzbr522vjNetJWgXF8x9aOKWFG+sx3ZjPDMPO/BGRNuTzrjZBUPN4Fx5lWRNcBDNVW7/eetIuMOnGszEhZvjNFH9GxbpQBTwCkTak0P5c7vILUPfFTZ89OKKIZEH30IuM0MwyYHxggPbe8LNeOI6vpFSMVj8dVJDIDQF5HUDdqfO835owB5ueWl6W3G65jXaJEZyWJid4OR/H0IZo3pVJ6Lperu8McG2Gj8lKJRFIBsyCaAHOOmLPadSXRsa6IEvM/0FkPMhbAf00AAAAASUVORK5CYII=");
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
