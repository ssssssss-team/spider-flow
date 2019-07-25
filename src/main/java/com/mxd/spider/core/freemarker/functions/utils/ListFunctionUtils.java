package com.mxd.spider.core.freemarker.functions.utils;

import java.util.ArrayList;
import java.util.List;

public class ListFunctionUtils {

	public static int length(List<?> list){
		return list != null ? list.size() : 0;
	}
	
	public static List<List<?>> split(List<?> list,int len){
		List<List<?>> result = new ArrayList<>();
		if (list == null || list.size() == 0 || len < 1) {
			return result;
		}
		int size = list.size();
		int count = (size + len - 1) / len;
		for (int i = 0; i < count; i++) {
			List<?> subList = list.subList(i * len, ((i + 1) * len > size ? size : len * (i + 1)));
			result.add(subList);
		}
		return result;
	}
	
	public static List<?> sublist(List<?> list,int fromIndex,int toIndex){
		return list!= null ? list.subList(fromIndex, toIndex) : new ArrayList<>();
	}
	
}
