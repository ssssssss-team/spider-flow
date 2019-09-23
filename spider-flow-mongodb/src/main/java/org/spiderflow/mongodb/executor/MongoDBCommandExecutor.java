package org.spiderflow.mongodb.executor;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.Shape;
import org.spiderflow.model.SpiderNode;
import org.spiderflow.mongodb.utils.MongoDBUtils;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

/**
 * 命令
 * @author xuan
 *
 */
@Component
public class MongoDBCommandExecutor implements ShapeExecutor {

private static Logger logger = LoggerFactory.getLogger(MongoDBCommandExecutor.class);
	
	public static final String DATASOURCE_ID = "datasourceId";
	
	public static final String MONGODB_SQL = "sql";
	
	public static final String MONGODB_OPERATION_TYPE = "operationType";
	
	public static final String MONGODB_COMMAND_VAR = "___mongoDB";
	
	public static final String OPERATION_INSERT = "insert";
	public static final String OPERATION_DELETE = "delete";
	public static final String OPERATION_UPDATE = "update";
	public static final String OPERATION_SELECT = "select";
	
	DBCollection dbCollection = null;
	
	@Override
	public String supportShape() {
		// TODO Auto-generated method stub
		return "mongodbcommand";
	}
	
	@Override
	public Shape shape() {
		Shape shape = new Shape();
		shape.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC9UlEQVRYR+2YP0zUUBjAf9+RKJPgQK6THptxERPiZOTUxEUj/tlMjCS62xoT3YARl5bJTXByBGcHISQmxhjQ6A6TPRg8JrnE62de6Z0Htne9XhMw4W1N3/u+X7//rwJgzeokygRQMs+HYSksBsr0liNrYrk6gTB3GMBiGNZ9W4al6OqiCOOqfFGYKkD1oIEVRkRwQw5l2FhyCWEMZdp3ZOqgARv6LU/1CDIPbxxZMg8rhmUxj5gcdHWw6khiJSh6+lVgAGXMd2S90/79H9czpOXpd+CsKk7FEe8fBab2whwCdeF6n/ISOFUPuLT1RFbSWLsnSMvTOVUmREJVM74tz1uVGov1C6tR9/rs2zJqefoL6FfYDpSy6SKdQDNDGkAI2yeqvKk4ci/GilMIk40aZ1w95OpIQVgWOKFQDZTLnUAzQbYCorz2HQlhW5flakmFVYFBVWYrjtiN9yEoLIkwkAa0a0jL0x8m4SLrxAKGGenqPMIDVbZrUNqfWE1Qk1AFqAc83HLkVZzrs0AGgKhQDwJG41xluVpGeB99SGKLtTx9i3LTJFUAC5u23MkFcsjTZwWYFjie5CrLUwNYRtnwHYkd+fbENHyr/eZG9als5AJphLSLqdZxL1BubzqyGFP3mkmXFNN74jtrMW8FRdgB7u4EfGiWHGXZd6QcA7iCcBEz1yQkXa7F3ID2wUeEY0HATJ9wRoVxo6SunI+N18gqCu8qtlzrVCNzaYtFVx8BVwJ4UYB5Ec4pfKrYciEOoOiqjXC1ptxv10pzcXccQBQC5VqdhaQkSGO5XN2dRWGWM13XySxKej1zBNmrBRvnYy25fyDIS1kWOdG49zNqseG92xPhcSRsqWuhgoXSn3jOFH3F71Kuaatha91RTpp7d0lhzYxQXQra3W66yO4AHL86vW+nNOpOofgI9JaZAzOAmt80p9tAmgFivlu5Aaw1ZoB2Nkglt/kHJNmSsf08lfBoU2pIy9W/14JuNCTs9e3olpRC1n8B+Qd0Dhp9ddQMugAAAABJRU5ErkJggg==");
		shape.setLabel("mongodbcommand");
		shape.setName("mongodbcommand");
		shape.setTitle("mongoDB执行语句");
		return shape;
	}
	
	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		String datasourceId = node.getStringJsonValue(DATASOURCE_ID);
		String sql = node.getStringJsonValue(MONGODB_SQL);
		String operationType = node.getStringJsonValue(MONGODB_OPERATION_TYPE);
		if(StringUtils.isBlank(datasourceId)){
			context.debug("mongodb数据源ID为空！");
		}else if(StringUtils.isBlank(sql)){
			context.debug("mongodb命令为空！");
		} else if(StringUtils.isBlank(operationType)){
			context.debug("mongodb命令类型为空！");
		} else {
			dbCollection = (DBCollection) context.get(MongoDBExecutor.MONGODB_CONTEXT_KEY + datasourceId);
			DBCursor db = mongoDBOperation(sql,operationType);
			MongoDBUtils.analysisJSON(variables,db);
		}
	}
	public DBCursor mongoDBOperation(String sql,String operateType){
		
		DBObject user_json = null;
		if(!operateType.equals(OPERATION_UPDATE))
			user_json = (DBObject)JSON.parse(sql);
		
		switch(operateType){
			case OPERATION_INSERT :
				dbCollection.insert(user_json);
				break;
			case OPERATION_DELETE :
				dbCollection.remove(user_json);
				break;
			case OPERATION_UPDATE :
				String[] strArr = sql.split("\\}\\,\\{");
				dbCollection.update((DBObject)JSON.parse(strArr[0]+"}"),(DBObject)JSON.parse("{"+strArr[1]));
				break;
			case OPERATION_SELECT :
				return dbCollection.find(user_json);
		}
		
		return null;
	}
}
