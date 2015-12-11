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
public enum EnumCriteriaType {
    MORE_THEN(">"),
    MORE_THEN_EQUALS(">="),
    LESS_THEN("<"),
    LESS_THEN_EQUALS("<"),
    LIKE("LIKE"),
    EQUALS("=");

    private EnumCriteriaType(String dbType) {
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
