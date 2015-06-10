package br.com.moretic.rest;

import br.com.moretic.util.MD5Crypt;
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
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Set;
import java.util.UUID;
import javax.servlet.http.*;
import javax.ws.rs.core.Context;

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
        return Response.ok(entity).build();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces("application/json")
    public Response findById(@PathParam("id") int id) {
        TypedQuery<Profile> findByIdQuery = em
                .createQuery(
                        "SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.profile LEFT JOIN FETCH p.shareViews LEFT JOIN FETCH p.profileContactsForProfileIdprofile LEFT JOIN FETCH p.groupHasProfiles LEFT JOIN FETCH p.profiles LEFT JOIN FETCH p.socialNetworks LEFT JOIN FETCH p.avatars LEFT JOIN FETCH p.profileContactsForProfileIdprofile1 LEFT JOIN FETCH p.shareViewWiths LEFT JOIN FETCH p.adresses LEFT JOIN FETCH p.securityInfo LEFT JOIN FETCH p.profileLang WHERE p.idprofile = :entityId ORDER BY p.idprofile",
                        Profile.class);
        findByIdQuery.setParameter("entityId", id);
        Profile entity;
        try {
            entity = findByIdQuery.getSingleResult();

            TypedQuery<Adress> findByIdProf = em.createQuery("SELECT DISTINCT a FROM Adress a  WHERE a.idProfile = :entityId ORDER BY a.idadress", Adress.class);
            
            findByIdQuery.setParameter("entityId", id);
            
            List<Adress> entityAddrs;
            
            findByIdProf.setParameter("entityId", id);
            entityAddrs = findByIdProf.getResultList();
           
            entity.getAdresses().addAll(entityAddrs);
            
        } catch (NoResultException nre) {
            entity = null;
        }
        if (entity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
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

    @GET
    @Path("/facebook/{email}/{pname}/{avatar}")
    public void facebook(@PathParam("email") String email, @PathParam("pname") String pname, @PathParam("avatar") String avatar, @Context HttpServletRequest req, @Context HttpServletResponse res) throws NoSuchAlgorithmException, IOException {

        //String password = UUID.randomUUID().toString().substring(0, 8);
        Profile p = new Profile();
        p.setEmail(email);
        p.setNmUser(pname);
        p.setPassword(MD5Crypt.getHash(email));

        em.persist(p);

        Avatar a = new Avatar();
        a.setIdProfile(p.getIdprofile());
        a.setPath(avatar.replaceAll("ø", "/"));
        a.setProfile(p);

        //Salva o avatar
        em.persist(a);

        p.getAvatars().add(a);
        HttpSession session = req.getSession();
        session.setAttribute(PROFILE, p);

        res.sendRedirect(SMARTCITIESMAINHTML);

    }
    public static final String SMARTCITIESMAINHTML = "/smartcities/main.html";

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

}
