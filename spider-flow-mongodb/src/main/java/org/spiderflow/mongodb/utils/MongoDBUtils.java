package org.spiderflow.mongodb.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;

public class MongoDBUtils {
	
	public static DBCollection createMongoDBTemplate(String host,int port,String database,String table,String adminName,String password){
		List<MongoCredential> credentials = new ArrayList<MongoCredential>();
    	ServerAddress serverAddress = new ServerAddress(host,port);                
    	List<ServerAddress> addrs = new ArrayList<ServerAddress>();                
    	addrs.add(serverAddress);                                
    	//MongoCredential.createScramSha1Credential()
    	MongoCredential credential = MongoCredential.createScramSha1Credential(adminName, database, password.toCharArray());                
    	credentials.add(credential);                                
    	//通过连接认证获取MongoDB连接
    	MongoClient mongoClient = new MongoClient(addrs,credentials);
    	DB db = mongoClient.getDB(table);
    	DBCollection con = db.getCollection(table);
    	return con;
    	/*//连接到数据库
    	@SuppressWarnings("deprecation")
		DBObject user_json = (DBObject)JSON.parse("{'$or' : [{\"name\":\"AA12\"},{\"name\":\"BB123\"}]}");//,\"age\":\"20\"
    	//con.insert(user_json);
    	DBCursor query =  con.find(user_json);*/
	}
	
	public static void analysisJSON(Map<String, Object> variables,DBCursor db){
		
		while(db.hasNext()){
			JSONObject jsonObject1=JSON.parseObject(db.next().toString());//将json字符串转换为json对象
			for (Map.Entry<String, Object> entry : jsonObject1.entrySet()) {
			System.out.println(entry.getKey()+"------"+entry.getValue());
				if(variables.containsKey(entry.getKey())){
					List<String> rsStr = (List<String>) variables.get(entry.getKey());
					rsStr.add(entry.getValue().toString());
					variables.put(entry.getKey(),rsStr);
				} else {
					List<String> str = new ArrayList<String>();
					str.add(entry.getValue().toString());
					variables.put(entry.getKey(), str);
				}
			}
		}
	}
}
