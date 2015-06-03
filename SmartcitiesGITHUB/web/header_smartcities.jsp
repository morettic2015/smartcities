
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
             */

            Profile p = (Profile) session.getAttribute(ProfileEndpoint.PROFILE);


        %>
        <div style="float: right;margin-left:4px;">
            <span class="usuario-cabecalho" id="headerNomeUsuario"><% out.print(p.getNmUser()); %></span>
            <br>
            <span class="usuario-cabecalho"><% out.print(p.getEmail());%></span>
            </br>
        </div>

        <div style="float: right;">
            <input type="image" id="btProfileHeader"  src="./images/icons/Perfil/48X48.png" style="width: 35px; height: 35px; float: right;margin-left:20px;"></img>
        </div>

    </div>
    <!--
    <span style="left: 151px;" class="item-menu-principal">Perfil</span>
    <span style="left: 412px;" class="item-menu-principal">Faturamento</span>
    <span style="left: 540px;" class="item-menu-principal">Rede de Compartilhamento</span>
    <span style="left: 224px;" class="item-menu-principal">Ferramenta de Dados</span> -->
</div>
<div style="height: 10px; background-color: #e5e5e5;"></div>
~´/