package org.spiderflow.model;

import com.alibaba.fastjson.JSON;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.serializer.FastJsonSerializer;

import javax.websocket.Session;
import java.util.Date;

/**
 * WebSocket通讯中爬虫的上下文域
 *
 * @author Administrator
 */
public class SpiderWebSocketContext extends SpiderContext {

    private static final long serialVersionUID = -1205530535069540245L;

    private Session session;

    private boolean debug;

    private Object lock = new Object();

    public SpiderWebSocketContext(Session session) {
        this.session = session;
    }

    public boolean isDebug() {
        return debug;
    }

    public void setDebug(boolean debug) {
        this.debug = debug;
    }

    @Override
    public void addOutput(SpiderOutput output) {
        this.write(new WebSocketEvent<>("output", output));
    }

    public void log(SpiderLog log) {
        write(new WebSocketEvent<>("log", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"), log));
    }

    public <T> void write(WebSocketEvent<T> event) {
        try {
            String message = JSON.toJSONString(event, FastJsonSerializer.serializeConfig);
            if(session.isOpen()){
                synchronized (session){
                    session.getBasicRemote().sendText(message);
                }
            }
        } catch (Throwable ignored) {
        }
    }

    @Override
    public void pause(String nodeId, String event, String key, Object value) {
        if(this.debug && this.isRunning()) {
            synchronized (this) {
                if(this.debug && this.isRunning()) {
                    synchronized (lock) {
                        try {
                            write(new WebSocketEvent<>("debug", new DebugInfo(nodeId, event, key, value)));
                            lock.wait();
                        } catch (InterruptedException ignored) {
                        }
                    }
                }
            }
        }
    }

    @Override
    public void resume() {
        if(this.debug){
            synchronized (lock){
                lock.notify();
            }
        }
    }

    @Override
    public void stop() {
        if(this.debug){
            synchronized (lock){
                lock.notifyAll();
            }
        }
    }

    class DebugInfo{

        private String nodeId;

        private String event;

        private String key;

        private Object value;

        public DebugInfo(String nodeId, String event, String key, Object value) {
            this.nodeId = nodeId;
            this.event = event;
            this.key = key;
            this.value = value;
        }

        public String getNodeId() {
            return nodeId;
        }

        public void setNodeId(String nodeId) {
            this.nodeId = nodeId;
        }

        public String getEvent() {
            return event;
        }

        public void setEvent(String event) {
            this.event = event;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }
    }
}
