package org.spiderflow.core.model;

public class ScriptFile {

    private String name;

    private String path;

    private boolean directory;

    public ScriptFile(String name, String path, boolean directory) {
        this.name = name;
        this.path = path;
        this.directory = directory;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isDirectory() {
        return directory;
    }

    public void setDirectory(boolean directory) {
        this.directory = directory;
    }

    @Override
    public String toString() {
        return "ScriptFile{" +
                "name='" + name + '\'' +
                ", path='" + path + '\'' +
                ", directory=" + directory +
                '}';
    }
}
