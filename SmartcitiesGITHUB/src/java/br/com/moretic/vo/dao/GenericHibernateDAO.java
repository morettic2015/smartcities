package br.com.moretic.vo.dao;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


@Stateless
public class GenericHibernateDAO {
	
	@PersistenceContext(unitName = "smartcitie_db")
	protected EntityManager em;
	
	public Object incluir(Object registro){
		em.persist(registro);
		return registro;
	}
	
	public boolean excluir(Object registro){
		if(registro == null)
			return false;
		em.remove(registro);
		return true;
	}
	
	public Object atualizar(Object registro){
		em.merge(registro);
		return registro;
	}
}
