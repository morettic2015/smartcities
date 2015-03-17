/*
 * MD5Crypt.java
 * 
 * Created on 03/06/2007, 20:17:08
 * 
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package br.com.moretic.util;

/**
 *
 * @author root
 */
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 *
 * @author Administrador
 */
public class MD5Crypt {
    public static String getHash (String chave) throws NoSuchAlgorithmException{
         java.security.MessageDigest md = MessageDigest.getInstance ("MD5"); 
         md.update(chave.getBytes()); 
         byte[] hash = md.digest(); 
         StringBuffer hexString = new StringBuffer(); 
         for (int i = 0; i < hash.length; i++) { 
            if ((0xff & hash[i]) < 0x10) 
               hexString.append( 
                  "0" + Integer.toHexString((0xFF & hash[i]))); 
            else 
               hexString.append(Integer.toHexString(0xFF & hash[i])); 
         } 
         return hexString.toString(); 
    }
   
    public static void main (String args[]){
      String sign = "OZZY";

      try { 
         java.security.MessageDigest md = MessageDigest.getInstance("MD5"); 
         md.update(sign.getBytes()); 
         byte[] hash = md.digest(); 
         StringBuffer hexString = new StringBuffer(); 
         for (int i = 0; i < hash.length; i++) { 
            if ((0xff & hash[i]) < 0x10) 
               hexString.append( 
                  "0" + Integer.toHexString((0xFF & hash[i]))); 
            else 
               hexString.append(Integer.toHexString(0xFF & hash[i])); 
         } 
         sign = hexString.toString(); 
         
         System.out.println(sign);
      } 
      catch (Exception nsae) { 
         nsae.printStackTrace(); 
      } 
    }
  
}
