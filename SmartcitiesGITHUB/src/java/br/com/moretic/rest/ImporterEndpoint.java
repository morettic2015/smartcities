/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import br.com.moretic.vo.*;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import javax.ejb.Stateless;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;

/**
 * REST Web Service
 *
 * @author LuisAugusto
 */
@Stateless
@Path("/importer")
public class ImporterEndpoint {
    
    @PersistenceContext(unitName = "smartcitie_db")
    private EntityManager em;

    /**
     * Creates a new instance of ImporterEndpoint
     */
    @GET
    @Path("/kml/{source}/{description}")
    @Produces("application/json")
    public Response kml(@PathParam("source") String source, @PathParam("description") String description, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException {
        
        Profile p = ProfileEndpoint.getProfileSession(req);
        
        Profile pOwner = em.find(Profile.class, p.getIdprofile());
        //@TODO Validar com parser XML o fonte KML 
        KmlSource kml = new KmlSource(source, description, pOwner);
        
        em.persist(kml);
        
        return Response.ok(kml).build();
    }
    
}
/**
 * Retrieves representation of an instance of
 * br.com.moretic.rest.ImporterEndpoint
 *
 * @return an instance of java.lang.String
 *
 *
 * }
 */
