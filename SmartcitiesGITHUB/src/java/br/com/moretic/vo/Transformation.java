/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.vo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 *
 * @author LuisAugusto
 */
@Entity
@Table(schema = "public", name = "transformation")
public class Transformation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "id_transformation", unique = true, nullable = false)
    @SequenceGenerator(name = "id_transformation_seq", sequenceName = "transform_id_transformation", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_transformation_seq")
    private Long id;

    @Basic
    private String tableTo;

    @Basic
    private String tableFrom;

    @OneToOne(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_next_t", nullable = false, insertable = false, updatable = false)
    private Transformation next;

    @Column(name = "id_next_t", updatable = true, insertable = true)
    private Long idNext;

    @Column(nullable = false)
    private Long maxIdLastOp = 0l;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_idprofile", nullable = false, insertable = false, updatable = false)
    private Profile owner;

    @JsonIgnore
    @Column(name = "profile_idprofile", nullable = false, insertable = true, updatable = true)
    private Integer idProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_from_database", updatable = false, insertable = false)
    private DataSource fromDatabase;

    @Column(name = "id_from_database", updatable = true, insertable = true)
    private Integer idFromDatabase;

    @ManyToOne
    @JoinColumn(name = "id_to_database", updatable = false, insertable = false)
    private DataSource toDatabase;

    @Column(name = "id_to_database", updatable = true, insertable = true)
    private Integer idToDatabase;

    @ManyToOne
    @JoinColumn(name = "id_from_source", updatable = false, insertable = false)
    private FileSource fromSource;

    @Column(name = "id_from_source", updatable = true, insertable = true)
    private Integer idFromSource;

    @ManyToOne
    @JoinColumn(name = "id_to_source", updatable = false, insertable = false)
    private FileSource toSource;

    @Column(name = "id_to_source", updatable = true, insertable = true)
    private Integer idToSource;

    @ElementCollection
    @MapKeyColumn(name = "f_from")
    @Column(name = "f_to")
    @CollectionTable(name = "transformation_fields", joinColumns = @JoinColumn(name = "transformation_fields_id"))
    private Map<String, String> myFields = new HashMap<String, String>();

    public DataSource getFromDatabase() {
        return fromDatabase;
    }

    public void setFromDatabase(DataSource fromDatabase) {
        this.fromDatabase = fromDatabase;
    }

    public DataSource getToDatabase() {
        return toDatabase;
    }

    public void setToDatabase(DataSource toDatabase) {
        this.toDatabase = toDatabase;
    }

    public FileSource getFromSource() {
        return fromSource;
    }

    public void setFromSource(FileSource fromSource) {
        this.fromSource = fromSource;
    }

    public FileSource getToSource() {
        return toSource;
    }

    public void setToSource(FileSource toSource) {
        this.toSource = toSource;
    }

    public Integer getIdFromDatabase() {
        return idFromDatabase;
    }

    public void setIdFromDatabase(Integer idFromDatabase) {
        this.idFromDatabase = idFromDatabase;
    }

    public Integer getIdToDatabase() {
        return idToDatabase;
    }

    public void setIdToDatabase(Integer idToDatabase) {
        this.idToDatabase = idToDatabase;
    }

    public Integer getIdFromSource() {
        return idFromSource;
    }

    public void setIdFromSource(Integer idFromSource) {
        this.idFromSource = idFromSource;
    }

    public Integer getIdToSource() {
        return idToSource;
    }

    public void setIdToSource(Integer idToSource) {
        this.idToSource = idToSource;
    }

    public Map<String, String> getMyFields() {
        return myFields;
    }

    public void mapField(String from, String to) {
        this.myFields.put(from, to);
    }

    public void setMyFields(Map<String, String> myFields) {
        this.myFields = myFields;
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

    public String getTableTo() {
        return tableTo;
    }

    public void setTableTo(String tableTo) {
        this.tableTo = tableTo;
    }

    public String getTableFrom() {
        return tableFrom;
    }

    public void setTableFrom(String tableFrom) {
        this.tableFrom = tableFrom;
    }

    public Long getId() {
        return id;
    }

    public Long getMaxIdLastOp() {
        return maxIdLastOp;
    }

    public void setMaxIdLastOp(Long maxIdLastOp) {
        this.maxIdLastOp = maxIdLastOp;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transformation getNext() {
        return next;
    }

    public void setNext(Transformation next) {
        this.idNext = next.getId();
        this.next = next;
    }

    public Long getIdNext() {
        return idNext;
    }

    public void setIdNext(Long idNext) {
        this.idNext = idNext;
    }

}
