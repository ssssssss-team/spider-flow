package org.spiderflow.core.expression.parsing;



import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.Source;

import org.spiderflow.core.expression.ExpressionError;
import org.spiderflow.core.expression.ExpressionTemplate;
import org.spiderflow.core.expression.parsing.Ast.BinaryOperation;
import org.spiderflow.core.expression.parsing.Ast.BooleanLiteral;
import org.spiderflow.core.expression.parsing.Ast.ByteLiteral;
import org.spiderflow.core.expression.parsing.Ast.CharacterLiteral;
import org.spiderflow.core.expression.parsing.Ast.DoubleLiteral;
import org.spiderflow.core.expression.parsing.Ast.Expression;
import org.spiderflow.core.expression.parsing.Ast.FloatLiteral;
import org.spiderflow.core.expression.parsing.Ast.FunctionCall;
import org.spiderflow.core.expression.parsing.Ast.IntegerLiteral;
import org.spiderflow.core.expression.parsing.Ast.ListLiteral;
import org.spiderflow.core.expression.parsing.Ast.LongLiteral;
import org.spiderflow.core.expression.parsing.Ast.MapLiteral;
import org.spiderflow.core.expression.parsing.Ast.MapOrArrayAccess;
import org.spiderflow.core.expression.parsing.Ast.MemberAccess;
import org.spiderflow.core.expression.parsing.Ast.MethodCall;
import org.spiderflow.core.expression.parsing.Ast.Node;
import org.spiderflow.core.expression.parsing.Ast.NullLiteral;
import org.spiderflow.core.expression.parsing.Ast.ShortLiteral;
import org.spiderflow.core.expression.parsing.Ast.StringLiteral;
import org.spiderflow.core.expression.parsing.Ast.TernaryOperation;
import org.spiderflow.core.expression.parsing.Ast.Text;
import org.spiderflow.core.expression.parsing.Ast.UnaryOperation;
import org.spiderflow.core.expression.parsing.Ast.VariableAccess;


/** Parses a {@link Source} into a {@link ExpressionTemplate}. The implementation is a simple recursive descent parser with a lookahead of
 * 1. **/
public class Parser {

	/** Parses a {@link Source} into a {@link ExpressionTemplate}. **/
	public static List<Node> parse (String source) {
		List<Node> nodes = new ArrayList<Node>();
		TokenStream stream = new TokenStream(new Tokenizer().tokenize(source));
		while (stream.hasMore()) {
			nodes.add(parseStatement(stream));
		}
		return nodes;
	}

	/** Parse a statement, which may either be a text block, if statement, for statement, while statement, macro definition,
	 * include statement or an expression. **/
	private static Node parseStatement (TokenStream tokens) {
		Node result = null;

		if (tokens.match(TokenType.TextBlock, false))
			result = new Text(tokens.consume().getSpan());
		else
			result = parseExpression(tokens);

		// consume semi-colons as statement delimiters
		while (tokens.match(";", true))
			;

		return result;
	}


	private static Expression parseExpression (TokenStream stream) {
		return parseTernaryOperator(stream);
	}

	private static Expression parseTernaryOperator (TokenStream stream) {
		Expression condition = parseBinaryOperator(stream, 0);
		if (stream.match(TokenType.Questionmark, true)) {
			Expression trueExpression = parseTernaryOperator(stream);
			stream.expect(TokenType.Colon);
			Expression falseExpression = parseTernaryOperator(stream);
			return new TernaryOperation(condition, trueExpression, falseExpression);
		} else {
			return condition;
		}
	}

	private static final TokenType[][] binaryOperatorPrecedence = new TokenType[][] {new TokenType[] {TokenType.Assignment},
		new TokenType[] {TokenType.Or, TokenType.And, TokenType.Xor}, new TokenType[] {TokenType.Equal, TokenType.NotEqual},
		new TokenType[] {TokenType.Less, TokenType.LessEqual, TokenType.Greater, TokenType.GreaterEqual}, new TokenType[] {TokenType.Plus, TokenType.Minus},
		new TokenType[] {TokenType.ForwardSlash, TokenType.Asterisk, TokenType.Percentage}};

	private static Expression parseBinaryOperator (TokenStream stream, int level) {
		int nextLevel = level + 1;
		Expression left = nextLevel == binaryOperatorPrecedence.length ? parseUnaryOperator(stream) : parseBinaryOperator(stream, nextLevel);

		TokenType[] operators = binaryOperatorPrecedence[level];
		while (stream.hasMore() && stream.match(false, operators)) {
			Token operator = stream.consume();
			Expression right = nextLevel == binaryOperatorPrecedence.length ? parseUnaryOperator(stream) : parseBinaryOperator(stream, nextLevel);
			left = new BinaryOperation(left, operator, right);
		}

		return left;
	}

	private static final TokenType[] unaryOperators = new TokenType[] {TokenType.Not, TokenType.Plus, TokenType.Minus};

	private static Expression parseUnaryOperator (TokenStream stream) {
		if (stream.match(false, unaryOperators)) {
			return new UnaryOperation(stream.consume(), parseUnaryOperator(stream));
		} else {
			if (stream.match(TokenType.LeftParantheses, true)) {
				Expression expression = parseExpression(stream);
				stream.expect(TokenType.RightParantheses);
				return expression;
			} else {
				return parseAccessOrCallOrLiteral(stream);
			}
		}
	}

