package org.spiderflow.mongodb.executor;
import java.util.ArrayList;
import java.util.List;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoBulkWriteException;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.WriteResult;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
public class MongoDBJDBC{
	
	static DB mongoConn = null;
	
	public static void main( String args[] ){
		try{
			List<MongoCredential> credentials = new ArrayList<MongoCredential>();
        	//连接到MongoDB服务 如果是远程连接可以替换“localhost”为服务器所在IP地址                
        	//ServerAddress()两个参数分别为 服务器地址 和 端口                
        	ServerAddress serverAddress = new ServerAddress("localhost",27017);                
        	List<ServerAddress> addrs = new ArrayList<ServerAddress>();                
        	addrs.add(serverAddress);                                
        	//MongoCredential.createScramSha1Credential()三个参数分别为 用户名 数据库名称 密码              xuanmi
        	MongoCredential credential = MongoCredential.createScramSha1Credential("admin", "admin", "xuanmi123".toCharArray());                
        	credentials.add(credential);                                
        	//通过连接认证获取MongoDB连接
        	MongoClient mongoClient = new MongoClient(addrs,credentials);
        	DB db = mongoClient.getDB("xuanxiaoli");
        	DBCollection con = db.getCollection("xuanxiaoli");
        	//查询条件sql
        	@SuppressWarnings("deprecation")//{"name":"C1"}
			DBObject user_json = (DBObject)JSON.parse("{\"name\":\"AA12\"}");//"db.xuanxiaoli.insert({name:'C2'})"
        	//WriteResult insert = con.insert(user_json);
        	DBCursor query =  con.find(user_json);
        	while(query.hasNext()){
        		System.out.println(query.next().toString());
    		}
            System.out.println("Connect to database successfully");
		} catch (MongoBulkWriteException e){         
			System.err.println( e.getClass().getName() + ": " + e.getMessage() );       
		} finally {
			
		}
	}
}