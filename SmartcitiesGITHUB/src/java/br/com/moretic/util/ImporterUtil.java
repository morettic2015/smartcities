/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.copy.HierarchicalStreamCopier;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;
import com.thoughtworks.xstream.io.xml.XppReader;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author LuisAugusto
 */
public class ImporterUtil {

    private EnumDriverType dbType;
    private Connection conn;
    private ArrayList<String> lTables;

    private DatabaseMetaData md;
    private ResultSet rs;
    private Statement stmt;
    private ResultSetMetaData rsmd;
    private String url;

    public static final String COLUMN_TYPE = "columnType";
    public static final String COLUMN_NAME = "columnName";
    public static final String ORDER = "order";
    public static final String PK_NAME = "pkName";

    public static final String FK_NAME = "fkName";
    public static final String FK_COLUMN_NAME = "fkColumnName";
    public static final String FK_TABLE_NAME = "fkTableName";
    public static final String PK_COLUMN_NAME = "pkColumnName";
    public static final String PK_TABLE_NAME = "pkTableName";

    public boolean connect(EnumDriverType dbTp, String url, String port, String user, String pass, String sid, String schema) throws ClassNotFoundException {
        //Set database type
        this.dbType = dbTp;
        //Register driver
        Class.forName(dbType.toString());
        //Estabeçece a conexão com o banco
        try {
            String urlConnection = makeDBConnURL(url, port, user, pass, sid, schema, dbTp);
            this.conn = DriverManager.getConnection(urlConnection);

            return !this.conn.isClosed();

        } catch (SQLException sQLException) {
            return false;
        }
    }

    private String makeDBConnURL(String host, String port, String user, String pass, String sid, String schema, EnumDriverType dt) {
        StringBuilder sb = new StringBuilder();

        if (dt.equals(EnumDriverType.ORACLE)) {
            sb.append("jdbc:oracle:thin:");
            sb.append(user);
            sb.append("@");
            sb.append(host);
            sb.append(":");
            sb.append(port);
            sb.append(":");
            sb.append(sid);

        } else if (dt.equals(EnumDriverType.POSTGRES)) {
            sb.append("jdbc:postgresql://");
            sb.append(host);
            sb.append("/");
            sb.append(schema);
            sb.append("?user=");
            sb.append(user);
            sb.append("&password=");
            sb.append(pass);
        }
        return sb.toString();
    }

    //@TODO retornar JSONArray com as tabelas
    public ArrayList<String> getTablesFromConnection(String schema) throws SQLException {
        lTables = new ArrayList<String>();
        md = conn.getMetaData();
        rs = md.getTables(null, null, "%", null);
        while (rs.next()) {
            
            if (rs.getString(4) != null && rs.getString(2) != null) {
            
                System.out.println(rs.getString(4));
                System.out.println("********");
                
                System.out.println(rs.getString(2));
                
                if (rs.getString(4).equals("TABLE") && rs.getString(2).equals(schema)) {
                    lTables.add(rs.getString(3));
                }
            }
        }
        return lTables;
    }

    //@TODO retornar JSON com as propriedades dads colunas
    public JSONArray getColumnsFromTable(String tableName) throws SQLException {
        JSONArray ja = new JSONArray();
        stmt = conn.createStatement();
        rs = stmt.executeQuery("SELECT * FROM " + tableName);
        rsmd = rs.getMetaData();
        int numberOfColumns = rsmd.getColumnCount();
        boolean b = rsmd.isSearchable(1);

        for (int i = 0; i < numberOfColumns; i++) {
            JSONObject js = new JSONObject();
            js.put(COLUMN_NAME, rsmd.getColumnName(i));//Nome da table que tem a fk
            js.put(COLUMN_TYPE, rsmd.getColumnTypeName(i));//Nome da table que tem a fk
            ja.put(js);
        }

        return ja;
    }

    public JSONArray getPKsFromTable(String schema, String tableName) throws SQLException {
        JSONArray ja = new JSONArray();
        ResultSet rs = md.getPrimaryKeys(null, schema, tableName);

        while (rs.next()) {
            JSONObject js = new JSONObject();
            js.put(COLUMN_NAME, rs.getString(4));//Nome da table que tem a fk
            js.put(PK_NAME, rs.getString(6));//Nome da table que tem a fk
            js.put(ORDER, rs.getString(5));//Nome da table que tem a fk

            ja.put(js);
        }
        return ja;
    }

    public JSONArray getFKsFromTable(String schema, String tableName) throws SQLException {
        JSONArray ja = new JSONArray();
        ResultSet rs = md.getImportedKeys(null, schema, tableName);

        while (rs.next()) {
            JSONObject js = new JSONObject();
            js.put(PK_TABLE_NAME, rs.getString(3));//Nome da table que tem a fk
            js.put(PK_COLUMN_NAME, rs.getString(4));//Nome da coluna que é fk

            js.put(FK_TABLE_NAME, rs.getString(7));//Nome da table que e referenciada
            js.put(FK_COLUMN_NAME, rs.getString(8));//Nome da coluna que é id referenciada

            js.put(FK_NAME, rs.getString(12));//Nome da fk que tem a fk
            ja.put(js);
        }
        return ja;
    }