	private static Expression parseAccessOrCallOrLiteral (TokenStream stream) {
		if (stream.match(TokenType.Identifier, false)) {
			return parseAccessOrCall(stream);
		} else if (stream.match(TokenType.LeftCurly, false)) {
			return parseMapLiteral(stream);
		} else if (stream.match(TokenType.LeftBracket, false)) {
			return parseListLiteral(stream);
		} else if (stream.match(TokenType.StringLiteral, false)) {
			return new StringLiteral(stream.expect(TokenType.StringLiteral).getSpan());
		} else if (stream.match(TokenType.BooleanLiteral, false)) {
			return new BooleanLiteral(stream.expect(TokenType.BooleanLiteral).getSpan());
		} else if (stream.match(TokenType.DoubleLiteral, false)) {
			return new DoubleLiteral(stream.expect(TokenType.DoubleLiteral).getSpan());
		} else if (stream.match(TokenType.FloatLiteral, false)) {
			return new FloatLiteral(stream.expect(TokenType.FloatLiteral).getSpan());
		} else if (stream.match(TokenType.ByteLiteral, false)) {
			return new ByteLiteral(stream.expect(TokenType.ByteLiteral).getSpan());
		} else if (stream.match(TokenType.ShortLiteral, false)) {
			return new ShortLiteral(stream.expect(TokenType.ShortLiteral).getSpan());
		} else if (stream.match(TokenType.IntegerLiteral, false)) {
			return new IntegerLiteral(stream.expect(TokenType.IntegerLiteral).getSpan());
		} else if (stream.match(TokenType.LongLiteral, false)) {
			return new LongLiteral(stream.expect(TokenType.LongLiteral).getSpan());
		} else if (stream.match(TokenType.CharacterLiteral, false)) {
			return new CharacterLiteral(stream.expect(TokenType.CharacterLiteral).getSpan());
		} else if (stream.match(TokenType.NullLiteral, false)) {
			return new NullLiteral(stream.expect(TokenType.NullLiteral).getSpan());
		} else {
			ExpressionError.error("Expected a variable, field, map, array, function or method call, or literal.", stream);
			return null; // not reached
		}
	}

	private static Expression parseMapLiteral (TokenStream stream) {
		Span openCurly = stream.expect(TokenType.LeftCurly).getSpan();

		List<Span> keys = new ArrayList<>();
		List<Expression> values = new ArrayList<>();
		while (stream.hasMore() && !stream.match(TokenType.RightCurly, false)) {
			keys.add(stream.expect(TokenType.Identifier).getSpan());
			stream.expect(":");
			values.add(parseExpression(stream));
			if (!stream.match(TokenType.RightCurly, false)) stream.expect(TokenType.Comma);
		}

		Span closeCurly = stream.expect(TokenType.RightCurly).getSpan();
		return new MapLiteral(new Span(openCurly, closeCurly), keys, values);
	}

	private static Expression parseListLiteral (TokenStream stream) {
		Span openBracket = stream.expect(TokenType.LeftBracket).getSpan();

		List<Expression> values = new ArrayList<>();
		while (stream.hasMore() && !stream.match(TokenType.RightBracket, false)) {
			values.add(parseExpression(stream));
			if (!stream.match(TokenType.RightBracket, false)) stream.expect(TokenType.Comma);
		}

		Span closeBracket = stream.expect(TokenType.RightBracket).getSpan();
		return new ListLiteral(new Span(openBracket, closeBracket), values);
	}

	private static Expression parseAccessOrCall (TokenStream stream) {
		Span identifier = stream.expect(TokenType.Identifier).getSpan();
		Expression result = new VariableAccess(identifier);

		while (stream.hasMore() && stream.match(false, TokenType.LeftParantheses, TokenType.LeftBracket, TokenType.Period)) {

			// function or method call
			if (stream.match(TokenType.LeftParantheses, false)) {
				List<Expression> arguments = parseArguments(stream);
				Span closingSpan = stream.expect(TokenType.RightParantheses).getSpan();
				if (result instanceof VariableAccess || result instanceof MapOrArrayAccess)
					result = new FunctionCall(new Span(result.getSpan(), closingSpan), result, arguments);
				else if (result instanceof MemberAccess) {
					result = new MethodCall(new Span(result.getSpan(), closingSpan), (MemberAccess)result, arguments);
				} else {
					ExpressionError.error("Expected a variable, field or method.", stream);
				}
			}

			// map or array access
			else if (stream.match(TokenType.LeftBracket, true)) {
				Expression keyOrIndex = parseExpression(stream);
				Span closingSpan = stream.expect(TokenType.RightBracket).getSpan();
				result = new MapOrArrayAccess(new Span(result.getSpan(), closingSpan), result, keyOrIndex);
			}

			// field or method access
			else if (stream.match(TokenType.Period, true)) {
				identifier = stream.expect(TokenType.Identifier).getSpan();
				result = new MemberAccess(result, identifier);
			}
		}

		return result;
	}

	/** Does not consume the closing parentheses. **/
	private static List<Expression> parseArguments (TokenStream stream) {
		stream.expect(TokenType.LeftParantheses);
		List<Expression> arguments = new ArrayList<Expression>();
		while (stream.hasMore() && !stream.match(TokenType.RightParantheses, false)) {
			arguments.add(parseExpression(stream));
			if (!stream.match(TokenType.RightParantheses, false)) stream.expect(TokenType.Comma);
		}
		return arguments;
	}
}
