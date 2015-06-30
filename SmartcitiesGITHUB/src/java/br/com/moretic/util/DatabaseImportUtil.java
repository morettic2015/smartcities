/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

/**
 *
 * @author LuisAugusto
 */
public class DatabaseImportUtil {

    private DatabaseDriverType dbType;
    private Connection conn;
    private ArrayList<String> lTables;
    private ArrayList<MCollumn> tColumns;
    private DatabaseMetaData md;
    private ResultSet rs;
    private Statement stmt;
    private ResultSetMetaData rsmd;
    private String url;

    public boolean connect(DatabaseDriverType dbTp, String url, String port, String user, String pass, String schema) throws ClassNotFoundException {
        //Set database type
        this.dbType = dbTp;
        //Register driver
        Class.forName(dbType.toString());
        //Estabeçece a conexão com o banco
            try {
                this.conn = DriverManager.getConnection(url, user, pass);
                
                return !this.conn.isClosed();
                
            } catch (SQLException sQLException) {
                return false;
            }
    }
    
    public ArrayList<String> getTablesFromConnection(Connection conn) throws SQLException {
        lTables = new ArrayList<String>();
        md = conn.getMetaData();
        rs = md.getTables(null, null, "%", null);
        while (rs.next()) {

            lTables.add(rs.getString(3));
        }
        return lTables;
    }

    public ArrayList<MCollumn> getColumnsFromTable(String tableName, Connection conn) throws SQLException {
        tColumns = new ArrayList<MCollumn>();
        stmt = conn.createStatement();
        rs = stmt.executeQuery("SELECT * FROM " + tableName);
        rsmd = rs.getMetaData();
        int numberOfColumns = rsmd.getColumnCount();
        boolean b = rsmd.isSearchable(1);

        for (int i = 0; i < numberOfColumns; i++) {
            MCollumn mc = new MCollumn();
            mc.columnName = rsmd.getColumnName(i);
            mc.columnType = rsmd.getColumnTypeName(i);
        }

        return tColumns;
    }

}

class MCollumn {

    protected String columnName, columnType;
}
