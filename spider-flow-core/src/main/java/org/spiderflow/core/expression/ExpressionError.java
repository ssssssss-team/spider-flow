
package org.spiderflow.core.expression;

import org.spiderflow.core.expression.parsing.Span;
import org.spiderflow.core.expression.parsing.Span.Line;
import org.spiderflow.core.expression.parsing.TokenStream;

/** All errors reported by the library go through the static functions of this class. */
public class ExpressionError {

	/**
	 * <p>
	 * Create an error message based on the provided message and stream, highlighting the line on which the error happened. If the
	 * stream has more tokens, the next token will be highlighted. Otherwise the end of the source of the stream will be
	 * highlighted.
	 * </p>
	 *
	 * <p>
	 * Throws a {@link RuntimeException}
	 * </p>
	 */
	public static void error (String message, TokenStream stream) {
		if (stream.hasMore())
			error(message, stream.consume().getSpan());
		else {
			String source = stream.getSource();
			if (source == null)
				error(message, new Span(" ", 0, 1));
			else
				error(message, new Span(source, source.length() - 1, source.length()));
		}
	}

	/** Create an error message based on the provided message and location, highlighting the location in the line on which the
	 * error happened. Throws a {@link TemplateException} **/
	public static void error (String message, Span location, Throwable cause) {

		Line line = location.getLine();
		message = "Error (" + line.getLineNumber() + "): " + message + "\n\n";
		message += line.getText();
		message += "\n";

		int errorStart = location.getStart() - line.getStart();
		int errorEnd = errorStart + location.getText().length() - 1;
		for (int i = 0, n = line.getText().length(); i < n; i++) {
			boolean useTab = line.getText().charAt(i) == '\t';
			message += i >= errorStart && i <= errorEnd ? "^" : useTab ? "\t" : " ";
		}

		if (cause == null)
			throw new TemplateException(message, location);
		else
			throw new TemplateException(message, location, cause);
	}

	/** Create an error message based on the provided message and location, highlighting the location in the line on which the
	 * error happened. Throws a {@link TemplateException} **/
	public static void error (String message, Span location) {
		error(message, location, null);
	}

	/** Exception thrown by all basis-template code via {@link ExpressionError#error(String, Span)}. In case an error happens deep inside a
	 * list of included templates, the {@link #getMessage()} method will return a condensed error message. **/
	public static class TemplateException extends RuntimeException {
		private static final long serialVersionUID = 1L;
		private final Span location;
		private final String errorMessage;

		private TemplateException (String message, Span location) {
			super(message);
			this.errorMessage = message;
			this.location = location;
		}

		public TemplateException (String message, Span location, Throwable cause) {
			super(message, cause);
			this.errorMessage = message;
			this.location = location;
		}

		/** Returns the location in the template at which the error happened. **/
		public Span getLocation () {
			return location;
		}

		@Override
		public String getMessage () {
			StringBuilder builder = new StringBuilder();

			if (getCause() == null || getCause() == this) {
				return super.getMessage();
			}

			builder.append(errorMessage.substring(0, errorMessage.indexOf('\n')));
			builder.append("\n");

			Throwable cause = getCause();
			while (cause != null && cause != this) {
				if (cause instanceof TemplateException) {
					TemplateException ex = (TemplateException)cause;
					if (ex.getCause() == null || ex.getCause() == ex)
						builder.append(ex.errorMessage);
					else
						builder.append(ex.errorMessage.substring(0, ex.errorMessage.indexOf('\n')));
					builder.append("\n");
				}
				cause = cause.getCause();
			}
			return builder.toString();
		}
	}
	
	public static class StringLiteralException extends RuntimeException {

		private static final long serialVersionUID = 1L;
		
	}
}
