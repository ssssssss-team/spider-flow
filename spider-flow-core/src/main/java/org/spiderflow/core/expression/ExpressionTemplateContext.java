
package org.spiderflow.core.expression;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.spiderflow.core.expression.interpreter.AstInterpreter;


/**
 * <p>
 * A template context stores mappings from variable names to user provided variable values. A {@link ExpressionTemplate} is given a context
 * for rendering to resolve variable values it references in template expressions.
 * </p>
 *
 * <p>
 * Internally, a template context is a stack of these mappings, similar to scopes in a programming language, and used as such by
 * the {@link AstInterpreter}.
 * </p>
 */
public class ExpressionTemplateContext {
	private final List<Map<String, Object>> scopes = new ArrayList<Map<String, Object>>();

	/** Keeps track of previously allocated, unused scopes. New scopes are first tried to be retrieved from this pool to avoid
	 * generating garbage. **/
	private final List<Map<String, Object>> freeScopes = new ArrayList<Map<String, Object>>();

	private final static ThreadLocal<ExpressionTemplateContext> CONTEXT_THREAD_LOCAL = new ThreadLocal<>();

	public static ExpressionTemplateContext get(){
		return CONTEXT_THREAD_LOCAL.get();
	}

	public static void remove(){
		CONTEXT_THREAD_LOCAL.remove();
	}

	public static void set(ExpressionTemplateContext context){
		CONTEXT_THREAD_LOCAL.set(context);
	}

	public ExpressionTemplateContext () {
		push();
	}
	
	public ExpressionTemplateContext(Map<String,Object> variables) {
		this();
		if(variables != null){
			variables.forEach(this::set);
		}
	}

	/** Sets the value of the variable with the given name. If the variable already exists in one of the scopes, that variable is
	 * set. Otherwise the variable is set on the last pushed scope. */
	public ExpressionTemplateContext set (String name, Object value) {
		for (int i = scopes.size() - 1; i >= 0; i--) {
			Map<String, Object> ctx = scopes.get(i);
			if (ctx.isEmpty()) continue;
			if (ctx.containsKey(name)) {
				ctx.put(name, value);
				return this;
			}
		}

		scopes.get(scopes.size() - 1).put(name, value);
		return this;
	}

	/** Sets the value of the variable with the given name on the last pushed scope **/
	public ExpressionTemplateContext setOnCurrentScope (String name, Object value) {
		scopes.get(scopes.size() - 1).put(name, value);
		return this;
	}

	/** Internal. Returns the value of the variable with the given name, walking the scope stack from top to bottom, similar to how
	 * scopes in programming languages are searched for variables. */
	public Object get (String name) {
		for (int i = scopes.size() - 1; i >= 0; i--) {
			Map<String, Object> ctx = scopes.get(i);
			if (ctx.isEmpty()) continue;
			Object value = ctx.get(name);
			if (value != null) return value;
		}
		return null;
	}

	/** Internal. Returns all variables currently defined in this context. */
	public Set<String> getVariables () {
		Set<String> variables = new HashSet<String>();
		for (int i = 0, n = scopes.size(); i < n; i++) {
			variables.addAll(scopes.get(i).keySet());
		}
		return variables;
	}

	/** Internal. Pushes a new "scope" onto the stack. **/
	public void push () {
		Map<String, Object> newScope = freeScopes.size() > 0 ? freeScopes.remove(freeScopes.size() - 1) : new HashMap<String, Object>();
		scopes.add(newScope);
	}

	/** Internal. Pops the top of the "scope" stack. **/
	public void pop () {
		Map<String, Object> oldScope = scopes.remove(scopes.size() - 1);
		oldScope.clear();
		freeScopes.add(oldScope);
	}
}
