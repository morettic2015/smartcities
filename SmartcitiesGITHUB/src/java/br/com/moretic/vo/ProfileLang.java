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
@Table(name = "profile_lang", schema = "public")
public class ProfileLang implements java.io.Serializable {

	@Id
	@Column(name = "id", unique = true, nullable = false)
	@SequenceGenerator(name = "profile_lang_seq", sequenceName = "profile_lang_id_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="profile_lang_seq") 
	private int id;
	
	@Column(name = "is_main_language")
	private Boolean isMainLanguage;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_profile", nullable = false, insertable = false, updatable = false)
	private Profile profile;
	
	@Column(name = "id_profile", nullable = false, insertable = true, updatable = true)
	private Integer idProfile;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_lang", nullable = false, insertable = false, updatable = false)
	private Lang lang;
	
	@Column(name = "id_lang", nullable = false, insertable = true, updatable = true)
	private Integer idLang;

	public ProfileLang() {
	}

	public ProfileLang(int id, Boolean isMainLanguage, Profile profile, Lang lang) {
		this.id = id;
		this.profile = profile;
		this.idProfile = profile.getIdprofile();
		this.lang = lang;
		this.idLang = lang.getIdLang();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Boolean getIsMainLanguage() {
		return isMainLanguage;
	}

	public void setIsMainLanguage(Boolean isMainLanguage) {
		this.isMainLanguage = isMainLanguage;
	}

	public Profile getProfile() {
		return profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	public Integer getIdProfile() {
		return idProfile;
	}

	public void setIdProfile(Integer idProfile) {
		this.idProfile = idProfile;
	}

	public Lang getLang() {
		return lang;
	}

	public void setLang(Lang lang) {
		this.lang = lang;
	}

	public Integer getIdLang() {
		return idLang;
	}

	public void setIdLang(Integer idLang) {
		this.idLang = idLang;
	}
}