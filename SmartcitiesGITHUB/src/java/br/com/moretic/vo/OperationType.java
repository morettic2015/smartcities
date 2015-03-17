package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * OperationType generated by hbm2java
 */
@Entity
@Table(name = "operation_type", schema = "public")
public class OperationType implements java.io.Serializable {

	@Id
	@Column(name = "idoperation_type", unique = true, nullable = false)
	private int idoperationType;

	@Column(name = "de_op", length = 45)
	private String deOp;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "operationType")
	private Set<ShareLog> shareLogs = new HashSet<ShareLog>(0);

	public OperationType() {
	}

	public OperationType(int idoperationType) {
		this.idoperationType = idoperationType;
	}

	public OperationType(int idoperationType, String deOp,
			Set<ShareLog> shareLogs) {
		this.idoperationType = idoperationType;
		this.deOp = deOp;
		this.shareLogs = shareLogs;
	}

	public int getIdoperationType() {
		return this.idoperationType;
	}

	public void setIdoperationType(int idoperationType) {
		this.idoperationType = idoperationType;
	}

	public String getDeOp() {
		return this.deOp;
	}

	public void setDeOp(String deOp) {
		this.deOp = deOp;
	}

	public Set<ShareLog> getShareLogs() {
		return this.shareLogs;
	}

	public void setShareLogs(Set<ShareLog> shareLogs) {
		this.shareLogs = shareLogs;
	}

}
