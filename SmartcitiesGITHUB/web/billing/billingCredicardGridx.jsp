<%@page import="br.com.moretic.vo.Profile"%>
<!DOCTYPE html>
<%@page import="br.com.moretic.vo.Country"%>
<%@page import="java.util.List"%>
<%@page import="br.com.moretic.rest.ProfileEndpoint"%>
<%
    List<Country> lCountries = (List<Country>) session.getAttribute(ProfileEndpoint.COUNTRIES);
    Profile p = (Profile) session.getAttribute(ProfileEndpoint.PROFILE);
    int idProfile = p.getIdprofile();
%>
<div data-dojo-type="dijit/layout/ContentPane" title="Pane" doLayout="true" style="position: absolute; z-index: 900; left: 0px; top: 0px; width: 340px; height: 90%px;">

    <input id="txtCNumber" 
           type="text" 
           dojoType="dijit.form.ValidationTextBox" 
           required="true"  
           regExp="/^(?:4[0-9]{12}(?:[0-9]{3})?)$/"
           promptMessage="Enter your credicard number."
           invalidMessage="Invalid number" 
           trim="true" 
           onkeypress="mask_card_field('txtCNumber')"
           style="position: absolute; z-index: 900; top: 20px; left: 15px; width: 200px;"
           />

    <select tabindex="11" id="cmbCardType" style="position: absolute; z-index: 900; left: 236px; top: 20px; width: 90px;">
        <option value="AmEx">American Express</option>
        <!--      <option value="CarteBlanche">Carte Blanche</option> -->
        <option value="DinersClub">Diners Club</option>
        <option value="Discover">Discover</option>
        <!-- <option value="EnRoute">enRoute</option>
         <option value="JCB">JCB</option> -->
        <option value="Maestro">Maestro</option>
        <option value="MasterCard">MasterCard</option>
        <option value="Solo">Solo</option>
        <!--      <option value="Switch">Switch</option> -->
        <option value="Visa">Visa</option>
        <option value="VisaElectron">Visa Electron</option>
        <!--      <option value="LaserCard">Laser</option> -->
    </select>


    <input id="txtMonth" 
           type="text"
           promptMessage="Enter your credicard expiration month."
           data-dojo-props="constraints:{datePattern:'MM'}" 
           data-dojo-type="dijit/form/DateTextBox" 
           style="position: absolute; z-index: 900; left: 15px; top: 60px; width: 90px;"
           />

    <input id="txtYear" 
           type="text" 
           promptMessage="Enter your credicard expiration year."
           data-dojo-props="constraints:{datePattern:'yyyy'}" 
           data-dojo-type="dijit/form/DateTextBox" 
           style="position: absolute; z-index: 900; top: 60px; width: 90px; left: 125px;"
           />

    <input id="txtSecCode" 
           type="text" 
           data-dojo-type="dijit/form/ValidationTextBox" 
           required="true"  
           promptMessage="Security code."
           invalidMessage="Invalid code" 
           trim="true" 
           style="position: absolute; z-index: 900; left: 236px; top: 60px; width: 90px;"
           />

    <input id="txtCardName" 
           type="text" 
           data-dojo-type="dijit/form/ValidationTextBox" 
           promptMessage="Name"
           style="position: absolute; z-index: 900; left: 15px; top: 100px; width: 200px;"
           />

    <input id="txtCardSurname" 
           type="text" 
           data-dojo-type="dijit/form/ValidationTextBox" 
           promptMessage="Surname"
           style="width: 90px; position: absolute; z-index: 900; left: 236px; top: 100px;"
           />

    <input id="txtPostCode" type="text" 
           data-dojo-type="dijit/form/ValidationTextBox" 
           promptMessage="Posting code"
           style="position: absolute; z-index: 900; left: 15px; top: 140px; width: 200px;"></input>

    <select id="cmbCountries" data-dojo-type="dijit/form/ComboBox" intermediateChanges="false" trim="false" uppercase="true" lowercase="false" propercase="false" invalidMessage="$_unset_$" pageSize="Infinity" searchDelay="200" style="position: absolute; z-index: 900; width: 90px; left: 236px; top: 140px;">
        <%
            /**
             * @Carrega lista de paises
             */
            for (Country c : lCountries) {
                out.print("<option value='" + c.getIdcountry() + "'>" + c.getNmCountry() + "</option>");
            }
        %>
    </select>
    <span style="position: absolute; z-index: 900; left: 15px; top: 5px;">Credicard number</span>
    <span style="position: absolute; z-index: 900; left: 15px; top: 45px;">Expiration Date</span>
    <span style="position: absolute; z-index: 900; left: 236px; top: 5px;">Card Type</span>
    <span style="position: absolute; z-index: 900; left: 236px; top: 45px;">Security code</span>
    <span style="position: absolute; z-index: 900; left: 15px; top: 85px;">Name</span>
    <span style="position: absolute; z-index: 900; left: 236px; top: 85px;">Surname</span>
    <img data-dojo-type="clipart/Help" style="position: absolute; z-index: 900; left: 310.04998779296875px; top: 61.6px;"></img>
    <img data-dojo-type="clipart/Lock" style="position: absolute; z-index: 900; left: 198px; top: 21.7px;"></img>
    <span style="position: absolute; z-index: 900; left: 15px; top: 125px;">Posting code</span>
    <span style="position: absolute; z-index: 900; left: 236px; top: 128px;">Country</span>
    <input type="button" onclick="saveLoadCredicard()" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="Add card" id="btSalvarCredicard" iconClass="icone-credito" style="position: absolute; z-index: 900; left: 258px; top: 167px;"></input>
    <!-- <input type="button" data-dojo-type="dijit/form/Button" intermediateChanges="false" label="Cancel" iconClass="icone-excluir" style="position: absolute; z-index: 900; left: 180px; top: 167px;"></input> -->
    <table data-dojo-type="gridx/Grid" 
           style="min-width: 1em; min-height: 1em; position: absolute; z-index: 900; left: 15px; top: 204px; width: 320px; height: 233px;" 
           jsId="gridCredicards"
           id="gridCredicards"
           data-dojo-props="cacheClass: 'gridx/core/model/cache/Async',
           modules: [                        
           'gridx/modules/SingleSort','gridx/modules/RowHeader','gridx/modules/select/Row', 'gridx/modules/select/Cell'
           ],
           structure:[ {width:'25px',name:'ID',field:'id'},
           {width:'60px',name:'Card Number',field:'card_number'},
           {width:'70px',name:'Name',field:'name'},
           {width:'51px',name:'Expiration Date',field:'expiration_date'},
           {width:'45px',name:'codeNum',field:'codeNum'}],
           store:storeMemory">

    </table>
