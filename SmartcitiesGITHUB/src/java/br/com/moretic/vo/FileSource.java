/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author LuisAugusto
 */
@Entity
@Table(schema = "public", name = "file_source")
public class FileSource implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "id_file_source", unique = true, nullable = false)
    @SequenceGenerator(name = "id_file_source_seq", sequenceName = "file_id_file_source", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_file_source_seq")
    private Long id = new Long(0);

    @Column(nullable = false, name = "f_version")
    private int vesionNr = 1;

    public void incVersion() {
        this.vesionNr++;
    }
    @Column(nullable = false, name = "f_uri")
    private String fileURI;

    @Column(nullable = false, name = "f_url")
    private String fileUrl;

    @Column(nullable = false, name = "f_desc")
    private String fileDesc;

    @Column(nullable = false, name = "f_title")
    private String fileTit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "f_type")
    private FileType myTp;

    public String getFileURI() {
        return fileURI;
    }

    public void setFileURI(String fileURI) {
        this.fileURI = fileURI;
    }

    public int getVesionNr() {
        return vesionNr;
    }

    public void setVesionNr(int vesionNr) {
        this.vesionNr = vesionNr;
    }

    public FileType getMyTp() {
        return myTp;
    }

    public void setMyTp(FileType myTp) {
        this.myTp = myTp;
    }

    public FileSource() {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileDesc() {
        return fileDesc;
    }

    public void setFileDesc(String fileDesc) {
        this.fileDesc = fileDesc;
    }

    public String getFileTit() {
        return fileTit;
    }

    public void setFileTit(String fileTit) {
        this.fileTit = fileTit;
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_idprofile", nullable = false, insertable = false, updatable = false)
    private Profile owner;

    @JsonIgnore
    @Column(name = "profile_idprofile", nullable = false, insertable = true, updatable = true)
    private Integer idProfile;

    public FileSource(String url, String description, Profile p) {
        this.fileUrl = url;
        this.fileDesc = description;
        this.owner = p;
        this.idProfile = p.getIdprofile();
    }

    public Profile getOwner() {
        return owner;
    }

    public void setOwner(Profile owner) {
        this.owner = owner;
    }

    public Integer getIdProfile() {
        return idProfile;
    }

    public void setIdProfile(Integer idProfile) {
        this.idProfile = idProfile;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof FileSource)) {
            return false;
        }
        FileSource other = (FileSource) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "br.com.moretic.vo.KmlSource[ id=" + id + " ]";
    }

}
