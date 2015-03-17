package br.com.moretic.rest;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import br.com.moretic.vo.SecurityInfo;

/**
 * 
 */
@Stateless
@Path("/securityinfos")
public class SecurityInfoEndpoint
{
   @PersistenceContext(unitName = "smartcitie_db")
   private EntityManager em;

   @POST
   @Consumes("application/json")
   public Response create(SecurityInfo entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(SecurityInfoEndpoint.class).path(String.valueOf(entity.getId())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") int id)
   {
      SecurityInfo entity = em.find(SecurityInfo.class, id);
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
      TypedQuery<SecurityInfo> findByIdQuery = em.createQuery("SELECT DISTINCT a FROM SecurityInfo a LEFT JOIN FETCH a.profile WHERE a.id = :entityId ORDER BY a.id", SecurityInfo.class);
      findByIdQuery.setParameter("entityId", id);
      SecurityInfo entity;
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
   public List<SecurityInfo> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult)
   {
      TypedQuery<SecurityInfo> findAllQuery = em.createQuery("SELECT DISTINCT a FROM SecurityInfo a LEFT JOIN FETCH a.profile ORDER BY a.id", SecurityInfo.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
      final List<SecurityInfo> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
   public Response update(SecurityInfo entity)
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