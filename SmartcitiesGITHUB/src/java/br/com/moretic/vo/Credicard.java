/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import javax.persistence.CascadeType;
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
@Table(name = "credicard", schema = "public")
public class Credicard implements Serializable, Comparable<Credicard> {

    @Id
    @Column(name = "idcredicard", unique = true, nullable = false)
    @SequenceGenerator(name = "credicard_seq", sequenceName = "credicard_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "credicard_seq")
    private Long idCredicard;
    @Column(name = "credicard_number", nullable = false, unique = true)
    private String credicardNumber;
    @Column(name = "credicard_code", nullable = false)
    private String credicardCode;
    @Column(name = "p_month", nullable = false)
    private String month;
    @Column(name = "p_year", nullable = false)
    private String year;
    @Column(name = "post_code", nullable = false)
    private String postingcode;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "credicard_idcountry", nullable = false, insertable = false, updatable = false)
    private Country country;
    @JsonIgnore
    @Column(name = "credicard_idcountry", nullable = false, insertable = true, updatable = true)
    private Integer idCountry;
    @Column(name = "p_name", nullable = false)
    private String p_name;
    @Column(name = "p_surname", nullable = false)
    private String p_surname;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credicard_idprofile", nullable = false, insertable = false, updatable = false)
    private Profile owner;
    @JsonIgnore
    @Column(name = "credicard_idprofile", nullable = false, insertable = true, updatable = true)
    private Integer idProfile;

    public Long getIdCredicard() {
        return idCredicard;
    }

    public void setIdCredicard(Long idCredicard) {
        this.idCredicard = idCredicard;
    }

    public String getCredicardNumber() {
        return credicardNumber;
    }

    public void setCredicardNumber(String credicardNumber) {
        this.credicardNumber = credicardNumber;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPostingcode() {
        return postingcode;
    }

    public void setPostingcode(String postingcode) {
        this.postingcode = postingcode;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public String getP_name() {
        return p_name;
    }

    public void setP_name(String p_name) {
        this.p_name = p_name.toUpperCase();
    }

    public String getP_surname() {
        return p_surname;
    }

    public void setP_surname(String p_surname) {
        this.p_surname = p_surname.toUpperCase();
    }

    public Integer getIdCountry() {
        return idCountry;
    }

    public void setIdCountry(Integer idCountry) {
        this.idCountry = idCountry;
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

    @Override
    public int compareTo(Credicard o) {
        return this.credicardNumber.compareTo(o.credicardNumber);
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 53 * hash + (this.credicardNumber != null ? this.credicardNumber.hashCode() : 0);
        hash = 53 * hash + (this.month != null ? this.month.hashCode() : 0);
        hash = 53 * hash + (this.year != null ? this.year.hashCode() : 0);
        hash = 53 * hash + (this.p_name != null ? this.p_name.hashCode() : 0);
        hash = 53 * hash + (this.p_surname != null ? this.p_surname.hashCode() : 0);
        return hash;
    }

    public String getCredicardCode() {
        return credicardCode;
    }

    public void setCredicardCode(String credicardCode) {
        this.credicardCode = credicardCode;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Credicard other = (Credicard) obj;
        if ((this.credicardNumber == null) ? (other.credicardNumber != null) : !this.credicardNumber.equals(other.credicardNumber)) {
            return false;
        }
        if ((this.month == null) ? (other.month != null) : !this.month.equals(other.month)) {
            return false;
        }
        if ((this.year == null) ? (other.year != null) : !this.year.equals(other.year)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "Credicard{" + "idCredicard=" + idCredicard + ", credicardNumber=" + credicardNumber + ", month=" + month + ", year=" + year + ", postingcode=" + postingcode + ", country=" + country + ", p_name=" + p_name + ", p_surname=" + p_surname + '}';
    }

}
