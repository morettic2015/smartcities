/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import br.com.moretic.util.EnumCriteriaType;
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
import javax.persistence.Table;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author LuisAugusto
 */
@Entity
@Table(name = "sql_filter_data", schema = "public")
public class SQLFilter implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "f_field", nullable = false, length = 200)
    private String fField;

    @Enumerated(EnumType.ORDINAL)
    private EnumCriteriaType criteria;

    @Column(name = "f_value", nullable = false, length = 500)
    private String fValue;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transformation_id_t1", nullable = false, insertable = false, updatable = false)
    private Transformation t1;
   
    @JsonIgnore
    @Column(name = "transformation_id_t1", nullable = false, insertable = true, updatable = true)
    private Integer idT1;

    public Transformation getT1() {
        return t1;
    }

    public void setT1(Transformation t1) {
        this.t1 = t1;
    }

    public Integer getIdT1() {
        return idT1;
    }

    public void setIdT1(Integer idT1) {
        this.idT1 = idT1;
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
        if (!(object instanceof SQLFilter)) {
            return false;
        }
        SQLFilter other = (SQLFilter) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "br.com.moretic.vo.SQLFilter[ id=" + id + " ]";
    }

    public String getfField() {
        return fField;
    }

    public void setfField(String fField) {
        this.fField = fField;
    }

    public EnumCriteriaType getCriteria() {
        return criteria;
    }

    public void setCriteria(EnumCriteriaType criteria) {
        this.criteria = criteria;
    }

    public String getfValue() {
        return fValue;
    }

    public void setfValue(String fValue) {
        this.fValue = fValue;
    }

}
