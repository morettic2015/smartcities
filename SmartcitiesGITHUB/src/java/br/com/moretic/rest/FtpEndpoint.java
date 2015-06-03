/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import br.com.moretic.util.FtpUtil;
import br.com.moretic.vo.FtpVO;
import java.io.FileNotFoundException;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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

    @GET
    @Path("/ls/{user}/{pass}/{url}/{port}")
    @Produces("application/json")
    public Response list(@PathParam("user") String user, @PathParam("pass") String pass, @PathParam("url") String url, @PathParam("port") Integer port) {
        FtpVO ftpfiles;

        try {

            ftpClient = new FtpUtil(user, pass, url, port);

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
