/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(schema = "public", name = "kml_source")
public class KmlSource implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "idkmlsource", unique = true, nullable = false)
    @SequenceGenerator(name = "idkmlsource_seq", sequenceName = "kml_idkmlsource_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "idkmlsource_seq")
    private Long id = new Long(0);

    @Column(nullable = false, name = "kml_url")
    private String kmlUrl;

    @Column(nullable = false, name = "kml_desc")
    private String kmlDesc;

    public String getKmlDesc() {
        return kmlDesc;
    }

    public void setKmlDesc(String kmlDesc) {
        this.kmlDesc = kmlDesc;
    }

    
    
    public String getKmlUrl() {
        return kmlUrl;
    }

    public void setKmlUrl(String kmlUrl) {
        this.kmlUrl = kmlUrl;
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_idprofile", nullable = false, insertable = false, updatable = false)
    private Profile owner;

    @Column(name = "profile_idprofile", nullable = false, insertable = true, updatable = true)
    private Integer idProfile;

    public KmlSource(String url, String description,Profile p) {
        this.kmlUrl = url;
        this.kmlDesc = description;
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
        if (!(object instanceof KmlSource)) {
            return false;
        }
        KmlSource other = (KmlSource) object;
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
