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
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;

/**
 * @author LuisAugusto
 */
final class FacebookUtil {

    private static final String client_secret = "84b4de4ec8db88ad215393d40c982c20";
    private static final String client_id = "880918378640520";
    private static final String redirect_uri = "http://localhost:8080/smartcities/rest/facebook";
    private static String FRIENDS_PATH = "https://graph.facebook.com/me/friends?fields=cover,name,id,third_party_id,email&access_token=";
    private static final String PROFILE_PATH = "https://graph.facebook.com/me?access_token=" ;
    private String ACESSTOKEN = null;

    public JSONArray createFriendList() {
        long fc = -1;
        JSONArray twitterJAFList = new JSONArray();
        String retorno;
        try {
            retorno = readURL(new URL(FRIENDS_PATH+ACESSTOKEN));
            /*
            try {
            for (User follower : followers) {
            
            JSONObject jsFollower = new JSONObject();
            jsFollower.append(br.com.moretic.social.twitter.TwiterCallback.ID, follower.getScreenName() + "@facebook.com");
            jsFollower.append(br.com.moretic.social.twitter.TwiterCallback.AVATAR, follower.getBiggerProfileImageURL());
            jsFollower.append(br.com.moretic.social.twitter.TwiterCallback.NAME, follower.getName());
            jsFollower.append(br.com.moretic.social.twitter.TwiterCallback.BIO, follower.getDescription());
            twitterJAFList.put(jsFollower);
            }
            } catch (Exception ex) {
            ex.printStackTrace();
            twitterJAFList = new JSONArray();
            } finally {
            return twitterJAFList;
            }*/
        } catch (IOException ex) {
            Logger.getLogger(FacebookUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return null;
    }

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
        ACESSTOKEN = accessToken;
        return readURL(new URL(PROFILE_PATH+ ACESSTOKEN));

        /*JSONObject resp = new JSONObject());

         UsuarioFacebook usuarioFacebook = new UsuarioFacebook(resp);
         System.out.println(usuarioFacebook.toString());*/
    }

    public static String getFRIENDS_PATH() {
        return FRIENDS_PATH;
    }

    public String getACESSTOKEN() {
        return ACESSTOKEN;
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
                + "&scope=user_hometown,user_about_me,user_friends,email,publish_actions,picture";
    }

/*    public String getFriendList(String idFb) throws MalformedURLException, IOException {
        //idFb = "me";
        return readURL(new URL("https://graph.facebook.com/" + idFb + "/friends"));
    }
*/
    private String getAuthURL(String authCode) {
        return "https://graph.facebook.com/oauth/access_token?client_id="
                + client_id + "&redirect_uri=" + redirect_uri
                + "&client_secret=" + client_secret + "&code=" + authCode;
    }

}
/*
 https://graph.facebook.com/oauth/authorize?client_id=880918378640520&display=page&redirect_uri=http://localhost:8080/smartcities/&scope=email,publish_actions

 **/
