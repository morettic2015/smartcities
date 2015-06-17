/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import java.io.*;
import java.util.*;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.JSONObject;

/**
 *
 * @author LuisAugusto
 */
@WebServlet(name = "UploadProxy", urlPatterns = {"/rest/importer/upload"})
public class UploadProxy extends HttpServlet {

    private boolean isMultipart;
    //private String filePath;
    private int maxFileSize = 500 * 1024 * 1024;
    private int maxMemSize = 4 * 1024;
    private File file;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    public void processRequest(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, java.io.IOException {
        // Check that we have a file upload request
        isMultipart = ServletFileUpload.isMultipartContent(request);
        //Set content type to JSON
        response.setContentType("application/json");

        java.io.PrintWriter out = response.getWriter();
        if (!isMultipart) {
            return;
        }
        DiskFileItemFactory factory = new DiskFileItemFactory();
        // maximum size that will be stored in memory
        factory.setSizeThreshold(maxMemSize);
        // Location to save data that is larger than maxMemSize.
        factory.setRepository(new File(SmartProxyFilter.getContextPath()));
        // Create a new file upload handler
        ServletFileUpload upload = new ServletFileUpload(factory);
        // maximum file size to be uploaded.
        upload.setSizeMax(maxFileSize);

        try {
            // Parse the request to get file items.
            List fileItems = upload.parseRequest(request);
            // Process the uploaded file items
            Iterator i = fileItems.iterator();
            //JSON
            JSONObject js = new JSONObject();
            //List files
            if (i.hasNext()) {
                FileItem fi = (FileItem) i.next();
                if (!fi.isFormField()) {
                    // Get the uploaded file parameters
                    //String fieldName = fi.getFieldName();
                    String fileName = fi.getName();
                    String contentType = fi.getContentType();
                    //boolean isInMemory = fi.isInMemory();
                    long sizeInBytes = fi.getSize();
                    // Write the file

                    String fPath = SmartProxyFilter.getContextPath() + File.separator + fileName;

                    file = new File(fPath);
                    fi.write(file);

                    js.put(NAME, fileName);
                    js.put(FULL_PATH, fPath);
                    js.put(BYTES, sizeInBytes);
                    js.put(CONTENT_TYPE, contentType);
                    js.put(MY_URL, SmartProxyFilter.getContextUri()+"/"+fileName);

                    out.println(js.toString());
                }
            }
        } catch (Exception ex) {
            System.out.println(ex);
        }
    }
    public static final String MY_URL = "myUrl";
    public static final String CONTENT_TYPE = "contentType";
    public static final String BYTES = "bytes";
    public static final String FULL_PATH = "fullPath";
    public static final String NAME = "name";

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
