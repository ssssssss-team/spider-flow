package org.spiderflow.logback;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.FileAppender;
import ch.qos.logback.core.UnsynchronizedAppenderBase;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.context.SpiderContextHolder;
import org.spiderflow.core.job.SpiderJobContext;
import org.spiderflow.model.SpiderLog;
import org.spiderflow.model.SpiderWebSocketContext;

import java.io.OutputStream;

public class SpiderFlowWebSocketAppender extends UnsynchronizedAppenderBase<ILoggingEvent> {

	@Override
	protected void append(ILoggingEvent event) {
		SpiderContext context = SpiderContextHolder.get();
		if(context instanceof SpiderWebSocketContext){
			SpiderWebSocketContext socketContext = (SpiderWebSocketContext) context;
			socketContext.log(new SpiderLog(event.getLevel().levelStr,event.getMessage(),event.getArgumentArray()));
		}
	}
}
