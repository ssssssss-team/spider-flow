package org.spiderflow.websocket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.spiderflow.core.Spider;
import org.spiderflow.core.utils.SpiderFlowUtils;
import org.spiderflow.model.SpiderWebSocketContext;
import org.spiderflow.model.WebSocketEvent;
import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * WebSocket通讯编辑服务
 *
 * @author Administrator
 */
@ServerEndpoint("/ws")
@Component
public class WebSocketEditorServer {

    public static Spider spider;

    private SpiderWebSocketContext context;

    @OnMessage
    public void onMessage(String message, Session session) {
        JSONObject event = JSON.parseObject(message);
        String eventType = event.getString("eventType");
        if ("test".equals(eventType)) {
            context = new SpiderWebSocketContext(session);
            context.setRunning(true);
            new Thread(() -> {
                String xml = event.getString("message");
                if (xml != null) {
                    spider.runWithTest(SpiderFlowUtils.loadXMLFromString(xml), context);
                    context.write(new WebSocketEvent<>("finish", null));
                } else {
                    context.write(new WebSocketEvent<>("error", "xml不正确！"));
                }
                context.setRunning(false);
            }).start();
        } else if ("stop".equals(eventType) && context != null) {
            context.setRunning(false);
        }
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("close");
        context.setRunning(false);
    }

}
