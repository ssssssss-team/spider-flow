package org.spiderflow.mongodb.utils;

import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class FastJsonUtil {
    public static String ObjectToString(Object o) {
        String s = JSON.toJSONString(o);
        return TrimDoubleQuote(s);
    }
    
    private static String TrimDoubleQuote(String s) {
        if (s.startsWith("\"") && s.endsWith("\"")) {
            s = s.substring(1, s.length());
            s = s.substring(0, s.length() - 1);
        }
        return s;
    }
    public static void main(String[] args) {
		String str = "{\"_id\": {\"$oid\": \"5d6f5e1a76ab0c15d8901786\"}, \"name\": \"BB123\", \"age\": \"20\"}";
		JSONObject jsonObject1=JSON.parseObject(str);//将json字符串转换为json对象
		for (Map.Entry<String, Object> entry : jsonObject1.entrySet()) {
            System.out.println(entry.getKey() + ":" + entry.getValue());
        }
	}
}