package br.com.moretic.vo.dao;

import javax.ejb.Stateless;
import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;

//import br.com.moretic.vo.Action;
//import br.com.moretic.vo.ActionId;

@Stateless
public class ActionHibernateDAO extends GenericHibernateDAO {

//	public Action pesquisar(ActionId id) {
//		TypedQuery<Action> findByIdQuery = em
//				.createQuery(
//						"SELECT DISTINCT a FROM Action a WHERE a.id.classPath = :classPath and a.id.actionInvoker = :actionInvoker",
//						Action.class);
//		findByIdQuery.setParameter("classPath", id.getClassPath());
//		findByIdQuery.setParameter("actionInvoker", id.getActionInvoker());
//		Action entity;
//		try {
//			entity = findByIdQuery.getSingleResult();
//		} catch (NoResultException nre) {
//			entity = null;
//		}
//		return entity;
//	}
}
