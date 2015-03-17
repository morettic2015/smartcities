package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * ProfileContactId generated by hbm2java
 */
@Embeddable
public class ProfileContactId implements java.io.Serializable {

	@Column(name = "profile_idprofile", nullable = false)
	private int profileIdprofile;

	@Column(name = "profile_idprofile1", nullable = false)
	private int profileIdprofile1;

	public ProfileContactId() {
	}

	public ProfileContactId(int profileIdprofile, int profileIdprofile1) {
		this.profileIdprofile = profileIdprofile;
		this.profileIdprofile1 = profileIdprofile1;
	}

	public int getProfileIdprofile() {
		return this.profileIdprofile;
	}

	public void setProfileIdprofile(int profileIdprofile) {
		this.profileIdprofile = profileIdprofile;
	}

	public int getProfileIdprofile1() {
		return this.profileIdprofile1;
	}

	public void setProfileIdprofile1(int profileIdprofile1) {
		this.profileIdprofile1 = profileIdprofile1;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ProfileContactId))
			return false;
		ProfileContactId castOther = (ProfileContactId) other;

		return (this.getProfileIdprofile() == castOther.getProfileIdprofile())
				&& (this.getProfileIdprofile1() == castOther
						.getProfileIdprofile1());
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result + this.getProfileIdprofile();
		result = 37 * result + this.getProfileIdprofile1();
		return result;
	}

}
