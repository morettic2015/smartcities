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
 * ShareType generated by hbm2java
 */
@Entity
@Table(name = "share_type", schema = "public")
public class ShareType implements java.io.Serializable {

	@Id
	@SequenceGenerator(name = "share_type_seq", sequenceName = "share_type_idshare_type_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="share_type_seq") 
	@Column(name = "idshare_type", unique = true, nullable = false)
	private int idshareType;

	@Column(name = "de_share", nullable = false, length = 600)
	private String deShare;

	@Column(name = "nm_share", nullable = false, length = 200)
	private String nmShare;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "shareType")
	private Set<ShareView> shareViews = new HashSet<ShareView>(0);

	public ShareType() {
	}

	public ShareType(int idshareType, String deShare, String nmShare) {
		this.idshareType = idshareType;
		this.deShare = deShare;
		this.nmShare = nmShare;
	}

	public ShareType(int idshareType, String deShare, String nmShare,
			Set<ShareView> shareViews) {
		this.idshareType = idshareType;
		this.deShare = deShare;
		this.nmShare = nmShare;
		this.shareViews = shareViews;
	}

	public int getIdshareType() {
		return this.idshareType;
	}

	public void setIdshareType(int idshareType) {
		this.idshareType = idshareType;
	}

	public String getDeShare() {
		return this.deShare;
	}

	public void setDeShare(String deShare) {
		this.deShare = deShare;
	}

	public String getNmShare() {
		return this.nmShare;
	}

	public void setNmShare(String nmShare) {
		this.nmShare = nmShare;
	}

	public Set<ShareView> getShareViews() {
		return this.shareViews;
	}

	public void setShareViews(Set<ShareView> shareViews) {
		this.shareViews = shareViews;
	}

}
