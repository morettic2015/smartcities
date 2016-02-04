<%-- 
    Document   : billingPaypal
    Created on : 02/02/2016, 00:55:52
    Author     : LuisAugusto
--%>

<%@page import="br.com.moretic.rest.ProfileEndpoint"%>
<%@page import="br.com.moretic.vo.Profile"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%
    Profile p = (Profile) session.getAttribute(ProfileEndpoint.PROFILE);
    String paypal = p.getPaypal();
    String id = "" + p.getIdprofile();
%>
<div data-dojo-type="dijit/layout/ContentPane" title="Pane" doLayout="false" style="position: absolute; z-index: 900; width: 380px; height: 140px; left: 1px; top: 0px;">
    
    <input type="text" value="<%=paypal%>"  id="txtPaypalAcc" name="txtPaypalAcc"        
           dojoType="dijit.form.ValidationTextBox" 
           required="true"  
           regExp="[\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b]+"
           promptMessage="Enter email address."
           invalidMessage="Invalid Email Address." 
           trim="true"
           style="position: absolute; z-index: 900; width: 200px; left: 15px; top: 125px;"
       />
  <!--  <input value="<%=paypal%>"  id="txtPaypalAcc" type="text" data-dojo-type="dijit/form/ValidationTextBox" data-dojo-props="regExp:'/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/', invalidMessage:'Invalid Email.'"  style="position: absolute; z-index: 900; width: 200px; left: 15px; top: 125px;"></input>-->
    <span style="position: absolute; z-index: 900; left: 15px; top: 50px;"><div id="msgPaypalDialog" style="color: #88F;font-size: larger"></div>O Paypal é um serviço de processamento de pagamentos online, que permite que você receba pagamentos.<br>
        Para usar o Paypal é necessário ter uma conta no Paypal.<a href="http://paypal.com" target="_blank">
            Saiba mais sobre o Paypal.</a>
        </br>
    </span><img data-dojo-type="clipart/Lock" style="position: absolute; z-index: 900; left: 190px; top: 125px;"></img>
    <input type="button" data-dojo-type="dijit/form/Button"  intermediateChanges="false" value="save" label="Save" iconClass="icone-salvar" style="position: absolute; z-index: 900; left: 230px; top: 120px;" onclick="savePaypallAcc()"></input>
    <img style="position: absolute; z-index: 900; left: 16px; top: 11.749999313354493px;" src="images/paypal-5dbca08b2e7ec49daa5ac1e568c59193.png"></img>
</div>
<script>

    function savePaypallAcc() {
        var txtAcc = document.getElementById("txtPaypalAcc").value;

        <% out.print("var url = 'profiles/paypal/'+txtAcc+'/" + id + "'");%>

        var resultado = myProfile.restServices.salvaObjeto(url);
        resultado.then(function (dados) {
            document.getElementById("msgPaypalDialog").innerHTML = "<i>Account updated.</i>"
        });
    }
</script>

