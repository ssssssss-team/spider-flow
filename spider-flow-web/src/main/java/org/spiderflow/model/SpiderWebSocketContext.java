package org.spiderflow.model;

import java.io.IOException;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

import javax.websocket.Session;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.spiderflow.context.SpiderContext;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.JSONSerializer;
import com.alibaba.fastjson.serializer.ObjectSerializer;
import com.alibaba.fastjson.serializer.SerializeConfig;
import com.alibaba.fastjson.serializer.SerializerFeature;

/**
 * WebSocket通讯中爬虫的上下文域
 * @author Administrator
 *
 */
public class SpiderWebSocketContext extends SpiderContext implements ObjectSerializer{

	private static final long serialVersionUID = -1205530535069540245L;
	
	private Session session;
	
	private SerializeConfig serializeConfig;
	
	public SpiderWebSocketContext(Session session) {
		this.session = session;
		this.serializeConfig = new SerializeConfig();
		this.serializeConfig.put(Long.TYPE, this);
		this.serializeConfig.put(Long.class, this);
		this.serializeConfig.put(BigDecimal.class, this);
		this.serializeConfig.put(BigInteger.class, this);
	}

	@Override
	public void addOutput(SpiderOutput output) {
		super.addOutput(output);
		this.write(new WebSocketEvent<>("output", output));
	}

	public void log(SpiderLog log) {
		write(new WebSocketEvent<>("log", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"), log));
	}
	
	public <T> void write(WebSocketEvent<T> event){
		synchronized (session) {
			if (session.isOpen()) {
				try {
					session.getBasicRemote().sendText(JSON.toJSONString(event,this.serializeConfig));
				} catch (IOException e) {
					//忽略异常
				}
			}
		}
	}

	@Override
	public void write(JSONSerializer serializer, Object object, Object fieldName, Type fieldType, int features) throws IOException {
		if(object == null){
			if(serializer.isEnabled(SerializerFeature.WriteNullNumberAsZero)){
				serializer.out.write("0");
			}else{
				serializer.out.writeNull();
			}
			return;
		}
		serializer.out.writeString(object.toString());
	}
	
}
