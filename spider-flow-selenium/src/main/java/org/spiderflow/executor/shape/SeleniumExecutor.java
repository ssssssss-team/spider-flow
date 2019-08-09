package org.spiderflow.executor.shape;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.openqa.selenium.Proxy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.io.SeleniumResponse;
import org.spiderflow.model.Shape;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SeleniumExecutor implements ShapeExecutor{
	
	public static final String JAVASCRIPT_ENABLED = "javascriptEnabled";
	
	public static final String URL = "url";
	
	public static final String DRIVER_VAR_NAME = "$$$driver";
	
	public static final String PAGE_LOAD_TIMEOUT = "pageLoadTimeout";
	
	public static final String IMPLICITLY_WAIT_TIMEOUT = "implicitlyWaitTimeout";
	
	public static final String PROXY = "proxy";
	
	@Autowired
	private ExpressionEngine engine;
	
	private static Logger logger = LoggerFactory.getLogger(SeleniumExecutor.class);
	
	@Override
	public Shape shape() {
		Shape shape = new Shape();
		shape.setImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADuUlEQVRIS7VWb2hbVRT/nfvyal8Ss7T5ZOskrbK5za1p4/9B65goKpUOiqJQV/FPJ1OW+kns0IqComLT6UA/ONaJ+zDQMrehm5O1q7NbhS4FQ5m4deAagqM0qUnW+N67V95rkybNe4lffB9C3j3nnt89v3Pu7zxCmef7APwqk/cQIbDkRg8JLqaIYd54EwIRmauDj0Vw1S4MWRlOBOQAlzBgBFxt5xzXGMOtxetihOnofSKiRlb7lwB81yJ3AxggIq/dqQTnZ4mx1kK7ECIBoPfJSfVg4XoRwLEWOQyiPeVoM6khSkHonMA8Jb5CDLZPqqHceh7gWFDqAKThSsFz9pqmBzA/NW7trvNt7RFtxKya8TMcgFdi8kw5WqwiudbegfSff1gkIRI6Vxt2RJAwATYMucMf7vvHlpp1L+3F2vYuKHV+M5i48Ru0uSPQ//rSPmGBIeXuWDdh3OuHLs28cSAzunVKbyvc4XB78OAXp+FZ34TpmI6foho8CuGeRgkb6iQTKHupE+B/l2YBJBSWaSCM1faD6G13Wk8efjNNBMoXrvXrCeC2LXh1KIOJK1pRkO2bZLz/lIKbEUV2+lGbTPjzhDHfCAjmyZ/9UTv/zPEb9xv/b3mhB8FX9qHr8xR+vaJbBri30YFDu1xQr71lSZcQ4ijhZ58o3H3iQAMyi7MI9A1A9XZiRzhVtrGGQ26Q9C38s/nOLPAXoyUAXbE70ToexYufzOPTU4vYfzpbFmD3wzfhtUeqsThZb+lXAtDk3IjnDkfx+kdz/xOAaxMoHsOhde/BUV2Zos92OrG98ZJNoQ2KCorsIOm8JnSzyHtruvHuxo/LFrkjKOODp50VirzcpgBfACcBRmtyZF4MnEEjuwu7h9IlnWTcha92uTGdOo6G33ts+Be9+YsGwUdBrOiieSUPzmw+ioBrMy5c1jBxWUN9LcN9tztQX8Owf74Pa+Z+QOdC3EIukFSkjH9J7Ma8YZBkKxWhuh50+B5Hm2er6d53fSe+SZ5EMpvFTNZp3WV5qTDMF71epNhV0Ao9ZXtz2XjBsx5b1NJhJsTy6ZsTS2JnPr/4OsDxn+X6ZU9LelCNuiwPwvg2pTm+Itd5p3O1YYjKA4eEWJh1VokasHxDFAC9owRj/bn30pl8ztcNLozJZrXZ3NfjoLNhuWrVyESSiIeUYNx+ZK5k4g2AS+GcCBbSIEHMppTqIl0wRM0haf1VzdcrD/0iTo1ZwVkInJY+WwhtR2Rpqt0hGQPeWBgB4weV5rjtZ8u/lJRxmM87gKsAAAAASUVORK5CYII=");
		shape.setName("selenium");
		shape.setTitle("Selenium");
		shape.setLabel("Selenium");
		return shape;
	}

	@Override
	public String supportShape() {
		return "selenium";
	}

	@Override
	public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
		DesiredCapabilities capabilities = DesiredCapabilities.htmlUnit();
		capabilities.setJavascriptEnabled("true".equals(node.getStringJsonValue(JAVASCRIPT_ENABLED)));
		String proxy = node.getStringJsonValue(PROXY);
		if(proxy != null){
			try {
				proxy = engine.execute(proxy, variables).toString();
				Proxy sProxy = new Proxy();
				sProxy.setHttpProxy(proxy);
				capabilities.setCapability(CapabilityType.PROXY, sProxy);
			} catch (Exception e) {
				context.log("设置代理出错，异常信息：" + ExceptionUtils.getStackTrace(e));
				logger.error("设置代理出错",e);
			}
		}
		//设置请求url
		String url = null;
		try {
			url = engine.execute(node.getStringJsonValue(URL), variables).toString();
			WebDriver driver = new HtmlUnitDriver(capabilities);
			//将driver对象存入变量里，供后续操作
			variables.put(DRIVER_VAR_NAME, driver);
			int pageLoadTimeout = NumberUtils.toInt(node.getStringJsonValue(PAGE_LOAD_TIMEOUT),60 * 1000);
			driver.manage().timeouts().pageLoadTimeout(pageLoadTimeout, TimeUnit.MILLISECONDS);
			int implicitlyWaitTimeout = NumberUtils.toInt(node.getStringJsonValue(IMPLICITLY_WAIT_TIMEOUT),3 * 1000);
			driver.manage().timeouts().implicitlyWait(implicitlyWaitTimeout, TimeUnit.MILLISECONDS);
			driver.get(url);
			//结果存入变量
			variables.put("resp", new SeleniumResponse(driver));
		} catch (Exception e) {
			context.log("设置请求url出错，异常信息：" + ExceptionUtils.getStackTrace(e));
			logger.error("设置请求url出错",e);
			ExceptionUtils.wrapAndThrow(e);
		}
		if(logger.isDebugEnabled()){
			logger.debug("设置请求url:{}" , url);
		}
	}

}
