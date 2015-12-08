/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import br.com.moretic.vo.DataSource;
import br.com.moretic.vo.Transformation;
import com.sun.media.jfxmedia.logging.Logger;
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
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import org.json.JSONArray;
import org.json.JSONException;
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

    public ImporterUtil(EnumDriverType dataSourceDriver, String dataSourceUrl, String pport, String dataUsername, String dataPassword, String nmDatasource) throws ClassNotFoundException {
        this.connect(dataSourceDriver, dataSourceUrl, pport, dataUsername, dataPassword, nmDatasource);

        try {
            conn.setSchema(nmDatasource);
        } catch (Exception sQLException) {
            java.util.logging.Logger.getAnonymousLogger().log(Level.WARNING, "conn.setSchema(schema) not supported! old JDBC DRIVER!");
        }
    }

    public boolean isConnOpen() throws SQLException {
        return !this.conn.isClosed();
    }

    private boolean connect(EnumDriverType dbTp, String url, String port, String user, String pass, String schema) throws ClassNotFoundException {
        //Set database type
        this.dbType = dbTp;
        //Register driver
        Class.forName(dbType.toString());
        //Estabeçece a conexão com o banco
        try {
            String urlConnection = makeDBConnURL(url, port, user, pass, schema, dbTp);
            this.conn = DriverManager.getConnection(urlConnection);

            return !this.conn.isClosed();

        } catch (SQLException sQLException) {
            return false;
        }
    }

    public void quit() {
        try {
            this.conn.close();
        } catch (SQLException ex) {
            java.util.logging.Logger.getLogger(ImporterUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private String makeDBConnURL(String host, String port, String user, String pass, String schema, EnumDriverType dt) {
        StringBuilder sb = new StringBuilder();

        if (dt.equals(EnumDriverType.ORACLE)) {
            sb.append("jdbc:oracle:thin:");
            sb.append(user);
            sb.append("@");
            sb.append(host);
            sb.append(":");
            sb.append(port);
            sb.append(":");
            sb.append(schema);

        } else if (dt.equals(EnumDriverType.POSTGRES)) {
            sb.append("jdbc:postgresql://");
            sb.append(host);
            sb.append("/");
            sb.append(schema);
            sb.append("?user=");
            sb.append(user);
            sb.append("&password=");
            sb.append(pass);
        } else if (dt.equals(EnumDriverType.MYSQL)) {
            sb.append("jdbc:mysql://");
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
        if (this.dbType.equals(EnumDriverType.MYSQL)) {//Não tem schema no banco 
            while (rs.next()) {

                if (rs.getString(4) != null && rs.getString(4).equalsIgnoreCase("TABLE")) {
                    lTables.add(rs.getString(3));
                }
            }
        } else {
            while (rs.next()) {

                if (rs.getString(4) != null && rs.getString(2) != null && rs.getString(4).equals("TABLE") && rs.getString(2).equals(schema)) {
                    lTables.add(rs.getString(3));

                }
            }
        }
        return lTables;
    }

    public JSONArray getTableData(String schema, String tableName, String... filters) throws SQLException {
        JSONArray ja = new JSONArray();

        stmt = conn.createStatement();

        StringBuilder query = new StringBuilder("SELECT DISTINCT * FROM " + tableName);

        //Concatena os filtros
        if (filters.length > 0) {
            query.append(" WHERE ");
            query.append(filters[0]);
        }

        rs = stmt.executeQuery(query.toString());

        rsmd = rs.getMetaData();
        int numberOfColumns = rsmd.getColumnCount();

        while (rs.next()) {
            JSONObject js = new JSONObject();

            for (int i = 1; i <= numberOfColumns; i++) {
                String colName = rsmd.getColumnName(i);
                try {
                    js.put(colName, rs.getString(i));//Nome da table que tem a fk
                } catch (SQLException sQLException) {
                    js.put(colName, "ERROR");
                }

            }
            ja.put(js);
        }

        return ja;
    }

    //@TODO retornar JSON com as propriedades dads colunas
    public JSONArray getColumnsFromTable(String schema, String tableName) throws SQLException {
        JSONArray ja = new JSONArray();
        stmt = conn.createStatement();

        rs = stmt.executeQuery("SELECT * FROM " + tableName);
        rsmd = rs.getMetaData();
        int numberOfColumns = rsmd.getColumnCount();
        boolean b = rsmd.isSearchable(1);

        for (int i = 1; i <= numberOfColumns; i++) {
            JSONObject js = new JSONObject();
            js.put(COLUMN_NAME, rsmd.getColumnName(i));//Nome da table que tem a fk
            js.put(COLUMN_TYPE, rsmd.getColumnTypeName(i));//Nome da table que tem a fk
            ja.put(js);
        }

        return ja;
    }

    public JSONArray getPKsFromTable(String schema, String tableName) throws SQLException {
        JSONArray ja = new JSONArray();
        md = conn.getMetaData();
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
        md = conn.getMetaData();
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

    public int[] copyData(Transformation t1, JSONArray fromData, int indice, JSONArray pks) throws SQLException {

        this.conn.setAutoCommit(false);

        String tableTo = t1.getTableTo();
        //DataSource destiny = t1.getToDatabase();
        PreparedStatement preparedStatement = null;
        JSONArray colunas = getColumnsFromTable(t1.getToDatabase().getSchema(), tableTo);

        StringBuilder query = new StringBuilder("INSERT INTO " + tableTo + "(");
        String pkName = pks.getJSONObject(0).getString(COLUMN_NAME);

        ArrayList<String> lColumns = new ArrayList<String>(0);
        for (int i = 0; i < colunas.length(); i++) {
            JSONObject js = colunas.getJSONObject(i);
            if (js.getString(COLUMN_NAME).equalsIgnoreCase(pkName))//PK E A ULTIMA SEMPRE
            {
                continue;
            }

            lColumns.add(js.getString(COLUMN_NAME));
            query.append(js.getString(COLUMN_NAME));
            query.append(",");

        }

        query.append(pkName);
        query.append(") VALUES (");

        int total = lColumns.size();
        total++;
        for (int i = 0; i <= total; i++) {
            query.append("?");
            if (total-- > 1) {
                query.append(",");
            }
        }

        query.append(")");

        preparedStatement = this.conn.prepareStatement(query.toString());

        for (int i = 0; i < fromData.length(); i++) {
            JSONObject data = fromData.getJSONObject(i);
            int cNum = 1;
            for (String c : lColumns) {
                String realColumn = t1.getMyFields().get(c);
                String realData = data.getString(realColumn);
                preparedStatement.setString(cNum++, realData);
            }

            preparedStatement.setLong(cNum++, indice++);

            preparedStatement.addBatch();

        }

        int[] r = null;
        try {
            r = preparedStatement.executeBatch();

            this.conn.commit();
        } catch (SQLException sQLException) {
            sQLException.printStackTrace();
            sQLException.getNextException().printStackTrace();
            this.conn.rollback();
        } finally {
            this.conn.close();
        }
        return r;

    }

    public int getMaxElementFrom(JSONArray ja, String table) throws SQLException {

        JSONObject js = ja.getJSONObject(0);
        String pkName = js.getString(COLUMN_NAME);

        int max = 0;

        stmt = conn.createStatement();
        rs = stmt.executeQuery("select (max(" + pkName + ")) as pk from " + table);

        if (rs.next()) {
            max = rs.getInt("pk");
        }

        return ++max;
    }

    public void destroy() throws SQLException {
        this.conn.close();
    }
}
