/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.moretic.social.outlook;

import br.com.moretic.rest.ProfileEndpoint;
import br.com.moretic.social.facebook.FacebookProxyFilter;
import br.com.moretic.social.facebook.FacebookUtil;
import static br.com.moretic.social.twitter.TwiterCallback.*;
import br.com.moretic.util.SmartProxyFilter;
import static br.com.moretic.util.SmartProxyFilter.UPLOAD;
import br.com.moretic.vo.Profile;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLEncoder;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.persistence.TypedQuery;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * /rest/profile/hotmail * @author LuisAugusto
 */
@WebServlet(name = "WindowsLiveLogin", urlPatterns = {"/rest/live/login"})
public class WindowsLiveLogin extends HttpServlet {

    @PersistenceContext(unitName = "smartcitie_db", type = PersistenceContextType.TRANSACTION)
    private EntityManager em;

    private static final String FRIENDS = "https://apis.live.net/v5.0/me/contacts?access_token=";
    private static final String LOGIN_URL = "https://apis.live.net/v5.0/me?access_token=";
    private static final String REDIRECT_URL = "http://localhost:8080/smartcities/rest/live/callback";
    private String GET_TOKEN = "https://login.live.com/oauth20_authorize.srf?client_id=000000004C17D3C1&scope=wl.signin,wl.basic,wl.emails,wl.contacts_emails&response_type=token&redirect_uri=http://localhost:8080/smartcities/rest/live/callback" + REDIRECT_URL;
    private static final String AVATAR_URL = "https://apis.live.net/v5.0/me/picture?access_token=";

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     * http://localhost:8080/smartcities/rest/profile/hotmail#access_token=EwCIAq1DBAAUGCCXc8wU/zFu9QnLdZXy%2bYnElFkAARzRjkPU/lAhBg8bbRzEyBqJQkuev2QaFFY2PKbhVtXKEWP6gmy69lN4yUWodNz80Xq8io%2bepg%2bNHkud6EiVad3Q0LNkPl3w85cBzOdT7H5RHBJerr11ajHbdDOQFu/bWtFhSEKwi59lxsPm9wHeMzLHVzN7GO%2bORwk7HuoLj2wjlJuY10mQa6%2bmZVhklxtqw1a6HPgLTOWkrme9PVSJUoWjST%2bXLclhpu0xh5FAIu8r/wAQaznY1e4DcKy1TpmT4kpa1OJuS1dZnbhL97fSVjOJHL%2byfanfJ4/oz0n%2bsA/jITMJmvGEtYHMcGjcsKacu27xoJDnE4IgJdzyRVeZZUsDZgAACJDzIJ0k9ET5WAHVjY7ewWmcqSCZ2GdqSuMhqWio%2bX3hwwEIJoL98uZXzVpfxjBgmRuXUJ4VBbY%2bbfJkMaMJv1G45UOLf0mgmM0iSR0U%2bfUOlWagesp4qvnq/1BGCtCqBCGle8pVotEagSH6SjxoUckgSgphrTXIpWHlQsvlxVfjik7KLLIgPIn7IV8jsXyToGQTC2zLTf75EFpP4RaR1HsfWIZQAVLun0D8FaMNIbnEyYln1HwvqQ2tDIkLvrpy5Hx5ROs%2b7r0QJZfFwZpK%2bBiBuqlp3C7NZMiDFrhHB27twDoQmnqqUYWL90yQc2Rit7lvKw1xlhoczyjlD9aM2N0owr/BD1gj4f4Z6BfKgshIRcAM%2bP87ZGkoSIyL0iPZbQHKpuU96HPtzJembQGdV8MLEgYUfaO0X8e7BfgQyk/uq5pNdcw8wOU/tsgEkn/N0Wjit/gjbjf0/0PnKADVbv5Z1mcB&token_type=bearer&expires_in=3600&scope=wl.signin%20wl.basic%20wl.emails%20wl.contacts_emails&state=redirect_type%3dauth%26display%3dpage%26request_ts%3d1453874440349%26response_method%3durl%26secure_cookie%3dfalse&user_id=081bb7f342a43f8658b5f306deb80bbc
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
            String token = request.getParameter("token");
            String url = LOGIN_URL + token;
            String profile = FacebookUtil.readURL(new URL(url));
            JSONObject jsProfileHotmail = new JSONObject(profile);
            JSONObject emails = jsProfileHotmail.getJSONObject(EMAILS);
            String avatarUrl = null;
            String jpaQueryEmail = "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.avatars  WHERE p.email = :acc OR p.email = :pref OR p.email = :pers OR p.email = :buss";

            String pref, buss, acc, pers;

            acc = emails.getString(ACCOUNT);
            pref = (emails.get(PREFERRED) != null) ? emails.get(PREFERRED).toString() : acc;
            buss = (emails.get(BUSINESS) != null) ? emails.get(BUSINESS).toString() : acc;
            pers = (emails.get(PERSONAL) != null) ? emails.get(PERSONAL).toString() : acc;

            TypedQuery<Profile> findByIdQuery = em.createQuery(jpaQueryEmail, Profile.class);
            findByIdQuery.setParameter("acc", acc);
            findByIdQuery.setParameter("pref", pref);
            findByIdQuery.setParameter("pers", pers);
            findByIdQuery.setParameter("buss", buss);

