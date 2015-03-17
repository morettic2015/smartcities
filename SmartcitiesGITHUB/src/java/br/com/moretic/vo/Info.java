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
 * Info generated by hbm2java
 */
@Entity
@Table(name = "info", schema = "public")
public class Info implements java.io.Serializable {

	@Id
	@Column(name = "iddata_info", unique = true, nullable = false)
	private int iddataInfo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "iddata_source", nullable = false)
	private DataSource dataSource;

	@Column(name = "nm_info", length = 300)
	private String nmInfo;

	@Column(name = "de_info", length = 300)
	private String deInfo;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "info")
	private Set<Field> fields = new HashSet<Field>(0);

	public Info() {
	}

	public Info(int iddataInfo, DataSource dataSource) {
		this.iddataInfo = iddataInfo;
		this.dataSource = dataSource;
	}

	public Info(int iddataInfo, DataSource dataSource, String nmInfo,
			String deInfo, Set<Field> fields) {
		this.iddataInfo = iddataInfo;
		this.dataSource = dataSource;
		this.nmInfo = nmInfo;
		this.deInfo = deInfo;
		this.fields = fields;
	}

	public int getIddataInfo() {
		return this.iddataInfo;
	}

	public void setIddataInfo(int iddataInfo) {
		this.iddataInfo = iddataInfo;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public String getNmInfo() {
		return this.nmInfo;
	}

	public void setNmInfo(String nmInfo) {
		this.nmInfo = nmInfo;
	}

	public String getDeInfo() {
		return this.deInfo;
	}

	public void setDeInfo(String deInfo) {
		this.deInfo = deInfo;
	}

	public Set<Field> getFields() {
		return this.fields;
	}

	public void setFields(Set<Field> fields) {
		this.fields = fields;
	}

}
