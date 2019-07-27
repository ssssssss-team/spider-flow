package org.spiderflow.core.freemarker.functions;

import java.util.List;

import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;

import freemarker.template.TemplateModelException;
/**
 * 封装Json数组的选择器方法类
 * @author Administrator
 *
 */
@Component
public class JsonArrayFunction extends FreemarkerTemplateMethodModel {
	/**
	 * 传入参数不为空且仅有一个时 取出index=0放入JSONArray并返回
	 * throws TemplateModelException 模版模型异常   删了也不报错不知道为什么要加 为了安全?防止因为泛型乱传参?
	 * return jsonArray Json数组
	 */
	@Override
	public Object process(List<?> args) throws TemplateModelException {
		if (args != null && args.size() == 1) {
			String content = getStringValue(args.get(0));
			JSONArray jsonArray = JSONArray.parseArray(content);
			return jsonArray;
		}
		return null;
	}

	@Override
	public String getFunctionName() {
		return "jsonarray";
	}

}
