package org.spiderflow.core.job;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.helpers.MessageFormatter;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.model.SpiderLog;

public class SpiderJobContext extends SpiderContext{

	private static final long serialVersionUID = 9099787449108938453L;
	
	private static Logger logger = LoggerFactory.getLogger(SpiderJobContext.class);
	
	private OutputStream outputstream;

	public SpiderJobContext(OutputStream outputstream) {
		super();
		this.outputstream = outputstream;
	}
	
	public void close(){
		try {
			this.outputstream.close();
		} catch (Exception e) {
		}
	}

	public OutputStream getOutputstream(){
		return this.outputstream;
	}
	
	public static SpiderJobContext create(String directory,String file){
		OutputStream os = null;
		try {
			File dirFile = new File(directory);
			if(!dirFile.exists()){
				dirFile.mkdirs();
			}
			os = new FileOutputStream(new File(directory,file), true);
		} catch (Exception e) {
			logger.error("创建日志文件出错",e);
		}
		return new SpiderJobContext(os);
	}
}
