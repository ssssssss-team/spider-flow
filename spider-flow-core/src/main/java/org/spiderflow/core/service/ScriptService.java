package org.spiderflow.core.service;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteWatchdog;
import org.apache.commons.exec.PumpStreamHandler;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spiderflow.core.io.ScriptResponse;
import org.spiderflow.core.model.ScriptFile;
import org.spiderflow.core.model.TreeNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class ScriptService {

    @Value("${spider.workspace}")
    private String workspace;

    @Autowired
    private static Logger logger = LoggerFactory.getLogger(ScriptService.class);

    /**
     * 保存脚本
     * @param scriptName    脚本名称
     * @param filename      文件名
     * @param content       脚本内容
     * @throws IOException
     */
    public boolean saveScript(String scriptName,String filename,String content){
        try {
            FileUtils.write(getScriptFile(scriptName,filename),content,"UTF-8");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public ScriptResponse execute(String scriptName, String filename, String parameters, int timeout) {
        String command = "";
        if(filename.endsWith(".py")){
            command = "python ";
        }else if(filename.endsWith(".js")){
            command = "node ";
        }else{
            return new ScriptResponse(-2,null,null,null);
        }
        command+= filename;
        if(parameters != null){
            command += " " + parameters;
        }
        logger.info("准备执行命令:{}",command);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ByteArrayOutputStream errorStream = new ByteArrayOutputStream();
        try{
            File directory = getScriptDirectory(scriptName);
            CommandLine commandLine = CommandLine.parse(command);
            DefaultExecutor executor = new DefaultExecutor();
            ExecuteWatchdog watchdog = new ExecuteWatchdog(timeout);
            executor.setWatchdog(watchdog);
            executor.setWorkingDirectory(directory);
            PumpStreamHandler handler = new PumpStreamHandler(outputStream, errorStream);
            executor.setStreamHandler(handler);
            int value = executor.execute(commandLine);
            logger.info("命令{}执行完毕,exitValue={}",command,value);
            return new ScriptResponse(value,outputStream,errorStream);
        } catch (Exception e) {
            logger.error("执行脚本失败",e);
            return new ScriptResponse(-1,outputStream,errorStream,e);
        }
    }

    public File getScriptFile(String scriptName,String filename){
        File file = new File(getScriptDirectory(scriptName),filename);
        File dir = file.getParentFile();
        if(!dir.exists()){
            dir.mkdirs();
        }
        return file;
    }

    private File getScriptDirectory(String scriptName){
        File directory =  new File(new File(workspace,"scripts"),scriptName);
        if(!directory.exists()){
            directory.mkdirs();
        }
        return directory;
    }

    public String read(String scriptName,String filename) throws IOException {
        File file = getScriptFile(scriptName, filename);
        if(!file.exists()){
            return null;
        }
        return FileUtils.readFileToString(file,"UTF-8");
    }

    public boolean rename(String scriptName,String oldName,String newName){
        File directory = getScriptDirectory(scriptName);
        return new File(directory, oldName).renameTo(new File(directory,newName));
    }

    /**
     * 删除脚本
     * @param scriptName    脚本名称
     * @param filename      文件名
     */
    public boolean removeScript(String scriptName,String filename) {
        try {
            File scriptDirectory = getScriptDirectory(scriptName);
            if(StringUtils.isBlank(filename)){
                FileUtils.deleteDirectory(scriptDirectory);
            }else{
                File file = getScriptFile(scriptName, filename);
                if(!file.exists()){
                    return false;
                }
                if(file.isDirectory()){
                    FileUtils.deleteDirectory(file);
                    return true;
                }
                return file.delete();
            }
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public List<String> listScript(){
        String[] files = new File(workspace, "scripts").list();
        if(files != null){
            Arrays.sort(files);
            return Arrays.asList(files);
        }else{
            return Collections.emptyList();
        }
    }

    public boolean createScript(String scriptName){
        File file = new File(new File(workspace,"scripts"),scriptName);
        if(file.exists()){
            return false;
        }
        return file.mkdirs();
    }

    public boolean createScriptFile(String scriptName,String file,boolean directory){
        File dir = getScriptDirectory(scriptName);
        File f = new File(dir, file);
        File parentFile = f.getParentFile();
        parentFile.mkdirs();
        try {
            return directory ? f.mkdirs() : f.createNewFile();
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * 循环遍历
     */
    public TreeNode<ScriptFile> list(String scriptName){
        return list(getScriptDirectory(scriptName),null,"");
    }

    private TreeNode<ScriptFile> list(File file,TreeNode<ScriptFile> node, String parentName){
        ScriptFile scriptFile = new ScriptFile(file.getName(),parentName,file.isDirectory());
        TreeNode<ScriptFile> current = new TreeNode<>(scriptFile);
        if(node != null){
            node.addNode(current);
        }
        if(file.isDirectory()){
            File[] files = file.listFiles();
            if(files != null){
                for (File child : files) {
                    list(child,current,(parentName.isEmpty() ? "" : parentName + File.separator) + child.getName());
                }
            }
        }
        return current;
    }
}
