package com.mxd.spider.core.freemarker.functions.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;

import org.apache.commons.io.IOUtils;

public class FileFunctionUtils {

	private static File getFile(String path, boolean createDirectory) {
		File f = new File(path);
		if (createDirectory && !f.getParentFile().exists()) {
			f.mkdirs();
		}
		return f;
	}

	public static void write(String path, String content, boolean append) throws IOException {
		write(path, content, Charset.defaultCharset().name(), append);
	}

	public static void write(String path, String content, String charset, boolean append) throws IOException {
		write(path, StringFunctionUtils.bytes(content, charset), append);
	}

	public static void write(String path, byte[] bytes, boolean append) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(getFile(path, true), append)) {
			fos.write(bytes);
			fos.flush();
		}
	}

	public static void write(String path, String content) throws IOException {
		if (content.indexOf("http") != -1) {
			urlByWrite(path, content);
		} else {
			write(path, content, false);
		}
	}

	public static void write(String path, String content, String charset) throws IOException {
		write(path, content, charset, false);
	}

	public static void urlByWrite(String path, String urls) throws IOException {
		URL url = new URL(urls);
		// 打开连接
		URLConnection con = url.openConnection();
		// 设置请求超时为5s
		con.setConnectTimeout(5 * 1000);
		InputStream is = con.getInputStream();
		// 开始读取
		ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
		byte[] buff = new byte[100]; // buff用于存放循环读取的临时数据
		int rc = 0;
		while ((rc = is.read(buff, 0, 100)) > 0) {
			swapStream.write(buff, 0, rc);
		}
		write(path, swapStream.toByteArray());
		// 完毕，关闭所有链接
		is.close();
	}

	public static void write(String path, byte[] bytes) throws IOException {
		write(path, bytes, false);
	}

	public static byte[] bytes(String path) throws IOException {
		try (FileInputStream fis = new FileInputStream(getFile(path, false))) {
			return IOUtils.toByteArray(fis);
		}
	}

	public static String string(String path, String charset) throws IOException {
		return StringFunctionUtils.newString(bytes(path), charset);
	}

	public static String string(String path) throws IOException {
		return StringFunctionUtils.newString(bytes(path), Charset.defaultCharset().name());
	}

}
