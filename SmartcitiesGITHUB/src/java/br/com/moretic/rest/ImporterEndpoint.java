/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import br.com.moretic.util.CsvUtil;
import br.com.moretic.util.SmartProxyFilter;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import br.com.moretic.vo.*;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import javax.ejb.Stateless;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;
import org.json.JSONArray;

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

    @GET
    @Path("/csv/{source}/{description}/{protocol}")
    @Produces("application/json")
    public Response csv(@PathParam("source") String source, @PathParam("description") String description, @PathParam("protocol") String ptr, @Context HttpServletRequest req, @Context HttpServletResponse res) throws Exception {

        Profile p = ProfileEndpoint.getProfileSession(req);

        Profile pOwner = em.find(Profile.class, p.getIdprofile());
        //@TODO Validar com parser XML o fonte KML 
        String path = SmartProxyFilter.getContextPath();
        //Arquivo remoto
        File f;

        String fName = makeFileName(pOwner.getIdprofile(), source);

        source = ptr + "://" + source.replaceAll("ø", "/");
        path += fName;

        f = copyFileFromWeb(source, path);

        //Monta o json do arquivo local
        JSONArray js = CsvUtil.makeJSONFromCsv(f.getAbsolutePath(), ",");

        //em.persist(kml);
        return Response.ok(js.toString()).build();
    }

    private File copyFileFromWeb(String address, String filePath) throws Exception {
        byte[] buffer = new byte[1024];
        int bytesRead;

        URL url = new URL(address);
        BufferedInputStream inputStream = null;
        BufferedOutputStream outputStream = null;
        URLConnection connection = url.openConnection();
        // If you need to use a proxy for your connection, the URL class has another openConnection method.
        // For example, to connect to my local SOCKS proxy I can use:
        // url.openConnection(new Proxy(Proxy.Type.SOCKS, newInetSocketAddress("localhost", 5555)));
        inputStream = new BufferedInputStream(connection.getInputStream());
        File f = new File(filePath);
        outputStream = new BufferedOutputStream(new FileOutputStream(f));
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        inputStream.close();
        outputStream.close();
        return f;
    }

    /*
    
     @ Monta o nome do arquivo conforme o tipo usuario e data de criação
    
     */
    private String makeFileName(int id, String sourceType) {

        String[] tp = sourceType.split("\\.");

        StringBuilder fName = new StringBuilder();

        Date dt = new Date();

        fName.append(File.separatorChar);

        fName.append(id);
        fName.append('_');
        fName.append(tp[tp.length - 1]);
        fName.append('_');
        fName.append(dt.getDay());
        fName.append('_');
        fName.append(dt.getMonth());
        fName.append('_');
        fName.append(dt.getYear());
        fName.append('_');
        fName.append(dt.getHours());
        fName.append('_');
        fName.append(dt.getMinutes());
        fName.append('_');
        fName.append(dt.getSeconds());
        fName.append('.');
        fName.append(tp[tp.length - 1]);

        return fName.toString();

    }
}
