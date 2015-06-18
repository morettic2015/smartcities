/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import br.com.moretic.rest.ProfileEndpoint;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author lmrosario
 *
 * @TODO MAP ALL SERVICES THAT REQUIRES AUTHENTICATION
 */
@WebFilter(filterName = "SmartProxyFilter",
        urlPatterns = {"/main.html",
            "/configuration.html",
            "/rest/importer/upload/*",
            //"/upload/*",
            "/rest/ftp/*",
            "/rest/importer/*"},
        dispatcherTypes = {
            DispatcherType.FORWARD,
            DispatcherType.ERROR,
            DispatcherType.REQUEST,
            DispatcherType.INCLUDE})

public class SmartProxyFilter implements Filter {

    private static final boolean debug = true;
    private static String contextPath;
    private static String contextUri;

    public static String getContextUri() {
        return contextUri;
    }

    public static void setContextUri(String contextUri) {
        SmartProxyFilter.contextUri = contextUri;
    }

    public static String getContextPath() {
        return contextPath;
    }

    // The filter configuration object we are associated with.  If
    // this value is null, this filter instance is not currently
    // configured. 
    private FilterConfig filterConfig = null;

    /**
     *
     * @param request The servlet request we are processing
     * @param response The servlet response we are creating
     * @param chain The filter chain we are processing
     *
     * @exception IOException if an input/output error occurs
     * @exception ServletException if a servlet error occurs
     */
    @Override
    @SuppressWarnings("empty-statement")
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        // doBeforeProcessing(request, response);
        HttpSession session = ((HttpServletRequest) request).getSession();

        //atribui ao contexto do servlet o caminho completo
        ServletContext servletContext = filterConfig.getServletContext();

        //Path to sys upload
        contextPath = servletContext.getRealPath(UPLOAD);
        ;
        //App fulll path request
        contextUri = getHostInfo((HttpServletRequest) request);

        //Verifica se o usuario e valido
        if (session.getAttribute(ProfileEndpoint.PROFILE) == null) {
            // req.getRequestDispatcher("/login.jsp").forward(request, response);
            ((HttpServletResponse) response).sendRedirect(getHostCTX((HttpServletRequest) request) + INDEXHTML);
        } else {
            chain.doFilter(request, response);
        };
        doAfterProcessing(request, response);
    }

    private static String getHostInfo(HttpServletRequest request) {
        StringBuilder requestURL = new StringBuilder(request.getScheme());
        requestURL.append("://");
        requestURL.append(request.getServerName());
        requestURL.append(":");
        requestURL.append(request.getServerPort());
    //    requestURL.append("/");
        requestURL.append(((HttpServletRequest) request).getContextPath());
        requestURL.append(UPLOAD);

        return requestURL.toString();
    }

    private static String getHostCTX(HttpServletRequest request) {
        StringBuilder requestURL = new StringBuilder(request.getScheme());
        requestURL.append("://");
        requestURL.append(request.getServerName());
        requestURL.append(":");
        requestURL.append(request.getServerPort());
        requestURL.append("/");
        requestURL.append(((HttpServletRequest) request).getContextPath());
        requestURL.append("/");

        return requestURL.toString();
    }

    public static final String UPLOAD = "/upload";

    public static final String INDEXHTML = "index.html";

    /**
     * Return the filter configuration object for this filter.
     *
     * @return
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
     * Return a String representation of this object.
     */
    @Override
    public String toString() {
        if (filterConfig == null) {
            return ("SmartProxyFilter()");
        }
        StringBuffer sb = new StringBuffer("SmartProxyFilter(");
        sb.append(filterConfig);
        sb.append(")");
        return (sb.toString());
    }

    public void log(String msg) {
        filterConfig.getServletContext().log(msg);
    }

    private void doAfterProcessing(ServletRequest request, ServletResponse response) throws MalformedURLException, IOException {
        log(((HttpServletResponse) response).getHeaderNames().toString());
       /* StringBuilder requestURL = new StringBuilder(request.getScheme());
        requestURL.append("://");
        requestURL.append(request.getServerName());
        requestURL.append(":");
        requestURL.append(request.getServerPort());
    //    requestURL.append("/");
        requestURL.append(((HttpServletRequest) request).getContextPath());
        
        requestURL.append("/rest/profiles/log/");
        
        requestURL.append(((HttpServletRequest)request).getRequestURI().replaceAll("/", "-"));*/
        
        //URL myUrl = new URL(requestURL.toString());
        //myUrl.getContent();
        
    }

    @Override
    public void init(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
        if (filterConfig != null) {
            if (debug) {
                log("NewFilter:Initializing filter");
            }
        }
    }

    @Override
    public void destroy() {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
