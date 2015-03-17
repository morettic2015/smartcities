package br.com.moretic.rest;

import br.com.moretic.util.MD5Crypt;
import br.com.moretic.util.ValidatorUtil;
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

import br.com.moretic.vo.Profile;
import java.security.NoSuchAlgorithmException;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;

/**
 *
 */
@Stateless
@Path("/profiles")
public class ProfileEndpoint {

    /**
     * Token para armazenar o perfil na sessao
     */
    public static final String PROFILE = "SMTR_PROFILE";

    //@Context
    //private HttpServletRequest request;
    
    //@Context HttpServletRequest req, @Context HttpServletResponse res

    @PersistenceContext(unitName = "smartcitie_db")
    private EntityManager em;

    @POST
    @Consumes("application/json")
    public Response create(Profile entity) {
        em.persist(entity);
        return Response.created(UriBuilder.fromResource(ProfileEndpoint.class).path(String.valueOf(entity.getIdprofile())).build()).build();
    }

    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    public Response deleteById(@PathParam("id") int id) {
        Profile entity = em.find(Profile.class, id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        em.remove(entity);
        return Response.noContent().build();
    }

    @GET
    @Path("/authenticate/{email}/{pass}")
    @Produces("application/json")
    public Response authenticate(@PathParam("email") String email, @PathParam("pass") String pass, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException {
        boolean hasErros = false,hasErrosEmail = false,hasErrosPass = false;
       
        HttpSession session = req.getSession();
       
        //Calcula MD5 HASH para comparar no server side
        String md5Pass = "OZZY OSBOURNE";
        Profile entity = null;

        //Valida se a senha e branca
        if (pass == null || pass.equals("")) {
            hasErrosPass = true;
        } else {
            md5Pass = MD5Crypt.getHash(pass);
        }

        hasErrosEmail = !ValidatorUtil.isEmail(email);

        hasErros = hasErrosEmail||hasErrosPass;
        
        if (!hasErros) {
            TypedQuery<Profile> findByIdQuery = em
                    .createQuery(
                            "SELECT DISTINCT p FROM Profile p WHERE p.email=:pEmail AND p.password=:pPass", Profile.class);

            findByIdQuery.setParameter("pEmail", email);
            findByIdQuery.setParameter("pPass", md5Pass);

            try {
                entity = findByIdQuery.getSingleResult();
            } catch (NoResultException nre) {
                entity = null;
            }

            session.setAttribute(PROFILE, entity);
        }
        if (hasErros || entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    public Response findById(@PathParam("id") int id) {
        TypedQuery<Profile> findByIdQuery = em
                .createQuery(
                        "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang WHERE p.idprofile = :entityId ORDER BY p.idprofile",
                        Profile.class);
        findByIdQuery.setParameter("entityId", id);
        Profile entity;
        try {
            entity = findByIdQuery.getSingleResult();
        } catch (NoResultException nre) {
            entity = null;
        }
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        return Response.ok(entity).build();
    }

    @GET
    @Produces("application/json")
    public List<Profile> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult) {
        TypedQuery<Profile> findAllQuery = em
                .createQuery(
                        "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang ORDER BY p.idprofile",
                        Profile.class);
        if (startPosition != null) {
            findAllQuery.setFirstResult(startPosition);
        }
        if (maxResult != null) {
            findAllQuery.setMaxResults(maxResult);
        }
        final List<Profile> results = findAllQuery.getResultList();
        return results;
    }

    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    public Response update(Profile entity) {
        try {
            entity = em.merge(entity);
        } catch (OptimisticLockException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getEntity()).build();
        }

        return Response.noContent().build();
    }
}