    public static JSONArray makeJSONFromCsv(String path, String delimiter) {
        BufferedReader fileReader = null;
        JSONArray jsonArray = new JSONArray();
        try {
            //Get the CSVReader instance with specifying the delimiter to be used
            fileReader = new BufferedReader(new FileReader(path));
            String line;
            //Read one line at a time

            while (((line = fileReader.readLine()) != null)) {
                String[] tokens = line.split(delimiter);

                String field = "";

                JSONArray js = new JSONArray();

                int i = 1;
                for (Object token : tokens) {
                    if (token instanceof Integer) {
                        js.put(Integer.parseInt(token.toString()));
                    }
                    if (token instanceof Float) {
                        js.put(Float.parseFloat(token.toString()));
                    } else {
                        js.put(token);
                    }

                }
                jsonArray.put(js);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                fileReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return jsonArray;
    }

    public static void main(String args[]) {
        System.out.println(makeJSONFromCsv("C:\\Users\\LuisAugusto\\Downloads\\FL_insurance_sample.csv", ","));
    }

    public static JSONObject makeJSONFromXml(String path) {
        BufferedReader fileReader = null;
        JSONObject jsonObject = new JSONObject();
        StringBuilder sbXml = new StringBuilder();
        try {
            //Get the CSVReader instance with specifying the delimiter to be used
            fileReader = new BufferedReader(new FileReader(path));
            String line;
            //Read one line at a time

            while (((line = fileReader.readLine()) != null)) {
                sbXml.append(line);
            }

            StringWriter buffer = new StringWriter();
            HierarchicalStreamReader sourceReader = new XppReader(new StringReader(sbXml.toString()));
            JettisonMappedXmlDriver jettisonDriver = new JettisonMappedXmlDriver();
            jettisonDriver.createWriter(buffer);
            HierarchicalStreamWriter destinationWriter = jettisonDriver.createWriter(buffer);

            HierarchicalStreamCopier copier = new HierarchicalStreamCopier();
            copier.copy(sourceReader, destinationWriter);

            jsonObject = new JSONObject(buffer.toString());
            JSONArray jsProperties = new JSONArray();

            readPropertiesJSON(jsonObject, jsProperties);

            jsonObject.put(METADADA, jsProperties);

            buffer.close();
            sourceReader.close();
            jettisonDriver = null;
            destinationWriter.close();
            copier = null;

        } catch (Exception e) {
            jsonObject = new JSONObject();
            jsonObject.put(ERROR_XML_JSON_1000, e.toString());
            e.printStackTrace();
        } finally {
            try {
                fileReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            fileReader = null;
        }
        return jsonObject;
    }
    public static final String ERROR_XML_JSON_1000 = "ERROR_XML JSON (1000)";
    public static final String METADADA = "metadata";
    /*
     Metodo recursivo para recuperar todos os elementos de um JSON OBject
     */

    private static void readPropertiesJSON(Object o, JSONArray prop) {
        if (o instanceof JSONObject) {
            Set<String> ks = ((JSONObject) o).keySet();
            Iterator<String> isks = ks.iterator();

            while (isks.hasNext()) {
                String s = isks.next();
                Object o1 = ((JSONObject) o).get(s);
                if (o1 instanceof JSONObject) {
                    readPropertiesJSON(o1, prop);
                } else if (o1 instanceof JSONArray) {
                    readPropertiesJSON(o1, prop);
                }
                prop.put(s);

            }
        } else if (o instanceof JSONArray) {
            if (((JSONArray) o).length() > 0) {
                JSONObject js = ((JSONArray) o).getJSONObject(0);
                readPropertiesJSON(js, prop);
            }
        }
    }

    public static void removePropertiesJSON(Object o, HashSet<String> properties) {
        if (o instanceof JSONObject) {
            HashSet<String> ks = new HashSet<String>(((JSONObject) o).keySet());//FUCKING SHIT SYNCHRONIZED
            Iterator<String> isks = ks.iterator();

            while (isks.hasNext()) {
                String s = isks.next();
                Object o1 = ((JSONObject) o).get(s);
                if (o1 instanceof JSONObject || o1 instanceof JSONArray) {
                    removePropertiesJSON(o1, properties);
                } else if (!properties.contains(s)) {
                    ((JSONObject) o).remove(s);
                }

            }
        } else if (o instanceof JSONArray) {
            if (((JSONArray) o).length() > 0) {
                for (int i = 0; i < ((JSONArray) o).length(); i++) {
                    Object js = ((JSONArray) o).get(i);
                    if (js instanceof JSONObject || js instanceof JSONArray) {
                        removePropertiesJSON(js, properties);
                    } else {
                        //Chegou aqui é um vetor de valores primitivos nao faz merda nenhuma
                        break;
                    }
                }
            }
        }
    }
}
