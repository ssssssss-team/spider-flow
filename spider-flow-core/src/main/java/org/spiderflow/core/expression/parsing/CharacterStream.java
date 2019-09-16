
package org.spiderflow.core.expression.parsing;

import javax.xml.transform.Source;

/** Wraps a the content of a {@link Source} and handles traversing the contained characters. Manages a current {@link Span} via
 * the {@link #startSpan()} and {@link #endSpan()} methods. */
public class CharacterStream {
	private final String source;
	private int index = 0;
	private final int end;

	private int spanStart = 0;

	public CharacterStream (String source) {
		this(source, 0, source.length());
	}

	public CharacterStream (String source, int start, int end) {
		if (start > end) throw new IllegalArgumentException("Start must be <= end.");
		if (start < 0) throw new IndexOutOfBoundsException("Start must be >= 0.");
		if (start > Math.max(0, source.length() - 1)) throw new IndexOutOfBoundsException("Start outside of string.");
		if (end > source.length()) throw new IndexOutOfBoundsException("End outside of string.");

		this.source = source;
		this.index = start;
		this.end = end;
	}

	/** Returns whether there are more characters in the stream **/
	public boolean hasMore () {
		return index < end;
	}

	/** Returns the next character without advancing the stream **/
	public char peek () {
		if (!hasMore()) throw new RuntimeException("No more characters in stream.");
		return source.charAt(index++);
	}

	/** Returns the next character and advance the stream **/
	public char consume () {
		if (!hasMore()) throw new RuntimeException("No more characters in stream.");
		return source.charAt(index++);
	}

	/** Matches the given needle with the next characters. Returns true if the needle is matched, false otherwise. If there's a
	 * match and consume is true, the stream is advanced by the needle's length. */
	public boolean match (String needle, boolean consume) {
		int needleLength = needle.length();
		for (int i = 0, j = index; i < needleLength; i++, j++) {
			if (index >= end) return false;
			if (needle.charAt(i) != source.charAt(j)) return false;
		}
		if (consume) index += needleLength;
		return true;
	}

	/** Returns whether the next character is a digit and optionally consumes it. **/
	public boolean matchDigit (boolean consume) {
		if (index >= end) return false;
		char c = source.charAt(index);
		if (Character.isDigit(c)) {
			if (consume) index++;
			return true;
		}
		return false;
	}

	/** Returns whether the next character is the start of an identifier and optionally consumes it. Adheres to
	 * {@link Character#isJavaIdentifierStart(char)}. **/
	public boolean matchIdentifierStart (boolean consume) {
		if (index >= end) return false;
		char c = source.charAt(index);
		if (Character.isJavaIdentifierStart(c)) {
			if (consume) index++;
			return true;
		}
		return false;
	}

	/** Returns whether the next character is the start of an identifier and optionally consumes it. Adheres to
	 * {@link Character#isJavaIdentifierPart(char)}. **/
	public boolean matchIdentifierPart (boolean consume) {
		if (index >= end) return false;
		char c = source.charAt(index);
		if (Character.isJavaIdentifierPart(c)) {
			if (consume) index++;
			return true;
		}
		return false;
	}

	/** Skips any number of successive whitespace characters. **/
	public void skipWhiteSpace () {
		while (true) {
			if (index >= end) return;
			char c = source.charAt(index);
			if (c == ' ' || c == '\n' || c == '\r' || c == '\t') {
				index++;
				continue;
			} else {
				break;
			}
		}
	}

	/** Start a new Span at the current stream position. Call {@link #endSpan()} to complete the span. **/
	public void startSpan () {
		spanStart = index;
	}

	/** Completes the span started with {@link #startSpan()} at the current stream position. **/
	public Span endSpan () {
		return new Span(source, spanStart, index);
	}

	public boolean isSpanEmpty () {
		return spanStart == this.index;
	}

	/** Returns the current character position in the stream. **/
	public int getPosition () {
		return index;
	}
}
