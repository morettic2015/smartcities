/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import javax.persistence.Basic;
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
@Table(name = "ftp_client", schema = "public")
public class FtpClient implements Serializable {

    @Column(name = "fpass")
    private String pass;

    @Column(name = "fuser")
    private String user;
    
    @Column(name = "fhost")
    private String host;
    
    @Basic
    private int port;

    @Id
    @Column(name = "id_ftp_client", unique = true, nullable = false)
    @SequenceGenerator(name = "id_ftp_client_seq", sequenceName = "id_ftp_client_id_ftp_client_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_ftp_client_seq")
    private int idFtpClient;

    public FtpClient() {
    }

    public int getIdFtpClient() {
        return idFtpClient;
    }

    public void setIdFtpClient(int idFtpClient) {
        this.idFtpClient = idFtpClient;
    }

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_idprofile", nullable = false, insertable = false, updatable = false)
    private Profile owner;

    public Profile getOwner() {
        return owner;
    }

    public void setOwner(Profile owner) {
        this.owner = owner;
    }

    public FtpClient(String user, String pass, String host, int port, Profile owner) {
        this.user = user;
        this.pass = pass;
        this.host = host;
        this.port = port;
        this.owner = owner;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 59 * hash + (this.host != null ? this.host.hashCode() : 0);
        hash = 59 * hash + this.idFtpClient;
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
        final FtpClient other = (FtpClient) obj;
        if ((this.host == null) ? (other.host != null) : !this.host.equals(other.host)) {
            return false;
        }
        return this.idFtpClient == other.idFtpClient;
    }

}
