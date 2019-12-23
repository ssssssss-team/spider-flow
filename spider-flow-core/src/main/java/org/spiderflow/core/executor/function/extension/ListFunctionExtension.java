package org.spiderflow.core.executor.function.extension;

import org.apache.commons.lang3.StringUtils;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;


@Component
public class ListFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return List.class;
	}
	
	@Comment("获取list的长度")
	@Example("${listVar.length()}")
	public static int length(List<?> list){
		return list.size();
	}
	
	@Comment("将list拼接起来")
	@Example("${listVar.join()}")
	public static String join(List<?> list){
		return StringUtils.join(list.toArray());
	}
	
	@Comment("将list用separator拼接起来")
	@Example("${listVar.join('-')}")
	public static String join(List<?> list,String separator){
		if(list.size() == 1){
			return list.get(0).toString();
		}else{
			return StringUtils.join(list.toArray(),separator);
		}
	}

	@Comment("将list<String>排序")
	@Example("${listVar.sort()}")
	public static List<String> sort(List<String> list){
		Collections.sort(list);
		return list;
	}

	@Comment("将list打乱顺序")
	@Example("${listVar.shuffle()}")
	public static List<?> shuffle(List<?> list){
		Collections.shuffle(list);
		return list;
	}
	
}
