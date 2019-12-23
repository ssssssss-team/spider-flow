package org.spiderflow.context;

import com.alibaba.ttl.TransmittableThreadLocal;

public class SpiderContextHolder {

	private static final ThreadLocal<SpiderContext> THREAD_LOCAL = new TransmittableThreadLocal<>();

	public static SpiderContext get() {
		return THREAD_LOCAL.get();
	}

	public static void set(SpiderContext context) {
		THREAD_LOCAL.set(context);
	}

	public static void remove() {
		THREAD_LOCAL.remove();
	}


}
