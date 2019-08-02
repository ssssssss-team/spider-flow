package org.spiderflow.core.freemarker.functions.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * List 工具类 防止NPE 添加了类似python的split()方法 
 * @author Administrator
 *
 */
public class ListFunctionUtils {

	public static int length(List<?> list){
		return list != null ? list.size() : 0;
	}
	
	/**
	 * 
	 * @param list 原List
	 * @param len 按多长进行分割
	 * @return List<List<?>> 分割后的数组
	 */
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
