/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Cacheable;
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
import javax.persistence.Temporal;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 *
 * @author LuisAugusto
 */
@Entity
@Table(name = "profile_log", schema = "public")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class UserLog implements Serializable, Comparable<UserLog> {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "idlog", unique = true, nullable = false)
    @SequenceGenerator(name = "idlog_seq", sequenceName = "log_idlog_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "idlog_seq")
    private Long id;

    public Long getId() {
        return id;
    }
    @Column(name = "ip_addr", nullable = false, updatable = false)
    private String ipAddrs;

    @Column(name = "log_action", nullable = false, updatable = false)
    private String action;

    @XmlTransient
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profile", nullable = false, insertable = false, updatable = false)
    private Profile profile;
    @XmlTransient
    @JsonIgnore
    @Column(name = "id_profile", nullable = false, insertable = true, updatable = false)
    private Integer idProfile;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    @Column(name = "log_date_time", nullable = false)
    private Date dTime = new Date();

    public String getIpAddrs() {
        return ipAddrs;
    }

    public void setIpAddrs(String ipAddrs) {
        this.ipAddrs = ipAddrs;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Date getdTime() {
        return dTime;
    }

    public void setdTime(Date dTime) {
        this.dTime = dTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @XmlTransient
    @JsonIgnore
    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    @XmlTransient
    @JsonIgnore
    public Integer getIdProfile() {
        return idProfile;
    }

    public void setIdProfile(Integer idProfile) {
        this.idProfile = idProfile;
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
        if (!(object instanceof UserLog)) {
            return false;
        }
        UserLog other = (UserLog) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "br.com.moretic.vo.UserLog[ id=" + id + " ]";
    }

    @Override
    public int compareTo(UserLog o) {
        return o.getId().compareTo(this.getId());
    }

}
