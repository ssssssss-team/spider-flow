package org.spiderflow.mongodb.web;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.spiderflow.model.JsonBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.MongoBulkWriteException;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

@RestController
@RequestMapping("/mongo")
public class MongoDBController {
	
	/**
	 * 
	 * @param host 地址
	 * @param port 端口
	 * @param adminName 用户名
	 * @param database 数据库名
	 * @param password 密码
	 */
	@RequestMapping("/connTest")
	public JsonBean<String> test(String host,Integer port,String adminName,String table,String database,String password){
		
		MongoClient mongoClient = new MongoClient();
		
		try{
			List<MongoCredential> credentials = new ArrayList<MongoCredential>();
        	ServerAddress serverAddress = new ServerAddress(host,port);
        	
        	List<ServerAddress> addrs = new ArrayList<ServerAddress>();                
        	addrs.add(serverAddress);                                
        	//MongoCredential.createScramSha1Credential()三个参数分别为 用户名 数据库名称 密码              
        	MongoCredential credential = MongoCredential.createScramSha1Credential(adminName, database, password.toCharArray());                
        	credentials.add(credential);
        	
        	MongoClientOptions options = setBuild();
        	//通过连接认证获取MongoDB连接 
        	mongoClient = new MongoClient(addrs,credentials,options);
        	//连接到数据库               
        	MongoDatabase mongoDatabase = mongoClient.getDatabase(table);
        	//数据传输查询是否连接成功
        	MongoCollection<Document> doc = mongoDatabase.getCollection(table);
        	try {
        		doc.count() ;
			} catch (Exception e) {
				return new JsonBean<String>(0,e.getMessage());
			}
        	return new JsonBean<String>(1,"测试成功");
		} catch (MongoBulkWriteException e){
			return new JsonBean<String>(0,e.getMessage());
		} finally {
			mongoClient.close();
		}
	}
	
	public MongoClientOptions setBuild(){
		
			MongoClientOptions.Builder build = new MongoClientOptions.Builder();
			build.connectionsPerHost(1000);
			build.threadsAllowedToBlockForConnectionMultiplier(20);
			build.connectTimeout(1000);
			build.maxWaitTime(1000);
			build.socketTimeout(1000);
			
		return build.build();
	}
}
