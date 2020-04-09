
package org.spiderflow.core.expression.parsing;

import java.util.ArrayList;
import java.util.List;

import org.spiderflow.core.expression.ExpressionError;
import org.spiderflow.core.expression.ExpressionError.StringLiteralException;
import org.spiderflow.core.expression.ExpressionError.TemplateException;


public class Tokenizer {

	/** Tokenizes the source into tokens with a {@link TokenType}. Text blocks not enclosed in {{ }} are returned as a single token
	 * of type {@link TokenType.TextBlock}. {{ and }} are not returned as individual tokens. See {@link TokenType} for the list of
	 * tokens this tokenizer understands. */
	public List<Token> tokenize (String source) {
		List<Token> tokens = new ArrayList<Token>();
		if (source.length() == 0) return tokens;
		CharacterStream stream = new CharacterStream(source);
		stream.startSpan();

		RuntimeException re = null;
		while (stream.hasMore()) {
			if (stream.match("${", false)) {
				if (!stream.isSpanEmpty()) tokens.add(new Token(TokenType.TextBlock, stream.endSpan()));
				stream.startSpan();
				boolean isContinue = false;
				do{
					while (!stream.match("}", true)) {
						if (!stream.hasMore()) ExpressionError.error("Did not find closing }.", stream.endSpan());
						stream.consume();
					}
					try{
						tokens.addAll(tokenizeCodeSpan(stream.endSpan()));
						isContinue = false;
						re = null;
					}catch(TemplateException e){
						re = e;
						if(e.getCause() != null || stream.hasMore()){
							isContinue = true;
						}
					}
					
				}while(isContinue);
				if(re != null){
					throw re;
				}
				stream.startSpan();
			} else {
				stream.consume();
			}
		}
		if (!stream.isSpanEmpty()) tokens.add(new Token(TokenType.TextBlock, stream.endSpan()));
		return tokens;
	}

	private static List<Token> tokenizeCodeSpan (Span span) {
		String source = span.getSource();
		CharacterStream stream = new CharacterStream(source, span.getStart(), span.getEnd());
		List<Token> tokens = new ArrayList<Token>();

		// match opening tag and throw it away
		if (!stream.match("${", true)) ExpressionError.error("Expected ${", new Span(source, stream.getPosition(), stream.getPosition() + 1));
		int leftCount = 0;
		int rightCount = 0;
		outer:
		while (stream.hasMore()) {
			// skip whitespace
			stream.skipWhiteSpace();

			// Number literal, both integers and floats. Number literals may be suffixed by a type identifier.
			if (stream.matchDigit(false)) {
				TokenType type = TokenType.IntegerLiteral;
				stream.startSpan();
				while (stream.matchDigit(true))
					;
				if (stream.match(TokenType.Period.getLiteral(), true)) {
					type = TokenType.FloatLiteral;
					while (stream.matchDigit(true))
						;
				}
				if (stream.match("b", true) || stream.match("B", true)) {
					if (type == TokenType.FloatLiteral) ExpressionError.error("Byte literal can not have a decimal point.", stream.endSpan());
					type = TokenType.ByteLiteral;
				} else if (stream.match("s", true) || stream.match("S", true)) {
					if (type == TokenType.FloatLiteral) ExpressionError.error("Short literal can not have a decimal point.", stream.endSpan());
					type = TokenType.ShortLiteral;
				} else if (stream.match("l", true) || stream.match("L", true)) {
					if (type == TokenType.FloatLiteral) ExpressionError.error("Long literal can not have a decimal point.", stream.endSpan());
					type = TokenType.LongLiteral;
				} else if (stream.match("f", true) || stream.match("F", true)) {
					type = TokenType.FloatLiteral;
				} else if (stream.match("d", true) || stream.match("D", true)) {
					type = TokenType.DoubleLiteral;
				}
				Span numberSpan = stream.endSpan();
				tokens.add(new Token(type, numberSpan));
				continue;
			}

			// String literal
			if (stream.match(TokenType.SingleQuote.getLiteral(), true)) {
				stream.startSpan();
				boolean matchedEndQuote = false;
				while (stream.hasMore()) {
					// Note: escape sequences like \n are parsed in StringLiteral
					if (stream.match("\\", true)) {
						stream.consume();
					}
					if (stream.match(TokenType.SingleQuote.getLiteral(), true)) {
						matchedEndQuote = true;
						break;
					}
					stream.consume();
				}
				if (!matchedEndQuote) ExpressionError.error("字符串没有结束符\'", stream.endSpan(),new StringLiteralException());
				Span stringSpan = stream.endSpan();
				stringSpan = new Span(stringSpan.getSource(), stringSpan.getStart() - 1, stringSpan.getEnd());
				tokens.add(new Token(TokenType.StringLiteral, stringSpan));
				continue;
			}

			// String literal
			if (stream.match(TokenType.DoubleQuote.getLiteral(), true)) {
				stream.startSpan();
				boolean matchedEndQuote = false;
				while (stream.hasMore()) {
					// Note: escape sequences like \n are parsed in StringLiteral
					if (stream.match("\\", true)) {
						stream.consume();
					}
					if (stream.match(TokenType.DoubleQuote.getLiteral(), true)) {
						matchedEndQuote = true;
						break;
					}
					stream.consume();
				}
				if (!matchedEndQuote) ExpressionError.error("字符串没有结束符\"", stream.endSpan(),new StringLiteralException());
				Span stringSpan = stream.endSpan();
				stringSpan = new Span(stringSpan.getSource(), stringSpan.getStart() - 1, stringSpan.getEnd());
				tokens.add(new Token(TokenType.StringLiteral, stringSpan));
				continue;
			}
			
			// Identifier, keyword, boolean literal, or null literal
			if (stream.matchIdentifierStart(true)) {
				stream.startSpan();
				while (stream.matchIdentifierPart(true))
					;
				Span identifierSpan = stream.endSpan();
				identifierSpan = new Span(identifierSpan.getSource(), identifierSpan.getStart() - 1, identifierSpan.getEnd());

				if (identifierSpan.getText().equals("true") || identifierSpan.getText().equals("false")) {
					tokens.add(new Token(TokenType.BooleanLiteral, identifierSpan));
				} else if (identifierSpan.getText().equals("null")) {
					tokens.add(new Token(TokenType.NullLiteral, identifierSpan));
				} else {
					tokens.add(new Token(TokenType.Identifier, identifierSpan));
				}
				continue;
			}

			// Simple tokens
			for (TokenType t : TokenType.getSortedValues()) {
				if (t.getLiteral() != null) {
					if (stream.match(t.getLiteral(), true)) {
						if(t == TokenType.LeftCurly){
							leftCount ++;
						}
						tokens.add(new Token(t, new Span(source, stream.getPosition() - t.getLiteral().length(), stream.getPosition())));
						continue outer;
					}
				}
			}
			if(leftCount!=rightCount&&stream.match("}", true)){
				rightCount++;
				tokens.add(new Token(TokenType.RightCurly, new Span(source, stream.getPosition() - 1, stream.getPosition())));
				continue outer;
			}
			// match closing tag
			if (stream.match("}", false)) break;

			ExpressionError.error("Unknown token", new Span(source, stream.getPosition(), stream.getPosition() + 1));
		}

		// code spans must end with }
		if (!stream.match("}", true)) ExpressionError.error("Expected }", new Span(source, stream.getPosition(), stream.getPosition() + 1));
		return tokens;
	}
}
