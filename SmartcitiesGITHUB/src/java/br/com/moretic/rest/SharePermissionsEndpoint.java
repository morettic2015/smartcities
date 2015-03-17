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
import br.com.moretic.vo.SharePermissions;

/**
 * 
 */
@Stateless
@Path("/sharepermissions")
public class SharePermissionsEndpoint
{
   @PersistenceContext(unitName = "smartcitie_db")
   private EntityManager em;

   @POST
   @Consumes("application/json")
   public Response create(SharePermissions entity)
   {
      em.persist(entity);
      return Response.created(UriBuilder.fromResource(SharePermissionsEndpoint.class).path(String.valueOf(entity.getIdsharePermissions())).build()).build();
   }

   @DELETE
   @Path("/{id:[0-9][0-9]*}")
   public Response deleteById(@PathParam("id") int id)
   {
      SharePermissions entity = em.find(SharePermissions.class, id);
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
      TypedQuery<SharePermissions> findByIdQuery = em.createQuery("SELECT DISTINCT s FROM SharePermissions s LEFT JOIN FETCH s.shareViewWiths WHERE s.idsharePermissions = :entityId ORDER BY s.idsharePermissions", SharePermissions.class);
      findByIdQuery.setParameter("entityId", id);
      SharePermissions entity;
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
   public List<SharePermissions> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult)
   {
      TypedQuery<SharePermissions> findAllQuery = em.createQuery("SELECT DISTINCT s FROM SharePermissions s LEFT JOIN FETCH s.shareViewWiths ORDER BY s.idsharePermissions", SharePermissions.class);
      if (startPosition != null)
      {
         findAllQuery.setFirstResult(startPosition);
      }
      if (maxResult != null)
      {
         findAllQuery.setMaxResults(maxResult);
      }
      final List<SharePermissions> results = findAllQuery.getResultList();
      return results;
   }

   @PUT
   @Path("/{id:[0-9][0-9]*}")
   @Consumes("application/json")
   public Response update(SharePermissions entity)
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