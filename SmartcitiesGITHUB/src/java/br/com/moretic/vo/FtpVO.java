/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author LuisAugusto
 * 
 * Classe VO 
 * 
 * 
 */

public class FtpVO implements Serializable {

    private String nodeName, fullPath;
    private FileType type = FileType.DIR;
    private List<FtpVO> lFiles;
    private Long size = 0l;
    private boolean fail = false;

    public boolean isFail() {
        return fail;
    }

    public void setFail(boolean fail) {
        this.fail = fail;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }
    
    

    public FtpVO(String nodeName) {
        this.nodeName = nodeName;
        lFiles = new ArrayList<FtpVO>();
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 23 * hash + (this.fullPath != null ? this.fullPath.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final FtpVO other = (FtpVO) obj;
        if ((this.fullPath == null) ? (other.fullPath != null) : !this.fullPath.equals(other.fullPath)) {
            return false;
        }
        return true;
    }

    public String getFullPath() {
        return fullPath;
    }

    public void setFullPath(String fullPath) {
        this.fullPath = fullPath;
    }

    public void addFile(FtpVO vo) {
        this.lFiles.add(vo);
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public FileType getType() {
        return type;
    }

    public void setType(FileType type) {
        this.type = type;
    }

    public List<FtpVO> getlFiles() {
        return lFiles;
    }

    public void setlFiles(List<FtpVO> lFiles) {
        this.lFiles = lFiles;
    }

}
