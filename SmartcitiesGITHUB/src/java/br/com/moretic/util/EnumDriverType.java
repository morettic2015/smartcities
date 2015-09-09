/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

/**
 *
 * @author LuisAugusto
 */
public enum EnumDriverType {
    
    ORACLE("oracle.jdbc.driver.OracleDriver"),
    MYSQL("com.mysql.jdbc.Driver"),
    POSTGRES("org.postgresql.Driver"),
    HSQLDB("org.hsqldb.jdbcDriver");

    private EnumDriverType(String dbType) {
        type = dbType;
    }
    
    private final String type;       

   
    public boolean equalsName(String otherName){
        return (otherName == null)? false:type.equals(otherName);
    }

    public String toString(){
       return type;
    }
}
