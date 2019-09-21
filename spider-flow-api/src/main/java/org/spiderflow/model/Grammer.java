package org.spiderflow.model;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.annotation.Return;

public class Grammer {
	
	private String owner;

	private String method;
	
	private String comment;
	
	private String example;
	
	private String function;
	
	private List<String> returns;
	
	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}
	
	public String getFunction() {
		return function;
	}

	public void setFunction(String function) {
		this.function = function;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getExample() {
		return example;
	}

	public void setExample(String example) {
		this.example = example;
	}

	public List<String> getReturns() {
		return returns;
	}
	
	public void setReturns(List<String> returns) {
		this.returns = returns;
	}
	
	public static List<Grammer> findGrammers(Class<?> clazz,String function,String owner,boolean mustStatic){
		Method[] methods = clazz.getDeclaredMethods();
		List<Grammer> grammers = new ArrayList<>();
		if(methods != null){
			for (Method method : methods) {
				if(Modifier.isPublic(method.getModifiers()) && (Modifier.isStatic(method.getModifiers())||!mustStatic)){
					Grammer grammer = new Grammer();
					grammer.setMethod(method.getName());
					Comment comment = method.getAnnotation(Comment.class);
					if(comment != null){
						grammer.setComment(comment.value());
					}
					Example example = method.getAnnotation(Example.class);
					if(example != null){
						grammer.setExample(example.value());
					}
					Return returns = method.getAnnotation(Return.class);
					if(returns != null){
						Class<?>[] clazzs = returns.value();
						List<String> returnTypes = new ArrayList<>();
						for (int i = 0; i < clazzs.length; i++) {
							returnTypes.add(clazzs[i].getSimpleName());
						}
						grammer.setReturns(returnTypes);
					}else{
						grammer.setReturns(Arrays.asList(method.getReturnType().getSimpleName()));
					}
					grammer.setFunction(function);
					grammer.setOwner(owner);
					grammers.add(grammer);
				}
			}
		}
		return grammers;
	}
}
