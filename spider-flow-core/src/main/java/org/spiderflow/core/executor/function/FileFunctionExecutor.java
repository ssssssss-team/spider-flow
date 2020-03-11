package org.spiderflow.core.executor.function;

import java.io.*;
import java.nio.charset.Charset;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.core.utils.FileUtils;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

/**
 * 文件读写 工具类 防止NPE 
 * @author Administrator
 *
 */
@Component
@Comment("file常用方法")
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

	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.html,false)}")
	public static void write(String path,String content,boolean append) throws IOException{
		write(path,content,Charset.defaultCharset().name(),append);
	}
	
	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.html,'UTF-8',false)}")
	public static void write(String path,String content,String charset,boolean append) throws IOException{
		write(path,StringFunctionExecutor.bytes(content, charset),append);
	}
	
	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.bytes,false)}")
	public static void write(String path,byte[] bytes,boolean append) throws IOException{
		write(path, new ByteArrayInputStream(bytes),append);
	}

	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.stream,false)}")
	public static void write(String path, InputStream stream, boolean append) throws IOException {
		try(FileOutputStream fos = new FileOutputStream(getFile(path,true),append)){
			IOUtils.copyLarge(stream, fos);
		}
	}

	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.bytes,false)}")
	public static void write(String path, InputStream stream) throws IOException {
		write(path, stream,false);
	}
	
	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.html)}")
	public static void write(String path,String content) throws IOException{
		write(path,content,false);
	}
	
	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.html,'UTF-8')}")
	public static void write(String path,String content,String charset) throws IOException{
		write(path,content,charset,false);
	}
	
	@Comment("写出文件")
	@Example("${file.write('e:/result.html',resp.bytes)}")
	public static void write(String path,byte[] bytes) throws IOException{
		write(path,bytes,false);
	}

	@Comment("下载Url资源")
	@Example("${file.download('e:/downloadPath',urls)}")
	public static void download(String path, List<String> urls) throws IOException{
		if(!CollectionUtils.isEmpty(urls)) {
			for (String url : urls) {
				FileUtils.downloadFile(path, url, true);
			}
		}
	}

	@Comment("下载Url资源")
	@Example("${file.download('e:/downloadPath',urls)}")
	public static void download(String path, String url) throws IOException {
		if (url != null) {
			FileUtils.downloadFile(path, url, true);
		}
	}
	
	@Comment("读取文件")
	@Example("${file.bytes('e:/result.html')}")
	public static byte[] bytes(String path) throws IOException{
		try(FileInputStream fis = new FileInputStream(getFile(path, false))){
			return IOUtils.toByteArray(fis);	
		}
	}
	
	@Comment("读取文件")
	@Example("${file.string('e:/result.html','UTF-8')}")
	public static String string(String path,String charset) throws IOException{
		return StringFunctionExecutor.newString(bytes(path), charset);
	}
	
	@Comment("读取文件")
	@Example("${file.string('e:/result.html')}")
	public static String string(String path) throws IOException{
		return StringFunctionExecutor.newString(bytes(path), Charset.defaultCharset().name());
	}
	
}
