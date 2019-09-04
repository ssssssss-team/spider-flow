package org.spiderflow.model;

import java.io.IOException;
import java.util.Date;

import javax.websocket.Session;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.spiderflow.context.SpiderContext;

import com.alibaba.fastjson.JSON;

/**
 * WebSocket通讯中爬虫的上下文域
 * @author Administrator
 *
 */
public class SpiderWebSocketContext extends SpiderContext{

	private static final long serialVersionUID = -1205530535069540245L;
	
	private Session session;
	
	public SpiderWebSocketContext(Session session) {
		super();
		this.session = session;
	}

	@Override
	public void addOutput(SpiderOutput output) {
		super.addOutput(output);
		this.write(new WebSocketEvent<>("output", output));
	}
	@Override
	public void log(SpiderLog log) {
		write(new WebSocketEvent<>("log", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"), log));
	}
	
	public <T> void write(WebSocketEvent<T> event){
		synchronized (session) {
			if (session.isOpen()) {
				try {
					System.out.println(JSON.toJSONString(event));
					session.getBasicRemote().sendText(JSON.toJSONString(event));
				} catch (IOException e) {
					//忽略异常
				}
			}
		}
	}
	
}
