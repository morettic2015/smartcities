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

/**
 * REST Web Service
 *
 * @author LuisAugusto
 * 
 * Connecta a um servidor FTP atua como um proxy
 * 
 */
@Path("/ftp")
@Stateless
public class FtpEndpoint {
    
    private FtpUtil ftpClient;
    
    @GET
    @Path("/ls/{user}/{pass}/{url}/{port}")
    @Produces("application/json")
    public Response list(@PathParam("user") String user, @PathParam("pass") String pass, @PathParam("url") String url, @PathParam("port") Integer port ) throws IOException, Exception {

        ftpClient = new FtpUtil(user, pass, url,port);
        
        String[] a1 = {"a","b"};
        
        return Response.ok(a1).build();
    }
    
    
    
    
    
}
class FtpProfile{
    public String user, pass, url;
    public Integer port;
}

class FileInfo{
    public String name, type, dir, info;
}
