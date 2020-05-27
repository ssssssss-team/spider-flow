package org.spiderflow.core.expression;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spiderflow.ExpressionEngine;
import org.spiderflow.core.expression.interpreter.AbstractReflection;
import org.spiderflow.executor.FunctionExecutor;
import org.spiderflow.executor.FunctionExtension;
import org.spiderflow.io.SpiderResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;

@Component
public class DefaultExpressionEngine implements ExpressionEngine {

    @Autowired
    private List<FunctionExecutor> functionExecutors;

    @Autowired
    private List<FunctionExtension> functionExtensions;

    @PostConstruct
    private void init() {
        for (FunctionExtension extension : functionExtensions) {
            AbstractReflection.getInstance().registerExtensionClass(extension.support(), extension.getClass());
        }
    }

    public Map<String, ExpressionObject> getExpressionObjectMap() {
        Map<String, ExpressionObject> objectMap = new HashMap<>();
        functionExecutors.forEach(functionExecutor -> {
            ExpressionObject object = new ExpressionObject();
            object.setClassName(functionExecutor.getFunctionPrefix());
            object.setMethods(getMethod(functionExecutor.getClass(), true));
            objectMap.put(object.getClassName(), object);
        });
        Arrays.asList(SpiderResponse.class, Element.class, Elements.class, String.class, Object.class, Date.class, Integer.class, List.class, Object[].class).forEach(clazz -> {
            ExpressionObject object = new ExpressionObject();
            object.setClassName(clazz.getSimpleName());
            getMethod(clazz, false).forEach(method -> {
                if (method.getName().startsWith("get") && method.getParameters().size() == 0 && method.getName().length() > 3) {
                    String attributeName = method.getName().substring(3);
                    attributeName = attributeName.substring(0, 1).toLowerCase() + attributeName.substring(1);
                    object.addAttribute(new ExpressionObject.ExpressionAttribute(method.getReturnType(), attributeName));
                } else {
                    object.addMethod(method);
                }
            });
            objectMap.put(object.getClassName(), object);
        });
		functionExtensions.forEach(extensions->{
			ExpressionObject object = objectMap.get(extensions.support().getSimpleName());
			if(object != null){
				getMethod(extensions.getClass(), true).forEach(method -> {
					if(method.getParameters().size() > 0){
						method.getParameters().remove(0);
						object.addMethod(method);
					}
				});
			}
		});
        return objectMap;
    }

    private List<ExpressionObject.ExpressionMethod> getMethod(Class clazz, boolean publicAndStatic) {
        List<ExpressionObject.ExpressionMethod> methods = new ArrayList<>();
        Method[] declaredMethods = clazz.getDeclaredMethods();
        for (int i = 0; i < declaredMethods.length; i++) {
            Method declaredMethod = declaredMethods[i];
            if (Modifier.isPublic(declaredMethod.getModifiers())) {
                boolean isStatic = Modifier.isStatic(declaredMethod.getModifiers());
                if ((!publicAndStatic) || isStatic) {
                    methods.add(new ExpressionObject.ExpressionMethod(declaredMethod));
                }
            }
        }
        return methods;
    }

    @Override
    public Object execute(String expression, Map<String, Object> variables) {
        if (StringUtils.isBlank(expression)) {
            return expression;
        }
        ExpressionTemplateContext context = new ExpressionTemplateContext(variables);
        for (FunctionExecutor executor : functionExecutors) {
            context.set(executor.getFunctionPrefix(), executor);
        }
        ExpressionGlobalVariables.getVariables().entrySet().forEach(entry -> {
            context.set(entry.getKey(), ExpressionTemplate.create(entry.getValue()).render(context));
        });
        try {
            ExpressionTemplateContext.set(context);
            return ExpressionTemplate.create(expression).render(context);
        } finally {
            ExpressionTemplateContext.remove();
        }
    }
}
