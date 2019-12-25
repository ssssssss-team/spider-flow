package org.spiderflow.model;

import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.serializer.FastJsonSerializer;

import javax.websocket.Session;
import java.util.Date;

/**
 * WebSocket通讯中爬虫的上下文域
 * @author Administrator
 *
 */
public class SpiderWebSocketContext extends SpiderContext{

	private static final long serialVersionUID = -1205530535069540245L;
	
	private Session session;
	
	public SpiderWebSocketContext(Session session) {
		this.session = session;
	}

	@Override
	public void addOutput(SpiderOutput output) {
		super.addOutput(output);
		this.write(new WebSocketEvent<>("output", output));
	}

	public void log(SpiderLog log) {
		write(new WebSocketEvent<>("log", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"), log));
	}
	
	public synchronized <T> void write(WebSocketEvent<T> event){
		try {
			session.getAsyncRemote().sendText(JSON.toJSONString(event, FastJsonSerializer.serializeConfig));
		} catch (Throwable ignored) {

		}
	}
}
