package org.spiderflow.core.executor.function;

import java.util.ArrayList;
import java.util.List;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

/**
 * List 工具类 防止NPE 添加了类似python的split()方法 
 * @author Administrator
 *
 */
@Component
@Comment("list常用方法")
public class ListFunctionExecutor implements FunctionExecutor{
	
	@Override
	public String getFunctionPrefix() {
		return "list";
	}

	@Comment("获取list的长度")
	@Example("${list.length(listVar)}")
	public static int length(List<?> list){
		return list != null ? list.size() : 0;
	}
	
	/**
	 * 
	 * @param list 原List
	 * @param len 按多长进行分割
	 * @return List<List<?>> 分割后的数组
	 */
	@Comment("分割List")
	@Example("${list.split(listVar,10)}")
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
	
	@Comment("截取List")
	@Example("${list.sublist(listVar,fromIndex,toIndex)}")
	public static List<?> sublist(List<?> list,int fromIndex,int toIndex){
		return list!= null ? list.subList(fromIndex, toIndex) : new ArrayList<>();
	}
		
}
