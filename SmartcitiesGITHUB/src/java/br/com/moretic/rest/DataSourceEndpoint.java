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
import br.com.moretic.vo.DataSource;

/**
 * 
 */
@Stateless
@Path("/datasources")
public class DataSourceEndpoint
{
   @PersistenceContext(unitName = "smartcitie_db")
   private EntityManager em;

   @POST
   @Consumes("application/json")
   public Response create(DataSource entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(DataSourceEndpoint.class).path(String.valueOf(entity.getIddataSource())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") int id)
   {
      DataSource entity = em.find(DataSource.class, id);
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
      TypedQuery<DataSource> findByIdQuery = em.createQuery("SELECT DISTINCT d FROM DataSource d LEFT JOIN FETCH d.dataSourceDriver LEFT JOIN FETCH d.dataSourceType LEFT JOIN FETCH d.dataSourceRelatedTo LEFT JOIN FETCH d.infos LEFT JOIN FETCH d.shareViews LEFT JOIN FETCH d.dataSources WHERE d.iddataSource = :entityId ORDER BY d.iddataSource", DataSource.class);
      findByIdQuery.setParameter("entityId", id);
      DataSource entity;
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
   public List<DataSource> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult)
   {
      TypedQuery<DataSource> findAllQuery = em.createQuery("SELECT DISTINCT d FROM DataSource d LEFT JOIN FETCH d.dataSourceDriver LEFT JOIN FETCH d.dataSourceType LEFT JOIN FETCH d.dataSourceRelatedTo LEFT JOIN FETCH d.infos LEFT JOIN FETCH d.shareViews LEFT JOIN FETCH d.dataSources ORDER BY d.iddataSource", DataSource.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
      final List<DataSource> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
   public Response update(DataSource entity)
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