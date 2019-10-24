package org.spiderflow.model;

/**
 * WebSocket事件
 * @author Administrator
 *
 * @param <T>
 */
public class WebSocketEvent<T> {
	
	private String eventType;
	
	private String timestamp;
	
	private T message;
	
	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public WebSocketEvent(String eventType, T message) {
		this.eventType = eventType;
		this.message = message;
	}
	
	public WebSocketEvent(String eventType, String timestamp, T message) {
		this.eventType = eventType;
		this.timestamp = timestamp;
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
