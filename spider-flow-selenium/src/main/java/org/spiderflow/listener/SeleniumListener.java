package org.spiderflow.listener;

import org.spiderflow.context.SpiderContext;
import org.spiderflow.utils.WebDriverHolder;
import org.springframework.stereotype.Component;

@Component
public class SeleniumListener implements SpiderListener{
	
	@Override
	public void beforeStart(SpiderContext context) {
		
	}

	@Override
	public void afterEnd(SpiderContext context) {
		WebDriverHolder.clear(context);
	}

}
