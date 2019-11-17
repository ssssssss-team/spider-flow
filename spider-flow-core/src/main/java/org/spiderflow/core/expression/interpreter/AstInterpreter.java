
package org.spiderflow.core.expression.interpreter;

import java.io.IOException;
import java.util.List;

import org.spiderflow.core.expression.ExpressionError;
import org.spiderflow.core.expression.ExpressionError.TemplateException;
import org.spiderflow.core.expression.ExpressionTemplate;
import org.spiderflow.core.expression.ExpressionTemplateContext;
import org.spiderflow.core.expression.parsing.Ast;
import org.spiderflow.core.expression.parsing.Ast.Node;
import org.spiderflow.core.expression.parsing.Ast.Text;

/**
 * <p>
 * Interprets a Template given a TemplateContext to lookup variable values in and writes the evaluation results to an output
 * stream. Uses the global {@link Reflection} instance as returned by {@link Reflection#getInstance()} to access members and call
 * methods.
 * </p>
 *
 * <p>
 * The interpeter traverses the AST as stored in {@link ExpressionTemplate#getNodes()}. the interpeter has a method for each AST node type
 * (see {@link Ast} that evaluates that node. A node may return a value, to be used in the interpretation of a parent node or to
 * be written to the output stream.
 * </p>
 **/
public class AstInterpreter {
	public static Object interpret (ExpressionTemplate template, ExpressionTemplateContext context) {
		try {
			return interpretNodeList(template.getNodes(), template, context);
		} catch (Throwable t) {
			if (t instanceof TemplateException)
				throw (TemplateException)t;
			else {
				ExpressionError.error("执行表达式出错 " + t.getMessage(), template.getNodes().get(0).getSpan(),t);
				return null; // never reached
			}
		} 
	}

	public static Object interpretNodeList (List<Node> nodes, ExpressionTemplate template, ExpressionTemplateContext context) throws IOException {
		String result = "";
		for (int i = 0, n = nodes.size(); i < n; i++) {
			Node node = nodes.get(i);
			Object value = node.evaluate(template, context);
			if(node instanceof Text){
				result += node.getSpan().getText();
			}else if(value == null){
				if(i ==	 0 && i + 1 == n){
					return null;
				}
				result += "null";
			}else if(value instanceof String || value instanceof Number || value instanceof Boolean){
				if(i ==0 && i + 1 ==n){
					return value;
				}
				result += value;
			}else if(i + 1 < n){
				ExpressionError.error("表达式执行错误", node.getSpan());
			}else{
				return value;
			}
		}
		return result;
	}
}
