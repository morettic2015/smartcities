package br.com.moretic.vo;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "lang", schema = "public")
public class Lang implements java.io.Serializable {

	@Id
	@Column(name = "id_lang", unique = true, nullable = false)
	@SequenceGenerator(name = "lang_seq", sequenceName = "lang_id_lang_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="lang_seq") 
	private int idLang;
	
	@Column(name = "lang", nullable = false, length = 50)
	private String lang;
	
	@Column(name = "token", nullable = false, length = 5)
	private String token;
	
	public Lang() {
	}

	public Lang(int idlang, String lang, String token) {
		this.idLang = idlang;
		this.lang = lang;
		this.token = token;
	}

	public int getIdLang() {
		return idLang;
	}

	public void setIdLang(int idLang) {
		this.idLang = idLang;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}