package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * Field generated by hbm2java
 */
@Entity
@Table(name = "field", schema = "public")
public class Field implements java.io.Serializable {

	@Id
	@Column(name = "iddata_field", unique = true, nullable = false)
	private int iddataField;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "field_type_idfield_type", nullable = false)
	private FieldType fieldType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "field_mask_idfield_mask")
	private FieldMask fieldMask;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "iddata_info", nullable = false)
	private Info info;

	@Column(name = "nm_field", nullable = false, length = 300)
	private String nmField;

	@Column(name = "de_field", length = 600)
	private String deField;

	@Column(name = "label", length = 100)
	private String label;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "fieldByFieldIddataFrom")
	private Set<Relationship> relationshipsForFieldIddataFrom = new HashSet<Relationship>(
			0);

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "fieldByFieldIddataTo")
	private Set<Relationship> relationshipsForFieldIddataTo = new HashSet<Relationship>(
			0);

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "field")
	private Set<TxnLog> txnLogs = new HashSet<TxnLog>(0);

	public Field() {
	}

	public Field(int iddataField, FieldType fieldType, Info info, String nmField) {
		this.iddataField = iddataField;
		this.fieldType = fieldType;
		this.info = info;
		this.nmField = nmField;
	}

	public Field(int iddataField, FieldType fieldType, FieldMask fieldMask,
			Info info, String nmField, String deField, String label,
			Set<Relationship> relationshipsForFieldIddataFrom,
			Set<Relationship> relationshipsForFieldIddataTo, Set<TxnLog> txnLogs) {
		this.iddataField = iddataField;
		this.fieldType = fieldType;
		this.fieldMask = fieldMask;
		this.info = info;
		this.nmField = nmField;
		this.deField = deField;
		this.label = label;
		this.relationshipsForFieldIddataFrom = relationshipsForFieldIddataFrom;
		this.relationshipsForFieldIddataTo = relationshipsForFieldIddataTo;
		this.txnLogs = txnLogs;
	}

	public int getIddataField() {
		return this.iddataField;
	}

	public void setIddataField(int iddataField) {
		this.iddataField = iddataField;
	}

	public FieldType getFieldType() {
		return this.fieldType;
	}

	public void setFieldType(FieldType fieldType) {
		this.fieldType = fieldType;
	}

	public FieldMask getFieldMask() {
		return this.fieldMask;
	}

	public void setFieldMask(FieldMask fieldMask) {
		this.fieldMask = fieldMask;
	}

	public Info getInfo() {
		return this.info;
	}

	public void setInfo(Info info) {
		this.info = info;
	}

	public String getNmField() {
		return this.nmField;
	}

	public void setNmField(String nmField) {
		this.nmField = nmField;
	}

	public String getDeField() {
		return this.deField;
	}

	public void setDeField(String deField) {
		this.deField = deField;
	}

	public String getLabel() {
		return this.label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public Set<Relationship> getRelationshipsForFieldIddataFrom() {
		return this.relationshipsForFieldIddataFrom;
	}

	public void setRelationshipsForFieldIddataFrom(
			Set<Relationship> relationshipsForFieldIddataFrom) {
		this.relationshipsForFieldIddataFrom = relationshipsForFieldIddataFrom;
	}

	public Set<Relationship> getRelationshipsForFieldIddataTo() {
		return this.relationshipsForFieldIddataTo;
	}

	public void setRelationshipsForFieldIddataTo(
			Set<Relationship> relationshipsForFieldIddataTo) {
		this.relationshipsForFieldIddataTo = relationshipsForFieldIddataTo;
	}

	public Set<TxnLog> getTxnLogs() {
		return this.txnLogs;
	}

	public void setTxnLogs(Set<TxnLog> txnLogs) {
		this.txnLogs = txnLogs;
	}

}