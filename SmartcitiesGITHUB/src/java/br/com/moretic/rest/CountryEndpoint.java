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
import br.com.moretic.vo.Country;

/**
 * 
 */
@Stateless
@Path("/countries")
public class CountryEndpoint
{
   @PersistenceContext(unitName = "smartcitie_db")
   private EntityManager em;

   @POST
   @Consumes("application/json")
   public Response create(Country entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(CountryEndpoint.class).path(String.valueOf(entity.getIdcountry())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") int id)
   {
      Country entity = em.find(Country.class, id);
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
      TypedQuery<Country> findByIdQuery = em.createQuery("SELECT DISTINCT c FROM Country c LEFT JOIN FETCH c.states s LEFT JOIN FETCH s.cities ct LEFT JOIN FETCH ct.adresses WHERE c.idcountry = :entityId ORDER BY c.idcountry", Country.class);
      findByIdQuery.setParameter("entityId", id);
      Country entity;
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
   public List<Country> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult)
   {
      TypedQuery<Country> findAllQuery = em.createQuery("SELECT DISTINCT c FROM Country c LEFT JOIN FETCH c.states s LEFT JOIN FETCH s.cities ct LEFT JOIN FETCH ct.adresses ORDER BY c.idcountry", Country.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
      final List<Country> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
   public Response update(Country entity)
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