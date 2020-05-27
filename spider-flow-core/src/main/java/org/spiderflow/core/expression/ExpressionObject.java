package org.spiderflow.core.expression;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.List;

public class ExpressionObject {

    private String className;

    private List<ExpressionMethod> methods = new ArrayList<>();

    private List<ExpressionAttribute> attributes = new ArrayList<>();

    private String superClass;

    private List<String> interfaces = new ArrayList<>();

    public void addAttribute(ExpressionAttribute attribute){
        this.attributes.add(attribute);
    }

    public void addMethod(ExpressionMethod method){
        this.methods.add(method);
    }

    public void addInterface(String interfaceName){
        this.interfaces.add(interfaceName);
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public List<ExpressionMethod> getMethods() {
        return methods;
    }

    public void setMethods(List<ExpressionMethod> methods) {
        this.methods = methods;
    }

    public String getSuperClass() {
        return superClass;
    }

    public void setSuperClass(String superClass) {
        this.superClass = superClass;
    }

    public List<String> getInterfaces() {
        return interfaces;
    }

    public void setInterfaces(List<String> interfaces) {
        this.interfaces = interfaces;
    }

    public List<ExpressionAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ExpressionAttribute> attributes) {
        this.attributes = attributes;
    }

    static class ExpressionAttribute{

        private String type;

        private String name;

        public ExpressionAttribute(String type, String name) {
            this.type = type;
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public String getName() {
            return name;
        }
    }

    static class ExpressionMethod{

        private String name;

        private String returnType;

        private String example;

        private String comment;

        private List<ExpressionMethodParameter> parameters = new ArrayList<>();

        public ExpressionMethod(Method method) {
            this.name = method.getName();
            this.returnType = method.getReturnType().getSimpleName();
            Example exampleAnnotation = method.getDeclaredAnnotation(Example.class);
            if(exampleAnnotation != null){
                this.example = exampleAnnotation.value();
            }
            Comment commentAnnotation = method.getDeclaredAnnotation(Comment.class);
            if(commentAnnotation != null){
                this.comment = commentAnnotation.value();
            }
            Parameter[] parameters = method.getParameters();
            if(parameters != null){
                for (int i = 0; i < parameters.length; i++) {
                    this.parameters.add(new ExpressionMethodParameter(parameters[i]));
                }
            }
        }

        public String getComment() {
            return comment;
        }

        public String getName() {
            return name;
        }

        public String getReturnType() {
            return returnType;
        }

        public String getExample() {
            return example;
        }

        public List<ExpressionMethodParameter> getParameters() {
            return parameters;
        }
    }

    static class ExpressionMethodParameter{

        private String name;

        private String type;

        public ExpressionMethodParameter(Parameter parameter) {
            this.name = parameter.getName();
            this.type = parameter.getType().getSimpleName();
        }

        public String getName() {
            return name;
        }

        public String getType() {
            return type;
        }
    }
}
