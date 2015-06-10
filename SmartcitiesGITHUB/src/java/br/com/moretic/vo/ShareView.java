package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import java.util.HashSet;
import java.util.Set;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnore;

/**
 * ShareView generated by hbm2java
 */
@Entity
@Table(name = "share_view", schema = "public")
public class ShareView implements java.io.Serializable {

	@EmbeddedId
	@AttributeOverrides({
			@AttributeOverride(name = "idprofileOwner", column = @Column(name = "idprofile_owner", nullable = false, insertable = false, updatable = false)),
			@AttributeOverride(name = "iddataSource", column = @Column(name = "iddata_source", nullable = false, insertable = false, updatable = false)) })
	private ShareViewId id;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "data_source_driver_iddata_source_driver", nullable = false, insertable = false, updatable = false)
	private DataSourceDriver dataSourceDriver;

	@Column(name = "data_source_driver_iddata_source_driver", nullable = false, insertable = true, updatable = true)
	private Integer idDataSourceDriver;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idshare_type", nullable = false, insertable = false, updatable = false)
	private ShareType shareType;

	@Column(name = "idshare_type", nullable = false, insertable = true, updatable = true)
	private Integer idShareType;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "iddata_source", nullable = false, insertable = false, updatable = false)
	private DataSource dataSource;

	@Column(name = "iddata_source", nullable = false, insertable = false, updatable = false)
	private Integer idDataSource;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idprofile_owner", nullable = false, insertable = false, updatable = false)
	private Profile profile;
	
	@Column(name = "idprofile_owner", nullable = false, insertable = false, updatable = false)
	private Integer idProfile;

	@Column(name = "req_url", nullable = false, length = 400)
	private String reqUrl;

	@Column(name = "res_url", nullable = false, length = 400)
	private String resUrl;

	@Column(name = "share_token", nullable = false, length = 150)
	private String shareToken;

	@Column(name = "can_share")
	private Boolean canShare;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "shareView")
	private Set<ViewRule> viewRules = new HashSet<ViewRule>(0);

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "shareView")
	private Set<ShareViewWith> shareViewWiths = new HashSet<ShareViewWith>(0);

	public ShareView() {
	}

	public ShareView(ShareViewId id, DataSourceDriver dataSourceDriver,
			ShareType shareType, DataSource dataSource, Profile profile,
			String reqUrl, String resUrl, String shareToken) {
		this.id = id;
		this.dataSourceDriver = dataSourceDriver;
		this.idDataSourceDriver = dataSourceDriver.getIddataSourceDriver();
		this.shareType = shareType;
		this.idShareType = shareType.getIdshareType();
		this.dataSource = dataSource;
		this.idDataSource = dataSource.getIddataSource();
		this.profile = profile;
		this.idProfile = profile.getIdprofile();
		this.reqUrl = reqUrl;
		this.resUrl = resUrl;
		this.shareToken = shareToken;
	}

	public ShareView(ShareViewId id, DataSourceDriver dataSourceDriver,
			ShareType shareType, DataSource dataSource, Profile profile,
			String reqUrl, String resUrl, String shareToken, Boolean canShare,
			Set<ViewRule> viewRules, Set<ShareViewWith> shareViewWiths) {
		this.id = id;
		this.dataSourceDriver = dataSourceDriver;
		this.idDataSourceDriver = dataSourceDriver.getIddataSourceDriver();
		this.shareType = shareType;
		this.idShareType = shareType.getIdshareType();
		this.dataSource = dataSource;
		this.idDataSource = dataSource.getIddataSource();
		this.profile = profile;
		this.idProfile = profile.getIdprofile();
		this.reqUrl = reqUrl;
		this.resUrl = resUrl;
		this.shareToken = shareToken;
		this.canShare = canShare;
		this.viewRules = viewRules;
		this.shareViewWiths = shareViewWiths;
	}

	public ShareViewId getId() {
		return this.id;
	}

	public void setId(ShareViewId id) {
		this.id = id;
	}

	public DataSourceDriver getDataSourceDriver() {
		return this.dataSourceDriver;
	}

	public void setDataSourceDriver(DataSourceDriver dataSourceDriver) {
		this.dataSourceDriver = dataSourceDriver;
	}

	public ShareType getShareType() {
		return this.shareType;
	}

	public void setShareType(ShareType shareType) {
		this.shareType = shareType;
	}

	public DataSource getDataSource() {
		return this.dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public Profile getProfile() {
		return this.profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	public String getReqUrl() {
		return this.reqUrl;
	}

	public void setReqUrl(String reqUrl) {
		this.reqUrl = reqUrl;
	}

	public String getResUrl() {
		return this.resUrl;
	}

	public void setResUrl(String resUrl) {
		this.resUrl = resUrl;
	}

	public String getShareToken() {
		return this.shareToken;
	}

	public void setShareToken(String shareToken) {
		this.shareToken = shareToken;
	}

	public Boolean getCanShare() {
		return this.canShare;
	}

	public void setCanShare(Boolean canShare) {
		this.canShare = canShare;
	}

	public Set<ViewRule> getViewRules() {
		return this.viewRules;
	}

	public void setViewRules(Set<ViewRule> viewRules) {
		this.viewRules = viewRules;
	}

	public Set<ShareViewWith> getShareViewWiths() {
		return this.shareViewWiths;
	}

	public void setShareViewWiths(Set<ShareViewWith> shareViewWiths) {
		this.shareViewWiths = shareViewWiths;
	}

	public Integer getIdDataSourceDriver() {
		return idDataSourceDriver;
	}

	public void setIdDataSourceDriver(Integer idDataSourceDriver) {
		this.idDataSourceDriver = idDataSourceDriver;
	}

	public Integer getIdShareType() {
		return idShareType;
	}

	public void setIdShareType(Integer idShareType) {
		this.idShareType = idShareType;
	}

	public Integer getIdDataSource() {
		return idDataSource;
	}

	public void setIdDataSource(Integer idDataSource) {
		this.idDataSource = idDataSource;
	}

	public Integer getIdProfile() {
		return idProfile;
	}

	public void setIdProfile(Integer idProfile) {
		this.idProfile = idProfile;
	}

}