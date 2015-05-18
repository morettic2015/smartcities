/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPHTTPClient;

/**
 *
 * @author LuisAugusto
 */
public class FtpUtil {

    private FTPClient ftp;
    private List<String> files;

    public FtpUtil(String proxyUser, String proxyPassword, String proxyHost, int proxyPort) throws IOException, Exception {
        if (proxyHost == null) {
            throw new Exception("NO HOST TO CONNECT");
        }

        this.ftp = new FTPHTTPClient(proxyHost, proxyPort, proxyUser, proxyPassword);
    }

    public void closeConnection() throws IOException {
        this.ftp.disconnect();
    }

    public List<String> listRoot() throws IOException {
        
        files = new ArrayList<>();
        
        for (FTPFile f : ftp.listFiles("/")) {
            files.add(f.getName());
        }
        
        return files;
    }
}
