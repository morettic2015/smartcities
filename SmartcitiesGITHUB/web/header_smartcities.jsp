
<%@page import="java.net.URL"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="br.com.moretic.rest.ProfileEndpoint"%>
<%@page import="br.com.moretic.vo.Profile"%>

<div style="padding-left: 10px; height: 67px;" class="fundo-laranja">
    <img src="images/Logo-Smartcities-Branco.png"></img>

    <div style="position:relative;top:20px;right:20px;float:right">

        <div style="float: right;margin-left:20px;">
            <input type="image" id="btAjudaHeader" src="./images/icons/Ajuda/branco/48X48.png" style="width: 35px; height: 35px; float: right;"></img>
        </div>

        <div style="float: right;margin-left:20px;">
            <input type="image" id="btConfigHeader" src="./images/icons/Config/Branco/48X48.png" style="width: 35px; height: 35px; float: right;"></img>
        </div>
        <%
            /**
             *
             * @ Recupera o perfil da session.
             * 
             * 
             * PORRA DE UM REDIRECT POR QUE O FACEBOOK E GAY DEMAIS!!!!!!!!!
             *
             */

            Profile p = (Profile) session.getAttribute(ProfileEndpoint.PROFILE);
            int id = p.getIdprofile();
            String avatarUrl = "./images/icons/Perfil/48X48.png";
            if (p.getAvatars().size() > 0) {
                avatarUrl = p.getAvatars().iterator().next().getPath();
                
                HttpURLConnection con = (HttpURLConnection) (new URL(avatarUrl).openConnection());
                con.setInstanceFollowRedirects(false);
                con.connect();
                int responseCode = con.getResponseCode();
                System.out.println(responseCode);
                String location = con.getHeaderField("Location");
                System.out.println(location);
                //SE NAO TIVER LOCATION NAO E A VIADAGEM DO FACEBOOK!!!
                avatarUrl = (location==null)?avatarUrl:location;
                
            }


        %>
        <script>
            var pProfile = {id:<% out.print(id);%>};
        </script>
        <div style="float: right;margin-left:4px;">
            <span class="usuario-cabecalho" id="headerNomeUsuario"><% out.print(p.getNmUser()); %></span>
            <br>
            <span class="usuario-cabecalho"><% out.print(p.getEmail());%></span>
            </br>
        </div>

        <div style="float: right;">
            <input type="image" id="btProfileHeader"  src="<% out.print(avatarUrl);%>" style="width: 35px; height: 35px; float: right;margin-left:20px;"></img>
        </div>

    </div>
</div>
<div style="height: 10px; background-color: #e5e5e5;"></div>