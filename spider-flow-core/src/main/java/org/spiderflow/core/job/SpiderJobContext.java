package org.spiderflow.core.job;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.model.SpiderOutput;

public class SpiderJobContext extends SpiderContext{

	private static final long serialVersionUID = 9099787449108938453L;
	
	private static Logger logger = LoggerFactory.getLogger(SpiderJobContext.class);
	
	private OutputStream outputstream;

	private List<SpiderOutput> outputs = new ArrayList<>();

	private boolean output;

	public SpiderJobContext(OutputStream outputstream,boolean output) {
		super();
		this.outputstream = outputstream;
		this.output = output;
	}
	
	public void close(){
		try {
			this.outputstream.close();
		} catch (Exception e) {
		}
	}

	@Override
	public void addOutput(SpiderOutput output) {
		if(this.output){
			synchronized (this.outputs){
				this.outputs.add(output);
			}
		}
	}

	@Override
	public List<SpiderOutput> getOutputs() {
		return outputs;
	}

	public OutputStream getOutputstream(){
		return this.outputstream;
	}
	
	public static SpiderJobContext create(String directory,String id,Integer taskId,boolean output){
		OutputStream os = null;
		try {
			File file = new File(new File(directory),id + File.separator + "logs" + File.separator + taskId + ".log");
			File dirFile = file.getParentFile();
			if(!dirFile.exists()){
				dirFile.mkdirs();
			}
			os = new FileOutputStream(file, true);
		} catch (Exception e) {
			logger.error("创建日志文件出错",e);
		}
		SpiderJobContext context = new SpiderJobContext(os, output);
		context.setFlowId(id);
		return context;
	}
}
