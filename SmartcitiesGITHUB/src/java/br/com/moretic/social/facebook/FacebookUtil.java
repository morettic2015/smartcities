/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.social.facebook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

/**
 *
 * @author LuisAugusto
 */
final class FacebookUtil {

    private static final String client_secret = "84b4de4ec8db88ad215393d40c982c20";
    private static final String client_id = "880918378640520";
    private static final String redirect_uri = "http://localhost:8080/smartcities/rest/facebook";

    public String getFBProfile(String code)
            throws MalformedURLException, IOException {

        String retorno = readURL(new URL(this.getAuthURL(code)));

        String accessToken = null;
        @SuppressWarnings("unused")
        Integer expires = null;
        String[] pairs = retorno.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=");
            if (kv.length != 2) {
                throw new RuntimeException("Resposta auth inesperada.");
            } else {
                if (kv[0].equals("access_token")) {
                    accessToken = kv[1];
                }
                if (kv[0].equals("expires")) {
                    expires = Integer.valueOf(kv[1]);
                }
            }
        }

        return readURL(new URL("https://graph.facebook.com/me?access_token=" + accessToken));

        /*JSONObject resp = new JSONObject());

         UsuarioFacebook usuarioFacebook = new UsuarioFacebook(resp);
         System.out.println(usuarioFacebook.toString());*/
    }
    
    

    private String readURL(URL url) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        InputStream is = url.openStream();
        int r;
        while ((r = is.read()) != -1) {
            baos.write(r);
        }
        return new String(baos.toByteArray());
    }

    private String getLoginRedirectURL() {
        return "https://graph.facebook.com/oauth/authorize?client_id="
                + client_id + "&display=page&redirect_uri=" + redirect_uri
                + "&scope=email,publish_actions,picture";
    }
    
    public String getFriendList(String idFb) throws MalformedURLException, IOException{
        //idFb = "me";
        return readURL(new URL("https://graph.facebook.com/"+idFb+"/friends"));
    }

    private String getAuthURL(String authCode) {
        return "https://graph.facebook.com/oauth/access_token?client_id="
                + client_id + "&redirect_uri=" + redirect_uri
                + "&client_secret=" + client_secret + "&code=" + authCode;
    }

}
/*
 https://graph.facebook.com/oauth/authorize?client_id=880918378640520&display=page&redirect_uri=http://localhost:8080/smartcities/&scope=email,publish_actions

 **/
