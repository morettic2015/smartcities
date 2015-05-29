/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import br.com.moretic.util.FtpUtil;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.io.IOException;
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
 *http://localhost:8080/smartcities/rest/ftp/ls/anonymous/me@me.com/ftp.kernel.org/21
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

    private FtpUtil ftpClient;
    // private String pUser,pPass,

    @GET
    @Path("/ls/{user}/{pass}/{url}/{port}")
    @Produces("application/json")
    public Response list(@PathParam("user") String user, @PathParam("pass") String pass, @PathParam("url") String url, @PathParam("port") Integer port) {
        List<String> files;

        try {
            ftpClient = new FtpUtil(user, pass, url, port);

            files = ftpClient.listRoot();
        } catch (Exception exception) {
            files = new ArrayList<String>();
            System.err.append("FTP SERVICE ERROR");
            System.err.append(exception.toString());
        }

        return Response.ok(files).build();
    }

}
     
class FtpProfile {

    public String user, pass, url;
    public Integer port;
}

class FileInfo {

    public String name, type, dir, info;
}