</div>
<script>

//  @Path("/credicard/{number}/{month}/{year}/{postcode}/{name}/{surname}/{country}/{sec}/{idProfile}")
    function saveLoadCredicard() {
        var profileId = "<% out.print(idProfile);%>";
        var txtCNumber = document.getElementById("txtCNumber").value;
        var txtMonth = document.getElementById("txtMonth").value;
        var txtYear = document.getElementById("txtYear").value;
        var txtSecCode = document.getElementById("txtSecCode").value;
        var txtCardName = document.getElementById("txtCardName").value;
        var txtCardSurname = document.getElementById("txtCardSurname").value;
        var txtPostCode = document.getElementById("txtPostCode").value;
        var txtCountry = document.getElementById("cmbCountries").value;
        var txtCardType = document.getElementById("cmbCardType").value;

        /**
         * @Valida campos
         * */

        if (!checkCreditCard(txtCNumber, txtCardType)) {
            document.getElementById("txtCNumber").focus();
            alert(getCardErrorMessage());
            return;
        } else if (txtMonth.value == "") {
            alert(getCardErrorMessage(6));
            document.getElementById("txtMonth").focus();
            return;
        } else if (txtYear.value == "") {
            alert(getCardErrorMessage(6));
            document.getElementById("txtYear").focus();
            return;
        } else if (txtSecCode.value == "") {
            alert(getCardErrorMessage(6));
            document.getElementById("txtSecCode").focus();
            return;
        } else if (txtCardName.value == "") {
            alert(getCardErrorMessage(6));
            document.getElementById("txtCardName").focus();
            return;
        } else if (txtCardSurname.value == "") {
            alert(getCardErrorMessage(6));
            document.getElementById("txtCardSurname").focus();
            return;
        } else if (txtPostCode.value == "") {
            alert(getCardErrorMessage(6));
            document.getElementById("txtPostCode").focus();
            return;
        }



        var url = "profiles/credicard/" + txtCNumber + "/" + txtMonth + "/" + txtYear + "/" + txtPostCode + "/" + txtCardName + "/" + txtCardSurname + "/" + txtCountry + "/" + txtSecCode + "/" + profileId;
        var resultado = myProfile.restServices.salvaObjeto(url);
        resultado.then(function (dados) {
            myProfile.credicards = dados;
            var gridDataMovdel = [];

            for (x = 0; x < myProfile.credicards.length; x++) {

                var newLine = {
                    id: myProfile.credicards[x].idCredicard,
                    name: myProfile.credicards[x].p_name + "," + myProfile.credicards[x].p_surname,
                    codeNum: myProfile.credicards[x].credicardCode,
                    card_number: myProfile.credicards[x].credicardNumber,
                    expiration_date: myProfile.credicards[x].month + "-" + myProfile.credicards[x].year
                }
                alert(myProfile.credicards[x].credicardNumber);
                // alert(newLine);
                //Coloca no model o novo objeto showCIt
                gridDataMovdel.push(newLine);
                gridCredicards.model.store.put(newLine);
            }
            gridCredicards.model.clearCache();
            gridCredicards.model.store.setData(gridDataMovdel);
            gridCredicards.body.refresh();
        });
    }


</script>