package org.spiderflow.io;

import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ReversedFileReader implements Closeable {

	private RandomAccessFile raf;

	private long index;

	private byte[] buf;

	public ReversedFileReader(File file, long index, int buffer) throws IOException {
		this.raf = new RandomAccessFile(file, "r");
		this.index = (index == -1 ? this.raf.length() : index);
		this.buf = new byte[buffer];
	}

	public List<String> readLines(int count) throws IOException {
		return readLines(count, null);
	}

	public List<String> readLines(int count,String keywords) throws IOException {
		List<String> lines = new ArrayList<>(count);
		byte[] temp = null;	//上次读取中换行之前的数据
		boolean find = false;
		while(index > -1 && count > 0){
			this.index = Math.max(0,this.index - this.buf.length);
			this.raf.seek(this.index);
			int len = this.raf.read(this.buf, 0, this.buf.length);
			int lastIndex = -1;
			if(len > -1){
				for (int i = len - 1; i >=0 && count > 0; i--) {	//倒序读取
					byte b = this.buf[i];
					if(b == 13 || b == 10){	//读取到\r或者\n
						if(temp != null || (lastIndex != -1 && lastIndex - i > 1)){
							int fromIndex = i + 1;
							int readLen = lastIndex == -1 ? len - i - 1 : lastIndex - i;
							String line = null;
							if(temp == null){
								line = new String(this.buf,fromIndex,readLen);
							}else if(temp.length + readLen > 0){
								byte[] data = new byte[temp.length + readLen];
								System.arraycopy(this.buf, fromIndex, data, 0, readLen);
								System.arraycopy(temp, 0, data, readLen, temp.length);
								line = new String(data);
							}
							temp = null;
							if(line != null){
								lines.add(line);
								count--;
								if(keywords != null && !find){
									find = line.contains(keywords);
									if(count == 0 && !find){
										lines.remove(0);
										count ++;
									}
								}
							}
						}
						lastIndex = i;
					}
				}
				int bufLen = lastIndex == -1 ? this.buf.length : lastIndex;
				byte[] data = new byte[bufLen];
				System.arraycopy(this.buf, 0, data, 0, bufLen);
				if(temp != null){
					byte[] newTemp = new byte[data.length + temp.length];
					System.arraycopy(data, 0, newTemp, 0, bufLen);
					System.arraycopy(temp, 0, newTemp, bufLen, temp.length);
					temp = newTemp;
				}else{
					temp = data;
				}
			}
		}
		if(temp != null){
			this.index = this.index + temp.length;
		}
		Collections.reverse(lines);
		return lines;
	}

	public long getIndex() {
		return index;
	}

	public static void main(String[] args) throws IOException {
		ReversedFileReader reader = new ReversedFileReader(new File("E:/b4430885ba8349588d1220d37eac831d.log"),-1,1024);
		reader.readLines(5,"author=宇润").forEach(System.out::println);
		System.out.println("--------------------------------------");
		reader = new ReversedFileReader(new File("E:/b4430885ba8349588d1220d37eac831d.log"),reader.getIndex(),1024);
		reader.readLines(5,"author=宇润").forEach(System.out::println);

	}

	@Override
	public void close() throws IOException {
		if(this.raf != null){
			this.raf.close();
		}
	}
}
