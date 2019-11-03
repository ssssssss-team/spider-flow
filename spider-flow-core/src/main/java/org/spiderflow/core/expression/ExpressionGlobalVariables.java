package org.spiderflow.core.expression;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ExpressionGlobalVariables {

	private static Map<String, Object> variables = new HashMap<>();

	private static ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();

	public static void reset(Map<String, Object> map){
		Lock lock = readWriteLock.writeLock();
		lock.lock();
		try {
			variables.clear();
			variables.putAll(map);
		} finally {
			lock.unlock();
		}
	}

	public static Map<String, Object> getVariables(){
		Lock lock = readWriteLock.readLock();
		lock.lock();
		try {
			return variables;
		} finally {
			lock.unlock();
		}
	}
}
