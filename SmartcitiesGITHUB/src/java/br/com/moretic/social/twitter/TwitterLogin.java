/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.social.twitter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.RequestToken;

/**
 *
 * @author LuisAugusto
 */
@WebServlet(name = "TwitterLoginFilter", urlPatterns = {"/rest/twitter/login"})
public class TwitterLogin extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, TwitterException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            /* TODO output your page here. You may use following sample code. */
            Twitter twitter = new TwitterFactory().getInstance();
            RequestToken requestToken;
            request.getSession(true).setAttribute("twitter", twitter);
            twitter.setOAuthConsumer(V_SU_WW_DJ_TLZ09W_IN2E1T_JG2Y_J, O2Z_WQ_DEDW_VH0KS9_MJ_R62GJ2_ML_ME_MZRJ5I6_LF_S0M_YB);
            
            //URL DE CALLBACK PARA SERVLET CALLBACK
            StringBuffer callbackURL = request.getRequestURL();
            int index = callbackURL.lastIndexOf("/");
            callbackURL.replace(index, callbackURL.length(), "").append("/callback");
            
            requestToken = twitter.getOAuthRequestToken(callbackURL.toString());
            
            String authURL = requestToken.getAuthenticationURL();
            request.getSession().setAttribute("requestToken", requestToken);
            response.sendRedirect(authURL);
        } catch (TwitterException twitterException) {
            twitterException.printStackTrace();
        } finally {
            out.close();
        }
    }
    public static final String O2Z_WQ_DEDW_VH0KS9_MJ_R62GJ2_ML_ME_MZRJ5I6_LF_S0M_YB = "O2zWQDedwVh0KS9MjR62gj2MlMEMzrj5i6LfS0mYb5kIFwXgUX";
    public static final String V_SU_WW_DJ_TLZ09W_IN2E1T_JG2Y_J = "4vSuWWDjTLZ09WIn2e1tJg2yJ";

// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (TwitterException ex) {
            Logger.getLogger(TwitterLogin.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (TwitterException ex) {
            Logger.getLogger(TwitterLogin.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
