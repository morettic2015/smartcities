/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.*;
import javax.persistence.Table;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author LuisAugusto
 */
@Entity
@Table(name = "circle", schema = "public")
public class Circle implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "idcircle", unique = true, nullable = false)
    @SequenceGenerator(name = "circle_seq", sequenceName = "circle_idcircle_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "circle_seq")
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Profile getOwner() {
        return owner;
    }

    public void setOwner(Profile owner) {
        this.owner = owner;
    }

    public String getCircleName() {
        return circleName;
    }

    public void setCircleName(String circleName) {
        this.circleName = circleName;
    }
    
    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    private Profile owner;

    @ElementCollection
    @Column(name = "circle_member_id_profile")
    @CollectionTable(name = "circle_member", joinColumns = @JoinColumn(name = "circle_member_fk"))
    private List<Integer> myMembers = new ArrayList<Integer>(); 

    public List<Integer> getMyMembers() {
        return myMembers;
    }

    public void setMyMembers(List<Integer> myMembers) {
        this.myMembers = myMembers;
    }
    
    
    
    @Column(name = "circle_name", nullable = false)
    private String circleName;

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Circle)) {
            return false;
        }
        Circle other = (Circle) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "br.com.moretic.vo.Circle[ id=" + id + " ]";
    }

}
