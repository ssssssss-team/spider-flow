package org.spiderflow.core.executor.function;

import org.apache.commons.lang3.RandomUtils;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

/**
 * 随机数/字符串 生成方法 
 * @author Administrator
 *
 */
@Component
public class RandomFunctionExecutor implements FunctionExecutor{
	
	@Override
	public String getFunctionPrefix() {
		return "random";
	}
	
	public static int randomInt(int min,int max){
		return RandomUtils.nextInt(min, max);
	}
	
	public static double randomDouble(double min,double max){
		return RandomUtils.nextDouble(min, max);
	}
	
	public static long randomLong(long min,long max){
		return RandomUtils.nextLong(min, max);
	}
	
	/**
	 * 
	 * @param chars 字符个数
	 * @param length 字符范围
	 * @return String 随机字符串
	 */
	public static String string(String chars,int length){
		if (chars != null) {
			char[] newChars = new char[length];
			int len = chars.length();
			for (int i = 0; i < length; i++) {
				newChars[i] = chars.charAt(randomInt(0,len));
			}
			return new String(newChars);
		}
		return null;
	}
	
}
