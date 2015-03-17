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
import br.com.moretic.vo.DataSourceType;

/**
 * 
 */
@Stateless
@Path("/datasourcetypes")
public class DataSourceTypeEndpoint
{
   @PersistenceContext(unitName = "smartcitie_db")
   private EntityManager em;

   @POST
   @Consumes("application/json")
   public Response create(DataSourceType entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(DataSourceTypeEndpoint.class).path(String.valueOf(entity.getIddataSourceType())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") int id)
   {
      DataSourceType entity = em.find(DataSourceType.class, id);
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
      TypedQuery<DataSourceType> findByIdQuery = em.createQuery("SELECT DISTINCT d FROM DataSourceType d LEFT JOIN FETCH d.dataSources WHERE d.iddataSourceType = :entityId ORDER BY d.iddataSourceType", DataSourceType.class);
      findByIdQuery.setParameter("entityId", id);
      DataSourceType entity;
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
   public List<DataSourceType> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult)
   {
      TypedQuery<DataSourceType> findAllQuery = em.createQuery("SELECT DISTINCT d FROM DataSourceType d LEFT JOIN FETCH d.dataSources ORDER BY d.iddataSourceType", DataSourceType.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
      final List<DataSourceType> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
   public Response update(DataSourceType entity)
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