package br.com.moretic.vo;

// Generated by Hibernate Tools 4.0.0

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * ViewRule generated by hbm2java
 */
@Entity
@Table(name = "view_rule", schema = "public")
public class ViewRule implements java.io.Serializable {

	@Id
	@Column(name = "idview_rules", unique = true, nullable = false)
	private int idviewRules;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumns({
			@JoinColumn(name = "idprofile_owner", referencedColumnName = "idprofile_owner", nullable = false),
			@JoinColumn(name = "iddata_source", referencedColumnName = "iddata_source", nullable = false) })
	private ShareView shareView;

	@Column(name = "rule_query", nullable = false, length = 1000)
	private String ruleQuery;

	@Column(name = "rule_script_path", length = 1000)
	private String ruleScriptPath;

	public ViewRule() {
	}

	public ViewRule(int idviewRules, ShareView shareView, String ruleQuery) {
		this.idviewRules = idviewRules;
		this.shareView = shareView;
		this.ruleQuery = ruleQuery;
	}

	public ViewRule(int idviewRules, ShareView shareView, String ruleQuery,
			String ruleScriptPath) {
		this.idviewRules = idviewRules;
		this.shareView = shareView;
		this.ruleQuery = ruleQuery;
		this.ruleScriptPath = ruleScriptPath;
	}

	public int getIdviewRules() {
		return this.idviewRules;
	}

	public void setIdviewRules(int idviewRules) {
		this.idviewRules = idviewRules;
	}

	public ShareView getShareView() {
		return this.shareView;
	}

	public void setShareView(ShareView shareView) {
		this.shareView = shareView;
	}

	public String getRuleQuery() {
		return this.ruleQuery;
	}

	public void setRuleQuery(String ruleQuery) {
		this.ruleQuery = ruleQuery;
	}

	public String getRuleScriptPath() {
		return this.ruleScriptPath;
	}

	public void setRuleScriptPath(String ruleScriptPath) {
		this.ruleScriptPath = ruleScriptPath;
	}

}
