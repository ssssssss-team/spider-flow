package org.spiderflow.oss.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.oss.model.Oss;
import org.spiderflow.oss.model.OssFile;

import com.aliyun.oss.OSSClient;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.OSSObjectSummary;
import com.aliyun.oss.model.ObjectListing;
import com.aliyun.oss.model.PutObjectResult;

public class OSSUtil {
	
	/**
	 * 
	 * @Title: getOSSClient 
	 * @Description: 获取oss客户端 
	 * @return OSSClient oss客户端 
	 * @throws
	 */
	public static OSSClient getOSSClient(Oss oss) {
		return new OSSClient(oss.getEndpoint(), oss.getAccessKeyId(), oss.getAccessKeySecret());
	}

	/**
	 * 
	 * @Title: uploadByNetworkStream 
	 * @Description: 通过网络流上传文件
	 * @param ossClient 	oss客户端 
	 * @param url 			URL 
	 * @param bucketName 	bucket名称 
	 * @param objectName 	上传文件目录和（包括文件名）例如“test/index.html” 
	 * @return void 		返回类型
	 * @throws
	 */
	public static void uploadByNetworkStream(OSSClient ossClient, URL url, String bucketName, String objectName) {
		try {
			InputStream inputStream = url.openStream();
			ossClient.putObject(bucketName, objectName, inputStream);
			ossClient.shutdown();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}
	}

	/**
	 * 
	 * @Title: uploadByInputStream 
	 * @Description: 通过输入流上传文件
	 * @param ossClient 	oss客户端 
	 * @param inputStream 	输入流 
	 * @param bucketName 	bucket名称
	 * @param objectName 	上传文件目录和（包括文件名） 例如“test/a.jpg” 
	 * @return void 		返回类型 
	 * @throws
	 */
	public static PutObjectResult uploadByInputStream(OSSClient ossClient, InputStream inputStream, String bucketName,
			String objectName) {
		try {
			return ossClient.putObject(bucketName, objectName, inputStream);
		} catch (Exception e) {
			throw e;
		} finally {
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}
	}

	/**
	 * 
	 * @Title: uploadByFile 
	 * @Description: 通过file上传文件 
	 * @param ossClient 	oss客户端 
	 * @param file 			上传的文件 
	 * @param bucketName 	bucket名称
	 * @param objectName 	上传文件目录和（包括文件名） 例如“test/a.jpg” 
	 * @return void 		返回类型
	 * @throws
	 */
	public static void uploadByFile(OSSClient ossClient, File file, String bucketName, String objectName) {
		try {
			ossClient.putObject(bucketName, objectName, file);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}
	}


	/**
	 * 
	    * @Title: deleteFile  
	    * @Description: 根据key删除oss服务器上的文件
	    * @param ossClient		oss客户端 
	    * @param bucketName		bucket名称 
	    * @param key    		文件路径/名称，例如“test/a.txt”
	    * @return void    		返回类型  
	    * @throws
	 */
	public static void deleteFile(Oss oss, String key, SpiderContext context) {
		OSSClient ossClient = getOSSClient(oss);
		try {
			ossClient.deleteObject(oss.getBucketName(), key);
		} catch (Exception e) {
			context.error("OSS删除出错,异常信息:{}", e);
		} finally {
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}
	}

	/**
	 * 
	 * @Title: getInputStreamByOSS 
	 * @Description:根据key获取服务器上的文件的输入流 
	 * @param ossClient 	oss客户端  
	 * @param bucketName 	bucket名称 
	 * @param key 			文件路径和名称 
	 * @return InputStream 	文件输入流
	 * @throws
	 */
	public static InputStream getInputStreamByOSS(OSSClient ossClient, String bucketName, String key) {
		InputStream content = null;
		try {
			OSSObject ossObj = ossClient.getObject(bucketName, key);
			content = ossObj.getObjectContent();
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return content;
	}

	/**
	 * 
	    * @Title: queryAllObject  
	    * @Description: 查询某个bucket里面的所有文件
	    * @param ossClient		oss客户端
	    * @param bucketName		bucket名称
	    * @return List<String>  文件路径和大小集合  
	    * @throws
	 */
	public static List<String> queryAllObject(OSSClient ossClient, String bucketName) {
		List<String> results = new ArrayList<String>();
		try {
			// ossClient.listObjects返回ObjectListing实例，包含此次listObject请求的返回结果。
			ObjectListing objectListing = ossClient.listObjects(bucketName);
			// objectListing.getObjectSummaries获取所有文件的描述信息。
			for (OSSObjectSummary objectSummary : objectListing.getObjectSummaries()) {
				results.add(" - " + objectSummary.getKey() + "  " + "(size = " + objectSummary.getSize() + ")");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}
		return results;
	}
	
	/**
	 * 上传文件到oss
	 */
	public static OssFile uploadFileToOss(Oss oss,byte[] file,String filePath,SpiderContext context){
		OssFile ossFile = new OssFile();
		try {
	        OSSUtil.uploadByInputStream(getOSSClient(oss), new ByteArrayInputStream(file), oss.getBucketName(), filePath);
	        ossFile.setSize(file.length);
	        ossFile.setPath(filePath);
	        ossFile.setUrl("https://"+oss.getBucketName()+"."+oss.getEndpoint()+"/"+filePath);
	        String[] fps = filePath.split("/");
	        ossFile.setName(fps[fps.length-1]);
	        return ossFile;
		} catch (Exception e) {
			context.error("OSS上传出错,异常信息:{}",e);
		}
		return null;
	}
	
}