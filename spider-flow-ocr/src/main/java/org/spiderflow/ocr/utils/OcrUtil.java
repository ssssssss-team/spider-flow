package org.spiderflow.ocr.utils;

import java.util.HashMap;

import org.json.JSONObject;
import org.spiderflow.ocr.model.Ocr;

import com.baidu.aip.ocr.AipOcr;

public class OcrUtil {
	
	private static HashMap<String, AipOcr> aipOcrMap = new HashMap<String, AipOcr>();
	
	private static HashMap<String, String> options = new HashMap<String, String>();
	
	static {
	    options.put("detect_direction", "true");
	    options.put("detect_language", "true");
	    options.put("probability", "true");
	}
	
	public static AipOcr getAipOcr(Ocr ocr) {
		String ocrMapKey = ocr.getAppId()+ocr.getApiKey()+ocr.getSecretKey();
		AipOcr aipOcr = aipOcrMap.get(ocrMapKey);
		if(aipOcr == null) {
			aipOcr = new AipOcr(ocr.getAppId(), ocr.getApiKey(), ocr.getSecretKey());
			aipOcrMap.put(ocrMapKey, aipOcr);
		}
		return aipOcr;
	}
	
	public static JSONObject ocrIdentify(Ocr ocr,byte[] bytes) {
		AipOcr aipOcr = getAipOcr(ocr);
		return aipOcr.basicGeneral(bytes, options);
	}
	
	public static JSONObject ocrIdentify(Ocr ocr,String url) {
		AipOcr aipOcr = getAipOcr(ocr);
		return aipOcr.basicGeneralUrl(url, options);
	}
	
}