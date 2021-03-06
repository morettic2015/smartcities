package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * GroupHasProfile generated by hbm2java
 */
@Entity
@Table(name = "group_has_profile", schema = "public")
public class GroupHasProfile implements java.io.Serializable {

	@EmbeddedId
	@AttributeOverrides({
			@AttributeOverride(name = "groupIdgroup", column = @Column(name = "group_idgroup", nullable = false)),
			@AttributeOverride(name = "profileIdprofile", column = @Column(name = "profile_idprofile", nullable = false)) })
	private GroupHasProfileId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "group_idgroup", nullable = false, insertable = false, updatable = false)
	private Group group;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "profile_idprofile", nullable = false, insertable = false, updatable = false)
	private Profile profile;

	@Column(name = "enabled", length = 1)
	private Character enabled;

	public GroupHasProfile() {
	}

	public GroupHasProfile(GroupHasProfileId id, Group group, Profile profile) {
		this.id = id;
		this.group = group;
		this.profile = profile;
	}

	public GroupHasProfile(GroupHasProfileId id, Group group, Profile profile,
			Character enabled) {
		this.id = id;
		this.group = group;
		this.profile = profile;
		this.enabled = enabled;
	}

	public GroupHasProfileId getId() {
		return this.id;
	}

	public void setId(GroupHasProfileId id) {
		this.id = id;
	}

	public Group getGroup() {
		return this.group;
	}

	public void setGroup(Group group) {
		this.group = group;
	}

	public Profile getProfile() {
		return this.profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	public Character getEnabled() {
		return this.enabled;
	}

	public void setEnabled(Character enabled) {
		this.enabled = enabled;
	}

}
