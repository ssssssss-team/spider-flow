package org.spiderflow.core.executor.function;

import java.text.ParseException;
import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

/**
 * 时间获取/格式化 工具类 防止NPE 默认格式(yyyy-MM-dd HH:mm:ss)
 * @author Administrator
 *
 */
@Component
public class DateFunctionExecutor implements FunctionExecutor{
	
	@Override
	public String getFunctionPrefix() {
		return "date";
	}
	
	private static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

	@Comment("格式化日期")
	@Example("${date.format(date.now())}")
	public static String format(Date date) {
		return format(date, DEFAULT_PATTERN);
	}

	@Comment("格式化日期")
	@Example("${date.format(1569059534000l)}")
	public static String format(Long millis) {
		return format(millis, DEFAULT_PATTERN);
	}

	@Comment("格式化日期")
	@Example("${date.format(date.now(),'yyyy-MM-dd')}")
	public static String format(Date date, String pattern) {
		return date != null ? DateFormatUtils.format(date, pattern) : null;
	}

	@Comment("格式化日期")
	@Example("${date.format(1569059534000l,'yyyy-MM-dd')}")
	public static String format(Long millis, String pattern) {
		return millis != null ? DateFormatUtils.format(millis, pattern) : null;
	}
	
	@Comment("字符串转为日期类型")
	@Example("${date.parse('2019-01-01 00:00:00')}")
	public static Date parse(String date) throws ParseException{
		return date != null ? DateUtils.parseDate(date, DEFAULT_PATTERN) : null;
	}
	
	@Comment("字符串转为日期类型")
	@Example("${date.parse('2019-01-01','yyyy-MM-dd')}")
	public static Date parse(String date,String pattern) throws ParseException{
		return date != null ? DateUtils.parseDate(date, pattern) : null;
	}

	@Comment("数字为日期类型")
	@Example("${date.parse(1569059534000l)}")
	public static Date parse(Long millis){
		return new Date(millis);
	}
	
	@Comment("获取当前时间")
	@Example("${date.now()}")
	public static Date now(){
		return new Date();
	}
	
	@Comment("获取指定日期n年后的日期")
	@Example("${date.addYears(date.now(),2)}")
	public static Date addYears(Date date,int amount){
		return DateUtils.addYears(date, amount);
	}
	
	@Comment("获取指定日期n月后的日期")
	@Example("${date.addMonths(date.now(),2)}")
	public static Date addMonths(Date date,int amount){
		return DateUtils.addMonths(date, amount);
	}
	
	@Comment("获取指定日期n天后的日期")
	@Example("${date.addDays(date.now(),2)}")
	public static Date addDays(Date date,int amount){
		return DateUtils.addDays(date, amount);
	}
	
	@Comment("获取指定日期n小时后的日期")
	@Example("${date.addHours(date.now(),2)}")
	public static Date addHours(Date date,int amount){
		return DateUtils.addHours(date, amount);
	}
	
	@Comment("获取指定日期n分钟后的日期")
	@Example("${date.addMinutes(date.now(),2)}")
	public static Date addMinutes(Date date,int amount){
		return DateUtils.addMinutes(date, amount);
	}
	
	@Comment("获取指定日期n秒后的日期")
	@Example("${date.addSeconds(date.now(),2)}")
	public static Date addSeconds(Date date,int amount){
		return DateUtils.addSeconds(date, amount);
	}
}
