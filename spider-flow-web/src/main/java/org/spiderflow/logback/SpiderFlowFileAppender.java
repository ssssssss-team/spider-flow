package org.spiderflow.logback;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.FileAppender;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.context.SpiderContextHolder;
import org.spiderflow.core.job.SpiderJobContext;

import java.io.OutputStream;

public class SpiderFlowFileAppender extends FileAppender<ILoggingEvent> {

	private OutputStream baseOutputStream;

	@Override
	protected void subAppend(ILoggingEvent event) {
		SpiderContext context = SpiderContextHolder.get();
		if(context instanceof SpiderJobContext){
			SpiderJobContext jobContext = (SpiderJobContext) context;
			if(jobContext.getOutputstream() != getOutputStream()){
				super.setOutputStream(jobContext.getOutputstream());
			}
		}else if(baseOutputStream != getOutputStream()){
			super.setOutputStream(baseOutputStream);
		}
		super.subAppend(event);
	}

	@Override
	public void setOutputStream(OutputStream outputStream) {
		if(baseOutputStream == null){
			baseOutputStream = outputStream;
		}
		super.setOutputStream(outputStream);
	}
}
