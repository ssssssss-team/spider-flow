package org.spiderflow.core.executor.function;

import org.apache.commons.codec.digest.DigestUtils;
import org.spiderflow.annotation.Comment;
import org.spiderflow.annotation.Example;
import org.spiderflow.executor.FunctionExecutor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
@Comment("MD5常用方法")
public class MD5FunctionExecutor implements FunctionExecutor {

    @Override
    public String getFunctionPrefix() {
        return "md5";
    }

    @Comment("md5加密")
    @Example("${md5.string(resp.html)}")
    public static String string(String str){
        return DigestUtils.md5Hex(str);
    }

    @Comment("md5加密")
    @Example("${md5.string(resp.bytes)}")
    public static String string(byte[] bytes){
        return DigestUtils.md5Hex(bytes);
    }

    @Comment("md5加密")
    @Example("${md5.string(resp.stream)}")
    public static String string(InputStream stream) throws IOException {
        return DigestUtils.md5Hex(stream);
    }

    @Comment("md5加密")
    @Example("${md5.bytes(resp.html)}")
    public static byte[] bytes(String str){
        return DigestUtils.md5(str);
    }

    @Comment("md5加密")
    @Example("${md5.bytes(resp.bytes)}")
    public static byte[] bytes(byte[] bytes){
        return DigestUtils.md5(bytes);
    }

    @Comment("md5加密")
    @Example("${md5.bytes(resp.stream)}")
    public static byte[] bytes(InputStream stream) throws IOException {
        return DigestUtils.md5(stream);
    }
}
