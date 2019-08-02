package org.spiderflow.web.model;

import java.io.IOException;
import java.util.Date;

import javax.websocket.Session;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.spiderflow.core.context.SpiderContext;
import org.spiderflow.core.model.SpiderOutput;

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
	public void log(String message) {
		super.log(message);
		write(new WebSocketEvent<>("log", String.format("%s  %s", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"),message)));
	}
	
	public <T> void write(WebSocketEvent<T> event){
		synchronized (session) {
			if (session.isOpen()) {
				try {
					session.getBasicRemote().sendText(JSON.toJSONString(event));
				} catch (IOException e) {
					//忽略异常
				}
			}
		}
	}
	
}
