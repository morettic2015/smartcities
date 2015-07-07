/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import br.com.moretic.util.ImporterUtil;
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
import java.io.FileWriter;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.HashSet;
import javax.ejb.Stateless;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

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
     * http://www.cpc.ncep.noaa.govøproductsøpredictionsøthreatsøTemp_D8_14.kml
     * http://www.cpc.ncep.noaa.gov/products/predictions/threats/Prcp_D3_7.kml
     * Creates a new instance of ImporterEndpoint
     *
     * @param source
     * @param res
     * @throws java.security.NoSuchAlgorithmException
     */
    @GET
    @Path("/kml/{source}/{description}")
    @Produces("application/json")
    public Response kml(@PathParam("source") String source, @PathParam("description") String description, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException, Exception {

        Profile p = ProfileEndpoint.getProfileSession(req);

        Profile pOwner = em.find(Profile.class, p.getIdprofile());
        String path = SmartProxyFilter.getContextPath();
        //replace da url
        source = "http://" + source.replaceAll("ø", "/");
        //nome do arquivo
        String fName = makeFileName(pOwner.getIdprofile(), source);

        path += fName;
        File f = copyFileFromWeb(source, path);
        //@TODO Validar com parser XML o fonte KML 
        String localFileURL = SmartProxyFilter.getContextUri() + "/" + fName;

        FileSource kml = new FileSource(localFileURL, description, pOwner);

        em.persist(kml);

        return Response.ok(kml).build();
    }

    @GET
    @Path("/xml_update/{ccol}")
    @Produces("application/json")
    public Response xml(@PathParam("ccol") String ccol, @Context HttpServletRequest req, @Context HttpServletResponse res) throws Exception {
        FileSource fs = ProfileEndpoint.getSessionObject(req, FileSource.class, FILE_INFO_STEP_2);
        JSONObject js = ImporterUtil.makeJSONFromXml(SmartProxyFilter.getContextPath() + fs.getFileUrl());
        String actualFile = SmartProxyFilter.getContextPath() + fs.getFileUrl();
        //Renomeia o arquivo antigo
        File old = new File(actualFile);
        File renamed = new File(SmartProxyFilter.getContextPath() + fs.getFileUrl() + "_old_" + fs.getVesionNr());
        old.renameTo(renamed);

        //Abre arquivos para atualização
        FileWriter fw = new FileWriter(actualFile);
        PrintWriter out = new PrintWriter(fw);
        String[] indices = ccol.split(",");

        //Monta o set de tokens
        HashSet<String> tokens = new HashSet<String>();
        for (String s : indices) {
            tokens.add(s);
        }

        //Aqui logica para remover os elementos do JSON
        ImporterUtil.removePropertiesJSON(js, tokens);
        //FIM DA LOGICA JSON DE LIMPAR AS COLUNAS

        //COnverte para XML        
        //grava no arquivo de novo
        String xmlOutput = "<?xml version=\"1.0\"?>"+XML.toString(js);
        out.print(xmlOutput);
        out.flush();
        out.close();
        fw.close();

        //Atualiza a versão do arquivo
        fs = em.find(FileSource.class, fs.getId());
        fs.incVersion();
        //Update object
        em.merge(fs);
        //Update Session
        ProfileEndpoint.addSessionObject(req, FILE_INFO_STEP_2, fs);
        //Return it

        new ProfileEndpoint().logAction("XML UPDATED (" + old.getName() + ")", req, res, em);
        old = null;
        renamed = null;
        fw = null;
        out = null;
        indices = null;
        actualFile = null;
        js = null;

        return Response.ok(fs).build();

    }

    @GET
    @Path("/csv_update/{ccol}")
    @Produces("application/json")
    public Response csv(@PathParam("ccol") String ccol, @Context HttpServletRequest req, @Context HttpServletResponse res) throws Exception {

        FileSource fs = ProfileEndpoint.getSessionObject(req, FileSource.class, FILE_INFO_STEP_2);
        JSONArray js = ImporterUtil.makeJSONFromCsv(SmartProxyFilter.getContextPath() + fs.getFileUrl(), ",");
        String actualFile = SmartProxyFilter.getContextPath() + fs.getFileUrl();

        //Renomeia o arquivo antigo
        File old = new File(actualFile);
        File renamed = new File(SmartProxyFilter.getContextPath() + fs.getFileUrl() + "_old_" + fs.getVesionNr());
        old.renameTo(renamed);

        //Update CSV file
        FileWriter fw = new FileWriter(actualFile);
        PrintWriter out = new PrintWriter(fw);
        String[] indices = ccol.split(",");
        for (int i = 0; i < js.length(); i++) {
            JSONArray ja1 = js.getJSONArray(i);

            for (int j = 0; j < indices.length; j++) {
                //Adiciona
                out.print(ja1.get(Integer.parseInt(indices[j])).toString());
                if (j < indices.length - 1) {
                    out.print(",");
                }
            }
            out.print("\n");

        }
        out.flush();

        //Close the Print Writer
        out.close();

        //Close the File Writer
        fw.close();

        //Retrieve object
        fs = em.find(FileSource.class, fs.getId());
        fs.incVersion();
        //Update object
        em.merge(fs);
        //Update Session
        ProfileEndpoint.addSessionObject(req, FILE_INFO_STEP_2, fs);
        //Return it

        new ProfileEndpoint().logAction("CSV UPDATED (" + old.getName() + ")", req, res, em);
        old = null;
        renamed = null;
        fw = null;
        out = null;
        indices = null;
        actualFile = null;
        js = null;

        return Response.ok(fs).build();
    }

    //
    @GET
    @Path("/file/{source}/{name}/{tp}/{description}")
    @Produces("application/json")
    public Response genericFileImporter(@PathParam("name") String name, @PathParam("tp") String tp, @PathParam("source") String source, @PathParam("description") String description, @Context HttpServletRequest req, @Context HttpServletResponse res) throws Exception {

        Profile p = ProfileEndpoint.getProfileSession(req);

        Profile pOwner = em.find(Profile.class, p.getIdprofile());
        //@TODO Validar com parser XML o fonte KML 
        String path = SmartProxyFilter.getContextPath();
        //Arquivo remoto
        File f;
        ;
        String fName = makeFileName(pOwner.getIdprofile(), source);

        source = SmartProxyFilter.getContextUri() + "/" + source;
        path += fName;

        FileSource fs = new FileSource();
        fs.setFileTit(name);
        fs.setFileUrl(fName);
        fs.setFileDesc(description);
        fs.setMyTp(FileType.valueOf(tp));
        fs.setIdProfile(pOwner.getIdprofile());
        fs.setOwner(pOwner);
        //Salva o data source do file
        em.persist(fs);

        ProfileEndpoint.addSessionObject(req, FILE_INFO_STEP_2, fs);
        //Copy file
        f = copyFileFromWeb(source, path);
        //Log action
        new ProfileEndpoint().logAction(FileType.valueOf(tp) + " IMPORT (" + fName + ")", req, res, em);
        //Retorna o CSV
        if (FileType.valueOf(tp).equals(FileType.CSV)) {
            JSONArray js = ImporterUtil.makeJSONFromCsv(f.getAbsolutePath(), ",");
            return Response.ok(js.toString()).build();
        } else if (FileType.valueOf(tp).equals(FileType.XML)) {
            JSONObject js = ImporterUtil.makeJSONFromXml(f.getAbsolutePath());
            return Response.ok(js.toString()).build();
        }
        //LOG DO SISTEMA

        //Retorno padrao
        //em.persist(kml);
        return Response.ok(fs).build();
    }
    public static final String FILE_INFO_STEP_2 = "FILE_INFO_STEP_2";

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
