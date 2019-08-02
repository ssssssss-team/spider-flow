package org.spiderflow.web.model;

/**
 * WebSocket事件
 * @author Administrator
 *
 * @param <T>
 */
public class WebSocketEvent<T> {
	
	private String eventType;
	
	private T message;

	public WebSocketEvent(String eventType, T message) {
		super();
		this.eventType = eventType;
		this.message = message;
	}

	public String getEventType() {
		return eventType;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public T getMessage() {
		return message;
	}

	public void setMessage(T message) {
		this.message = message;
	}
}
