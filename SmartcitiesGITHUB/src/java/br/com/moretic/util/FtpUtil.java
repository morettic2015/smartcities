/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;

/**
 *
 * @author LuisAugusto
 */
public class FtpUtil {

    private FTPClient ftp;
    private List<String> files;

    public FtpUtil(String proxyUser, String proxyPassword, String proxyHost, int proxyPort) throws IOException, Exception {
        if (proxyHost == null) {
            System.err.append("NO HOST TO CONNECT");
            throw new Exception("NO HOST TO CONNECT");
        }

        ftp = new FTPClient();
        if (proxyPort > 0) {
            ftp.connect(proxyHost, proxyPort);
        } else {
            ftp.connect(proxyHost);
        }

        ftp.login(proxyUser, proxyPassword);
        ftp.enterLocalPassiveMode();
        ftp.setFileType(FTP.BINARY_FILE_TYPE);
    }

    public void closeConnection() throws IOException {
        this.ftp.disconnect();
    }

    public List<String> listRoot() throws IOException {

        files = new ArrayList<String>();

        for (FTPFile f : ftp.listFiles("/")) {
            files.add(f.getName());
            System.out.println(f.getName());
        }

        return files;
    }

    public static void main(String[] args) throws Exception {
        new FtpUtil("connectgeo", "M1y+P5UOxQ9bJ7ko", "connectgeo.com.br", 21).listRoot();
    }
}

