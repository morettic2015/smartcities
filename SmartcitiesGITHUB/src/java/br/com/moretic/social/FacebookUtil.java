/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.social;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

/**
 *
 * @author LuisAugusto
 */
public class FacebookUtil {

    private static final String client_secret = "";
    private static final String client_id = "618780288218697";
    private static final String redirect_uri = "http://localhost:8080/smartcities/loginfbresponse";

    public void obterUsuarioFacebook(String code)
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

   //     JSONObject resp = new JSONObject(readURL(new URL(
   //             "https://graph.facebook.com/me?access_token=" + accessToken)));

      
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

    public String getLoginRedirectURL() {
        return "https://graph.facebook.com/oauth/authorize?client_id="
                + client_id + "&display=page&redirect_uri=" + redirect_uri
                + "&scope=email,publish_actions";
    }

    public String getAuthURL(String authCode) {
        return "https://graph.facebook.com/oauth/access_token?client_id="
                + client_id + "&redirect_uri=" + redirect_uri
                + "&client_secret=" + client_secret + "&code=" + authCode;
    }

}
