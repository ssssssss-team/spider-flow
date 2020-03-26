package org.spiderflow.core.script;

import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.expression.ExpressionTemplate;
import org.spiderflow.core.expression.ExpressionTemplateContext;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ScriptManager {

    private static Logger logger = LoggerFactory.getLogger(ScriptManager.class);

    private static ScriptEngine scriptEngine;

    private static Set<String> functions = new HashSet<>();

    private static ReadWriteLock lock = new ReentrantReadWriteLock();

    public static void setScriptEngine(ScriptEngine engine){
        scriptEngine = engine;
        StringBuffer script = new StringBuffer();
        script.append("var ExpressionTemplate = Java.type('")
                .append(ExpressionTemplate.class.getName())
                .append("');")
                .append("var ExpressionTemplateContext = Java.type('")
                .append(ExpressionTemplateContext.class.getName())
                .append("');")
                .append("function _eval(expression) {")
                .append("return ExpressionTemplate.create(expression).render(ExpressionTemplateContext.get());")
                .append("}");
        try {
            scriptEngine.eval(script.toString());
        } catch (ScriptException e) {
            logger.error("注册_eval函数失败",e);
        }
    }

    public static void clearFunctions(){
        functions.clear();
    }

    public static ScriptEngine createEngine(){
        return new ScriptEngineManager().getEngineByName("nashorn");
    }

    public static void lock(){
        lock.writeLock().lock();
    }

    public static void unlock(){
        lock.writeLock().unlock();
    }

    public static void registerFunction(ScriptEngine engine,String functionName,String parameters,String script){
        try {
            engine.eval(concatScript(functionName,parameters,script));
            functions.add(functionName);
            logger.info("注册自定义函数{}成功",functionName);
        } catch (ScriptException e) {
            logger.warn("注册自定义函数{}失败",functionName,e);
        }
    }

    private static String concatScript(String functionName,String parameters,String script){
        StringBuffer scriptBuffer = new StringBuffer();
        scriptBuffer.append("function ")
                .append(functionName)
                .append("(")
                .append(parameters == null ? "" : parameters)
                .append("){")
                .append(script)
                .append("}");
        return scriptBuffer.toString();
    }

    public static boolean containsFunction(String functionName){
        try {
            lock.readLock().lock();
            return functions.contains(functionName);
        } finally {
            lock.readLock().unlock();
        }
    }

    public static void validScript(String functionName,String parameters,String script) throws Exception {
        new ScriptEngineManager().getEngineByName("nashorn").eval(concatScript(functionName,parameters,script));
    }

    public static Object eval(ExpressionTemplateContext context, String functionName, Object ... args) throws ScriptException, NoSuchMethodException {
        if("_eval".equals(functionName)){
            if(args == null || args.length != 1){
                throw new ScriptException("_eval必须要有一个参数");
            }else{
                return ExpressionTemplate.create(args[0].toString()).render(context);
            }
        }
        if(scriptEngine == null){
            throw new NoSuchMethodException(functionName);
        }
        try{
            lock.readLock().lock();
            return convertObject(((Invocable) scriptEngine).invokeFunction(functionName, args));
        } finally{
            lock.readLock().unlock();
        }
    }

    private static Object convertObject(Object object){
        if(object instanceof ScriptObjectMirror){
            ScriptObjectMirror mirror = (ScriptObjectMirror) object;
            if(mirror.isArray()){
                int size = mirror.size();
                Object[] array = new Object[size];
                for (int i = 0; i < size; i++) {
                    array[i] = convertObject(mirror.getSlot(i));
                }
                return array;
            }else{
                String className = mirror.getClassName();
                if("Date".equalsIgnoreCase(className)){
                    return new Date(mirror.to(Long.class));
                }
                //其它类型待处理
            }
            
        }
        return object;
    }
}
