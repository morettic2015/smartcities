/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.social.twitter;

import br.com.moretic.rest.ProfileEndpoint;
import br.com.moretic.social.facebook.FacebookProxyFilter;
import static br.com.moretic.social.facebook.FacebookProxyFilter.FACEBOOKREST;
import br.com.moretic.vo.Profile;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import twitter4j.User;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.auth.AccessToken;
import twitter4j.auth.RequestToken;

/**
 *
 * @author LuisAugusto
 */
@WebServlet(name = "TwiterCallback", urlPatterns = {"/rest/twitter/callback"})
public class TwiterCallback extends HttpServlet {

    @PersistenceContext(unitName = "smartcitie_db", type = PersistenceContextType.TRANSACTION)
    private EntityManager em;

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
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            Twitter twitter = (Twitter) request.getSession().getAttribute("twitter");
            RequestToken requestToken = (RequestToken) request.getSession().getAttribute("requestToken");
            String verifier = request.getParameter("oauth_verifier");

            AccessToken accessToken = null;
            try {
                accessToken = twitter.getOAuthAccessToken(requestToken, verifier);
                request.getSession().removeAttribute("requestToken");

            } catch (TwitterException twitterException) {
                twitterException.printStackTrace();
            }

            long userId = accessToken.getUserId();
            User user = twitter.showUser(userId);

            String avatarUrl = user.getProfileImageURL().toString();
            System.out.println(user.getScreenName());

            TypedQuery<Profile> findByIdQuery = em.createQuery("SELECT DISTINCT p FROM Profile p WHERE p.email = :entityId ORDER BY p.idprofile", Profile.class);
            findByIdQuery.setParameter("entityId", user.getScreenName() + "@twitter.com");

            Profile entity = null;
            try {
                //Ja existe recupera e fechou
                entity = findByIdQuery.getSingleResult();
                request.getSession(true).setAttribute(ProfileEndpoint.PROFILE, entity);

                ((HttpServletResponse) response).sendRedirect(SMARTCITIESMAINHTML);
            } catch (NoResultException nre) {
                try {

                    String url = FacebookProxyFilter.FACEBOOKREST + "/" + user.getScreenName() + "@twitter.com/" + user.getName() + "/" + URLEncoder.encode(avatarUrl.replaceAll("/","ø"),"UTF-8") ;
                    ((HttpServletResponse) response).sendRedirect(url);

                } catch (Exception ex1) {

                    Logger.getLogger(FacebookProxyFilter.class.getName()).log(Level.SEVERE, null, ex1);

                    ((HttpServletResponse) response).sendRedirect(SMARTCITIESINDEXHTML);
                    // em.getTransaction().rollback();
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }
    }
    public static final String SMARTCITIESINDEXHTML = "/smartcities/index.html";
    public static final String SMARTCITIESMAINHTML = "/smartcities/main.html";

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
        processRequest(request, response);
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
        processRequest(request, response);
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