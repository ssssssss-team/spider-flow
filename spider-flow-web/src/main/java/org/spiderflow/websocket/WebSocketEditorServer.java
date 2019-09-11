package org.spiderflow.websocket;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.core.Spider;
import org.spiderflow.core.utils.DataSourceUtils;
import org.spiderflow.core.utils.SpiderFlowUtils;
import org.spiderflow.model.SpiderWebSocketContext;
import org.spiderflow.model.WebSocketEvent;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

/**
 * WebSocket通讯编辑服务
 * @author Administrator
 *
 */
@ServerEndpoint("/ws")
@Component
public class WebSocketEditorServer {
	
	public static Spider spider;
	
	private static Map<String,SpiderWebSocketContext> contextMap = new HashMap<>();
	
	@OnMessage
	public void onMessage(String message,Session session){
		JSONObject event = JSON.parseObject(message);
		SpiderWebSocketContext context = contextMap.get(session.getId());
		if(context == null){
			context = new SpiderWebSocketContext(session);
			contextMap.put(session.getId(), context);
		}
		String eventType = event.getString("eventType");
		if("test".equals(eventType)){
			context.setRunning(true);
			final SpiderWebSocketContext spiderContext = context;
			new Thread(()->{
				String xml = event.getString("message");
				if(xml != null){
					spider.runWithTest(SpiderFlowUtils.loadXMLFromString(xml), spiderContext);
					spiderContext.write(new WebSocketEvent<>("finish", null));
				}else{
					spiderContext.write(new WebSocketEvent<>("error", "xml不正确！"));
				}
			}).start();
		}else if("stop".equals(eventType)){
			context.setRunning(false);
		}else if("testDatasource".equals(eventType)){
			JSONObject dsConfig = event.getJSONObject("message");
			String className = DataSourceUtils.getDriverClassByDataBaseType(dsConfig.getString("type"));
			if(StringUtils.isEmpty(className)){
				context.write(new WebSocketEvent<>("error", "不支持的数据库类型！"));
			}else{
				String url = dsConfig.getString("url");
				String username = dsConfig.getString("username");
				String password = dsConfig.getString("password");
				Connection connection = null;
				try{
					Class.forName(className);
					connection = DriverManager.getConnection(url,username,password);
					context.write(new WebSocketEvent<>("success", "测试连接成功！"));
				}catch(Exception e){
					context.write(new WebSocketEvent<>("error", "连接失败," + e.getMessage()));
				} finally{
					try {
						connection.close();
					} catch (Exception e) {
					}
				}
				
			}
		}
	}
	
	@OnClose
	public void onClose(Session session){
		SpiderWebSocketContext context = contextMap.get(session.getId());
		if(context != null){
			context.setRunning(false);
		}
		contextMap.remove(session.getId());
	}

}
