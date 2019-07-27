package org.spiderflow.web.websocket;

import java.sql.Connection;

import javax.sql.DataSource;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.core.Spider;
import org.spiderflow.core.utils.DataSourceUtils;
import org.spiderflow.core.utils.SpiderFlowUtils;
import org.spiderflow.web.model.SpiderWebSocketContext;
import org.spiderflow.web.model.WebSocketEvent;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

@ServerEndpoint("/ws")
@Component
public class WebSocketEditorServer {
	
	public static Spider spider;
	
	@OnMessage
	public void onMessage(String message,Session session){
		JSONObject event = JSON.parseObject(message);
		SpiderWebSocketContext context = new SpiderWebSocketContext(session);
		if("test".equals(event.getString("eventType"))){
			String xml = event.getString("message");
			if(xml != null){
				spider.runWithTest(SpiderFlowUtils.loadXMLFromString(xml), context);
			}else{
				context.write(new WebSocketEvent<>("error", "xml不正确！"));
			}
		}else if("testDatasource".equals(event.getString("eventType"))){
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
					DataSource ds = DataSourceUtils.createDataSource(className, url, username, password);
					connection = ds.getConnection();
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

}
