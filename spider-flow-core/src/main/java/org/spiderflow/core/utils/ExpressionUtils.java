package org.spiderflow.core.utils;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.model.SpiderNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;

/**
 * Created on 2020-03-11
 *
 * @author Octopus
 */
@Component
public class ExpressionUtils {

    private static Logger logger = LoggerFactory.getLogger(ExpressionUtils.class);

    /**
     * 选择器
     */
    private static ExpressionEngine engine;

    @Autowired
    private ExpressionUtils(ExpressionEngine engine){
        ExpressionUtils.engine = engine;
    }

    public static boolean executeCondition(SpiderNode fromNode, SpiderNode node, Map<String, Object> variables) {
        if (fromNode != null) {
            String condition = node.getCondition(fromNode.getNodeId());
            if (StringUtils.isNotBlank(condition)) { // 判断是否有条件
                Object result = null;
                try {
                    result = engine.execute(condition, variables);
                } catch (Exception e) {
                    logger.error("判断{}出错,异常信息：{}", condition, e);
                }
                if (result != null) {
                    boolean isContinue = "true".equals(result) || Objects.equals(result, true);
                    logger.debug("判断{}={}", condition, isContinue);
                    return isContinue;
                }
                return false;
            }
        }
        return true;
    }

    public static Object execute(String expression, Map<String, Object> variables) {
        return engine.execute(expression, variables);
    }
}
