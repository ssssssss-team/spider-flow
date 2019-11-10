package org.spiderflow.io;

import java.io.Closeable;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class RandomAccessFileReader implements Closeable {

	private RandomAccessFile raf;

	/**
	 * 从index位置开始读取
	 */
	private long index;

	/**
	 * 读取顺序，默认倒叙
	 */
	private boolean reversed;

	/**
	 * 缓冲区大小
	 */
	private int bufSize;

	public RandomAccessFileReader(RandomAccessFile raf, long index, boolean reversed) throws IOException {
		this(raf, index, 1024, reversed);
	}

	public RandomAccessFileReader(RandomAccessFile raf, long index, int bufSize, boolean reversed) throws IOException {
		if (raf == null) {
			throw new NullPointerException("file is null");
		}
		this.raf = raf;
		this.reversed = reversed;
		this.bufSize = bufSize;
		this.index = index;
		this.init();
	}

	private void init() throws IOException {
		if (reversed) {
			this.index = this.index == -1 ? this.raf.length() : Math.min(this.index, this.raf.length());
		} else {
			this.index = Math.min(Math.max(this.index, 0), this.raf.length());
		}
		if (this.index > 0) {
			this.raf.seek(this.index);
		}
	}

	/**
	 * 读取n行
	 *
	 * @param n        要读取的行数
	 * @param keywords 搜索的关键词
	 * @param matchcase 是否区分大小写
	 * @param regx 是否是正则搜索
	 * @return 返回Line对象，包含行的起始位置与终止位置
	 */
	public List<Line> readLine(int n, String keywords, boolean matchcase, boolean regx) throws IOException {
		List<Line> lines = new ArrayList<>(n);
		long lastCRLFIndex = reversed ? this.index : (this.index > 0 ? this.index + 1 : -1);
		boolean find = keywords == null || keywords.isEmpty();
		Pattern pattern = regx && !find ? Pattern.compile(keywords) : null;
		while (n > 0) {
			byte[] buf = reversed ? new byte[(int) Math.min(this.bufSize, this.index)] : new byte[this.bufSize];
			if (this.reversed) {
				if (this.index == 0) {
					break;
				}
				this.raf.seek(this.index -= buf.length);
			}
			int len = this.raf.read(buf, 0, buf.length);
			if (len == -1) {    //已读完
				break;
			}
			for (int i = 0; i < len && n > 0; i++) {
				int readIndex = reversed ? len - i - 1 : i;
				if (isCRLF(buf[readIndex])) {    //如果读取到\r或\n
					if (Math.abs(this.index + readIndex - lastCRLFIndex) > 1) { //两行之间的间距,当=1时则代表有\r\n,\n\r,\r\r,\n\n四种情况之一
						long fromIndex = reversed ? this.index + readIndex : lastCRLFIndex;    //计算起止位置
						long endIndex = reversed ? lastCRLFIndex : this.index + readIndex;    //计算终止位置
						Line line = readLine(fromIndex + 1, endIndex);    //取出文本
						if (find || (find = (pattern == null ? find(line.getText(), keywords, matchcase) : find(line.getText(), pattern)))) {    //定位查找，使被查找的行始终在第一行
							if (reversed) {
								lines.add(0, line);    //反向查找时，插入到List头部
							} else {
								lines.add(line);
							}
							n--;
						}
					}
					lastCRLFIndex = this.index + readIndex;    //记录上次读取到的\r或\n位置
				}
			}
			if (!reversed) {
				this.index += buf.length;
			}
		}
		if (reversed && n > 0 && lastCRLFIndex > 1 && (find || lines.size() > 0)) {
			lines.add(0, readLine(0, lastCRLFIndex));
		}
		return lines;
	}

	private boolean find(String text, String keywords, boolean matchcase) {
		return matchcase ? text.contains(keywords) : text.toLowerCase().contains(keywords.toLowerCase());
	}

	private boolean find(String text, Pattern pattern) {
		return pattern.matcher(text).find();
	}

	/**
	 * 从指定位置读取一行
	 *
	 * @param fromIndex 开始位置
	 * @param endIndex  结束位置
	 * @return 返回Line对象
	 * @throws IOException
	 */
	private Line readLine(long fromIndex, long endIndex) throws IOException {
		long index = this.raf.getFilePointer();
		this.raf.seek(fromIndex);
		byte[] buf = new byte[(int) (endIndex - fromIndex)];
		this.raf.read(buf, 0, buf.length);
		Line line = new Line(fromIndex, new String(buf), endIndex);
		this.raf.seek(index);
		return line;
	}

	private boolean isCRLF(byte b) {
		return b == 13 || b == 10;
	}

	@Override
	public void close() throws IOException {
		if (this.raf != null) {
			this.raf.close();
		}
	}
}
