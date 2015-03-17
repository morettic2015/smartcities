package br.com.moretic.rest;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import br.com.moretic.vo.ProfileLang;

/**
 * 
 */
@Stateless
@Path("/profilelangs")
public class ProfileLangEndpoint
{
   @PersistenceContext(unitName = "smartcitie_db")
   private EntityManager em;

   @POST
   @Consumes("application/json")
	public Response create(ProfileLang entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(ProfileLangEndpoint.class).path(String.valueOf(entity.getId())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") int id)
   {
		ProfileLang entity = em.find(ProfileLang.class, id);
      if (entity == null)
      {
         return Response.status(Status.NOT_FOUND).build();
      }
      em.remove(entity);
      return Response.noContent().build();
   }

   @GET
   @Path("/{id:[0-9][0-9]*}")
   @Produces("application/json")
   public Response findById(@PathParam("id") int id)
   {
		TypedQuery<ProfileLang> findByIdQuery = em
				.createQuery(
						"SELECT DISTINCT a FROM ProfileLang a LEFT JOIN FETCH a.profile LEFT JOIN FETCH a.lang WHERE a.id = :entityId ORDER BY a.id",
						ProfileLang.class);
      findByIdQuery.setParameter("entityId", id);
		ProfileLang entity;
      try
      {
         entity = findByIdQuery.getSingleResult();
      }
      catch (NoResultException nre)
      {
         entity = null;
      }
      if (entity == null)
      {
         return Response.status(Status.NOT_FOUND).build();
      }
      return Response.ok(entity).build();
   }

   @GET
   @Produces("application/json")
	public List<ProfileLang> listAll(
			@QueryParam("start") Integer startPosition,
			@QueryParam("max") Integer maxResult)
   {
		TypedQuery<ProfileLang> findAllQuery = em
				.createQuery(
						"SELECT DISTINCT a FROM ProfileLang a LEFT JOIN FETCH a.profile LEFT JOIN FETCH a.lang ORDER BY a.id",
						ProfileLang.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
		final List<ProfileLang> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
	public Response update(ProfileLang entity)
   {
      try
      {
         entity = em.merge(entity);
      }
      catch (OptimisticLockException e)
      {
         return Response.status(Response.Status.CONFLICT).entity(e.getEntity()).build();
      }

      return Response.noContent().build();
   }
}