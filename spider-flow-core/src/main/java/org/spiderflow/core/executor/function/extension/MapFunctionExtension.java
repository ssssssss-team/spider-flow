package org.spiderflow.core.executor.function.extension;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MapFunctionExtension implements FunctionExtension {

	@Override
	public Class<?> support() {
		return Map.class;
	}

	@Comment("将map转换为List")
	@Example("${mapmVar.toList('=')}")
	public static List<String> toList(Map<?,?> map,String separator){
		return map.entrySet().stream().map(entry-> entry.getKey() + separator + entry.getValue()).collect(Collectors.toList());
	}
}
