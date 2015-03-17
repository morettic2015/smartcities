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
@Table(name = "security_info", schema = "public")
public class SecurityInfo implements java.io.Serializable {

	@Id
	@Column(name = "id", unique = true, nullable = false)
	@SequenceGenerator(name = "security_seq", sequenceName = "security_info_id_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="security_seq") 
	private int id;
	
	@Column(name = "telefone_recorey1", nullable = false, length = 50)
	private String telefoneRecorey1;
	
	@Column(name = "telefone_recorey2", nullable = false, length = 50)
	private String telefoneRecorey2;
	
	@Column(name = "email_recorey1", nullable = false, length = 50)
	private String emailRecorey1;
	
	@Column(name = "secret_word", nullable = false, length = 100)
	private String secretWord;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_profile", nullable = false, insertable = false, updatable = false)
	private Profile profile;
	
	@Column(name = "id_profile", nullable = false, insertable = true, updatable = true)
	private Integer idProfile;

	public SecurityInfo() {
	}

	public SecurityInfo(int id, String telefoneRecorey1, String telefoneRecorey2, String emailRecorey1, String secretWord, Profile profile) {
		this.id = id;
		this.telefoneRecorey1 = telefoneRecorey1;
		this.telefoneRecorey2 = telefoneRecorey2;
		this.emailRecorey1 = emailRecorey1;
		this.secretWord = secretWord;
		this.profile = profile;
		this.idProfile = profile.getIdprofile();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTelefoneRecorey1() {
		return telefoneRecorey1;
	}

	public void setTelefoneRecorey1(String telefoneRecorey1) {
		this.telefoneRecorey1 = telefoneRecorey1;
	}

	public String getTelefoneRecorey2() {
		return telefoneRecorey2;
	}

	public void setTelefoneRecorey2(String telefoneRecorey2) {
		this.telefoneRecorey2 = telefoneRecorey2;
	}

	public String getEmailRecorey1() {
		return emailRecorey1;
	}

	public void setEmailRecorey1(String emailRecorey1) {
		this.emailRecorey1 = emailRecorey1;
	}

	public String getSecretWord() {
		return secretWord;
	}

	public void setSecretWord(String secretWord) {
		this.secretWord = secretWord;
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
	
}