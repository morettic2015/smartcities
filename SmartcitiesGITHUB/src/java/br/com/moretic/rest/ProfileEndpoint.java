package br.com.moretic.rest;

import br.com.moretic.social.twitter.TwiterCallback;
import static br.com.moretic.social.twitter.TwiterCallback.*;
import br.com.moretic.util.MD5Crypt;
import br.com.moretic.util.SmartProxyFilter;
import br.com.moretic.util.ValidatorUtil;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import br.com.moretic.vo.*;
import java.io.IOException;
import java.io.Serializable;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.Query;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;
import org.hibernate.exception.ConstraintViolationException;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 */
@Stateless
@Path("/profiles")
public class ProfileEndpoint {

    /**
     * Token para armazenar o perfil na sessao
     */
    public static final String PROFILE = "SMTR_PROFILE";

    //@Context
    //private HttpServletRequest request;
    //@Context HttpServletRequest req, @Context HttpServletResponse res
    @PersistenceContext(unitName = "smartcitie_db")
    private EntityManager em;
    
    @POST
    @Consumes("application/json")
    public Response create(Profile entity) {
        em.persist(entity);
        return Response.created(UriBuilder.fromResource(ProfileEndpoint.class).path(String.valueOf(entity.getIdprofile())).build()).build();
    }
    
    @DELETE
    @Path("/{id:[0-9][0-9]*}")
    public Response deleteById(@PathParam("id") int id) {
        Profile entity = em.find(Profile.class, id);
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        em.remove(entity);
        return Response.noContent().build();
    }

    /**
     * Create a circle if does not exists then associate the contact to the
     * circle
     *
     * @Moretto
     */
    @GET
    @Path("/addToCircle/{emailContact}/{circleName}")
    @Produces("application/json")
    public Response addToCircle(@PathParam("emailContact") String emailContact, @PathParam("circleName") String circleName, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        String jpaQuery = "SELECT p FROM Profile p where p.email LIKE :pEmail";
        Query q = em.createQuery(jpaQuery);
        q.setParameter("pEmail", "%" + emailContact + "%");
        Profile circleContact = (Profile) q.getSingleResult();
        Profile owner = getProfileSession(req);
        owner = em.find(Profile.class, owner.getIdprofile());
        
        jpaQuery = "SELECT DISTINCT c FROM Circle c where c.circleName LIKE :pCircleName and c.owner = :owner";
        q = em.createQuery(jpaQuery);
        q.setParameter("pCircleName", circleName);
        q.setParameter("owner", owner);
        Circle circleGroup = null;
        
        try {//Recupera o circulo existente e edita
            circleGroup = (Circle) q.getSingleResult();
        } catch (NoResultException e) {//Não encontrado. Primeira try ele cria e depois associa tanto o novo como o antigo.

            //owner = em.find(Profile.class, owner.getIdprofile());
            circleGroup = new Circle();
            circleGroup.setOwner(owner);
            circleGroup.setCircleName(circleName);
            
            em.persist(circleGroup);
        }
        
        circleGroup.getMyMembers().add(circleContact.getIdprofile());
        
        em.merge(circleGroup);

        //RETORNA OS CIRCULOS OS QUAIS O USUARIO ESTÁ ASSOCIADO
        String querySql
                = " SELECT "
                + "    c1.* "
                + " FROM "
                + "    \"public\".circle as c1, "
                + "    \"public\".circle_member as c2 "
                + " WHERE "
                + "    c1.idcircle = c2.circle_member_fk "
                + "    AND c2.circle_member_id_profile = :member "
                + "    AND c1.owner_idprofile = :owner ORDER BY c1.circle_name ASC";
        
        q = em.createNativeQuery(querySql, Circle.class);
        q.setParameter("owner", owner.getIdprofile());
        q.setParameter("member", circleContact.getIdprofile());
        
        List<Circle> cListMember = q.getResultList();
        
        Set<String> lVoCircleTags = new HashSet<String>();
        for (Circle cc : cListMember) {
            lVoCircleTags.add(cc.getCircleName());
        }
        
        return Response.ok(lVoCircleTags).build();
        
    }
    
