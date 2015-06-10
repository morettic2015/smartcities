/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import br.com.moretic.util.FtpUtil;
import br.com.moretic.vo.FtpClient;
import br.com.moretic.vo.FtpVO;
import br.com.moretic.vo.Profile;
import java.io.FileNotFoundException;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;

/**
 * REST Web Service
 *
 * @author LuisAugusto
 *
 * Connecta a um servidor FTP atua como um proxy
 *
 * ************************DADOS DO SERVIDOR DE TESTE FTP
 * http://localhost:8080/smartcities/rest/ftp/ls/anonymous/me@me.com/ftp.kernel.org/21
 *
 *
 * http://localhost:8080/smartcities/rest/ftp/ls/connectgeo/M1y+P5UOxQ9bJ7ko/connectgeo.com.br/21
 *
 *
 *
 */
@Path("/ftp")
@Stateless
public class FtpEndpoint {

    public static final String FTP_DIR_PATH = " C:/tmp/";
    private FtpUtil ftpClient;
    // private String pUser,pPass,
    @PersistenceContext(unitName = "smartcitie_db")
    private EntityManager em;

    @GET
    @Path("/ls/{user}/{pass}/{url}/{port}")
    @Produces("application/json")
    public Response list(@PathParam("user") String user, @PathParam("pass") String pass, @PathParam("url") String url, @PathParam("port") Integer port, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        FtpVO ftpfiles;

        try {

            ftpClient = new FtpUtil(user, pass, url, port);

            //Persiste o FTP source no esquema
            Profile p = ProfileEndpoint.getProfileSession(req);
            FtpClient fc = ftpClient.getVo(p);

            TypedQuery<FtpClient> findByIdQuery = em.createQuery(
                    "SELECT DISTINCT p FROM FtpClient p LEFT JOIN FETCH p.owner WHERE p.host = :entityId",
                    FtpClient.class);
            findByIdQuery.setParameter("entityId", url);
            //
            FtpClient fc2 = null;
            try {
                fc2 = findByIdQuery.getSingleResult();

                //Atualiza o ftp
                fc2.setPass(pass);
                fc2.setUser(user);
                fc2.setPort(port);
                //Persiste
                em.merge(fc2);

                //novo
            } catch (NoResultException e) {
                em.persist(fc);
                fc2 = fc;
            }

            ftpfiles = ftpClient.readDir("/");

            ftpClient.closeConnection();

        } catch (Exception exception) {
            ftpfiles = new FtpVO(null);
            System.err.append("FTP SERVICE ERROR");
            System.err.append(exception.toString());
        }

        return Response.ok(ftpfiles).build();
    }

    @GET
    @Path("/cp/{user}/{pass}/{url}/{port}/{file}")
    @Produces("application/json")
    public Response copy(@PathParam("user") String user, @PathParam("pass") String pass, @PathParam("url") String url, @PathParam("port") Integer port, @PathParam("file") String file) {
        ConnectionStatus cs = new ConnectionStatus();

        try {

            ftpClient = new FtpUtil(user, pass, url, port);

            cs.status = ftpClient.copyFile("/", FTP_DIR_PATH, file);

            ftpClient.closeConnection();

        } catch (FileNotFoundException exception) {

            System.err.append("FTP FILE NOT FOUND ERROR");

            System.err.append(exception.toString());
        } catch (Exception exception) {

            System.err.append("FTP GET ERROR");
            System.err.append(exception.toString());
        }

        return Response.ok(cs).build();
    }

}

class ConnectionStatus implements Serializable {

    boolean status = false;
}
