package org.spiderflow.io;

public class Line {

	private long from;

	private String text;

	private long to;

	public Line(long from, String text, long to) {
		this.from = from;
		this.text = text;
		this.to = to;
	}

	public long getFrom() {
		return from;
	}

	public void setFrom(long from) {
		this.from = from;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public long getTo() {
		return to;
	}

	public void setTo(long to) {
		this.to = to;
	}

	@Override
	public String toString() {
		return "Line{" +
				"from=" + from +
				", text='" + text + '\'' +
				", to=" + to +
				'}';
	}
}
