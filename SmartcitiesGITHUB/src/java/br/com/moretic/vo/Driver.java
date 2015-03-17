package br.com.moretic.vo;

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

@Entity
@Table(name = "driver", schema = "public")
public class Driver implements java.io.Serializable {

	@Id
	@Column(name = "id", unique = true, nullable = false)
	@SequenceGenerator(name = "driver_id_seq", sequenceName = "driver_id_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "driver_id_seq")
	private int id;

	@Column(name = "driver_name", length = 200)
	private String driverName;

	@Column(name = "driver_classpath", length = 250)
	private String driverClasspath;

	// @Type(type="org.hibernate.type.BinaryType")
	@Column(name = "driver_binaries")
	byte[] driverBinaries;

	@Column(name = "driver_description", length = 200)
	private String driverDescription;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "driver_creator", nullable = false, insertable = false, updatable = false)
	private Profile driverCreator;

	@Column(name = "driver_creator", nullable = false, insertable = true, updatable = true)
	private Integer idProfileDriverCreator;


	public Driver() {
	}

	public Driver(int id) {
		this.id = id;
	}

	public Driver(int id, String driverName, String driverClasspath,
			byte[] driverBinaries, String driverDescription,
			Profile driverCreator) {
		this.id = id;
		this.driverName = driverName;
		this.driverClasspath = driverClasspath;
		this.driverBinaries = driverBinaries;
		this.driverDescription = driverDescription;
		this.driverCreator = driverCreator;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}

	public String getDriverClasspath() {
		return driverClasspath;
	}

	public void setDriverClasspath(String driverClasspath) {
		this.driverClasspath = driverClasspath;
	}

	public byte[] getDriverBinaries() {
		return driverBinaries;
	}

	public void setDriverBinaries(byte[] driverBinaries) {
		this.driverBinaries = driverBinaries;
	}

	public String getDriverDescription() {
		return driverDescription;
	}

	public void setDriverDescription(String driverDescription) {
		this.driverDescription = driverDescription;
	}

	public Profile getDriverCreator() {
		return driverCreator;
	}

	public void setDriverCreator(Profile driverCreator) {
		this.driverCreator = driverCreator;
	}

	public Integer getIdProfileDriverCreator() {
		return idProfileDriverCreator;
	}

	public void setIdProfileDriverCreator(Integer idProfileDriverCreator) {
		this.idProfileDriverCreator = idProfileDriverCreator;
	}

}
