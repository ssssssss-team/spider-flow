package org.spiderflow.logback;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxy;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.context.SpiderContextHolder;
import org.spiderflow.model.SpiderLog;
import org.spiderflow.model.SpiderWebSocketContext;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SpiderFlowWebSocketAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {

	@Override
	protected void append(ILoggingEvent event) {
		SpiderContext context = SpiderContextHolder.get();
		if(context instanceof SpiderWebSocketContext){
			SpiderWebSocketContext socketContext = (SpiderWebSocketContext) context;
			List<Object> arguments = new ArrayList<>(Arrays.asList(event.getArgumentArray()));
			ThrowableProxy throwableProxy = (ThrowableProxy) event.getThrowableProxy();
			if(throwableProxy != null){
				arguments.add(throwableProxy.getThrowable());
			}
			socketContext.log(new SpiderLog(event.getLevel().levelStr.toLowerCase(),event.getMessage(),arguments));
		}
	}
}
