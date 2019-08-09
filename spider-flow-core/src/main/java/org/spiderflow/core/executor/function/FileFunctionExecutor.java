package org.spiderflow.core.executor.function;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;

import org.apache.commons.io.IOUtils;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

/**
 * 文件读写 工具类 防止NPE 
 * @author Administrator
 *
 */
@Component
public class FileFunctionExecutor implements FunctionExecutor{
	
	@Override
	public String getFunctionPrefix() {
		return "file";
	}
	
	/**
	 * 
	 * @param path 文件路径/名
	 * @param createDirectory 是否需要创建
	 * @return File 文件
	 */
	private static File getFile(String path,boolean createDirectory){
		File f = new File(path);
		if(createDirectory&&!f.getParentFile().exists()){
			f.getParentFile().mkdirs();
		}
		return f;
	}

	public static void write(String path,String content,boolean append) throws IOException{
		write(path,content,Charset.defaultCharset().name(),append);
	}
	
	public static void write(String path,String content,String charset,boolean append) throws IOException{
		write(path,StringFunctionExecutor.bytes(content, charset),append);
	}
	
	public static void write(String path,byte[] bytes,boolean append) throws IOException{
		try(FileOutputStream fos = new FileOutputStream(getFile(path,true),append)){
			fos.write(bytes);
			fos.flush();
		}
	}
	
	public static void write(String path,String content) throws IOException{
		write(path,content,false);
	}
	
	public static void write(String path,String content,String charset) throws IOException{
		write(path,content,charset,false);
	}
	
	public static void write(String path,byte[] bytes) throws IOException{
		write(path,bytes,false);
	}
	
	public static byte[] bytes(String path) throws IOException{
		try(FileInputStream fis = new FileInputStream(getFile(path, false))){
			return IOUtils.toByteArray(fis);	
		}
	}
	
	public static String string(String path,String charset) throws IOException{
		return StringFunctionExecutor.newString(bytes(path), charset);
	}
	
	public static String string(String path) throws IOException{
		return StringFunctionExecutor.newString(bytes(path), Charset.defaultCharset().name());
	}
	
}
