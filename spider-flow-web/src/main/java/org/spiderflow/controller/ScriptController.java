package org.spiderflow.controller;

import org.spiderflow.core.io.ScriptResponse;
import org.spiderflow.core.model.ScriptFile;
import org.spiderflow.core.model.TreeNode;
import org.spiderflow.core.service.ScriptService;
import org.spiderflow.model.JsonBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/script")
public class ScriptController {

    @Autowired
    private ScriptService scriptService;

    @RequestMapping("/list")
    public JsonBean<List<String>> scripts(){
        return new JsonBean<>(scriptService.listScript());
    }

    @RequestMapping("/files")
    public JsonBean<TreeNode<ScriptFile>> files(String script){
        return new JsonBean<>(scriptService.list(script));
    }
    @RequestMapping("/create")
    public JsonBean<Boolean> create(String scriptName){
        return new JsonBean<>(scriptService.createScript(scriptName));
    }

    @RequestMapping("/create/file")
    public JsonBean<Boolean> createFile(String scriptName,String file,String dir){
        return new JsonBean<>(scriptService.createScriptFile(scriptName,file,"1".equalsIgnoreCase(dir)));
    }

    @RequestMapping("/remove/file")
    public JsonBean<Boolean> remove(String scriptName,String file){
        return new JsonBean<>(scriptService.removeScript(scriptName,file));
    }

    @RequestMapping("/rename/file")
    public JsonBean<Boolean> rename(String scriptName,String file,String newFile){
        return new JsonBean<>(scriptService.rename(scriptName,file,newFile));
    }

    @RequestMapping("/read")
    public JsonBean<String> read(String scriptName,String file) throws IOException {
        return new JsonBean<>(scriptService.read(scriptName,file));
    }

    @RequestMapping("/save")
    public JsonBean<Boolean> save(String scriptName,String file,String content){
        return new JsonBean<>(scriptService.saveScript(scriptName,file,content));
    }

    @RequestMapping("/test")
    public JsonBean<ScriptResponse> test(String scriptName, String file, String parameter, Integer timeout) {
        return new JsonBean<>(scriptService.execute(scriptName,file,parameter,timeout == null ? -1 : timeout));
    }
}
