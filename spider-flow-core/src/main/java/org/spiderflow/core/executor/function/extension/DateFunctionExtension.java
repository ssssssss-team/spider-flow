package org.spiderflow.core.executor.function.extension;

import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.spiderflow.executor.FunctionExtension;
import org.springframework.stereotype.Component;

@Component
public class DateFunctionExtension implements FunctionExtension{

	@Override
	public Class<?> support() {
		return Date.class;
	}
	
	public static String format(Date date){
		return format(date, "yyyy-MM-dd HH:mm:ss");
	}
	
	public static String format(Date date,String pattern){
		return DateFormatUtils.format(date,pattern);
	}
}
