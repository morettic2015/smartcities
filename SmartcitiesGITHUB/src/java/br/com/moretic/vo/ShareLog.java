package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * ShareLog generated by hbm2java
 */
@Entity
@Table(name = "share_log", schema = "public")
public class ShareLog implements java.io.Serializable {

	@Id
	@Column(name = "idshare_log", unique = true, nullable = false)
	private int idshareLog;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumns({
			@JoinColumn(name = "share_from_to_idprofile_user", referencedColumnName = "idprofile_user", nullable = false),
			@JoinColumn(name = "share_from_to_idprofile_owner", referencedColumnName = "iddata_source", nullable = false),
			@JoinColumn(name = "share_from_to_iddata_source", referencedColumnName = "idprofile_owner", nullable = false) })
	private ShareViewWith shareViewWith;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "operation_type_idoperation_type", nullable = false)
	private OperationType operationType;

	@Temporal(TemporalType.DATE)
	@Column(name = "date", length = 13)
	private Date date;

	@Column(name = "ip", length = 30)
	private String ip;

	@Column(name = "info_log", length = 4000)
	private String infoLog;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "shareLog")
	private Set<TxnLog> txnLogs = new HashSet<TxnLog>(0);

	public ShareLog() {
	}

	public ShareLog(int idshareLog, ShareViewWith shareViewWith,
			OperationType operationType) {
		this.idshareLog = idshareLog;
		this.shareViewWith = shareViewWith;
		this.operationType = operationType;
	}

	public ShareLog(int idshareLog, ShareViewWith shareViewWith,
			OperationType operationType, Date date, String ip, String infoLog,
			Set<TxnLog> txnLogs) {
		this.idshareLog = idshareLog;
		this.shareViewWith = shareViewWith;
		this.operationType = operationType;
		this.date = date;
		this.ip = ip;
		this.infoLog = infoLog;
		this.txnLogs = txnLogs;
	}

	public int getIdshareLog() {
		return this.idshareLog;
	}

	public void setIdshareLog(int idshareLog) {
		this.idshareLog = idshareLog;
	}

	public ShareViewWith getShareViewWith() {
		return this.shareViewWith;
	}

	public void setShareViewWith(ShareViewWith shareViewWith) {
		this.shareViewWith = shareViewWith;
	}

	public OperationType getOperationType() {
		return this.operationType;
	}

	public void setOperationType(OperationType operationType) {
		this.operationType = operationType;
	}

	public Date getDate() {
		return this.date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getIp() {
		return this.ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getInfoLog() {
		return this.infoLog;
	}

	public void setInfoLog(String infoLog) {
		this.infoLog = infoLog;
	}

	public Set<TxnLog> getTxnLogs() {
		return this.txnLogs;
	}

	public void setTxnLogs(Set<TxnLog> txnLogs) {
		this.txnLogs = txnLogs;
	}

}
