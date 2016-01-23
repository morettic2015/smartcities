/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.util;


import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;




import static java.lang.System.*;
import websphinx.Crawler;
import websphinx.Page;

public abstract class AgentCrawler extends Crawler {

//    private static SyndFeed sf;
    private static Pattern p1 = Pattern.compile("rss", Pattern.CASE_INSENSITIVE);
    private static Pattern p2 = Pattern.compile("xml", Pattern.CASE_INSENSITIVE);
    private static Pattern p3 = Pattern.compile(".+@.+\\.[a-z]+", Pattern.CASE_INSENSITIVE);
    public static Integer cont = new Integer(0);

    AgentCrawler() {
        super();  // Do what the parent  crawler would do
    }

    // What to do when we visit the page
    @Override
    public void visit(Page page) {
        //System.out.println("Visiting: " + page.getTitle());

        String content = page.getContent();

        // pesquisa ocorrências de RSS
        Matcher m1 = p1.matcher(content);
        Matcher m2 = p2.matcher(content);
        if (m1.find() || m2.find()) {

            try {
                //tenta criar um feed para ver se a notícia é válida
             //   sf = FeedFactory.getInstance(page.getURL().toString());

                //Grava o feed
                //FeedFacade.persistFeedUrl(page.getURL().toString(), sf.getTitle(), sf);

              //  sf = null;
                cont++;
                out.println("------------");
                out.println("FEED TOTAL" + cont);
                out.println("URL:" + page.getURL().toString());
                out.println("DEPTH:" + page.getDepth());
                //out.println("DEPTH:" + page.getWords());
                out.println("------------");
            } catch (Exception ex) {
                //System.out.println("Page does not represent a valid RSS FEED.\nThe following error occured:\n"+ex.toString());
            } finally {
                m1 = null;
                m2 = null;
                content = null;
                //page.getOrigin().setPage(null);
                page.discardContent();
                page = null;
               // sf = null;
                System.gc();
                // Since we don't need to retain the pages
                // This code helps with memory management
            }
        }
        ////////////////////////////////////
       /* Scanner sc = new Scanner(content);
        String token = null;
        try {
            while(sc.hasNext()) {
                token = sc.findInLine(p3);
                if (token != null) {
                    Spam sp = new Spam();
                    token = sc.next();
                    sp.setEmail(token);
                    FeedFacade.persistSpam(sp);
                    out.println("------------");
                    out.println("EMAIL" + token);
                    out.println("------------");
                }
            } 
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            page.getOrigin().setPage(null);
            page.discardContent();
            page = null;
            token = null;
            sc = null;
        }
    */
    }
}