            Profile entity = null;
            try {
                //Ja existe recupera e fechou
                entity = findByIdQuery.getSingleResult();
                request.getSession(true).setAttribute(ProfileEndpoint.PROFILE, entity);

                ((HttpServletResponse) response).sendRedirect(SMARTCITIESMAINHTML);
            } catch (NoResultException nre) {
                try {
                    //Copia o avatar no primeiro login no sistema
                    String mUrl = "https://apis.live.net/v5.0/" + jsProfileHotmail.getString("id") + "/picture?";
                    avatarUrl = copyImageFromUrl(new URL(mUrl), jsProfileHotmail.getString("id"), request, this);

                    //MOnta os contatos do hotmail
                    mUrl = FRIENDS + token;
                    String strFrd = FacebookUtil.readURL(new URL(mUrl));
                    JSONArray ja = makeContactList(strFrd,request,this);

                    request.getSession(true).setAttribute(FOLLOWERS, ja);

                    //Monta a url para salvar o progile
                    //Se o email preferido for diferente de null e diferente do email da conta registra como o preferido
                    acc = acc.equalsIgnoreCase(pref) ? acc : pref;

                    String saveProfile = FacebookProxyFilter.FACEBOOKREST + "/" + acc + "/" + jsProfileHotmail.getString(NAME) + "/" + URLEncoder.encode(avatarUrl.replaceAll("/", "ø"), "UTF-8");
                    ((HttpServletResponse) response).sendRedirect(saveProfile);

                } catch (Exception ex1) {

                    Logger.getLogger(FacebookProxyFilter.class.getName()).log(Level.SEVERE, null, ex1);

                    ((HttpServletResponse) response).sendRedirect(SMARTCITIESINDEXHTML);
                    // em.getTransaction().rollback();
                }

            }
            // out.print(friends);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    private String copyImageFromUrl(URL avatarLocation, String id, HttpServletRequest req, HttpServlet s) throws IOException {
        InputStream in = new BufferedInputStream(avatarLocation.openStream());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[1024];
        int n = 0;
        while (-1 != (n = in.read(buf))) {
            out.write(buf, 0, n);
        }
        out.close();
        in.close();
        byte[] response1 = out.toByteArray();
        ServletContext servletContext = s.getServletContext();

        //Path to sys upload
        String fosContextPath = servletContext.getRealPath(UPLOAD);
        String fileName = id + ".png";
        String fosPath = fosContextPath + File.separator + fileName;

        FileOutputStream fos = new FileOutputStream(fosPath);
        fos.write(response1);
        fos.close();

        return SmartProxyFilter.getHostInfo(req) + "/" + fileName;
    }



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

    /**
     *
     * id: "contact.176d4d00000000000000000000000000", first_name: "Luisa",
     * last_name: "Moretto", name: "Luisa Moretto", is_friend: false,
     * is_favorite: false, user_id: null, email_hashes: [ ], updated_time:
     * "2015-10-23T23:26:16+0000", emails: { preferred: null, account: null,
     * personal: null, business: null, other: null }
     *
     */
    private JSONArray makeContactList(String strFrd, HttpServletRequest request, HttpServlet servlet) {
        JSONObject jsFrd = new JSONObject(strFrd);
        JSONArray ja = jsFrd.getJSONArray("data");
        JSONArray ret = new JSONArray();
        for (int i = 0; i < ja.length(); i++) {
            String mAVatar = "NONOO", mainEmail = null;
            JSONObject follower = ja.getJSONObject(i);
            JSONObject jsFollower = new JSONObject();

            //Não tem email nao será importado!!!!!!!!!!!!!!!!!!!
            if (follower.getJSONObject(EMAILS).get(ACCOUNT).equals(null)) {
                continue;
            }

            if (!follower.get(USER_ID).equals(null)) {
                mAVatar = "https://apis.live.net/v5.0/" + follower.getString(USER_ID) + "/picture?";
            }else{
                continue;//Nao tem como recuperar a foto entao fodase otario!
            }
            mainEmail = (!follower.getJSONObject(EMAILS).get(PREFERRED).equals(null)) ? follower.getJSONObject(EMAILS).getString(PREFERRED) : follower.getJSONObject(EMAILS).getString(ACCOUNT);

            /*
                @FAKE BIO
            */
            StringBuilder sb = new StringBuilder();
            sb.append("WINDOWS LIVE CONTACT");
            sb.append("\n");
            sb.append(follower.getJSONObject(EMAILS).get(ACCOUNT).toString());
            sb.append(",");
            sb.append(follower.getJSONObject(EMAILS).get(PREFERRED).toString());
            sb.append("\n");
            sb.append("user_id:");
            sb.append(follower.getString(USER_ID));
            sb.append("\n");
            sb.append("updated_time:");
            sb.append(follower.getString(UPDATED_TIME));
            
            jsFollower.append(ID, mainEmail);
            jsFollower.append(AVATAR, mAVatar);
            jsFollower.append(NAME, follower.getString(NAME));
            jsFollower.append(BIO, sb.toString());
            ret.put(jsFollower);
        }

        return ret;
    }


}
