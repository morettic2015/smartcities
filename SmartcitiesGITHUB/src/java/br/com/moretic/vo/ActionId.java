package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * ActionId generated by hbm2java
 */
@Embeddable
public class ActionId implements java.io.Serializable {

	@Column(name = "class_path", nullable = false, length = 200)
	private String classPath;

	@Column(name = "action_invoker", nullable = false, length = 200)
	private String actionInvoker;

	public ActionId() {
	}

	public ActionId(String classPath, String actionInvoker) {
		this.classPath = classPath;
		this.actionInvoker = actionInvoker;
	}

	public String getClassPath() {
		return this.classPath;
	}

	public void setClassPath(String classPath) {
		this.classPath = classPath;
	}

	public String getActionInvoker() {
		return this.actionInvoker;
	}

	public void setActionInvoker(String actionInvoker) {
		this.actionInvoker = actionInvoker;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof ActionId))
			return false;
		ActionId castOther = (ActionId) other;

		return ((this.getClassPath() == castOther.getClassPath()) || (this
				.getClassPath() != null && castOther.getClassPath() != null && this
				.getClassPath().equals(castOther.getClassPath())))
				&& ((this.getActionInvoker() == castOther.getActionInvoker()) || (this
						.getActionInvoker() != null
						&& castOther.getActionInvoker() != null && this
						.getActionInvoker()
						.equals(castOther.getActionInvoker())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getClassPath() == null ? 0 : this.getClassPath().hashCode());
		result = 37
				* result
				+ (getActionInvoker() == null ? 0 : this.getActionInvoker()
						.hashCode());
		return result;
	}

}
