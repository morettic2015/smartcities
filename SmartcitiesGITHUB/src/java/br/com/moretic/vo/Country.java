package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 * Country generated by hbm2java
 */
@Entity
@Table(name = "country", schema = "public")
public class Country implements java.io.Serializable {

	@Id
	@Column(name = "idcountry", unique = true, nullable = false)
	@SequenceGenerator(name = "country_seq", sequenceName = "country_id_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="country_seq") 
	private int idcountry;

	@Column(name = "nm_country", length = 45)
	private String nmCountry;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "country")
	private Set<State> states = new HashSet<State>(0);

	public Country() {
	}

	public Country(int idcountry) {
		this.idcountry = idcountry;
	}

	public Country(int idcountry, String nmCountry, Set<State> states) {
		this.idcountry = idcountry;
		this.nmCountry = nmCountry;
		this.states = states;
	}

	public int getIdcountry() {
		return this.idcountry;
	}

	public void setIdcountry(int idcountry) {
		this.idcountry = idcountry;
	}

	public String getNmCountry() {
		return this.nmCountry;
	}

	public void setNmCountry(String nmCountry) {
		this.nmCountry = nmCountry;
	}

	public Set<State> getStates() {
		return this.states;
	}

	public void setStates(Set<State> states) {
		this.states = states;
	}

}