    public HashSet<String> findMyCircles(int ownerId, EntityManager em1) {
        String querySql
                = " SELECT "
                + "    c1.* "
                + " FROM "
                + "    \"public\".circle as c1 "
                + " WHERE "
                + "   c1.owner_idprofile = :owner ORDER BY c1.circle_name ASC";
        
        Query q;
        q = em1.createNativeQuery(querySql, Circle.class);
        q.setParameter("owner", ownerId);
        List<Circle> cListMember = q.getResultList();
        
        HashSet<String> lVoCircleTags = new HashSet<String>();
        for (Circle cc : cListMember) {
            lVoCircleTags.add(cc.getCircleName());
        }
        
        return lVoCircleTags;
    }
    
    @GET
    @Path("/security/{email}/{fone}/{cel}/{phrase}")
    @Produces("application/json")
    public Response security(@PathParam("email") String email, @PathParam("fone") String fone, @PathParam("cel") String cel, @PathParam("phrase") String phrase, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException {
        
        Profile p = getProfileSession(req);
        TypedQuery<Profile> findPByIdQuery = em
                .createQuery(
                        "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang WHERE p.idprofile = :entityId ORDER BY p.idprofile",
                        Profile.class);
        findPByIdQuery.setParameter("entityId", p.getIdprofile());
        p = findPByIdQuery.getSingleResult();
        
        ArrayList<SecurityInfo> alsi = new ArrayList<SecurityInfo>(p.getSecurityInfo());
        SecurityInfo si = new SecurityInfo();
        if (alsi.size() > 0) {
            si = alsi.get(0);
            si.setEmailRecorey1(email);
            si.setTelefoneRecorey1(fone);
            si.setTelefoneRecorey2(cel);
            si.setSecretWord(phrase);
            si.setProfile(p);
            si.setIdProfile(p.getIdprofile());
            em.merge(si);
        } else {
            //si = new SecurityInfo();
            si.setEmailRecorey1(email);
            si.setTelefoneRecorey1(fone);
            si.setTelefoneRecorey2(cel);
            si.setSecretWord(phrase);
            si.setProfile(p);
            si.setIdProfile(p.getIdprofile());
            em.persist(si);
        }
        //p = null;
        findPByIdQuery = null;
        alsi = null;
        si = null;
        
        logAction("SECURITY INFO UPDATED", req, res);
        
        return findById(p.getIdprofile(),req,res);
    }

    /**
     * http://localhost:8080/smartcities/rest/profile/address/(-27.596618,%20-48.54527010000004)/Rua%20General%20Bitencourt,%20397%20-%20Centro,%20Florian%C3%B3polis%20-%20SC,%2088020-100,%20Brasil/123
     *
     *
     *
     * @param latLon
     * @param addrs
     * @param compl
     * @param req
     * @param res
     * @return
     */
    @GET
    @Path("/address/{latLon}/{addrs}/{compl}")
    @Produces("application/json")
    public Response address(@PathParam("latLon") String latLon, @PathParam("addrs") String addrs, @PathParam("compl") String compl, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException {
        
        Profile p = getProfileSession(req);
        
        Adress adrs = new Adress();
        adrs.setIdProfile(p.getIdprofile());
        adrs.setOtherinfo(compl);
        adrs.setStreet(addrs);
        adrs.setProfile(p);
        
        String[] formatLatLon = latLon.substring(1, latLon.length() - 1).split(",");
        
        adrs.setLat(formatLatLon[0]);
        adrs.setLon(formatLatLon[1]);

        //Remove o endereço anterior e mantem um só
        TypedQuery<Adress> findByIdQuery = em.createQuery("SELECT DISTINCT a FROM Adress a WHERE a.idProfile = :entityId ORDER BY a.idadress", Adress.class);
        findByIdQuery.setParameter("entityId", p.getIdprofile());
        Adress entity;
        try {
            entity = findByIdQuery.getSingleResult();
            em.remove(entity);
        } catch (NoResultException nre) {
            entity = null;
        }
        
        em.persist(adrs);
        
        logAction("ADDRESS UPDATED", req, res);
        return Response.ok(adrs).build();
    }
    
    @GET
    @Path("/authenticate/{email}/{pass}")
    @Produces("application/json")
    public Response authenticate(@PathParam("email") String email, @PathParam("pass") String pass, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, UnknownHostException {
        boolean hasErros = false, hasErrosEmail = false, hasErrosPass = false;
        
        HttpSession session = req.getSession();
        session.setMaxInactiveInterval(1800);//Session de meia hora pro caboclo

        Profile f = new Profile();
        //Calcula MD5 HASH para comparar no server side
        String md5Pass = "OZZY OSBOURNE";
        Profile entity = null;

        //Valida se a senha e branca
        if (pass == null || pass.equals("")) {
            hasErrosPass = true;
        } else {
            md5Pass = MD5Crypt.getHash(pass);
        }
        
        hasErrosEmail = !ValidatorUtil.isEmail(email);
        
        hasErros = hasErrosEmail || hasErrosPass;
        
        if (!hasErros) {
            TypedQuery<Profile> findByIdQuery = em
                    .createQuery(
                            "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang WHERE p.email=:pEmail AND p.password=:pPass", Profile.class);
            
            findByIdQuery.setParameter("pEmail", email);
            findByIdQuery.setParameter("pPass", md5Pass);
            
            try {
                entity = findByIdQuery.getSingleResult();
            } catch (NoResultException nre) {
                entity = new Profile();
            }
            //Pega o ip do cliente
            InetAddress IP = InetAddress.getLocalHost();
            System.out.println("CLIENT IP := " + IP.getHostAddress());
            
            session.setAttribute(PROFILE, entity);
        }
        if (hasErros || entity == null) {
            session.invalidate();//destroy a session do maluco
            return Response.ok(f).build();//retorna vo VAZIO

        }
        logAction("LOGIN", req, res);
        return Response.ok(entity).build();
    }
    
    @GET
    @Produces("application/json")
    @Path("/ctx")
    public Response getUserContext(@Context HttpServletRequest req, @Context HttpServletResponse res) {
        Profile p = getProfileSession(req);
        
        return findById(p.getIdprofile(),req,res);
    }
    
    @GET
    @Path("/contactList/")
    @Produces("application/json")
    public Response findContactList(@Context HttpServletRequest req, @Context HttpServletResponse res) {
        
        Profile p = getProfileSession(req);
        
        p = em.find(Profile.class, p.getIdprofile());

        //Carrega a lista de database
        TypedQuery<ProfileContact> findByProfileContact = em.createQuery("SELECT DISTINCT a FROM ProfileContact a  WHERE a.profileByProfileIdprofile = :entityId ", ProfileContact.class);
        findByProfileContact.setParameter("entityId", p);
        List<ProfileContact> entityDataSources;
        //findByFtpSource.setParameter("entityId", id);
        entityDataSources = findByProfileContact.getResultList();
        //Ordena a lista por email do perfil
        Collections.sort(entityDataSources);
        //Mapa de Strings para o retorno
        List<HashMap<String, String>> lP = new ArrayList<HashMap<String, String>>();
        for (ProfileContact pContact : entityDataSources) {
            
            HashMap<String, String> pcVo = new HashMap<String, String>();
            
            Set<Avatar> lA = pContact.getProfileByProfileIdprofile1().getAvatars();
            
            pcVo.put(TwiterCallback.CODE, pContact.getProfileByProfileIdprofile1().getIdprofile() + "");
            pcVo.put(TwiterCallback.ID, pContact.getProfileByProfileIdprofile1().getEmail());
            pcVo.put(TwiterCallback.NAME, pContact.getProfileByProfileIdprofile1().getNmUser());
            pcVo.put(TwiterCallback.BIO, pContact.getProfileByProfileIdprofile1().getBioText());
            if (lA.size() > 0) {
                pcVo.put(TwiterCallback.AVATAR, lA.iterator().next().getPath());
            } else {
                pcVo.put(TwiterCallback.AVATAR, "x");
            }
            lP.add(pcVo);
        }
        return Response.ok(lP).build();
        
    }
    
    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    public Response findById(@PathParam("id") int id, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        TypedQuery<Profile> findByIdQuery = em
                .createQuery("SELECT DISTINCT p FROM"
                        + " Profile p "
                        + " LEFT JOIN FETCH p.profile "
                        /////////   + " LEFT JOIN FETCH p.myFtps"
                        + " LEFT JOIN FETCH p.shareViews"
                        + " LEFT JOIN FETCH p.profileContactsForProfileIdprofile"
                        + " LEFT JOIN FETCH p.groupHasProfiles"
                        + " LEFT JOIN FETCH p.profiles"
                        + " LEFT JOIN FETCH p.socialNetworks"
                        + " LEFT JOIN FETCH p.avatars"
                        + " LEFT JOIN FETCH p.profileContactsForProfileIdprofile1"
                        + " LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang WHERE p.idprofile = :entityId ORDER BY p.idprofile",
                        Profile.class);
        findByIdQuery.setParameter("entityId", id);
        Profile entity;
        try {
            entity = findByIdQuery.getSingleResult();
            //Carrega os endereços
            TypedQuery<Adress> findByIdProf = em.createQuery("SELECT DISTINCT a FROM Adress a  WHERE a.idProfile = :entityId ORDER BY a.idadress", Adress.class);
            findByIdProf.setParameter("entityId", id);
            List<Adress> entityAddrs;
            entityAddrs = findByIdProf.getResultList();
            entity.getAdresses().addAll(entityAddrs);

            //Carrega os dados de segurança
            TypedQuery<SecurityInfo> findByIdSec = em.createQuery("SELECT DISTINCT a FROM SecurityInfo a  WHERE a.idProfile = :entityId ORDER BY a.emailRecorey1", SecurityInfo.class);
            findByIdSec.setParameter("entityId", id);
            List<SecurityInfo> entitySec;
            entitySec = findByIdSec.getResultList();
            entity.getSecurityInfo().addAll(entitySec);

            //Carrega a lista de logs
            TypedQuery<UserLog> findByIdSecUserLog = em.createQuery("SELECT DISTINCT a FROM UserLog a  WHERE a.idProfile = :entityId ORDER BY a.dTime", UserLog.class);
            findByIdSecUserLog.setParameter("entityId", id);
            List<UserLog> entityUserLog;
            entityUserLog = findByIdSecUserLog.getResultList();
            entity.getlLog().clear();
            entity.getlLog().addAll(entityUserLog);

            //Carrega a lista de avatars
            TypedQuery<Avatar> findByIdAvatar = em.createQuery("SELECT DISTINCT a FROM Avatar a  WHERE a.idProfile = :entityId ORDER BY a.idavatar", Avatar.class);
            findByIdAvatar.setParameter("entityId", id);
            List<Avatar> entitAvatar;
            entitAvatar = findByIdAvatar.getResultList();
            entity.getAvatars().clear();
            entity.getAvatars().addAll(entitAvatar);

            //Carrega a lista de Files
            TypedQuery<FileSource> findByIdSecUserLogFileSource = em.createQuery("SELECT DISTINCT a FROM FileSource a  WHERE a.idProfile = :entityId ORDER BY a.myTp", FileSource.class);
            findByIdSecUserLogFileSource.setParameter("entityId", id);
            List<FileSource> entityUserLogFS;
            entityUserLogFS = findByIdSecUserLogFileSource.getResultList();
            //entity.getlLog().clear();
            entity.getMySources().addAll(entityUserLogFS);

            //Carrega a lista de Files
            TypedQuery<FtpClient> findByFtpSource = em.createQuery("SELECT DISTINCT a FROM FtpClient a  WHERE a.idProfile = :entityId ORDER BY a.host", FtpClient.class);
            findByFtpSource.setParameter("entityId", id);
            List<FtpClient> entityFtps;
            //findByFtpSource.setParameter("entityId", id);
            entityFtps = findByFtpSource.getResultList();
            //entity.getlLog().clear();
            entity.getMyFtps().addAll(entityFtps);

            //Carrega a lista de database
            TypedQuery<DataSource> findByDataSource = em.createQuery("SELECT DISTINCT a FROM DataSource a  WHERE a.idProfile = :entityId ORDER BY a.nmDatasource", DataSource.class);
            findByDataSource.setParameter("entityId", id);
            List<DataSource> entityDataSources;
            //findByFtpSource.setParameter("entityId", id);
            entityDataSources = findByDataSource.getResultList();
            //entity.getlLog().clear();
            entity.getMyDbs().addAll(entityDataSources);
            
            entity.setCirclesOwner(findMyCircles(entity.getIdprofile(), em));
            
            findByIdProf = null;
            findByIdSec = null;
            findByIdSecUserLogFileSource = null;
            findByFtpSource = null;
            findByIdSecUserLog = null;
            findByIdAvatar = null;
            entityUserLogFS = null;
            entitAvatar = null;
            entityUserLog = null;
            entitySec = null;
            entityDataSources = null;
            
        } catch (NoResultException nre) {
            entity = null;
        }
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        req.getSession(true).setAttribute(PROFILE, entity);
        
        return Response.ok(entity).build();
    }
    
    @GET
    @Produces("application/json")
    public List<Profile> listAll(@QueryParam("start") Integer startPosition, @QueryParam("max") Integer maxResult) {
        TypedQuery<Profile> findAllQuery = em
                .createQuery(
                        "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang ORDER BY p.idprofile",
                        Profile.class);
        if (startPosition != null) {
            findAllQuery.setFirstResult(startPosition);
        }
        if (maxResult != null) {
            findAllQuery.setMaxResults(maxResult);
        }
        final List<Profile> results = findAllQuery.getResultList();
        return results;
    }
    
    @PUT
    @Path("/{id:[0-9][0-9]*}")
    @Consumes("application/json")
    public Response update(Profile entity) {
        try {
            entity = em.merge(entity);
        } catch (OptimisticLockException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getEntity()).build();
        }
        
        return Response.noContent().build();
    }
    
    @POST
    @Path("/p1/{name}/{email}/{birthday}/{password}/{bio}/{telephone}/{avatar}/{lang}/{id}/{identity}")
    @Produces("application/json")
    public Response p1(@PathParam("name") String name,
            @PathParam("email") String email,
            @PathParam("birthday") String birthday,
            @PathParam("password") String password,
            @PathParam("bio") String bio,
            @PathParam("telephone") String telephone,
            @PathParam("avatar") String avatar,
            @PathParam("lang") String lang,
            @PathParam("id") Integer id,
            @PathParam("identity") String identity) throws NoSuchAlgorithmException, UnknownHostException {
        
        Profile user;
        //Novo usuario id = -1

        if (id == -1) {
            user = new Profile();
        } else {
            user = em.find(Profile.class, id);
        }
        
        try {
            user.setBio(bio.getBytes());
            user.setEmail(email);
            user.setIdprofile(id);
            user.setOnline(true);
            user.setNascimento(new Date()); //pegar a data e transformar mm/dd/yyyy
            user.setCpfCnpj(identity);
            
            em.merge(user);
            
            Avatar a1 = new Avatar();
            
            a1.setPath(avatar);
            a1.setProfile(user);
            
            em.persist(a1);
        } catch (Exception e) {
            
        } finally {
            
        }
        
        return Response.ok(user).build();
    }

    /**
     * @TODO Implementar validação de um email de contato no paypal.....
     * @return Response json profile
     */
    @GET
    @Path("/paypal/{email}/{id}")
    @Produces("application/json")
    public Response paypal(@PathParam("email") String email, @PathParam("id") String id,@Context HttpServletRequest req, @Context HttpServletResponse res) {
        
        Profile p = em.find(Profile.class, new Integer(id));
        
        p.setPaypal(email);
        
        em.merge(p);
        
        return findById(p.getIdprofile(),req,res);
        
    }
    
    @GET
    @Path("/google/{email}/{pname}/{avatar}")
    public void google(@PathParam("email") String email, @PathParam("pname") String pname, @PathParam("avatar") String avatar, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, IOException {
        
        TypedQuery<Profile> findByIdQuery = em.createQuery("SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.avatars  WHERE p.email = :entityId ORDER BY p.idprofile", Profile.class);
        findByIdQuery.setParameter("entityId", email);
        
        Profile entity = null;
        try {
            //Ja existe recupera e fechou
            entity = findByIdQuery.getSingleResult();
            req.getSession(true).setAttribute(ProfileEndpoint.PROFILE, entity);
            
            ((HttpServletResponse) res).sendRedirect(SMARTCITIESMAINHTML);
        } catch (NoResultException nre) {//Não existe portanto cria o emo flamenguista
            facebook(email, pname, null, req, res);
        }
        
    }
    
    @GET
    @Path("/facebook/{email}/{pname}/{avatar}")
    public void facebook(@PathParam("email") String email, @PathParam("pname") String pname, @PathParam("avatar") String avatar, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, IOException {
        HttpSession session = req.getSession();
        logAction("SOCIAL NETWORK LOGIN", req, res);
        
        String jpaQueryEmail = "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.avatars  WHERE p.email LIKE :account";
        Query q1 = em.createQuery(jpaQueryEmail);
        q1.setParameter(TwiterCallback.ACCOUNT, "%" + email + "%");
        Profile p;
        try {//Verifica se esse filho de uma egua existe.

            if (session.getAttribute(PROFILE) != null) {
                res.sendRedirect(SMARTCITIESMAINHTML);
            }
            p = (Profile) q1.getSingleResult();
        } catch (Exception nre) {
            //String password = UUID.randomUUID().toString().substring(0, 8);
            p = new Profile();
            p.setEmail(email);
            p.setNmUser(pname);
            p.setPassword(MD5Crypt.getHash(email));
            
            em.persist(p);
        }
        if (avatar != null) {
            Avatar a = new Avatar();
            a.setIdProfile(p.getIdprofile());
            a.setPath(avatar.replaceAll("ø", "/"));
            a.setProfile(p);

            //Salva o avatar
            em.persist(a);
            
            p.getAvatars().add(a);
            em.merge(p);
        }
        
        session.setAttribute(PROFILE, p);

        //Has a follower list to associate with
        if (req.getSession(true).getAttribute(FOLLOWERS) != null) {
            JSONArray followersList = (JSONArray) req.getSession(true).getAttribute(FOLLOWERS);
            FOLLOWER_LOOP:
            for (int i = 0; i < followersList.length(); i++) {
                
                JSONObject follower = followersList.getJSONObject(i);
                
                Profile p1 = new Profile();
                
                String emailPk = follower.getJSONArray(ID).getString(0);
                
                q1 = em.createQuery(jpaQueryEmail);
                q1.setParameter(TwiterCallback.ACCOUNT, "%" + emailPk + "%");
                
                List<Profile> fl = q1.getResultList();

                //Ja existe o resultado....
                if (fl.size() > 0) {
                    
                    p1 = fl.get(0);
                    
                } else {//Cria o perfil de um novo usuario.....

                    p1.setEmail(follower.getJSONArray(ID).getString(0));
                    p1.setNmUser(follower.getJSONArray(NAME).getString(0));
                    p1.setBio(follower.getJSONArray(BIO).getString(0).getBytes());
                    p1.setPassword(MD5Crypt.getHash(follower.getJSONArray(ID).getString(0)));
                    em.persist(p1);
                    
                    Avatar a1 = new Avatar();
                    a1.setIdProfile(p1.getIdprofile());
                    a1.setPath(follower.getJSONArray(AVATAR).getString(0).replaceAll("ø", "/"));
                    a1.setProfile(p1);
                    
                    em.persist(a1);
                    
                    p1.getAvatars().add(a1);
                    em.merge(p1);
                }
                
                ProfileContactId pcId = new ProfileContactId(p.getIdprofile(), p1.getIdprofile());
                 
                Query q = em.createQuery("SELECT pc FROM ProfileContact pc WHERE pc.id = :paramid");
                q.setParameter("paramid", pcId);
                
                List<ProfileContact> pcList = q.getResultList();
                if(pcList.size()>0)
                    continue FOLLOWER_LOOP;
                
                ProfileContact pContact = new ProfileContact(pcId, p, p1);
                pContact.setEnabled(Boolean.TRUE);
                
                em.persist(pContact);
                
                logAction(p1.getIdprofile(), em, "SOCIAL NETWORK / contact " + p.getEmail(), req);
                logAction("SOCIAL NETWORK / contact " + p1.getEmail(), req, res);
                
            }
            
        }
        
        res.sendRedirect(SMARTCITIESMAINHTML);
        
    }
    
    @GET
    @Path("/logout")
    public void logoff(@Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, IOException {
        logAction("LOG OFF", req, res);
        HttpSession session = req.getSession();
        session.invalidate();
        
        res.sendRedirect(TwiterCallback.SMARTCITIESINDEXHTML);
        
    }
    
    public static final String SMARTCITIESMAINHTML = TwiterCallback.SMARTCITIESMAINHTML;

    /**
     *
     * @param req
     * @return
     */
    public static Profile getProfileSession(HttpServletRequest req) {
        HttpSession session = req.getSession();
        Profile p = (Profile) session.getAttribute(ProfileEndpoint.PROFILE);
        
        return ((p == null) ? new Profile() : p);
    }
    
    public static void addSessionObject(HttpServletRequest req, String token, Object o) {
        HttpSession session = req.getSession();
        session.setAttribute(token, o);
    }
    
    public static <T extends Object> T getSessionObject(HttpServletRequest req, Class<T> type, String token) {
        HttpSession session = req.getSession();
        Object o = session.getAttribute(token);
        
        return type.cast(o);
    }

    /**
     * <T> void checkedWork(final Class<T> type, final Object object) {
     * work(type, type.cast(object)); }
     *
     */
    /**
     *
     *
     * http://localhost:8080/smartcities/rest/profiles/bio/Lam/malacma@gmail.com/10-06-2015/028.903.629-14/SENHAasdasd/ENgenheiro%20de%20software%20/a/a
     * http://localhost:8080/smartcities/rest/profiles/bio/Lamm/malacma@twitter.com/10-06-2015/028.903.629.14/SENHA/Engenheiro%20de%20Software/(48)9600-49294/PT-BR/Engenheiro
     * Update user profile
     */
    @GET
    @Produces("application/json")
    @Path("/bio/{pname}/{email}/{birth}/{cpfCnpj}/{passwd}/{fone}/{lang}/{bio}/{avatar}")
    public Response updateProfile(@PathParam("cpfCnpj") String cpfCnpj,
            @PathParam("passwd") String passwd,
            @PathParam("email") String email,
            @PathParam("pname") String pname,
            @PathParam("birth") String birth,
            @PathParam("fone") String fone,
            @PathParam("lang") String lang,
            @PathParam("bio") String bio,
            @PathParam("avatar") String avatar,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) throws ParseException, NoSuchAlgorithmException {
        
        Profile f = getProfileSession(req);
        
        TypedQuery<Profile> findPByIdQuery = em
                .createQuery(
                        "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang WHERE p.idprofile = :entityId ORDER BY p.idprofile",
                        Profile.class);
        findPByIdQuery.setParameter("entityId", f.getIdprofile());
        f = findPByIdQuery.getSingleResult();
        
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        
        f.setCpfCnpj(cpfCnpj);
        f.setBio(bio.getBytes());
        f.setEmail(email);
        f.setNmUser(pname);
        f.setTelefone(fone);
        f.setNascimento(sdf.parse(birth));

        //Atualiza o password apenas se for diferente do hash atual
        if (!passwd.equals(f.getPassword())) {
            f.setPassword(MD5Crypt.getHash(passwd));
            logAction("PASSWORD UPDATED (" + passwd + ")", req, res);
        }
        /*  TypedQuery<Adress> findByIdProf = em.createQuery("SELECT DISTINCT a FROM Adress a  WHERE a.idProfile = :entityId ORDER BY a.idadress", Adress.class);
         findByIdProf.setParameter("entityId", f.getIdprofile());
         List<Adress> entityAddrs;
         entityAddrs = findByIdProf.getResultList();*/

        //Adiciona todos
        //  f.getAdresses().addAll(entityAddrs);
        TypedQuery<Lang> findByIdQuery = em.createQuery("SELECT DISTINCT a FROM Lang a WHERE a.token = :entityId ORDER BY a.token", Lang.class);
        findByIdQuery.setParameter("entityId", lang);
        Lang entity;
        try {
            entity = findByIdQuery.getSingleResult();
            
        } catch (NoResultException nre) {
            entity = new Lang();
            entity.setLang(lang);
            entity.setToken(lang);
            em.persist(entity);
        }
        
        ArrayList<ProfileLang> apl = new ArrayList<ProfileLang>(f.getProfileLang());
        
        boolean achou = false;
        for (ProfileLang pl : apl) {
            if (pl.getLang().getToken().equals(lang)) {
                achou = true;
                continue;
            }
            pl.setIsMainLanguage(false);
            em.merge(pl);
        }
        if (!achou) {
            
            ProfileLang pl = new ProfileLang();
            pl.setIsMainLanguage(true);
            pl.setIdProfile(f.getIdprofile());
            pl.setIdLang(entity.getIdLang());
            pl.setLang(entity);
            pl.setProfile(f);
            
            em.persist(pl);
            
            f.getProfileLang().add(pl);
            pl = null;
            logAction("UPDATE PROFILE LANGUAGE (" + entity.getLang() + ")", req, res);
            
        }
        
        if (!avatar.endsWith("blank")) {
            avatar = SmartProxyFilter.getContextUri() + "/" + avatar;
            
            Avatar a1 = new Avatar();
            a1.setPath(avatar);
            a1.setProfile(f);
            a1.setIdProfile(f.getIdprofile());
            
            ArrayList<Avatar> lAvatars = new ArrayList<Avatar>(f.getAvatars());
            
            for (Avatar a : lAvatars) {
                em.remove(a);//Remove todos apenas um avatar para cada usuario
            }
            
            em.persist(a1);
            logAction("UPDATE AVATAR (" + avatar + ")", req, res);
        }

        //Salva o vinculo do perfil com a linguagem
        //Limpa a lista depois grava
        //Atualiza o usuario
        em.merge(f);

        //f= null;
        apl.clear();
        apl = null;
        entity = null;
        //entityAddrs.clear();
        // entityAddrs = null;
        findByIdQuery = null;
        // findByIdProf = null;
        findPByIdQuery = null;
        sdf = null;
        
        logAction("UPDATE PROFILE", req, res);
        
        return findById(f.getIdprofile(),req,res);
        
    }
    
    @GET
    public void logAction(int id, EntityManager em1, String action, HttpServletRequest req) {
        
        try {
            Profile p = em1.find(Profile.class, id);
            
            p = em1.find(Profile.class, p.getIdprofile());
            
            if (p == null) {
                return;
            }
            
            UserLog log = new UserLog();
            log.setAction(action);
            log.setProfile(p);
            log.setIdProfile(p.getIdprofile());
            log.setIpAddrs(req.getRemoteAddr());
            
            em1.persist(log);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @GET
    public void logAction(@PathParam("action") String action,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res, EntityManager em1) {
        
        try {
            Profile p = getProfileSession(req);
            
            p = em1.find(Profile.class, p.getIdprofile());
            
            if (p == null) {
                return;
            }
            
            UserLog log = new UserLog();
            log.setAction(action);
            log.setProfile(p);
            log.setIdProfile(p.getIdprofile());
            log.setIpAddrs(req.getRemoteAddr());
            
            em1.persist(log);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @GET
    @Path("/log/{action}/")
    public void logAction(@PathParam("action") String action,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) {
        
        logAction(action, req, res, em);
    }
    
}
