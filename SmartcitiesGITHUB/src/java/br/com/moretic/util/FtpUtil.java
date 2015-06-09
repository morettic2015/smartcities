/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;

import br.com.moretic.vo.FileType;
import br.com.moretic.vo.FtpClient;
import br.com.moretic.vo.FtpVO;
import br.com.moretic.vo.Profile;
import java.io.FileOutputStream;
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
    private String pProxy,pUser,pPass,pHost;
    private int port;
            

    public FtpUtil(String proxyUser, String proxyPassword, String proxyHost, int proxyPort) throws IOException, Exception {
      
        this.pHost = proxyHost;
        this.pPass = proxyPassword;
        this.port = proxyPort;
        this.pUser = proxyUser;
        
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

    public FtpClient getVo(Profile p){
        return new FtpClient(pUser,pPass,pHost,port,p);
    }
    
    public void closeConnection() throws IOException {
        this.ftp.disconnect();
    }

    /* public List<String> listRoot() throws IOException {

     files = new ArrayList<String>();

     for (FTPFile f : ftp.listFiles("/")) {
     files.add(f.getName());
     f.getType();
     System.out.println(f.getName());
     }

     return files;
     }*/
    /**
     * Le diretorios e subdiretorios atraves de recursividade
     */
    public FtpVO readDir(String dir) throws IOException {

        FtpVO ftpVo = new FtpVO(dir);

        for (FTPFile f : ftp.listFiles(dir)) {

            if (f.isDirectory()) {
                // ftpVo.setType(FileType.DIR);
                ftpVo.addFile(readDir(f.getName()));
                ftpVo.setSize(f.getSize());
                // ftpVo.setFullPath(dir+"/"+f.);
            } else {
                FtpVO mvo = new FtpVO(f.getName());
                mvo.setType(FileType.FILE);
                ftpVo.addFile(mvo);
            }
            System.out.println(f.getName());
        }

        return ftpVo;
    }

    public boolean copyFile(String remote, String local, String search) throws IOException {

        for (FTPFile f : ftp.listFiles(remote)) {

            if (f.getName().equalsIgnoreCase(search)) {
                
                FileOutputStream fos = new FileOutputStream(local+"/"+f.getName());
                this.ftp.retrieveFile(f.getName(), fos);

                return true;
            } else if (f.isDirectory()) {

                copyFile(f.getName(), local, search);

                // ftpVo.setFullPath(dir+"/"+f.);
            }

        }

        return false;
    }

}
