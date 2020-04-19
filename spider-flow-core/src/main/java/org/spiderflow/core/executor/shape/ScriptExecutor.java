package org.spiderflow.core.executor.shape;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.context.SpiderContext;
import org.spiderflow.core.io.ScriptResponse;
import org.spiderflow.core.service.ScriptService;
import org.spiderflow.core.utils.ExpressionUtils;
import org.spiderflow.executor.ShapeExecutor;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Map;

@Component
public class ScriptExecutor implements ShapeExecutor {

    public static final String RESULT_VARIABLE = "scriptVariable";

    public static final String SCRIPT_TIMEOUT = "scriptTimeout";

    public static final String SCRIPT_NAME = "scriptName";

    public static final String SCRIPT_FILE = "scriptFile";

    public static final String SCRIPT_CHARSET = "scriptCharset";

    public static final String SCRIPT_PARAMETER = "scriptParameter";

    private static Logger logger = LoggerFactory.getLogger(ScriptExecutor.class);

    @Autowired
    private ScriptService scriptService;

    @Override
    public String supportShape() {
        return "script";
    }

    @Override
    public void execute(SpiderNode node, SpiderContext context, Map<String, Object> variables) {
        String scriptName = node.getStringJsonValue(SCRIPT_NAME);
        String scriptFile = node.getStringJsonValue(SCRIPT_FILE);
        String parameter = node.getStringJsonValue(SCRIPT_PARAMETER);
        int timeout = NumberUtils.toInt(node.getStringJsonValue(SCRIPT_TIMEOUT,"-1"),-1);
        if(StringUtils.isBlank(scriptName) || StringUtils.isBlank(scriptFile)){
            logger.info("脚本名和脚本文件名不能为空！");
            return;
        }
        File file = scriptService.getScriptFile(scriptName, scriptFile);
        if(!file.exists()){
            logger.info("在脚本{}中找不到脚本文件{}",scriptName,scriptFile);
            return;
        }
        String charset = node.getStringJsonValue(SCRIPT_CHARSET);
        String variable = node.getStringJsonValue(RESULT_VARIABLE);
        if(parameter != null){
            try {
                Object value = ExpressionUtils.execute(parameter,variables);
                logger.info("脚本参数:{}",value);
                if(value != null){
                    parameter = value.toString();
                }
            } catch (Exception e) {
                logger.error("获取脚本参数出错",e);
            }
        }
        ScriptResponse response = scriptService.execute(scriptName, scriptFile, parameter, timeout);
        if(StringUtils.isNotBlank(charset)){
            response.charset(charset);
        }
        if(StringUtils.isNotBlank(variable)){
            variables.put(variable,response);
        }

    }
}
