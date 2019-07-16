package com.mxd.spider.web.model;

import java.io.IOException;
import java.util.Date;

import javax.websocket.Session;

import org.apache.commons.lang3.time.DateFormatUtils;

import com.alibaba.fastjson.JSON;
import com.mxd.spider.core.context.SpiderContext;
import com.mxd.spider.core.model.SpiderOutput;

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
