/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.social.facebook;

import br.com.moretic.rest.ProfileEndpoint;
import br.com.moretic.util.MD5Crypt;
import br.com.moretic.vo.Profile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.persistence.SynchronizationType;
import javax.persistence.TypedQuery;
import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONObject;

/**
 *
 * @author LuisAugusto
 */
@WebFilter(filterName = "FacebookProxyFilter", urlPatterns = {"/rest/facebook"}, dispatcherTypes = {DispatcherType.REQUEST, DispatcherType.FORWARD, DispatcherType.ERROR, DispatcherType.INCLUDE})
public class FacebookProxyFilter implements Filter {

    private static final boolean debug = true;

    @PersistenceContext(unitName = "smartcitie_db", type = PersistenceContextType.TRANSACTION)
    private EntityManager em;

    // The filter configuration object we are associated with.  If
    // this value is null, this filter instance is not currently
    // configured. 
    private FilterConfig filterConfig = null;

    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpSession session = ((HttpServletRequest) request).getSession();
        HttpServletRequest rreq = ((HttpServletRequest) request);

        FacebookUtil fbu = new FacebookUtil();
        String code = null;
        try {
            code = rreq.getParameter("code");

        } catch (Exception e) {//sem codigo vai pro index seu negro
            ((HttpServletResponse) response).sendRedirect(SMARTCITIESINDEXHTML);
            e.printStackTrace();
        }

        //CODIGO OK
        //ABRE URL DO FACEBOOK COM A API FACEBOOKUTIL
        String profile = URLDecoder.decode(fbu.getFBProfile(code), "UTF-8");
        //MONTA UM JSON DO OBJETO
        JSONObject profileJson = new JSONObject(profile);

        TypedQuery<Profile> findByIdQuery = em.createQuery("SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.avatars WHERE p.email = :entityId ORDER BY p.idprofile", Profile.class);
        findByIdQuery.setParameter("entityId", profileJson.getString("email"));
        String uIdFb = null;
        Profile entity = null;
        try {
            //Ja existe recupera e fechou
            entity = findByIdQuery.getSingleResult();
            entity.getAvatars();
            session.setAttribute(ProfileEndpoint.PROFILE, entity);

            ((HttpServletResponse) response).sendRedirect(SMARTCITIESMAINHTML);
        } catch (Exception nre) {
            nre.printStackTrace();
            try {
                uIdFb = profileJson.getString("id");
                //graph.facebook.com/10205211352462356/picture
                String urlImg = "http://graph.facebook.com/" + uIdFb + "/picture/";

                String fList;

                //fList = URLDecoder.decode(fbu.getFriendList(uIdFb), "UTF-8");

                String url = FACEBOOKREST + "/" + profileJson.getString("email") + "/" + profileJson.getString("name") + "/" + URLEncoder.encode(urlImg.replaceAll("/", "ø"), "UTF-8");
                ((HttpServletResponse) response).sendRedirect(url);

            } catch (Exception ex1) {

                Logger.getLogger(FacebookProxyFilter.class.getName()).log(Level.SEVERE, null, ex1);

                ((HttpServletResponse) response).sendRedirect(SMARTCITIESINDEXHTML);
                // em.getTransaction().rollback();
            }

        }

    }
    public static final String SMARTCITIESINDEXHTML = "/smartcities/index.html";
    public static final String SMARTCITIESMAINHTML = "/smartcities/main.html";
    public static final String FACEBOOKREST = "/smartcities/rest/profiles/facebook";

    /**
     * Return the filter configuration object for this filter.
     */
    public FilterConfig getFilterConfig() {
        return (this.filterConfig);
    }

    /**
     * Set the filter configuration object for this filter.
     *
     * @param filterConfig The filter configuration object
     */
    public void setFilterConfig(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
    }

    /**
     * Destroy method for this filter
     */
    public void destroy() {
    }

    /**
     * Init method for this filter
     */
    public void init(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
        if (filterConfig != null) {
            if (debug) {
                log("FacebookProxyFilter:Initializing filter");
            }
        }
    }

    /**
     * Return a String representation of this object.
     */
    @Override
    public String toString() {
        if (filterConfig == null) {
            return ("FacebookProxyFilter()");
        }
        StringBuffer sb = new StringBuffer("FacebookProxyFilter(");
        sb.append(filterConfig);
        sb.append(")");
        return (sb.toString());
    }

    private void sendProcessingError(Throwable t, ServletResponse response) {
        String stackTrace = getStackTrace(t);

        if (stackTrace != null && !stackTrace.equals("")) {
            try {
                response.setContentType("text/html");
                PrintStream ps = new PrintStream(response.getOutputStream());
                PrintWriter pw = new PrintWriter(ps);
                pw.print("<html>\n<head>\n<title>Error</title>\n</head>\n<body>\n"); //NOI18N

                // PENDING! Localize this for next official release
                pw.print("<h1>The resource did not process correctly</h1>\n<pre>\n");
                pw.print(stackTrace);
                pw.print("</pre></body>\n</html>"); //NOI18N
                pw.close();
                ps.close();
                response.getOutputStream().close();
            } catch (Exception ex) {
            }
        } else {
            try {
                PrintStream ps = new PrintStream(response.getOutputStream());
                t.printStackTrace(ps);
                ps.close();
                response.getOutputStream().close();
            } catch (Exception ex) {
            }
        }
    }

    public static String getStackTrace(Throwable t) {
        String stackTrace = null;
        try {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            t.printStackTrace(pw);
            pw.close();
            sw.close();
            stackTrace = sw.getBuffer().toString();
        } catch (Exception ex) {
        }
        return stackTrace;
    }

    public void log(String msg) {
        filterConfig.getServletContext().log(msg);
    }

}
