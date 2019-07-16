package com.mxd.spider.core.utils;

import java.util.HashMap;
import java.util.Map;

public class Maps {

	public static <K,V> Map<K,V> add(Map<K,V> srcMap,K k,V v){
		HashMap<K, V> destMap = new HashMap<>(srcMap);
		destMap.put(k, v);
		return destMap;
	}
}
