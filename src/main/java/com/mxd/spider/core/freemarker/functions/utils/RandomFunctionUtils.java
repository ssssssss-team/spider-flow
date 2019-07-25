package com.mxd.spider.core.freemarker.functions.utils;

import org.apache.commons.lang3.RandomUtils;

public class RandomFunctionUtils {
	
	public static int randomInt(int min,int max){
		return RandomUtils.nextInt(min, max);
	}
	
	public static double randomDouble(double min,double max){
		return RandomUtils.nextDouble(min, max);
	}
	
	public static long randomLong(long min,long max){
		return RandomUtils.nextLong(min, max);
	}
	
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
