/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.rest;

import br.com.moretic.util.EnumDriverType;
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
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.NoSuchEntityException;
import javax.ejb.Stateless;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;
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
    @Path("/get_tables/{source}")
    @Produces("application/json")
    public Response findTablesByDataSource(@PathParam("source") String source, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException, Exception {

        String infoCode[] = source.split("_");
        ArrayList ja = null;

        //
        if (infoCode[0].equalsIgnoreCase("dtb")) {

            DataSource de = em.find(DataSource.class, Long.parseLong(infoCode[1]));
            EnumDriverType databaseType = de.getDataSourceDriver();
            String dbName = de.getNmDatasource();
            String user = de.getDataUsername();
            String pPort = de.getPport().toString();
            String passwd = de.getDataPassword();
            String urlDb = de.getDataSourceUrl();
            //String mSchema = de.getDeSchema();
            ImporterUtil ui;

            try {
                ui = new ImporterUtil(databaseType, urlDb, pPort, user, passwd, dbName);
                if (ui.isConnOpen()) {
                    ja = ui.getTablesFromConnection(de.getDeSchema());
                }
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
        return Response.ok(ja).build();
    }

    @GET
    @Path("/get_columns/{source}/{tb}")
    @Produces("application/json")
    public Response findTableColumnsByDataSource(@PathParam("source") String source, @PathParam("tb") String ttable, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException, Exception {

        String infoCode[] = source.split("_");
        JSONArray ja = null;

        //
        if (infoCode[0].equalsIgnoreCase("dtb")) {

            DataSource de = em.find(DataSource.class, Long.parseLong(infoCode[1]));
            EnumDriverType databaseType = de.getDataSourceDriver();
            String dbName = de.getNmDatasource();
            String user = de.getDataUsername();
            String pPort = de.getPport().toString();
            String passwd = de.getDataPassword();
            String urlDb = de.getDataSourceUrl();
            //String mSchema = de.getDeSchema();
            ImporterUtil ui;

            try {
                ui = new ImporterUtil(databaseType, urlDb, pPort, user, passwd, dbName);
                if (ui.isConnOpen()) {
                    ja = ui.getColumnsFromTable(dbName, ttable);
                }
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
        return Response.ok(ja.toString()).build();
    }

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

    private JSONArray exportTableData(String dataSourceId, String tableName) {
        ImporterUtil ui;
        JSONArray ja = new JSONArray();
        //Recupera o datasource
        DataSource de;
        try {
            de = em.find(DataSource.class, Long.parseLong(dataSourceId));
        } catch (Exception numberFormatException) {
            Logger.getLogger(ImporterEndpoint.class.getName()).log(Level.SEVERE, null, "ERROR RETRIEVING TABLE METADATA!\n" + numberFormatException.toString());
            return new JSONArray();
        }

        EnumDriverType databaseType = de.getDataSourceDriver();
        String dbName = de.getNmDatasource();
        String user = de.getDataUsername();
        String pPort = de.getPport().toString();
        String passwd = de.getDataPassword();
        String urlDb = de.getDataSourceUrl();
        String dbSchema = de.getSchema();
        try {
            ui = new ImporterUtil(databaseType, urlDb, pPort, user, passwd, dbName);

            if (ui.isConnOpen()) {

                ja = ui.getTableData(dbSchema, tableName);
            }
        } catch (SQLException ex) {
            Logger.getLogger(ImporterEndpoint.class.getName()).log(Level.SEVERE, null, "ERROR RETRIEVING TABLE DATA!\n" + ex.toString());
            return new JSONArray();
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ImporterEndpoint.class.getName()).log(Level.SEVERE, null, "ERROR CONNECTING TO DATABASE DRIVER NOT FOUND!\n" + ex.toString());
            return new JSONArray();
        }

        try {
            ui.destroy();
        } catch (SQLException ex) {
            Logger.getLogger(ImporterEndpoint.class.getName()).log(Level.SEVERE, null, ex);
        }

        return ja;
    }

    @GET
    @Path("/export_table_xml/{datasource_id}/{table_name}")
    @Produces("application/xml")
    public Response exportTableDataXML(@PathParam("datasource_id") String dataSourceId, @PathParam("table_name") String tableName, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        //Instancia o importer
        JSONArray ja = exportTableData(dataSourceId, tableName);
        return Response.ok(ja.toString()).build();
    }

    /**
     *
     * http://localhost:8080/smartcities/rest/importer/view_sample/3/t2
     *
     */
    @GET
    @Path("/view_sample/{idDataSource}/{tableSampe}")
    @Produces("application/json")
    public Response viewSampleData(@PathParam("idDataSource") String idDataSource,
            @PathParam("tableSampe") String tableSampe,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) throws ClassNotFoundException, SQLException {
        DataSource from1 = em.find(DataSource.class, Long.parseLong(idDataSource));

        ImporterUtil iu = new ImporterUtil(from1.getDataSourceDriver(), from1.getDataSourceUrl(), from1.getPport().toString(), from1.getDataUsername(), from1.getDataPassword(), from1.getNmDatasource());

        JSONObject fromData = iu.getSampleTableData(tableSampe);

        
        req.getSession(true).setAttribute(iu.SAMPLE_DATA, fromData);
        
        iu.quit();

        return Response.ok(fromData.toString()).build();
    }

    @GET
    @Path("/copy_data/{idTtransformation}")
    @Produces("application/json")
    public Response copyDataSource(@PathParam("idTtransformation") String idTtransformation) throws ClassNotFoundException, SQLException {
        Transformation t1 = em.find(Transformation.class, Long.parseLong(idTtransformation));
        DataSource from1 = t1.getFromDatabase();
        DataSource to1 = t1.getToDatabase();

        JSONArray fromData = new JSONArray();

        ImporterUtil iu = new ImporterUtil(from1.getDataSourceDriver(), from1.getDataSourceUrl(), from1.getPport().toString(), from1.getDataUsername(), from1.getDataPassword(), from1.getNmDatasource());
        ImporterUtil iu2 = new ImporterUtil(to1.getDataSourceDriver(), to1.getDataSourceUrl(), to1.getPport().toString(), to1.getDataUsername(), to1.getDataPassword(), to1.getNmDatasource());
        //PKS
        JSONArray ja = iu2.getPKsFromTable(to1.getSchema(), t1.getTableTo());
        JSONArray ja1 = iu.getPKsFromTable(from1.getSchema(), t1.getTableFrom());
        //INDICE NO BANCO
        int indice = iu2.getMaxElementFrom(ja, t1.getTableTo());

        if (iu.isConnOpen()) {

            if (indice > 1) {

                StringBuilder filter = new StringBuilder(ja1.getJSONObject(0).getString(ImporterUtil.COLUMN_NAME));

                filter.append(">");
                int pos = indice - 1;
                filter.append(pos);

                fromData = iu.getTableData(from1.getSchema(), t1.getTableFrom(), filter.toString());
            } else {
                fromData = iu.getTableData(from1.getSchema(), t1.getTableFrom());
            }
        }

        if (iu2.isConnOpen()) {

            iu2.copyData(t1, fromData, indice, ja);

            t1.setMaxIdLastOp(new Long(--indice));
            em.merge(t1);

        }
        //Close conn
        iu.quit();
        iu2.quit();

        return Response.ok(fromData.toString()).build();

    }

    /**
     * http://localhost:8080/smartcities/rest/importer/transformation/dtb_1/dtb_4/t1/t2_nm1/params?t2_nm1col=descriptiont1
     *
     * na lista de parametros a chave é a coluna destino e o valor
     * correspondente no mapa é a tabela origem
     *
     */
    @GET
    @Path("/transformation/{idDataSourceFrom}/{idDataSourceTo}/{tbFrom}/{tbTo}/{fKeys}")
    @Produces("application/json")
    public Response saveTransformation(@PathParam("idDataSourceFrom") String idDataSourceFrom,
            @PathParam("idDataSourceTo") String idDataSourceTo,
            @PathParam("tbFrom") String tableFrom,
            @PathParam("tbTo") String tableTo,
            @PathParam("fKeys") String uuid,
            @Context UriInfo uriInfo,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) {

        Transformation t1 = new Transformation();
        t1.setTableFrom(tableFrom);
        t1.setTableTo(tableTo);

        MultivaluedMap params = uriInfo.getQueryParameters();
        HashMap<String, String> fieldMap = new HashMap<String, String>();
        for (Object key : params.keySet()) {
            String fFrom = key.toString();
            if (fFrom.equals(REQUESTPREVENT_CACHE)) {
                continue;
            }
            String fTo = params.getFirst(key).toString();
            fieldMap.put(fFrom, fTo);
        }

        Profile p = ProfileEndpoint.getProfileSession(req);
        Profile pOwner = em.find(Profile.class, p.getIdprofile());
        t1.setOwner(pOwner);
        t1.setIdProfile(p.getIdprofile());
        t1.setMyFields(fieldMap);//

        String fromTp[] = idDataSourceFrom.split("_");
        String toTp[] = idDataSourceTo.split("_");

        DataSource fromDb, toDB;
        FileSource fromSrc, toSrc;

        Long idDtsrc = Long.parseLong(fromTp[1]);

        if (fromTp[0].equalsIgnoreCase("dtb")) {
            fromDb = em.find(DataSource.class, idDtsrc);
            t1.setFromDatabase(fromDb);
            t1.setIdFromDatabase(fromDb.getIddataSource().intValue());
        } else {
            fromSrc = em.find(FileSource.class, idDtsrc);
            t1.setFromSource(fromSrc);
            t1.setIdFromSource(fromSrc.getId().intValue());
        }

        idDtsrc = Long.parseLong(toTp[1]);

        if (toTp[0].equalsIgnoreCase("dtb")) {
            toDB = em.find(DataSource.class, idDtsrc);
            t1.setToDatabase(toDB);
            t1.setIdToDatabase(toDB.getIddataSource().intValue());
        } else {
            toSrc = em.find(FileSource.class, idDtsrc);
            t1.setToSource(toSrc);
            t1.setIdToSource(toSrc.getId().intValue());
        }
        //Salva a transformação
        em.persist(t1);

        //Retorna o json
        return Response.ok(t1).build();
    }
    public static final String REQUESTPREVENT_CACHE = "request.preventCache";

    @GET
    @Path("/export_table_json/{datasource_id}/{table_name}")
    @Produces("application/json")
    public Response exportTableDataJSON(@PathParam("datasource_id") String dataSourceId, @PathParam("table_name") String tableName, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        //Instancia o importer
        JSONArray ja = exportTableData(dataSourceId, tableName);
        return Response.ok(ja.toString()).build();
    }

    @GET
    @Path("/export_columns_json/{datasource_id}/{table_name}")
    @Produces("application/json")
    public Response exportTableColumnsJSON(@PathParam("datasource_id") String dataSourceId, @PathParam("table_name") String tableName, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        //Instancia o importer
        ImporterUtil ui = null;
        DataSource de;
        JSONArray ja = new JSONArray();
        try {
            de = em.find(DataSource.class, Long.parseLong(dataSourceId));
        } catch (NoSuchEntityException e) {
            Logger.getLogger(ImporterEndpoint.class.getName()).log(Level.SEVERE, null, "ERROR RETRIEVING TABLE METADATA!\n" + e.toString());
            return Response.ok(ja.toString()).build();//Datasource not found
        }

        EnumDriverType databaseType = de.getDataSourceDriver();
        String dbName = de.getNmDatasource();
        String user = de.getDataUsername();
        String pPort = de.getPport().toString();
        String passwd = de.getDataPassword();
        String urlDb = de.getDataSourceUrl();
        String mSchema = de.getDeSchema();

        try {
            ui = new ImporterUtil(databaseType, urlDb, pPort, user, passwd, dbName);
            if (ui.isConnOpen()) {

                ja.put(ui.getColumnsFromTable(mSchema, tableName));
                ja.put(ui.getPKsFromTable(mSchema, tableName));
                ja.put(ui.getFKsFromTable(mSchema, tableName));
            }

        } catch (Exception e) {
            e.printStackTrace();
            ja = new JSONArray();
        } finally {
            try {
                ui.destroy();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return Response.ok(ja.toString()).build();
        }
    }

    @GET
    @Path("/copy_soutce/{url}")
    @Produces("application/json")
    public Response copySource(@PathParam("ccol") String ccol, @Context HttpServletRequest req, @Context HttpServletResponse res) {

        return null;
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
        String xmlOutput = "<?xml version=\"1.0\"?>" + XML.toString(js);
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

    /**
     * http://localhost:8080/smartcities/rest/importer/db_poll/postgres/m0r3tt02013/POSTGRES/localhost/3128/smartcities/public
     */
    @GET
    @Path("/db_poll/{pUser}/{pPass}/{dbType}/{url}/{port}/{databaseModel}/{schema}")
    @Produces("application/json")
    public Response connectDbGetTables(@PathParam("pUser") String pUser,
            @PathParam("pPass") String pPass,
            @PathParam("dbType") String dbType,
            @PathParam("url") String url,
            @PathParam("port") String port,
            @PathParam("databaseModel") String databaseModel,
            @PathParam("schema") String schema,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) throws Exception {

        EnumDriverType mdriver = EnumDriverType.valueOf(dbType.toUpperCase());
        ImporterUtil iu = new ImporterUtil(mdriver, url, port, pUser, pPass, databaseModel);

        if (iu.isConnOpen()) {

            //@todo persisir dados da conexão do usuario
            ArrayList<String> lTables = iu.getTablesFromConnection(schema);

            JSONObject jsTable = new JSONObject();

            jsTable.put(SCHEMAA, schema);
            jsTable.put(P_DB, databaseModel);
            jsTable.put(P_DRIVER, mdriver);
            jsTable.put(P_URL, url);
            jsTable.put(P_PORT, port);
            jsTable.put(P_USER, pUser);
            //jsTable.put(SID, sid);

            JSONArray databaseModelMetaData = new JSONArray();

            for (String tName : lTables) {
                JSONObject js = new JSONObject();
                js.put("tName", tName);

                JSONArray cols = new JSONArray();
                JSONArray pks = new JSONArray();
                JSONArray fks = new JSONArray();

                //Recover all the columns
                try {
                    cols = iu.getColumnsFromTable(schema, tName);
                } catch (SQLException sQLException) {
                    Logger.getAnonymousLogger().log(Level.WARNING, "iu.getColumnsFromTable(" + schema + "," + tName + ")");
                }
                js.put(COLUMNS, cols);

                //Recover all the pk from table
                try {
                    pks = iu.getPKsFromTable(schema, tName);
                } catch (SQLException sQLException) {
                    Logger.getAnonymousLogger().log(Level.WARNING, "iu.getPKsFromTable(" + schema + "," + tName + ")");
                }
                js.put(PKS, pks);

                //Recover all the fk from table
                try {
                    fks = iu.getFKsFromTable(schema, tName);
                } catch (SQLException sQLException) {
                    Logger.getAnonymousLogger().log(Level.WARNING, "iu.getFKsFromTable(" + schema + "," + tName + ")");
                }
                js.put(FKS, fks);

                databaseModelMetaData.put(js);

            }
            jsTable.put("mdd", databaseModelMetaData);

            Profile p = ProfileEndpoint.getProfileSession(req);

            //Persiste o datasource
            try {
                DataSource de = new DataSource();
                de.setDataPassword(pPass);
                de.setDataUsername(pUser);
                de.setPport(new Integer(port));
                de.setDataSourceUrl(url);
                de.setDataSourceDriver(mdriver);
                de.setNmDatasource(databaseModel);
                de.setDeSchema(schema);

                de.setOwner(p);
                de.setIdProfile(p.getIdprofile());

                em.persist(de);
            } catch (Exception numberFormatException) {
                numberFormatException.printStackTrace();
            }

            return Response.ok(jsTable.toString()).build();
        }
        return Response.ok(null).build();

    }
    public static final String P_DB = "pDb";
    public static final String SID = "sid";
    public static final String P_USER = "pUser";
    public static final String P_PORT = "pPort";
    public static final String P_URL = "pUrl";
    public static final String P_DRIVER = "pDriver";
    public static final String TABLE = "table";
    public static final String SCHEMAA = "databaseModel";
    public static final String FKS = "fks";
    public static final String PKS = "pks";
    public static final String COLUMNS = "columns";

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
