package org.spiderflow.core.io;

import org.apache.commons.lang3.exception.ExceptionUtils;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;

public class ScriptResponse {

    private int exitValue;

    private ByteArrayOutputStream outputStream;

    private ByteArrayOutputStream errorStream;

    private String defaultCharset;

    private Throwable throwable;

    public ScriptResponse(int exitValue, ByteArrayOutputStream outputStream, ByteArrayOutputStream errorStream) {
        this.exitValue = exitValue;
        this.outputStream = outputStream;
        this.errorStream = errorStream;
    }

    public ScriptResponse(int exitValue, ByteArrayOutputStream outputStream, ByteArrayOutputStream errorStream,Throwable throwable) {
        this(exitValue,outputStream,errorStream);
        this.throwable = throwable;
    }

    public int getExitValue() {
        return exitValue;
    }

    public ScriptResponse charset(String charset){
        this.defaultCharset = charset;
        return this;
    }

    public String getValue() throws UnsupportedEncodingException {
        if(errorStream == null){
            return null;
        }
        return defaultCharset == null ? outputStream.toString() : outputStream.toString(defaultCharset);
    }

    public String getError() throws UnsupportedEncodingException {
        if(errorStream == null){
            return null;
        }
        return defaultCharset == null ? errorStream.toString() : errorStream.toString(defaultCharset);
    }

    public String getStack(){
        return this.throwable == null ? null : ExceptionUtils.getStackTrace(this.throwable);
    }
}
