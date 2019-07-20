package com.mxd.spider.core.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Maps {

	public static <K,V> Map<K,V> add(Map<K,V> srcMap,K k,V v){
		HashMap<K, V> destMap = new HashMap<>(srcMap);
		destMap.put(k, v);
		return destMap;
	}
	
	public static <K,V> Map<K,V> add(Map<K,V> srcMap,List<K> ks,List<V> vs){
		HashMap<K, V> destMap = new HashMap<>(srcMap);
		if(ks != null && vs != null && ks.size() == vs.size()){
			int size = ks.size();
			for (int i = 0; i < size; i++) {
				destMap.put(ks.get(0), vs.get(0));
			}
		}
		return destMap;
	}
}
