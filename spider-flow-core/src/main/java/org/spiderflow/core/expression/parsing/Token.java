
package org.spiderflow.core.expression.parsing;

/** A token produced by the {@link Tokenizer}. */
public class Token {
	private final TokenType type;
	private final Span span;

	public Token (TokenType type, Span span) {
		this.type = type;
		this.span = span;
	}

	public TokenType getType () {
		return type;
	}

	public Span getSpan () {
		return span;
	}

	public String getText () {
		return span.getText();
	}

	@Override
	public String toString () {
		return "Token [type=" + type + ", span=" + span + "]";
	}
}
