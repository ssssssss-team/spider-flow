package com.mxd.spider.web.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import com.mxd.spider.core.Spider;
import com.mxd.spider.web.websocket.WebSocketEditorServer;

@Configuration
public class WebSocketConfiguration {
	
	@Bean
	public ServerEndpointExporter endpointExporter(){
		return new ServerEndpointExporter();
	}
	
	@Autowired
	public void setSpider(Spider spider) {
		WebSocketEditorServer.spider = spider;
	}

}
