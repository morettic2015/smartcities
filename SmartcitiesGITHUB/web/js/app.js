/**************************************
 *		Controle da visão / telas
 *************************************/

/**
 *	Globais
 */

var map;			// MAPA DO GOOGLE
var storePais;
var objetosDropadosDBSelection = [];	// Array de dados das tabelas escolhidas pelo usuario na importacao de BD
var linhasDBSelection = [];				// Array das linhas (relacionamentos) entre tabelas na importacao de BD
var widListaTabelasDBSelection = null;	// Guarda referencia do objeto Source na importacao de DB
var resProfileGeocoder = null;			// Guarda o objeto resultado do Geocoder do Google
var selectedAddress = null;				// Objeto JSON criado quando o usuário seleciona seu endereço
var profileAddressMarker = null;		// Marcador do endereço do usuário em Profile Address
var dataImportObject = null;			// Guarda um objeto qualquer com as propriedades necessárias para importar dados  
var myProfile;   						// Perfil do usuario com todos os dados dele

/**
 *	Constantes: uri dos arquivos/telas
 */
var PROFILE_SPLASH = "profile/perfilSplash.html";
var PROFILE_INFO = "profile/profileInfo.html";
var PROFILE_ADDRESS = "profile/profileAddress.html";
var PROFILE_SECURITY = "profile/profileSecurity.html";
var PROFILE_HISTORY = "profile/profileHistory.html";
var DATASOURCE_SPLASH = "dataSource/fonteDadosSplash.html";
var DATAIMPORT_COPY = "dataSource/copyData.html";
var DATAIMPORT_DB_CONNECTION = "dataSource/databaseImport.html";
var DATAIMPORT_DB_SELECTION = "dataSource/importDatabaseSelection.html";
var DATAIMPORT_DRIVER = "dataSource/dataDriver.html";
var DATAIMPORT_FILE_LOCATE = "dataSource/dataFileLocate.html";
var DATAIMPORT_HISTORY = "dataSource/historyData.html";
var DATAIMPORT_AD_CONNECTION = "dataSource/importADConnection.html";
var DATAIMPORT_CSV = "dataSource/importCsv.html";
var DATAIMPORT_FTP_CONNECTION = "dataSource/importFtpConection.html";
var DATAIMPORT_FTP_SELECTION = "dataSource/importFtpSelection.html";
var DATAIMPORT_JSON = "dataSource/importJson.html";
var DATAIMPORT_KML = "dataSource/importKml.html";
var DATAIMPORT_XML = "dataSource/importXml.html";
var DATAIMPORT_LDAP_CONNECTION = "dataSource/importLdapConnection.html";
var DATAIMPORT_WSDL = "dataSource/importWsdl.html";
var DATAIMPORT_PENDENCY_FILES = "dataSource/pendencyFileSelect.html";
var DATAIMPORT_SHARE = "dataSource/shareData.html";
var DATAIMPORT_TASK = "dataSource/task.html";
var DATAIMPORT_TRANSFORM = "dataSource/transform.html";
var MAP_SPLASH = "map/mapSplash.html";
var MAP_CONFIG = "map/mapConfig.html";
var MAP_SEARCH = "map/mapSearch.html";
var ALARMS_SPLASH = "alarms/alarmesSplash.html";
var BILLING_SPLASH = "billing/faturamentoSplash.html";
var BILLING_CREDITDEBT = "billing/billingCreditDebt.html";
var BILLING_TRANSACTIONS = "billing/billingTransactions.html";
var BILLING_PAYPAL = "billing/formPaypal.html";
var BILLING_PAGSEGURO = "billing/formPagseguro.html";
var BILLING_BANK = "billing/formBanco.html";
var BILLING_CARD = "billing/formCartao.html";
var CIRCLES_SPLASH = "circles/circulosSplash.html";
var CIRCLES_MANAGE = "circles/circles.html";
var CIRCLES_CONTACTS = "circles/circleContacts.html";
var CIRCLES_IMPORTOPTIONS = "circles/opcoesImportacaoContato.html";
var CONFIGURATION = "configuration.html";
var HEADER_MAIN = "header_smartcities.jsp";
var EULA = "info/eula.html";
var UPLOAD = "upload/index.html";
var STORE_COVER = "store/storeCover.html";

require([
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/parser",
    "dojo/request/xhr",
    "dojo/_base/array",
    "dojo/query",
    "dojo/_base/event",
    "dojo/i18n!./nls/texts.js",
    "dojo/aspect",
    "dojo/dnd/Source",
    "dojo/dnd/Target",
    "dojo/dnd/move",
    "dijit/Tree",
    "dijit/tree/ObjectStoreModel",
    "dijit/tree/dndSource",
    "dijit/registry",
    "dojox/gfx",
    "js/restServices.js"
],
        function (
                ready,
                on,
                dom,
                domAttr,
                domConstruct,
                domClass,
                domStyle,
                parser,
                xhr,
                array,
                query,
                event,
                textos,
                aspect,
                Source,
                Target,
                move,
                Tree,
                StoreModel,
                dndSource,
                registry,
                gfx,
                restServices
                ) {

            ready(function () {

                /**
                 *	Configuração do pós-carregamento das páginas em cada ContentPane
                 */
                contentPane_Perfil.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_FerramentaDados.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_Mapa.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_Alarmes.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_Faturamento.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_Circulos.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_PopUp.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                contentPane_Loja.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                });
                //headerMain.set("onDownloadEnd", function () {
                //    configuraTela(this.get("href"));
                //});


                /**
                 *	Carrega as telas de splash
                 */
                carregaTelaPerfil(PROFILE_SPLASH);
                carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                carregaTelaMapa(MAP_SPLASH);
                carregaTelaAlarmes(ALARMS_SPLASH);
                carregaTelaFaturamento(BILLING_SPLASH);
                carregaTelaCirculos(CIRCLES_SPLASH);
                carregaTelaLoja(STORE_COVER);
                /**
                 *	Atribuindo Eventos
                 */

                // Modulo Perfil
                on(dom.byId("btProfileInfo"), "click", function () {
                    carregaTelaPerfil(PROFILE_INFO, function () {

                        dom.byId("txtNameProfile").value = myProfile.nmUser;
                        dom.byId("txtEmailProfile").value = myProfile.email;
                        var objBirthDate = new Date(myProfile.nascimento);
                        var birthDay = objBirthDate.getDate().toString();
                        birthDay = (birthDay.length == 1) ? "0" + birthDay : birthDay;
                        var birthYear = objBirthDate.getFullYear().toString();
                        var birthMonth = (objBirthDate.getMonth() + 1).toString();
                        birthMonth = (birthMonth.length == 1) ? "0" + birthMonth : birthMonth;
                        var strBirthDate = birthMonth + "/" + birthDay + "/" + birthYear;
                        dom.byId("txtBirthdateProfile").value = strBirthDate;
                        dom.byId("txtCpfCnpjProfile").value = myProfile.cpfCnpj;
                        dom.byId("txtPasswordProfile").value = myProfile.password;
                        dom.byId("txtConfirmPassProfile").value = myProfile.password;
                        dom.byId("txtBioProfile").value = myProfile.bioText;
                        dom.byId("txtTelefoneProfileInfo").value = myProfile.telefone;
                        dom.byId("userAvatarInput").value = myProfile.avatars[0].path;
                        dom.byId("userAvatarImage").src = myProfile.avatars[0].path;
                        if (myProfile.cpfCnpj != null) {
                            registry.byId("btToggleEULA").set("checked", true);
                        }

                    });
                });
                on(dom.byId("btProfileAddress"), "click", function () {
                    carregaTelaPerfil(PROFILE_ADDRESS, function () {

                        if (myProfile.adresses.length > 0) {
                            dom.byId("txtEnderecoRua").value = myProfile.adresses[0].street;
                            dom.byId("txtEnderecoComplemento").value = myProfile.adresses[0].otherinfo;
                            //TODO MARCAR A POSIção DO USUARIO NO MAPA
                            addMarkerToMap(myProfile.adresses[0].street + "<br>" + myProfile.adresses[0].otherinfo, myProfile.adresses[0].street, myProfile.adresses[0].lat, myProfile.adresses[0].lon)
                        }

                    });
                });
                on(dom.byId("btProfileSecurity"), "click", function () {
                    carregaTelaPerfil(PROFILE_SECURITY, function () {
                        //alert(myProfile.securityInfo.length);
                        if (myProfile.securityInfo.length > 0) {
                            dom.byId("txtSegurancaEmail").value = myProfile.securityInfo[0].emailRecorey1;
                            dom.byId("txtSegurancaFrase").value = myProfile.securityInfo[0].secretWord;
                            dom.byId("txtSegurancaCelular").value = myProfile.securityInfo[0].telefoneRecorey1;
                            dom.byId("txtSegurancaTelefone").value = myProfile.securityInfo[0].telefoneRecorey2;
                        }

                    });
                });
                on(dom.byId("btProfileHistory"), "click", function () {
                    carregaTelaPerfil(PROFILE_HISTORY, function () {
                        var gridDataMovdel = [];
                        if (myProfile.lLog.length > 0) {
                            //Adiciona os itens no grid

                            for (i = 0; i < myProfile.lLog.length; i++) {
                                //Make date from timestamp
                                var mDate = new Date(myProfile.lLog[i].dTime);
                                var dday = mDate.getDate();
                                var dmonth = mDate.getMonth() + 1;
                                var dyear = mDate.getFullYear();
                                var dhour = mDate.getHours();
                                var dmin = mDate.getMinutes();
                                var dsec = mDate.getSeconds();
                                //var dmil = mDate.getMiliseconds();
                                //Format date
                                var dFullYMDHMSM = dday + "-" + dmonth + "-" + dyear + " " + dhour + ":" + dmin + ":" + dsec; // + ":" +dmil;
                                //Makes a new lline object
                                var newLine = {
                                    id: myProfile.lLog[i].id,
                                    dTime: dFullYMDHMSM,
                                    action: myProfile.lLog[i].action,
                                    ipAddrs: myProfile.lLog[i].ipAddrs
                                }
                                //Coloca no model o novo objeto
                                gridDataMovdel.push(newLine);
                            }
                            gridProfileHistory.model.clearCache();
                            gridProfileHistory.model.store.setData(gridDataMovdel);
                            gridProfileHistory.body.refresh();
                            // grid.startup();

                            //gridProfileHistory.sort.sort('dTime', true);
                        }
                    });
                });
                // Modulo Ferramenta de dados
                on(dom.byId("mnuImportDataAD"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_AD_CONNECTION)
                });
                on(dom.byId("mnuImportDataDB"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_DB_CONNECTION)
                });
                on(dom.byId("mnuImportDataFtp"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_FTP_CONNECTION)
                });
                on(dom.byId("mnuImportDataLdap"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_LDAP_CONNECTION)
                });
                on(dom.byId("itemCsvImport"), "click", function () {
                    var param = {tipoArquivo: "CSV"};
                    carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                });
                on(dom.byId("itemJsonImport"), "click", function () {
                    var param = {tipoArquivo: "JSON"};
                    carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                });
                on(dom.byId("itemKmlImport"), "click", function () {
                    var param = {tipoArquivo: "KML"};
                    carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                });
                on(dom.byId("itemRssImport"), "click", function () {
                    var param = {tipo: "RSS"};
                    carregaTelaFerramentaDados(DATAIMPORT_KML, param);
                });
                /*
                 on(dom.byId("itemWsdlImport"), "click", function () {
                 var param = {tipoArquivo: "WSDL"};
                 carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                 });
                 on(dom.byId("itemXlsImport"), "click", function () {
                 var param = {tipoArquivo: "XLS"};
                 carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                 });
                 */
                on(dom.byId("itemXmlImport"), "click", function () {
                    var param = {tipoArquivo: "XML"};
                    carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                });
                on(dom.byId("mnuFerramentaDadosCopy"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_COPY);
                });
                on(dom.byId("mnuFerramentaDadosTransform"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_TRANSFORM);
                });
                on(dom.byId("btHistoricoDados"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_HISTORY);
                });
                on(dom.byId("mnuFerramentaDadosDrivers"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_DRIVER);
                });
                on(dom.byId("mnuFerramentaDadosShare"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_SHARE);
                });
                on(dom.byId("mnuFerramentaDadosTask"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_TASK);
                });
                //Módulo Mapa
                on(dom.byId("btMapaSearch"), "click", function () {
                    abrePopUpModal(MAP_SEARCH);
                });
                on(dom.byId("btMapaLayers"), "click", function () {
                    abrePopUpModal(MAP_CONFIG);
                    addMarkerToMap("TEXTO INFORMATIVO NONONONO", "INFO TITULO", "42", "-88");
                });
                on(dom.byId("btMapaView"), "click", function () {
                    makeGmap();
                });
                on(dom.byId("tabMap"), "onShow", function () {
                    makeGmap();
                });
                // Aba/Módulo Faturamento
                on(dom.byId("btTransacoes"), "click", function () {
                    carregaTelaFaturamento(BILLING_TRANSACTIONS)
                });
                on(dom.byId("btCreditoDebito"), "click", function () {
                    carregaTelaFaturamento(BILLING_CREDITDEBT)
                });
                // Aba/Módulo Círculos
                on(dom.byId("btContatos"), "click", function () {
                    carregaTelaCirculos(CIRCLES_CONTACTS);
                });
                on(dom.byId("btCirculos"), "click", function () {
                    carregaTelaCirculos(CIRCLES_MANAGE);
                });
                /**
                 *	Delegação de evento para conteudo carregado dinamicamente
                 */

                /*
                 *	Módulo Ferramenta de Dados
                 */

                query("#conteudo_ferr_dados").on("#btTestarConexaoDados:click", function (evt) {
                    event.stop(evt);
                });
                // Aba/Módulo Faturamento
                query("#conteudo_faturamento").on("#btCCCredito:click", function (evt) {
                    abrePopUpModal(BILLING_CARD);
                    event.stop(evt);
                });
                query("#conteudo_faturamento").on("#btPaypalCredito:click", function (evt) {
                    abrePopUpModal(BILLING_PAYPAL, "Paypal", 300, 300);
                    event.stop(evt);
                });
                query("#conteudo_faturamento").on("#btPagseguroCredito:click", function (evt) {
                    abrePopUpModal(BILLING_PAGSEGURO, "PagSeguro");
                    event.stop(evt);
                });
                query("#conteudo_faturamento").on("#btBancoCredito:click", function (evt) {
                    abrePopUpModal(BILLING_BANK);
                    event.stop(evt);
                });
                // Modulo Circulos
                on(dom.byId("conteudo_circulos"), "#btImportarContatos:click", function () {
                    //abreImportarContato();
                    modalMessage(" importar contato", "Teste");
                });
                // Tela de Configuração

                query("#container_modal").on("#flagUS:click", function (evt) {
                    alteraLocale("en");
                    event.stop(evt);
                });
                query("#container_modal").on("#flagBR:click", function (evt) {
                    alteraLocale("pt-br");
                    event.stop(evt);
                });
                query("#container_modal").on("#btLogout:click", function (evt) {
                    //TODO script de logout
                    event.stop(evt);
                });
                /**
                 *	Atribuição das strings dos dicionários (Conteúdo que é carregado na inicialização)
                 */

                // Main
                dom.byId("rotuloAbaPerfil").innerHTML = textos.rotAbaPerfil;
                dom.byId("rotuloAbaDados").innerHTML = textos.rotAbaDados;
                dom.byId("rotuloAbaMapa").innerHTML = textos.rotAbaMapa;
                dom.byId("rotuloAbaAlarmes").innerHTML = textos.rotAbaAlarmes;
                dom.byId("rotuloAbaFaturamento").innerHTML = textos.rotAbaFaturamento;
                dom.byId("rotuloAbaCirculos").innerHTML = textos.rotAbaCirculos;
                dom.byId("rotuloAbaLoja").innerHTML = textos.rotAbaLoja;
                dom.byId("rotBtProfileInfo").innerHTML = textos.rotDadosPessoais;
                dom.byId("rotBtProfileAddress").innerHTML = textos.rotEndereco;
                dom.byId("rotBtProfileSecurity").innerHTML = textos.rotSeguranca;
                dom.byId("rotBtProfileHistory").innerHTML = textos.rotHistoricoConta;
                dom.byId("rotBtImportarDados").innerHTML = textos.rotImportar;
                dom.byId("rotBtExportarDados").innerHTML = textos.rotExportar;
                dom.byId("rotBtExcluirDados").innerHTML = textos.rotExcluir;
                dom.byId("rotBtAtualizarDados").innerHTML = textos.rotAtualizar;
                dom.byId("rotBtCopiarDados").innerHTML = textos.rotCopiar;
                dom.byId("rotBtTransformarDados").innerHTML = textos.rotTransformar;
                dom.byId("rotBtCompartilharDados").innerHTML = textos.rotCompartilhar;
                dom.byId("rotBtDriversDados").innerHTML = textos.rotDrivers;
                dom.byId("rotBtTarefaDados").innerHTML = textos.rotTarefa;
                dom.byId("rotBtHistoricoDados").innerHTML = textos.rotHistorico;
                dom.byId("rotBtFerramentasDados").innerHTML = textos.rotFerramentas;
                dom.byId("rotBtEditarDados").innerHTML = textos.gEditar;
                dom.byId("rotBtVisualizarDados").innerHTML = textos.rotVisualizarDados;
                dom.byId("rotBtMapaSave").innerHTML = textos.rotSalvar;
                dom.byId("rotBtMapaView").innerHTML = textos.gVisualizar;
                dom.byId("rotBtMapaSearch").innerHTML = textos.rotFiltrar;
                dom.byId("rotBtMapaLayers").innerHTML = textos.gCamadas;
                dom.byId("rotBtMapaExportar").innerHTML = textos.rotExportar;
                dom.byId("rotBtAlertSave").innerHTML = textos.rotSalvar;
                dom.byId("rotBtAlertNew").innerHTML = textos.rotNovo;
                dom.byId("rotBtAlertLoad").innerHTML = textos.rotAtualizar;
                dom.byId("rotBtAlertSearch").innerHTML = textos.rotFiltrar;
                dom.byId("rotBtAlertConfig").innerHTML = textos.rotConfigurar;
                dom.byId("rotBtTransacoes").innerHTML = textos.rotTransacoes;
                dom.byId("rotBtCreditoDebito").innerHTML = textos.rotCreditoDebito;
                dom.byId("rotBtContatos").innerHTML = textos.rotContatos;
                dom.byId("rotBtCirculos").innerHTML = textos.rotCirculos;
                dom.byId("tituloArvoreFontesDados").innerHTML = textos.fontesDados;
                // dom.byId("tituloArvorePendencias").innerHTML = textos.importacoesPendentes;

                /**
                 *	Carregamento das trees de 'Fonte de Dados'
                 */
                //loadTreeDataSources();
                //loadTreePendencies();
                //dom.byId("")
                on(dom.byId("btAtualizarDados"), "click", function () {
                    loadUserCTX().then(function (succeded) {
                        if (succeded) {
                            //alert(succeded);
                            loadDataSourcelistElements();
                        }
                    });
                });
                /*
                 *	Informa o tabcontainer que deve ser atualizado o tamanho
                 */
                tabContainerPrincipal.resize();
            });
            function loadDataSourcelistElements() {
                var myFtpList = myProfile.myFtps;
                var sourcesList = myProfile.mySources;
                //ZERA TODOS
                document.getElementById("ftpGroup").innerHTML = "";
                document.getElementById("xmlGroup").innerHTML = "";
                document.getElementById("csvGroup").innerHTML = "";
                document.getElementById("jsonGroup").innerHTML = "";
                document.getElementById("kmlGroup").innerHTML = "";
                document.getElementById("rssGroup").innerHTML = "";
                document.getElementById("ldapGroup").innerHTML = "";
                document.getElementById("adGroup").innerHTML = "";
                document.getElementById("dbGroup").innerHTML = "";
                // alert(sourcesList);
                for (i = 0; i < sourcesList.length; i++) {
                    var myTpInfo = sourcesList[i].myTp.toLowerCase() + "Group";
                    //alert(myTpInfo);
                    var selectDataOption = document.getElementById(myTpInfo)
                    var opt = document.createElement('option');
                    opt.value = sourcesList[i].id;
                    opt.style = "font-size: 8px;"
                    opt.innerHTML = sourcesList[i].fileTit + "(" + sourcesList[i].fileUrl + ")";
                    selectDataOption.appendChild(opt);
                }
                var selectDataOption = document.getElementById("ftpGroup");
                for (i = 0; i < myFtpList.length; i++) {
                    //var myTpInfo = sourcesList[i].myTp.toLowerCase() + "Group";
                    //alert(myTpInfo);

                    var opt = document.createElement('option');
                    opt.value = myFtpList[i].id;
                    opt.style = "font-size: 8px;"
                    opt.innerHTML = myFtpList[i].host + "(" + myFtpList[i].user + ")";
                    selectDataOption.appendChild(opt);
                }
            }


            /*
             * Inicio da Declaracao das funções
             */

            function alteraLocale(locale) {
                location.search = "?locale=" + locale;
            }

            /**
             *  Função para criar o mapa do google.
             *
             * */

            function makeGmap() {
                /*var mapOptions = {
                 zoom: 8,
                 center: new google.maps.LatLng(-34.397, 150.644)
                 };
                 var map = new google.maps.Map(document.getElementById('conteudo_mapa'), mapOptions);*/

                var brooklyn = new google.maps.LatLng(41.875696, -87.624207);
                var MY_MAPTYPE_ID = 'Smartcity';
                var featureOpts = [
                    {
                        stylers: [
                            {hue: '#A9F5E1'},
                            {visibility: 'simplified'},
                            {gamma: 0.5},
                            {weight: 0.5}
                        ]
                    },
                    {
                        elementType: 'labels',
                        stylers: [
                            {visibility: 'on'}
                        ]
                    },
                    {
                        featureType: 'water',
                        stylers: [
                            {color: '#A9F5E1'}
                        ]
                    }
                ];
                var mapOptions = {
                    zoom: 8,
                    center: brooklyn,
                    mapTypeControlOptions: {
                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
                    },
                    mapTypeId: MY_MAPTYPE_ID
                };
                map = new google.maps.Map(document.getElementById('conteudo_mapa'),
                        mapOptions);
                //Tools
                var drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.MARKER,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            google.maps.drawing.OverlayType.MARKER,
                            google.maps.drawing.OverlayType.CIRCLE,
                            google.maps.drawing.OverlayType.POLYGON,
                            google.maps.drawing.OverlayType.POLYLINE,
                            google.maps.drawing.OverlayType.RECTANGLE
                        ]
                    },
                    markerOptions: {
                        icon: 'images/icons/Bug/48X48.png'
                    },
                    circleOptions: {
                        fillColor: '#ffff00',
                        fillOpacity: 1,
                        strokeWeight: 5,
                        clickable: false,
                        editable: true,
                        zIndex: 1
                    }
                });
                drawingManager.setMap(map);
                var styledMapOptions = {
                    name: 'Smartcities'
                };
                var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
                map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
                //Marcador
                /*var marker = new google.maps.Marker({
                 position: brooklyn,
                 map: map,
                 title: 'TESTE',
                 labelContent: "$425K"
                 });*/
                var contentString = '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
                        '<div id="bodyContent">' +
                        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
                        'sandstone rock formation in the southern part of the ' +
                        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
                        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
                        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
                        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
                        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
                        'Aboriginal people of the area. It has many springs, waterholes, ' +
                        'rock caves and ancient paintings. Uluru is listed as a World ' +
                        'Heritage Site.</p>' +
                        '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                        'http://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
                        '(last visited June 22, 2009).</p>' +
                        '</div>' +
                        '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var marker = new google.maps.Marker({
                    position: brooklyn,
                    map: map,
                    title: 'Uluru (Ayers Rock)'
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
                //Layer KML
                var ctaLayer = new google.maps.KmlLayer({
                    url: 'http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml'
                });
                ctaLayer.setMap(map);
                //Tempo
                var weatherLayer = new google.maps.weather.WeatherLayer({
                    temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
                });
                weatherLayer.setMap(map);
                //Nuvens
                var cloudLayer = new google.maps.weather.CloudLayer();
                cloudLayer.setMap(map);
                //Carros
                var trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
                //Camada transito
                var transitLayer = new google.maps.TransitLayer();
                transitLayer.setMap(map);
                //Camada de bike
                var bikeLayer = new google.maps.BicyclingLayer();
                bikeLayer.setMap(map);
                //Adiciona local das legendas do mapa
                var legendaMap = document.getElementById('mapLegend'); //recupera div da legenda
                legendaMap.style.display = "block";
                //
                //  var searchMap = document.getElementById('mapSearch');//recupera div da legenda
                //legendaMap.style.visibility="visible"; //Seta o layer pra ser visiveel
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendaMap); //Anexa no mapaBOTTOM_CENTER
                //  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(searchMap);//Anexa no mapaBOTTOM_CENTER
            }

            function addMarkerToMap(txtInfo, infoTitle, mLat, mLon) {
                var brooklyn = new google.maps.LatLng(parseFloat(mLat), parseFloat(mLon));
                var customIcCircle = {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity: 0.5,
                    fillColor: 'ff0000',
                    strokeOpacity: 1.0,
                    strokeColor: 'fff000',
                    strokeWeight: 3.0,
                    scale: 20
                };
                var infowindow = new google.maps.InfoWindow({
                    content: txtInfo
                });
                var marker = new google.maps.Marker({
                    position: brooklyn,
                    map: map,
                    title: infoTitle,
                    icon: customIcCircle
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(map, marker);
                });
            }

            function showProfileAddressGmap() {

                var floripa = new google.maps.LatLng(-27.594501, -48.550905);
                var MY_MAPTYPE_ID = 'MapaEndereco';
                var mapOptions = {
                    zoom: 8,
                    center: floripa,
                    mapTypeControlOptions: {
                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
                    },
                    mapTypeId: MY_MAPTYPE_ID
                };
                map = new google.maps.Map(document.getElementById('mapProfileAddress'), mapOptions);
                var styledMapOptions = {
                    name: 'Smartcities'
                };
                var featureOpts = [
                    {
                        stylers: [
                            {hue: '#A9F5E1'},
                            {visibility: 'simplified'},
                            {gamma: 0.7},
                            {weight: 0.5}
                        ]
                    },
                    {
                        elementType: 'labels',
                        stylers: [
                            {visibility: 'on'}
                        ]
                    },
                    {
                        featureType: 'water',
                        stylers: [
                            {color: '#A9F5E1'}
                        ]
                    }
                ];
                var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
                map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
                var contentString = '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        '<h1 id="firstHeading" class="firstHeading">Ilha da Magia</h1>' +
                        '<div id="bodyContent">' +
                        '<p>Olho lhó ixtepô!</p>' +
                        '</div>' +
                        '</div>';
                /*
                 var infowindow = new google.maps.InfoWindow({
                 content: contentString
                 });
                 
                 var marker = new google.maps.Marker({
                 position: floripa,
                 map: map,
                 title: 'Flonópix'
                 });
                 google.maps.event.addListener(marker, 'click', function () {
                 infowindow.open(map, marker);
                 }); 
                 */

                //Adiciona local das legendas do mapa
                //var legendaMap = document.getElementById('mapLegend');//recupera div da legenda                
                //legendaMap.style.visibility="visible"; //Seta o layer pra ser visiveel
                //map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendaMap);//Anexa no mapa

            }


            /**
             *	Funções para carregar telas dinâmicas
             */

            function carregaTelaPerfil(paginaConteudo, parametros) {
                //parametrosTela = parametros;	// Setando variável global
                ///COMENTARIO

                loadUserCTX().then(function (succeded) {
                    if (succeded) {
                        loadDataSourcelistElements();
                    }
                });
                contentPane_Perfil.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                    parametros();
                });
                var objContainer = contentPane_Perfil;
                objContainer.set("href", paginaConteudo);
                // 

            }

            function carregaTelaFerramentaDados(paginaConteudo, parametros, fFunc) {
                parametrosTela = parametros; // Setando variável global


                contentPane_FerramentaDados.set("onDownloadEnd", function () {
                    configuraTela(this.get("href"));
                    fFunc();
                });
                var objContainer = contentPane_FerramentaDados;
                objContainer.set("href", paginaConteudo);
            }

            function carregaTelaMapa(paginaConteudo, parametros) {
                parametrosTela = parametros; // Setando variável global
                var objContainer = contentPane_Mapa;
                objContainer.set("href", paginaConteudo);
            }

            function carregaTelaAlarmes(paginaConteudo, parametros) {
                parametrosTela = parametros; // Setando variável global
                var objContainer = contentPane_Alarmes;
                objContainer.set("href", paginaConteudo);
            }

            function carregaTelaFaturamento(paginaConteudo, parametros) {
                parametrosTela = parametros; // Setando variável global
                var objContainer = contentPane_Faturamento;
                objContainer.set("href", paginaConteudo);
            }

            function carregaTelaCirculos(paginaConteudo, parametros) {
                parametrosTela = parametros; // Setando variável global
                var objContainer = contentPane_Circulos;
                objContainer.set("href", paginaConteudo);
            }

            function carregaTelaLoja(paginaConteudo) {
                contentPane_Loja.set("href", paginaConteudo);
            }

            /**
             * Função para abrir o modal. 
             * @argument {paginaConteudo} paginaConteudo pagina html a ser carregada no modal
             * @argument {titulo} o texto que será exibido na barra de título do modal
             * @argument {largura} define a largura do modal. Opcional.
             * @argument {altura} define a altura do modal. Opcional.
             * */
            function abrePopUpModal(paginaConteudo, titulo, largura, altura, messageOnly) {
                var larguraModal = largura != undefined && largura != null ? largura : 400;
                var alturaModal = altura != undefined && altura != null ? altura : 200;
                var larguraContent = larguraModal - 25;
                var alturaContent = alturaModal - 52;
                //dom.byId("tituloModal").innerHTML = titulo;
                if (messageOnly) {
                    contentPane_PopUp.set("content", paginaConteudo);
                } else {
                    contentPane_PopUp.set("href", paginaConteudo);
                }
                domStyle.set("myDialog", "width", larguraModal + "px");
                domStyle.set("myDialog", "height", alturaModal + "px");
                domStyle.set(contentPane_PopUp.domNode, "width", larguraContent + "px");
                domStyle.set(contentPane_PopUp.domNode, "height", alturaContent + "px");
                myDialog.set("title", titulo);
                exibeModal();
            }

            function exibeModal() {
                myDialog.show();
            }

            function modalMessage(message, type) {
                abrePopUpModal(message, type, null, 150, true);
            }


            function configuraTela(pagina) {
                console.log("Carregou " + pagina);
                if (pagina == DATASOURCE_SPLASH) {
                    i18nSplashDataSource();
                    setEventsSplashDataSource();
                } else if (pagina == PROFILE_SPLASH) {
                    i18nSplashProfile();
                    setEventsSplashProfile();
                } else if (pagina == MAP_SPLASH) {
                    i18nSplashMap();
                    setEventsSplashMap();
                } else if (pagina == ALARMS_SPLASH) {
                    i18nSplashAlarms();
                    setEventsSplashAlarms();
                } else if (pagina == BILLING_SPLASH) {
                    i18nSplashBilling();
                    setEventsSplashBilling();
                } else if (pagina == CIRCLES_SPLASH) {
                    i18nSplashCircles();
                    setEventsSplashCircles();
                } else if (pagina == PROFILE_INFO) {
                    i18nProfileInfo();
                    setEventsProfileInfo();
                } else if (pagina == PROFILE_ADDRESS) {
                    i18nProfileAdress();
                    setEventsProfileAddress();
                    showProfileAddressGmap();
                    startGeocoder();
                } else if (pagina == PROFILE_SECURITY) {
                    i18nProfileSecurity();
                    setEventsProfileSecurity();
                } else if (pagina == PROFILE_HISTORY) {
                    i18nProfileHistory();
                    refreshGridProfileHistory();
                } else if (pagina == DATAIMPORT_COPY) {
                    i18nCopyData();
                } else if (pagina == DATAIMPORT_TRANSFORM) {
                    i18nDataTransform();
                    loadTreeDataTransform();
                    refreshGridDataTransform();
                } else if (pagina == DATAIMPORT_SHARE) {
                    i18nDataShare();
                    refreshGridDataShare();
                } else if (pagina == DATAIMPORT_DRIVER) {
                    i18nDataDriver();
                    refreshGridDataDriver();
                } else if (pagina == DATAIMPORT_TASK) {
                    i18nDataTask();
                    refreshGridTasks();
                } else if (pagina == DATAIMPORT_HISTORY) {
                    i18nDataHistory();
                    refreshGridDataHistory();
                } else if (pagina == BILLING_TRANSACTIONS) {
                    i18nBillingTransactions();
                } else if (pagina == BILLING_CREDITDEBT) {
                    i18nBillingCredit();
                } else if (pagina == CIRCLES_CONTACTS) {
                    i18nContactCircle();
                    setEventsCircleContacts();
                    refreshGridCircleContacts();
                } else if (pagina == CIRCLES_MANAGE) {
                    i18nCircles();
                    refreshGridCircles();
                } else if (pagina == MAP_CONFIG) {
                    i18nMapConfig();
                } else if (pagina == CONFIGURATION) {
                    i18nGeneralConfig();
                } else if (pagina == DATAIMPORT_DB_CONNECTION) {
                    i18nImportBancoDados();
                    setEventsImportDBConnection();
                } else if (pagina == DATAIMPORT_DB_SELECTION) {
                    setEventsImportDBSelection();
                    i18nImportDatabaseSelection();
                    //loadTreeDBSelection();
                    // a arvore foi substituida por uma lista em vista da imcompatibilidade do dijit/tree/dndSource com o dojo/dnd/source
                    loadListaDBSelection();
                    loadDragDropDBSelection();
                    objetosDropadosDBSelection = [];
                    linhasDBSelection = [];
                } else if (pagina == DATAIMPORT_KML) {
                    //sem uso
                    //i18nImportKml();
                    //setEventsImportKml();
                    //dom.byId("tipoArquivoImportKml").innerHTML = parametrosTela.tipo;
                } else if (pagina == BILLING_PAYPAL) {
                    i18nFormPaypal();
                } else if (pagina == BILLING_PAGSEGURO) {
                    i18nFormPagseguro();
                } else if (pagina == BILLING_BANK) {
                    i18nFormBanco();
                } else if (pagina == BILLING_CARD) {
                    i18nFormCartao();
                } else if (pagina == DATAIMPORT_FTP_CONNECTION) {
                    setEventsImportFtpConn();
                    i18nImportFtpConnection();
                } else if (pagina == DATAIMPORT_FTP_SELECTION) {
                    setEventsImportFtpSelect();
                    i18nImportFtpSelect();
                    dom.byId("tipoArquivoImportFtpSelection").innerHTML = parametrosTela.protocolo;
                    refreshFileListFTPImport(); // preenchimento do grid
                    loadTreeFtpImport(); // preenchimento da tree
                } else if (pagina == DATAIMPORT_AD_CONNECTION) {
                    i18nImportADConnection();
                    setEventsImportADConnection();
                } else if (pagina == DATAIMPORT_FILE_LOCATE) {
                    dom.byId("tipoArquivoDataFileLocate").innerHTML = parametrosTela.tipoArquivo;
                    dom.byId("hdnTipoArquivo").value = parametrosTela.tipoArquivo;
                    setEventsDataFileLocate();
                    i18nDataFileLocate();
                } else if (pagina == DATAIMPORT_CSV) {
                    dom.byId("tipoArquivoCSV_XLS").innerHTML = parametrosTela.tipoArquivo;
                    setEventsImportCsv();
                    i18nImportCsv();
                } else if (pagina == DATAIMPORT_LDAP_CONNECTION) {
                    setEventsImportLdapConn();
                    i18nImportLdapConnection();
                } else if (pagina == DATAIMPORT_JSON) {
                    dom.byId("tipoArquivoJson_Xml").innerHTML = parametrosTela.tipoArquivo;
                    setEventsImportJson();
                    i18nImportJson();
                    loadTreeJsonOrigin();
                    loadTreeJsonDestiny();
                } else if (pagina == DATAIMPORT_WSDL) {
                    setEventsImportWsdl();
                    i18nImportWsdl();
                    loadTreeWsdl();
                    refreshGridWsdl();
                } else if (pagina == DATAIMPORT_PENDENCY_FILES) {
                    setEventsPendencyFileSelect();
                    i18nPendencyFileSelect();
                    refreshGridPendencyFileSelect();
                } else if (pagina == HEADER_MAIN) {
                    setEventsHeader();
                } else if (pagina == STORE_COVER) {
                    setEventsStoreCover();
                }

            }







            /**
             *	Atribuição de textos e internacionalização das telas
             */
            { // Profile
                function i18nProfileInfo() {
                    dom.byId("rotBtSalvarProfileInfo").innerHTML = textos.rotSalvar;
                    dom.byId("titleProfileInfo").innerHTML = textos.tituloDadosPessoais;
                    dom.byId("nameProfileInfo").innerHTML = textos.rotNomePerfil;
                    dom.byId("emailProfileInfo").innerHTML = textos.rotEmailPerfil;
                    dom.byId("birthProfileInfo").innerHTML = textos.rotDataNascPerfil;
                    dom.byId("cpfCnpjProfileInfo").innerHTML = textos.cpfCnpjPassaporte;
                    dom.byId("passwordProfileInfo").innerHTML = textos.rotSenhaPerfil;
                    dom.byId("confirmPassProfileInfo").innerHTML = textos.rotConfirmaSenhaPerfil;
                    dom.byId("bioProfileInfo").innerHTML = textos.rotBioPerfil;
                    dom.byId("acceptEulaProfileInfo").innerHTML = textos.btAceitoTermosPerfil;
                    dom.byId("phoneProfileInfo").innerHTML = textos.rotTelefonePerfil;
                    dom.byId("avatarProfileInfo").innerHTML = textos.rotAvatarPerfil;
                    dom.byId("languageProfileInfo").innerHTML = textos.rotIdiomaPerfil;
                    registry.byId("txtConfirmPassProfile").set("invalidMessage", textos.verifiqueSenha);
                }

                function i18nProfileAdress() {
                    dom.byId("rotBtSalvarProfileAddress").innerHTML = textos.rotSalvar;
                    dom.byId("tituloProfileAddress").innerHTML = textos.tituloEnderecoPerfil;
                    dom.byId("ruaProfileAddress").innerHTML = textos.rotRuaPerfil;
                    dom.byId("complProfileAddress").innerHTML = textos.rotComplementoPerfil;
                    dom.byId("btBuscarEnderecoProfile").innerHTML = textos.rotFiltrar;
                    /*
                     dom.byId("cepProfileAddress").innerHTML = textos.rotCepPerfil;
                     dom.byId("bairroProfileAddress").innerHTML = textos.rotBairroPerfil;
                     dom.byId("paisProfileAddress").innerHTML = textos.rotPaisPerfil;
                     //dom.byId("cmbCountryProfileAddress").innerHTML = textos.selecionePais;
                     dom.byId("estadoProfileAddress").innerHTML = textos.rotEstadoPerfil;
                     //dom.byId("cmdStateAddress").innerHTML = textos.selecioneEstado;
                     dom.byId("cidadeProfileAddress").innerHTML = textos.rotCidadePerfil;
                     //dom.byId("cmdCityAddress").innerHTML = textos.selecioneCidade;*/

                    //setDadosComboPais();
                }
                /*
                 function setDadosComboPais(){
                 // Cria store memory com valores retirados do dicionario
                 console.log("entrou");
                 var dadosPais = [
                 {id:1, name:"Brasil"},
                 {id:2, name:"Mexico"}
                 ];
                 console.log("and? " + dadosPais);
                 storePais = storeMemory;
                 // valores...
                 //atribui ao combo pais
                 console.log("hello");
                 //dom.byId("cmbEnderecoPais").store = storePais;
                 console.log("funciona?");
                 }
                 */
                function i18nProfileLanguage() {
                    dom.byId("rotBtSalvarProfileLanguage").innerHTML = textos.rotSalvar;
                    dom.byId("tituloProfileLanguage").innerHTML = textos.tituloIdiomaPerfil
                    dom.byId("idiomaProfileLanguage").innerHTML = textos.rotIdiomaPerfil;
                    dom.byId("varianteProfileLanguage").innerHTML = textos.rotVarianteIdiomaPerfil;
                    dom.byId("outrosProfileLanguage").innerHTML = textos.rotOutrosPerfil;
                }
                function i18nProfileSecurity() {
                    dom.byId("rotBtSalvarProfileSecurity").innerHTML = textos.rotSalvar;
                    dom.byId("tituloProfileSecurity").innerHTML = textos.tituloSegurancaPerfil
                    dom.byId("emailProfileSecurity").innerHTML = textos.rotEmailRecuperaPerfil;
                    dom.byId("telefoneProfileSecurity").innerHTML = textos.rotTelefonePerfil;
                    dom.byId("celularProfileSecurity").innerHTML = textos.rotCelularPerfil;
                    dom.byId("fraseProfileSecurity").innerHTML = textos.rotFraseSecretaPerfil;
                }
                function i18nProfileHistory() {
                    dom.byId("tituloProfileHistory").innerHTML = textos.tituloHistoricoPerfil
                    dom.byId("rotDeProfileHistory").innerHTML = textos.rotDe;
                    dom.byId("rotAteProfileHistory").innerHTML = textos.rotAte;
                    dom.byId("rotBtBuscarProfileHistory").innerHTML = textos.btBuscar;
                    dom.byId("rotColIDProfileHistory").innerHTML = textos.rotID;
                    dom.byId("rotColDataProfileHistory").innerHTML = textos.rotData;
                    dom.byId("rotColTipoProfileHistory").innerHTML = textos.rotTipo;
                    dom.byId("rotColIPProfileHistory").innerHTML = textos.rotIP;
                }
            }

            { // Data Sources

                function i18nCopyData() {
                    dom.byId("rotBtCopiarCopyData").innerHTML = textos.rotCopiar;
                    dom.byId("tituloCopyData").innerHTML = textos.tituloCopiarDados;
                    dom.byId("p1CopyData").innerHTML = textos.p1CopiarDados;
                    dom.byId("rotNomeCopyData").innerHTML = textos.rotNomeDestinoDados;
                    dom.byId("rotChkDadosCopyData").innerHTML = textos.rotCopiarDados;
                    dom.byId("rotChkCompartCopyData").innerHTML = textos.rotCopiarCompartDados;
                }
                function i18nDataTransform() {
                    dom.byId("rotBtSalvarTransformData").innerHTML = textos.rotSalvar;
                    dom.byId("rotBtExcluirTransformData").innerHTML = textos.rotExcluir;
                    dom.byId("rotBtVincularTransformData").innerHTML = textos.btVincularCamposDados;
                    dom.byId("rotBtAgruparTransformData").innerHTML = textos.btAgruparCamposDados;
                    dom.byId("rotBtFiltrarTransformData").innerHTML = textos.btFiltrarDados;
                    dom.byId("rotBtLayoutTransformData").innerHTML = textos.btLayoutDados;
                    dom.byId("rotBtTestarTransformData").innerHTML = textos.btTestarDados;
                    dom.byId("tituloTransformData").innerHTML = textos.tituloTransformarDados;
                    dom.byId("p1TransformData").innerHTML = textos.p1TransformarDados;
                    dom.byId("nomeTransformData").innerHTML = textos.gNome;
                    dom.byId("gzipTransformData").innerHTML = textos.rotGZIPDados;
                    dom.byId("httpsTransformData").innerHTML = textos.rotHttpsDados;
                    //dom.byId("rotNomeCampoTransform").innerHTML = textos.rotNomeCampoDados;
                    //dom.byId("opStringTransformData").innerHTML = textos.gString;
                    //dom.byId("opNumericoTransformData").innerHTML = textos.gNumerico;
                    //dom.byId("opBlobTransformData").innerHTML = textos.gBlob;
                    //dom.byId("opLogicoTransformData").innerHTML = textos.gLogico;
                    //dom.byId("opMascaraTransformData").innerHTML = textos.gMascara;
                    dom.byId("rotGridIDTransfomData").innerHTML = textos.gID;
                    dom.byId("rotGridNomeTransformData").innerHTML = textos.rotNomeTransformacaoDados;
                }
                function i18nDataShare() {
                    dom.byId("tituloShareData").innerHTML = textos.tituloCompartilharDados;
                    dom.byId("p1ShareData").innerHTML = textos.p1CompartilharDados;
                    dom.byId("rotNomeShareData").innerHTML = textos.gNome;
                    dom.byId("rotEnviarShareData").innerHTML = textos.rotEnviarParaDados;
                    dom.byId("rotPermissaoShareData").innerHTML = textos.rotPermissaoDados;
                    console.log("6");
                    //dom.byId("opViewPermissionShare").innerHTML = textos.gVisualizar;
                    console.log("7");
                    //dom.byId("opEditPermissionShare").innerHTML = textos.gEditar;
                    console.log("8");
                    dom.byId("rotVisibilidadeShareData").innerHTML = textos.rotVisibilidadeDados;
                    console.log("9");
                    //dom.byId("opPublicoVisibShare").innerHTML = textos.gPublico;
                    console.log("10");
                    //dom.byId("opPrivadoVisibShare").innerHTML = textos.gPrivado;
                    console.log("11");
                    dom.byId("rotGridIDShareData").innerHTML = textos.gID;
                    dom.byId("rotGridNomeShareData").innerHTML = textos.gNome;
                    dom.byId("rotGridCirculosShareData").innerHTML = textos.rotCirculos;
                    dom.byId("rotGridInfoShareData").innerHTML = textos.gInfo;
                }
                function i18nDataDriver() {
                    dom.byId("tituloDataDriver").innerHTML = textos.gDrivers;
                    dom.byId("p1DataDriver").innerHTML = textos.p1DriversDados;
                    dom.byId("rotNomeDataDriver").innerHTML = textos.gNome;
                    dom.byId("rotDriverDataDriver").innerHTML = textos.gDriver;
                    dom.byId("rotIconeDataDriver").innerHTML = textos.gIcone;
                    dom.byId("rotBtTestarDriver").innerHTML = textos.btTestarDriverDados;
                    dom.byId("rotDescricaoDataDriver").innerHTML = textos.gDescricao;
                    dom.byId("colGridIDDataDriver").innerHTML = textos.gID;
                    dom.byId("colGridDriverDataDriver").innerHTML = textos.gDriver;
                    dom.byId("colGridDescricaoDataDriver").innerHTML = textos.gDescricao;
                    dom.byId("colGridIconeDataDriver").innerHTML = textos.gIcone;
                    dom.byId("colGridClasspathDriver").innerHTML = textos.gClasspath;
                    dom.byId("rotBtSaveDriver").innerHTML = textos.rotSalvar;
                }
                function i18nDataTask() {
                    dom.byId("tituloDataTask").innerHTML = textos.tituloTarefasDados;
                    dom.byId("p1DataTask").innerHTML = textos.p1TarefasDados;
                    dom.byId("rotDiariamenteDataTask").innerHTML = textos.rotDiariamenteDados;
                    dom.byId("rotSicronDataTask").innerHTML = textos.rotSincronTarefaDados;
                    dom.byId("rotIntervaloDataTask").innerHTML = textos.rotIntervaloTarefaDados;
                    dom.byId("colGridIDDataTask").innerHTML = textos.gID;
                    dom.byId("colGridNomeDataTask").innerHTML = textos.gNome;
                    dom.byId("colGridHoraDataTask").innerHTML = textos.gHora;
                    dom.byId("colGridDateDataTask").innerHTML = textos.gData;
                    dom.byId("colGridPeriodoDataTask").innerHTML = textos.periodoExecucaoTarefa;
                    dom.byId("rotBtNewTask").innerHTML = textos.btNovaTarefaDados;
                    dom.byId("rotBtSaveTask").innerHTML = textos.rotSalvar;
                    dom.byId("rotBtExcludeTask").innerHTML = textos.rotExcluir;
                }
                function i18nDataHistory() {
                    dom.byId("tituloHistoryData").innerHTML = textos.tituloHistoricoDados;
                    dom.byId("p1HistoryData").innerHTML = textos.p1HistoricoDados;
                    dom.byId("rotDeHistoryData").innerHTML = textos.rotDe;
                    dom.byId("rotAteHistoryData").innerHTML = textos.rotAte;
                    dom.byId("rotBtBuscarHistoryData").innerHTML = textos.btBuscar;
                    dom.byId("colGridIDHistoryData").innerHTML = textos.gID;
                    dom.byId("colGridDateHistoryData").innerHTML = textos.gData;
                    dom.byId("colGridTimeHistoryData").innerHTML = textos.gHora;
                    dom.byId("colGridUserHistoryData").innerHTML = textos.gUsuario;
                    dom.byId("colGridSourceHistoryData").innerHTML = textos.fonteDados;
                    dom.byId("colGridOperationHistoryData").innerHTML = textos.gOperacao;
                }
                function i18nImportBancoDados() {
                    dom.byId("rotBtAnteriorImportDB").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoImportDB").innerHTML = textos.gProximo;
                    dom.byId("tituloDataBaseImport").innerHTML = textos.tituloImportBancoDados;
                    dom.byId("rotNomeFonteDBImport").innerHTML = textos.nomeFonteDados;
                    dom.byId("rotNomeBaseDBImport").innerHTML = textos.nomeBaseDados;
                    dom.byId("rotTipoDBImport").innerHTML = textos.tipoBaseDados;
                    dom.byId("rotUrlDBImport").innerHTML = textos.gUrl;
                    dom.byId("rotPortaDBImport").innerHTML = textos.gPorta;
                    dom.byId("rotUsuarioDBImport").innerHTML = textos.gUsuario;
                    dom.byId("rotSenhaDBImport").innerHTML = textos.gSenha;
                    dom.byId("rotBtTestarDBImport").innerHTML = textos.testarConexao;
                }
                function i18nImportDatabaseSelection() {
                    dom.byId("rotBtAnteriorDatabaseSelection").innerHTML = textos.gAnterior;
                    dom.byId("rotBtSalvarDatabaseSelection").innerHTML = textos.rotSalvar;
                    dom.byId("tituloImportDBSelection").innerHTML = textos.tituloImportDBSelection;
                    dom.byId("p1ImportDBSelection").innerHTML = textos.p1ImportDBSelection;
                }
                function i18nImportKml() {
                    dom.byId("rotBtAnteriorImportKml").innerHTML = textos.gAnterior;
                    dom.byId("rotBtSalvarImportKml").innerHTML = textos.rotSalvar;
                    dom.byId("tituloImportKml").innerHTML = textos.rotImportar;
                    dom.byId("rotLinkImportKml").innerHTML = textos.gLink;
                    dom.byId("rotDescricaoImportKml").innerHTML = textos.gDescricao;
                }
                function i18nImportADConnection() {
                    dom.byId("tituloImportADConnection").innerHTML = textos.rotImportar;
                    dom.byId("rotBtAnteriorADConnection").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoADConnection").innerHTML = textos.gProximo;
                    dom.byId("p1ImportADConnection").innerHTML = textos.p1ImportADConnection;
                    dom.byId("rotIPImportADConnection").innerHTML = textos.rotIP;
                    dom.byId("rotUsuarioImportADConnection").innerHTML = textos.gUsuario;
                    dom.byId("rotSenhaImportADConnection").innerHTML = textos.gSenha;
                    dom.byId("rotBtTestarImportADConn").innerHTML = textos.gTestar;
                }
                function i18nImportFtpConnection() {
                    dom.byId("rotBtAnteriorFtpConn").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoFtpConn").innerHTML = textos.gProximo;
                    dom.byId("tituloImportFtpConection").innerHTML = textos.rotImportar;
                    dom.byId("p1ImportFtpConection").innerHTML = textos.p1ImportFtpConection;
                    dom.byId("rotTipoImportFtp").innerHTML = textos.gTipo;
                    dom.byId("rotUrlImportFtp").innerHTML = textos.gUrl;
                    dom.byId("rotUsuarioImportFtp").innerHTML = textos.gUsuario;
                    dom.byId("rotSenhaImportFtp").innerHTML = textos.gSenha;
                    dom.byId("rotBtTestarFtpConn").innerHTML = textos.gTestar;
                }
                function i18nImportFtpSelect() {
                    dom.byId("rotBtAnteriorFtpSelect").innerHTML = textos.gAnterior;
                    dom.byId("rotBtFinalizarFtpSelect").innerHTML = textos.gFinalizar;
                    dom.byId("tituloImportFtpSelection").innerHTML = textos.rotImportar;
                    dom.byId("p1ImportFtpSelection").innerHTML = textos.p1ImportFtpSelection;
                    dom.byId("rotColNomeArquivo").innerHTML = textos.gNome;
                    dom.byId("rotColTipoArquivo").innerHTML = textos.gTipo;
                    dom.byId("rotColTamanhoArquivo").innerHTML = textos.gTamanho;
                    dom.byId("rotColDataModificacao").innerHTML = textos.dataModificacao;
                }
                function i18nDataFileLocate() {
                    dom.byId("rotBtAnteriorFileLocate").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoFileLocate").innerHTML = textos.gProximo;
                    dom.byId("tituloDataFileLocate").innerHTML = textos.rotImportar;
                    dom.byId("rotArquivoFileLocate").innerHTML = textos.localArquivo;
                    dom.byId("rotNomeFonteFileLocate").innerHTML = textos.nomeFonteDados;
                    dom.byId("rotDescricaoFileLocate").innerHTML = textos.gDescricao;
                    registry.byId("btUploadFileLocate").set("label", textos.enviarDestePC);
                    registry.byId("btPendencyDirectory").set("label", textos.abrirDiretorioPendencias);
                }
                function i18nImportCsv() {
                    dom.byId("rotBtAnteriorImportCsv").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoImportCsv").innerHTML = textos.gFinalizar;
                    dom.byId("tituloImportCSV").innerHTML = textos.rotImportar;
                    dom.byId("p1ImportCsv").innerHTML = textos.p1ImportCsv;
                }
                function i18nImportLdapConnection() {
                    dom.byId("rotBtAnteriorLdapConnect").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoLdapConnect").innerHTML = textos.gProximo;
                    dom.byId("tituloImportLdap").innerHTML = textos.importarLdap;
                    dom.byId("rotUrlImportLdap").innerHTML = textos.gUrl;
                    dom.byId("rotPortaImportLdap").innerHTML = textos.gPorta;
                    dom.byId("rotPesquisaImportLdap").innerHTML = textos.pesquisaLdap;
                    dom.byId("rotUsuarioImportLdap").innerHTML = textos.gUsuario;
                    dom.byId("rotSenhaImportLdap").innerHTML = textos.gSenha;
                }
                function i18nImportJson() {
                    dom.byId("rotBtAnteriorImportJson").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoImportJson").innerHTML = textos.gFinalizar;
                    dom.byId("tituloImportJson").innerHTML = textos.rotImportar;
                    dom.byId("p1ImportJson").innerHTML = textos.p1ImportJson;
                }
                function i18nImportWsdl() {
                    dom.byId("rotBtAnteriorImportWsdl").innerHTML = textos.gAnterior;
                    dom.byId("rotBtProximoImportWsdl").innerHTML = textos.gProximo;
                    dom.byId("rotBtSalvarImportWsdl").innerHTML = textos.rotSalvar;
                    dom.byId("tituloImportImportWsdl").innerHTML = textos.tituloImportImportWsdl;
                    dom.byId("p1ImportWsdl").innerHTML = textos.p1ImportWsdl;
                    dom.byId("rotFiltroImportWsdl").innerHTML = textos.filtroWsdl;
                }
                function i18nPendencyFileSelect() {

                }
            }

            { // Billing
                function i18nBillingTransactions() {
                    dom.byId("tituloBillingTransactions").innerHTML = textos.tituloHistoricoTransacoes;
                    dom.byId("rotDeBillingTransactions").innerHTML = textos.rotDe;
                    dom.byId("rotAteBillingTransactions").innerHTML = textos.rotAte;
                    dom.byId("rotTipoBillingTransactions").innerHTML = textos.gTipo;
                    dom.byId("rotBtBuscarBillingTransactions").innerHTML = textos.btBuscar;
                    dom.byId("colGridCodigoBillingTransactions").innerHTML = textos.gCodigo;
                    dom.byId("colGridDataBillingTransactions").innerHTML = textos.gData;
                    dom.byId("colGridTipoBillingTransactions").innerHTML = textos.gTipo;
                    dom.byId("colGridMediadorBillingTransactions").innerHTML = textos.gMediador;
                }
                function i18nBillingCredit() {
                    dom.byId("tituloBillingCreditDebit").innerHTML = textos.tituloCreditoDebito;
                    dom.byId("p1BillingCreditDebit").innerHTML = textos.p1CreditoDebito;
                    dom.byId("colGridNomeBillingCredit").innerHTML = textos.gNome;
                    dom.byId("colGridContaBillingCredit").innerHTML = textos.gConta;
                    dom.byId("colGridAgenciaBillingCredit").innerHTML = textos.gAgencia;
                    dom.byId("colGridBancoBillingCredit").innerHTML = textos.gBanco;
                }
            }

            { // Circles
                function i18nContactCircle() {
                    dom.byId("tituloCircleContacts").innerHTML = textos.tituloContatosCirculos;
                    dom.byId("rotNomeCircleContacts").innerHTML = textos.gNome;
                    dom.byId("rotBtBuscarCircleContacts").innerHTML = textos.btBuscar;
                    dom.byId("colGridNomeCircleContacts").innerHTML = textos.gNome;
                    dom.byId("colGridEmailCircleContacts").innerHTML = textos.gEmail;
                    dom.byId("colGridCirculosCircleContacts").innerHTML = textos.gCirculo;
                    dom.byId("rotBtNovoCircleContacts").innerHTML = textos.rotNovo;
                    dom.byId("rotBtSalvarCircleContacts").innerHTML = textos.rotSalvar;
                    dom.byId("rotBtExcluirCircleContacts").innerHTML = textos.rotExcluir;
                    dom.byId("rotBtImportarCircleContacts").innerHTML = textos.rotImportar;
                    dom.byId("rotBtCirculoCircleContacts").innerHTML = textos.gCirculo;
                }
                function i18nCircles() {
                    dom.byId("tituloCircles").innerHTML = textos.tituloCirculos;
                    dom.byId("rotNomeCircles").innerHTML = textos.gNome;
                    dom.byId("rotBtBuscarCircles").innerHTML = textos.btBuscar;
                    dom.byId("colGridCirculoCircles").innerHTML = textos.gCirculo;
                    dom.byId("colGridMembrosCircles").innerHTML = textos.gMembros;
                    dom.byId("rotBtNovoCircles").innerHTML = textos.rotNovo;
                    dom.byId("rotBtSalvarCircles").innerHTML = textos.rotSalvar;
                    dom.byId("rotBtExcluirCircles").innerHTML = textos.rotExcluir;
                    dom.byId("rotBtHistoricoCircles").innerHTML = textos.rotHistorico;
                }
            }

            function i18nMapConfig() {
                dom.byId("tituloModal").innerHTML = textos.tituloMapConfig;
                dom.byId("rotBtFiltrarMapConfig").innerHTML = textos.rotFiltrar;
                dom.byId("rotBtSalvarMapConfig").innerHTML = textos.rotSalvar;
            }
            function i18nGeneralConfig() {
                dom.byId("tituloModal").innerHTML = textos.gConfiguracao;
                dom.byId("tituloConfiguracao").innerHTML = textos.gConfiguracao;
                dom.byId("rotConfigRegion").innerHTML = textos.gRegiao;
            }


            /*
             *	Internacionalização das telas de Splash
             */
            function i18nSplashDataSource() {
                dom.byId("rotSplashImportData").innerHTML = textos.rotImportar;
                dom.byId("pSplashImportData").innerHTML = textos.descImportarDados;
                dom.byId("rotSplashExportData").innerHTML = textos.rotExportar;
                dom.byId("pSplashExportData").innerHTML = textos.descExportarDados;
                dom.byId("rotSplashCopyData").innerHTML = textos.rotCopiar;
                dom.byId("pSplashCopyData").innerHTML = textos.descCopiarDados;
                dom.byId("rotSplashTransformData").innerHTML = textos.rotTransformar;
                dom.byId("pSplashTransformData").innerHTML = textos.descTransformarDados;
                dom.byId("rotSplashShareData").innerHTML = textos.rotCompartilhar;
                dom.byId("pSplashShareData").innerHTML = textos.descCompartilharDados;
                dom.byId("rotSplashDrivers").innerHTML = textos.rotDrivers;
                dom.byId("pSplashDrivers").innerHTML = textos.descDriversDados;
                dom.byId("rotSplashDataTasks").innerHTML = textos.rotTarefa;
                dom.byId("pSplashDataTasks").innerHTML = textos.descTarefasDados;
                dom.byId("rotSplashDataHistory").innerHTML = textos.rotHistorico;
                dom.byId("pSplashDataHistory").innerHTML = textos.descHistoricoDados;
            }
            function i18nSplashProfile() {
                dom.byId("rotSplashPersonalInfo").innerHTML = textos.rotDadosPessoais;
                dom.byId("pSplashPersonalInfo").innerHTML = textos.descDadosPessoais;
                dom.byId("rotSplashProfileAddress").innerHTML = textos.rotEndereco;
                dom.byId("pSplashProfileAddress").innerHTML = textos.descEndereco;
                dom.byId("rotSplashProfileLanguage").innerHTML = textos.rotIdioma;
                dom.byId("pSplashProfileLanguage").innerHTML = textos.descIdioma;
                dom.byId("rotSplashProfileSecurity").innerHTML = textos.rotSeguranca;
                dom.byId("pSplashProfileSecurity").innerHTML = textos.descSeguranca;
                dom.byId("rotSplashProfileHistory").innerHTML = textos.rotHistoricoConta;
                dom.byId("pSplashProfileHistory").innerHTML = textos.descHistoricoConta;
            }
            function i18nSplashMap() {
                dom.byId("rotSplashViewMap").innerHTML = textos.gVisualizar;
                dom.byId("pSplashViewMap").innerHTML = textos.descVisualizarMapa;
                dom.byId("rotSplashSearchMap").innerHTML = textos.rotFiltrar;
                dom.byId("pSplashSearchMap").innerHTML = textos.descFiltrarMapa;
                dom.byId("rotSplashMapLayers").innerHTML = textos.gCamadas;
                dom.byId("pSplashMapLayers").innerHTML = textos.descCamadasMapa;
                dom.byId("rotSplashExportMap").innerHTML = textos.rotExportar;
                dom.byId("pSplashExportMap").innerHTML = textos.descExportarMapa;
            }
            function i18nSplashAlarms() {
                dom.byId("rotSplashRefreshAlarm").innerHTML = textos.rotAtualizar;
                dom.byId("pSplashRefreshAlarm").innerHTML = textos.descAtualizarAlarme;
                dom.byId("rotSplashSearchAlarm").innerHTML = textos.rotFiltrar;
                dom.byId("pSplashSearchAlarm").innerHTML = textos.descFiltrarAlarme;
                dom.byId("rotSplashConfigAlarm").innerHTML = textos.rotConfigurar;
                dom.byId("pSplashConfigAlarm").innerHTML = textos.descConfigurarAlarme;
            }
            function i18nSplashBilling() {
                dom.byId("rotSplashCredit").innerHTML = textos.gCredito;
                dom.byId("pSplashCredit").innerHTML = textos.descCreditoFaturamento;
                dom.byId("rotSplashDebit").innerHTML = textos.gDebito;
                dom.byId("pSplashDebit").innerHTML = textos.descDebitoFaturamento;
                dom.byId("rotSplashTransactions").innerHTML = textos.rotTransacoes;
                dom.byId("pSplashTransactions").innerHTML = textos.descTransacoesFaturamento;
            }
            function i18nSplashCircles() {
                dom.byId("rotSplashImportContacts").innerHTML = textos.rotImportarContatos;
                dom.byId("pSplashImportContacts").innerHTML = textos.descImportarContatosCirculos;
                dom.byId("rotSplashNewContact").innerHTML = textos.rotNovoContato;
                dom.byId("pSplashNewContact").innerHTML = textos.descNovoContatoCirculos;
                dom.byId("rotSplashCircles").innerHTML = textos.rotCirculos;
                dom.byId("pSplashCircles").innerHTML = textos.descCirculos;
            }

            function i18nFormPaypal() {
                dom.byId("tituloPaypal").innerHTML = textos.paypal;
                dom.byId("p1Paypal").innerHTML = textos.p1Paypal;
                dom.byId("rotBtSalvarPaypal").innerHTML = textos.rotSalvar;
            }
            function i18nFormPagseguro() {
                dom.byId("tituloPagseguro").innerHTML = textos.pagSeguro;
                dom.byId("p1Pagseguro").innerHTML = textos.p1Pagseguro;
                dom.byId("rotBtSalvarPagseguro").innerHTML = textos.rotSalvar;
            }
            function i18nFormBanco() {
                dom.byId("tituloFormBanco").innerHTML = textos.gContaBancaria;
                dom.byId("p1FormBanco").innerHTML = textos.p1FormBanco;
                dom.byId("rotBtNovaFormBanco").innerHTML = textos.btNovaConta;
                dom.byId("rotBtSalvarFormBanco").innerHTML = textos.rotSalvar;
                dom.byId("rotBtExcluirFormBanco").innerHTML = textos.rotExcluir;
            }
            function i18nFormCartao() {
                dom.byId("rotSelecioneCartao").innerHTML = textos.selecioneCartao;
                dom.byId("rotNumeroCartao").innerHTML = textos.numeroCartao;
                dom.byId("rotDataExpiracaoCartao").innerHTML = textos.dataExpiracao;
                dom.byId("cvcFormCartao").innerHTML = textos.cvc;
                dom.byId("colGridNumeroCartao").innerHTML = textos.numeroCartao;
                dom.byId("colGridBandeiraCartao").innerHTML = textos.gBandeira;
                dom.byId("rotBtSalvarFormCartao").innerHTML = textos.rotSalvar;
                dom.byId("rotBtExcluirFormCartao").innerHTML = textos.rotExcluir;
            }



            /**
             *	Atribução de eventos às telas carregadas via ajax
             */

            // Header/Cabeçalho
            function setEventsHeader() {
                on(dom.byId("btConfigHeader"), "click", function () {
                    //contentPane_PopUp.set("href", CONFIGURATION);
                    //myDialog.set("title", "Config");
                    //myDialog.show();
                    abrePopUpModal(CONFIGURATION, textos.gConfiguracao, 300, 200);
                });
            }

            // Eventos no modulo Perfil

            function setEventsProfileInfo() {
                on(dom.byId("btSalvarProfileInfo"), "click", function () {
                    saveProfileInfo();
                });
                on(dom.byId("btToggleEULA"), "click", function () {
                    abrePopUpModal(EULA, textos.eula);
                });
                on(dom.byId("txtConfirmPassProfile"), "blur", function () {
                    var obj = registry.byId(this.id);
                    obj.set("regExp", "^" + dom.byId("txtPasswordProfile").value + "$");
                });
                on(dom.byId("txtTelefoneProfileInfo"), "keypress", function () {
                    var evento = arguments[0] || window.event;
                    refreshInternationalPhoneMask(evento, this);
                });
                registry.byId("txtCpfCnpjProfile").set("validator", function () {
                    return validateCpfCnpj(this);
                });
                on(dom.byId("txtCpfCnpjProfile"), "keypress", function () {
                    var evento = arguments[0] || window.event;
                    refreshIdentificationMask(evento, this);
                });
                on(dom.byId("txtBioProfile"), "keypress", function () {
                    var evento = arguments[0] || window.event;
                    limitTextArea(this, 250, evento);
                });
                on(dom.byId("userAvatarInput"), "change", function () {
                    //TODO passa valor para o src da imagem
                    // depois de carregar a imagem/upload
                    // para algum componente(?)
                    console.log(this.value);
                    dom.byId("userAvatarImage").src = this.value;
                });
                query(".icone-bandeira").on("click", function () {
                    selectProfileLocale(this);
                });
                on(dom.byId("userAvatarImage"), "click", function () {
                    //TODO passa valor para o src da imagem
                    // depois de carregar a imagem/upload
                    // para algum componente(?)
                    //console.log(this.value);
                    //dom.byId("userAvatarImage").src = this.value;

                    abrePopUpModal(UPLOAD, "File Upload", 400, 300);
                });
            }

            function setEventsProfileAddress() {
                on(dom.byId("btSalvarEnderecoPerfil"), "click", function () {
                    saveProfileAddress();
                });
                on(dom.byId("btBuscarEnderecoProfile"), "click", function () {
                    showFoundedAddresses(dom.byId("txtEnderecoRua").value);
                });
                on(dom.byId("txtEnderecoRua"), "keypress", function () {
                    var evento = arguments[0] || window.event;
                    manageKeyProfileAddressSearch(evento, this);
                });
                query("#boxResultsProfileAddress").on(".item-listagem:click", function () {
                    selectProfileAddress(this.id);
                });
            }

            function setEventsProfileSecurity() {
                on(dom.byId("btSalvarSegurancaPerfil"), "click", function () {
                    saveProfileSecurity();
                });
                on(dom.byId("txtSegurancaTelefone"), "keypress", function () {
                    var evento = arguments[0] || window.event;
                    refreshInternationalPhoneMask(evento, this);
                });
                on(dom.byId("txtSegurancaCelular"), "keypress", function () {
                    var evento = arguments[0] || window.event;
                    refreshInternationalPhoneMask(evento, this);
                });
            }

            // Eventos nas telas do módulo Fonte de Dados
            function setEventsImportFtpConn() {
                on(dom.byId("btAnteriorFtpConnection"), "click", function () {
                    carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                });
                on(dom.byId("btProximoFtpConnection"), "click", function () {
                    // var param = {protocolo: "FTP"};

                    var user = dom.byId("txtUserFtp").value;
                    var pass = dom.byId("txtPasswordFtp").value;
                    var ftp = dom.byId("txtUrlFtp").value;
                    var port = dom.byId("txtUrlPort").value;
                    var url = "ftp/ls/" + user + "/" + pass + "/" + ftp + "/" + port

                    //var campos = [dom.byId("txtUserFtp"), dom.byId("txtPasswordFtp"), dom.byId("txtUrlFtp"), dom.byId("txtUrlPort")];
                    if ((user == "") || (pass = "") || (ftp == "") || (port == "")) {
                        dom.byId("txtUserFtp").focus();
                        dom.byId("txtPasswordFtp").focus();
                        dom.byId("txtUrlFtp").focus();
                        dom.byId("txtUrlPort").focus();
                        return;
                    }
                    //http://localhost:8080/smartcities/rest/ftp/ls/anonymous/me@me.com/ftp.kernel.org/21
                    var resultado = restServices.salvaObjeto(url);
                    //Armazena dados temporariamente 
                    //myProfile.ftpData = resultado;

                    resultado.then(function (dados) {
                        myProfile.ftpData = dados;
                        if (myProfile.ftpData.fail) {
                            contentPane_PopUp.set("href", "error/ftperror.hrml");
                            myDialog.set("title", "FTP CONNECTION ERROR");
                            myDialog.show();
                        } else {
                            var objContainer = contentPane_FerramentaDados;
                            objContainer.set("href", DATAIMPORT_FTP_SELECTION);
                        }
                    });
                });
            }
            function setEventsImportFtpSelect() {
                on(dom.byId("btAnteriorFtpSelection"), "click", function () {
                    var pagina = DATAIMPORT_FTP_CONNECTION;
                    if (parametrosTela && parametrosTela.protocolo == "Active Directory") {
                        pagina = DATAIMPORT_AD_CONNECTION;
                    }
                    carregaTelaFerramentaDados(pagina);
                });
                on(dom.byId("btFinalizarFtpSelection"), "click", function () {
                    // sem implementacao

                });
            }
            function setEventsImportADConnection() {
                on(dom.byId("btAnteriorADConnection"), "click", function () {
                    carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                });
                on(dom.byId("btProximoADConnection"), "click", function () {
                    saveActiveDirectory();
                    //TODO carrega tela se tudo acima estiver ok
                    // provavelemnte deve ser passado um parametro que identifica o objeto salvo,
                    // para que seja realizado o vinculo com as pendencias na tela seguinte
                    var param = {protocolo: "Active Directory"};
                    carregaTelaFerramentaDados(DATAIMPORT_FTP_SELECTION, param);
                });
            }
            function setEventsImportDBConnection() {
                on(dom.byId("btAnteriorImportDBConnect"), "click", function () {
                    carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                });
                on(dom.byId("btProximoImportDBConnect"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_DB_SELECTION);
                });
            }
            function setEventsImportDBSelection() {
                on(dom.byId("btAnteriorDBSelection"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_DB_CONNECTION);
                });
                on(dom.byId("btSalvarDBSelection"), "click", function () {
                    saveDatabaseSelection();
                });
            }


            function setEventsDataFileLocate() {
                on(dom.byId("btAnteriorFileLocate"), "click", function () {
                    carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                });
                on(dom.byId("btProximoFileLocate"), "click", function () {
                    var param = parametrosTela;
                    var pagina = "";
                    if (parametrosTela.tipoArquivo == "CSV") {
                        pagina = DATAIMPORT_CSV;
                        saveCSVFile(parametrosTela);
                    } else if (parametrosTela.tipoArquivo == "JSON") {
                        pagina = DATAIMPORT_JSON;
                    } else if (parametrosTela.tipoArquivo == "XLS") {
                        pagina = DATAIMPORT_CSV;
                    } else if (parametrosTela.tipoArquivo == "XML") {
                        pagina = DATAIMPORT_JSON;
                        saveXMLFile(parametrosTela);
                    } else if (parametrosTela.tipoArquivo == "WSDL") {
                        pagina = DATAIMPORT_WSDL;
                    } else if (parametrosTela.tipoArquivo == "KML") {
                        pagina = "";
                    }

                    carregaTelaFerramentaDados(pagina, param);
                });
                on(dom.byId("btUploadFileLocate"), "click", function () {
                    abrePopUpModal(UPLOAD, textos.tituloUpload, 400, 250);
                });
                on(dom.byId("btPendencyDirectory"), "click", function () {
                    abrePopUpModal(DATAIMPORT_PENDENCY_FILES);
                });
            }
            function setEventsImportCsv() {
                on(dom.byId("btAnteriorImportCsv"), "click", function () {
                    var param = parametrosTela;
                    carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                });
            }
            function setEventsImportLdapConn() {
                on(dom.byId("btAnteriorLdapConnect"), "click", function () {
                    carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                });
                on(dom.byId("btProximoLdapConnect"), "click", function () {
                    var param = {tipoArquivo: "LDAP"};
                    carregaTelaFerramentaDados(DATAIMPORT_JSON, param);
                });
            }
            function setEventsImportJson() {
                on(dom.byId("btAnteriorImportJson"), "click", function () {
                    if (parametrosTela && parametrosTela.tipoArquivo == "LDAP") {
                        carregaTelaFerramentaDados(DATAIMPORT_LDAP_CONNECTION);
                    } else {
                        var param = parametrosTela;
                        carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                    }
                });
                on(dom.byId("btFinalizarImportJson"), "click", function () {

                });
            }
            function setEventsImportKml() {
                on(dom.byId("btAnteriorImportKml"), "click", function () {
                    carregaTelaFerramentaDados(DATASOURCE_SPLASH);
                });
            }
            function setEventsImportWsdl() {
                on(dom.byId("btAnteriorImportWsdl"), "click", function () {
                    var param = parametrosTela;
                    carregaTelaFerramentaDados(DATAIMPORT_FILE_LOCATE, param);
                });
            }
            function setEventsPendencyFileSelect() {

            }

            function setEventsSplashDataSource() {
                /* TODO Remover? ou terá outra utilidade?
                 on(dom.byId("rotSplashImportData"), "click", function () {
                 carregaTelaFerramentaDados("choiceDataFormatImport.html")
                 });
                 on(dom.byId("rotSplashExportData"), "click", function () {
                 carregaTelaFerramentaDados("choiceDataFormatExport.html")
                 });
                 */
                on(dom.byId("rotSplashDataHistory"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_HISTORY)
                });
                on(dom.byId("rotSplashDrivers"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_DRIVER)
                });
                on(dom.byId("rotSplashShareData"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_SHARE)
                });
                on(dom.byId("rotSplashCopyData"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_COPY)
                });
                on(dom.byId("rotSplashDataTasks"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_TASK)
                });
                on(dom.byId("rotSplashTransformData"), "click", function () {
                    carregaTelaFerramentaDados(DATAIMPORT_TRANSFORM)
                });
            }
            function setEventsSplashProfile() {
                on(dom.byId("rotSplashPersonalInfo"), "click", function () {
                    carregaTelaPerfil(PROFILE_INFO);
                });
                on(dom.byId("rotSplashProfileAddress"), "click", function () {
                    carregaTelaPerfil(PROFILE_ADDRESS);
                });
                on(dom.byId("rotSplashProfileLanguage"), "click", function () {
                    carregaTelaPerfil(PROFILE_INFO);
                });
                on(dom.byId("rotSplashProfileSecurity"), "click", function () {
                    carregaTelaPerfil(PROFILE_SECURITY);
                });
                on(dom.byId("rotSplashProfileHistory"), "click", function () {
                    carregaTelaPerfil(PROFILE_HISTORY);
                });
            }
            function setEventsSplashMap() {
                on(dom.byId("rotSplashViewMap"), "click", function () {
                    makeGmap();
                });
                on(dom.byId("rotSplashSearchMap"), "click", function () {
                    abrePopUpModal(MAP_SEARCH);
                });
                on(dom.byId("rotSplashMapLayers"), "click", function () {
                    abrePopUpModal(MAP_CONFIG);
                    addMarkerToMap("TEXTO INFORMATIVO NONONONO", "INFO TITULO", "42", "-88");
                });
                on(dom.byId("rotSplashExportMap"), "click", function () {
                    // sem implementacao
                });
            }
            function setEventsSplashAlarms() {
                on(dom.byId("rotSplashRefreshAlarm"), "click", function () {
                    // sem implementacao
                });
                on(dom.byId("rotSplashSearchAlarm"), "click", function () {
                    // sem implementacao
                });
                on(dom.byId("rotSplashConfigAlarm"), "click", function () {
                    // sem implementacao
                });
            }
            function setEventsSplashBilling() {
                on(dom.byId("rotSplashCredit"), "click", function () {
                    carregaTelaFaturamento(BILLING_CREDITDEBT);
                });
                on(dom.byId("rotSplashDebit"), "click", function () {
                    carregaTelaFaturamento(BILLING_CREDITDEBT);
                });
                on(dom.byId("rotSplashTransactions"), "click", function () {
                    carregaTelaFaturamento(BILLING_TRANSACTIONS);
                });
            }
            function setEventsSplashCircles() {
                on(dom.byId("rotSplashImportContacts"), "click", function () {
                    abrePopUpModal(CIRCLES_IMPORTOPTIONS);
                });
                on(dom.byId("rotSplashNewContact"), "click", function () {
                    carregaTelaCirculos(CIRCLES_CONTACTS)
                });
                on(dom.byId("rotSplashCircles"), "click", function () {
                    carregaTelaCirculos(CIRCLES_MANAGE)
                });
            }

            // Eventos nas telas do módulo Círculos
            function setEventsCircleContacts() {
                on(dom.byId("btImportarContatos"), "click", function () {
                    abrePopUpModal(CIRCLES_IMPORTOPTIONS);
                });
            }

            // Eventos no módulo Loja
            function setEventsStoreCover() {

            }


            /**
             *	Funções para montar as árvores
             */

            function loadTreeFtpImport(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Teste", parent: "treeRoot"}, {id: 2, label: "item_modificado", parent: 1, leaf: true}, {id: 'pendencies', label: "Pendencias", parent: 'treeRoot'}];
                poolStore.treeFtpSelect = fillStoreTree(poolStore.treeFtpSelect, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.treeFtpSelect,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeFtpSelection"));
                tree.onDblClick = function () {
                    poolStore.treeFtpSelect.put({id: 3, label: 'adicionou aqui', parent: 'treeRoot', leaf: true});
                }
            }

            function loadTreeDBSelection(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Tabela1", parent: "treeRoot"}, {id: 2, label: "campo1", parent: 1, leaf: true}, {id: 3, label: "Tabela2", parent: 'treeRoot'}];
                poolStore.treeDBSelect = fillStoreTree(poolStore.treeDBSelect, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.treeDBSelect,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeDBSelection"));
                tree.onDblClick = function () {
                    poolStore.treeDBSelect.put({id: 4, label: 'campo2', parent: 1, leaf: true});
                }
            }

            function loadTreeDataSources(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "FTP", parent: "treeRoot"}, {id: 2, label: "ftp do senai", parent: 1, leaf: true}, {id: 3, label: "ftp da estacio", parent: 1, leaf: true}];
                poolStore.treeDataSource = fillStoreTree(poolStore.treeDataSource, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.treeDataSource,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeDataSources"));
                tree.onDblClick = function () {
                    poolStore.treeDataSource.put({id: 4, label: 'campo2', parent: 1, leaf: true});
                }
            }

            function loadTreePendencies(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Importacao 09/02", parent: "treeRoot"}, {id: 2, label: "CSV", parent: 1}, {id: 3, label: "Morettic.csv", parent: 2, leaf: true}];
                poolStore.treePendencies = fillStoreTree(poolStore.treePendencies, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.treePendencies,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreePendency"));
            }

            function loadTreeDataTransform(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Importacao 09/02", parent: "treeRoot"}, {id: 2, label: "CSV", parent: 1}, {id: 3, label: "Morettic.csv", parent: 2, leaf: true}];
                poolStore.dataSource.st1 = fillStoreTree(poolStore.dataSource.st1, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.dataSource.st1,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeDataTransform"));
            }

            function loadTreeJsonOrigin(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Importacao 09/02", parent: "treeRoot"}, {id: 2, label: "CSV", parent: 1}, {id: 3, label: "Morettic.csv", parent: 2, leaf: true}];
                poolStore.dataSource.st1 = fillStoreTree(poolStore.dataSource.st1, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.dataSource.st1,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeJsonOrigin"));
            }

            function loadTreeJsonDestiny(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Importacao 09/02", parent: "treeRoot"}, {id: 2, label: "CSV", parent: 1}, {id: 3, label: "Morettic.csv", parent: 2, leaf: true}];
                poolStore.dataSource.st2 = fillStoreTree(poolStore.dataSource.st2, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.dataSource.st2,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeJsonDestiny"));
            }

            function loadTreeWsdl(arrDados) {
                var arrDadosTeste = [{id: 'treeRoot', label: "Root"}, {id: 1, label: "Rest", parent: "treeRoot"}, {id: 2, label: "endpoint1", parent: 1, leaf: true}, {id: 3, label: "endpoint2", parent: 1, leaf: true}];
                poolStore.dataSource.st1 = fillStoreTree(poolStore.dataSource.st1, arrDadosTeste);
                // cria model
                var model = new StoreModel({
                    store: poolStore.dataSource.st1,
                    query: {id: 'treeRoot'},
                    labelAttr: 'label',
                    mayHaveChildren: function (item) {
                        return !item.leaf;
                    }
                });
                // cria tree apontando para um local reservado
                var tree = new Tree({
                    model: model,
                    showRoot: false,
                    dndController: dndSource
                }).placeAt(dom.byId("espacoTreeWsdl"));
            }

            function loadDataSourcesList() {
                // pega a lista de fontes de dados do objeto global do usuario

                // monta as tags optgroup e options
                // dentro de listaFontesDados
                var textoHtml = "<optgroup label='FTP'><option value='ufsc'>CCT - UFSC</option><optgroup><optgroup label='Banco de dados'><option value='ufsc'>postgres:5432/rockandroll</option><optgroup>";
                var objetoDOM = domConstruct.toDom(textoHtml);
                domConstruct.place(objetoDOM, "listaFontesDados");
            }

            function loadPendenciesList() {
                // pega a lista das pendencias do objeto global do usuario

                // monta as tags optgroup e options
                // dentro de listaPendencias
                var textoHtml = "<optgroup label='XML'><option value='nf'>nf000001.xml</option><optgroup>";
                var objetoDOM = domConstruct.toDom(textoHtml);
                domConstruct.place(objetoDOM, "listaPendencias");
            }

            function loadListaDBSelection() {
                var boxLista = new Source("listaTabelas", {
                    creator: function (item, hint) {
                        var objDom = domConstruct.toDom("<div>" + item.nome + "</div>");
                        return {node: objDom, data: item, type: ["tabela"]};
                    },
                    accept: ["tabela"]
                });
                widListaTabelasDBSelection = boxLista; // Guarda na global

                console.log("tipo da lista : " + boxLista.declaredClass);
                /*
                 *	Chamada da função que acessa o serviço que fornece os dados.
                 *	Esta deve retornar um array no padrão JSON com os seguintes dados: nome, type, campos.
                 *	Ex. [ { nome:'nome', type:'type', campos:['campo1','campo2'] } ]
                 */
                var dados;
                // dados = buscarTabelasDB();


                dados = [
                    {nome: 'Pessoa', type: 'tabela', campos: ["nome", "cpf", "endereco", "dataNasc"]},
                    {nome: 'Cidade', type: 'tabela', campos: ["idCidade", "nome", "estado"], fk: [{atributo: "estado", entidade: "Estado"}, {atributo: "nome", entidade: "Pessoa"}]},
                    // fk: [{chave_estrangeira,lookup_table},{...}] 
                    {nome: 'Estado', type: 'tabela', campos: ["idEstado", "nome", "uf", "pais"]},
                    {nome: 'Usuario', type: 'tabela', campos: ["nome", "senha", "permissoes", "tipo"]},
                    {nome: 'Permissao', type: 'tabela', campos: ["descricao", "operacao", "leitura", "escrita", "execucao"]}
                ];
                boxLista.insertNodes(false, dados);
                // Listeners do boxLista
                aspect.after(boxLista, "onMouseDown", function () {
                    dom.byId("targetDragDrop").style.display = '';
                });
                aspect.after(boxLista, "onMouseUp", function () {
                    dom.byId("targetDragDrop").style.display = 'none';
                });
                // TODO - apos cancelar: oculta o target
            }

            function loadDragDropDBSelection() {
                var alturaSuperficie = dom.byId("graphicsSurface").clientHeight;
                var larguraSuperficie = dom.byId("graphicsSurface").clientWidth;
                var superficieGfx = gfx.createSurface("graphicsSurface", larguraSuperficie - 1, alturaSuperficie - 2);
                superficieGfx.whenLoaded(function () {
                    //var linha = superficieGfx.createLine({x1:0,y1:0,x2:larguraSuperficie,y2:alturaSuperficie}).setStroke("black");
                });
                var boxDrop = new Target("targetDragDrop", {
                    accept: ["tabela"]
                });
                aspect.around(boxDrop, "onDndDrop", function (originalCall) {
                    return function () {
                        originalCall.apply(this, arguments);
                        var fonte = arguments[0];
                        var alvo = arguments[3];
                        if (fonte.node.id == "listaTabelas") {

                            for (var i in alvo.map) {
                                // move os dados para uma global
                                objetosDropadosDBSelection.push(alvo.map[i]);
                                /*
                                 * Criação da representação visual das tabelas do banco de dados
                                 */
                                var camposTabela = "";
                                var dados = alvo.map[i].data;
                                var nomeTabela = dados.nome;
                                // Transforma cada div em DOM, seta listener e inclui no DOM pai.

                                var objetoDOM = domConstruct.toDom(
                                        "<div id='dbi_tabela_" + nomeTabela + "' style='border:1px solid #777;min-width:100px;max-width:150px;width:100px;'>" +
                                        "	<div id='dbi_titulo_" + nomeTabela + "' class='titulo-tabela-dnd'>" + nomeTabela + "<span id='dbi_apagar_tabela_" + nomeTabela + "' class='icone-excluir-tabela-dnd' style='float:right'>X</span></div>" +
                                        "	<div id='dbi_campos_" + nomeTabela + "' style='background-color:white;padding:2px;cursor:default'></div>" +
                                        "</div>"
                                        );
                                domConstruct.place(objetoDOM, "containerDragDrop");
                                on(dom.byId("dbi_apagar_tabela_" + nomeTabela), "click", function () {
                                    eraseTableDnd(nomeTabela, superficieGfx)
                                });
                                // Prepara os campos para serem inseridos dentro das "tabelas"								
                                for (var i = 0; i < dados.campos.length; i++) {
                                    var nomeCampo = dados.campos[i];
                                    var campoTabela = domConstruct.toDom(
                                            "<div class='campo-tabela-dnd' style='width:100%;' id='" + nomeCampo + "_" + nomeTabela + "'>" +
                                            nomeCampo + "<span id='dbi_excluir_campo_" + nomeCampo + "_" + nomeTabela + "' class='icone-excluir-campo-dnd'>X</span></div>"
                                            );
                                    domConstruct.place(campoTabela, "dbi_campos_" + nomeTabela);
                                    on(dom.byId("dbi_excluir_campo_" + nomeCampo + "_" + nomeTabela), "click", function () {
                                        eraseTableFieldDnd(this)
                                    });
                                }

                                // Transforma em componente moveable e comunica o que fazer ao terminar de arrastá-lo
                                var quadroMovel = new move.parentConstrainedMoveable(objetoDOM, {area: 'padding', handle: "dbi_titulo" + nomeTabela, within: true});
                                /*
                                 *	Criação das linhas de relacionamento/cardinalidade
                                 */
                                // FK
                                // Se existem chaves estrangeiras no objeto
                                if (dados.fk != null && dados.fk != undefined) {
                                    // Para cada chave estrangeiras faça
                                    console.log("length fk: " + dados.fk.length);
                                    for (var i = 0; dados.fk.length > i; i++) {
                                        console.log("i: " + i);
                                        // Para cada objeto na lista de objetos dropados faça
                                        console.log("n objetos: " + objetosDropadosDBSelection.length);
                                        console.log("teste: " + objetosDropadosDBSelection[0]);
                                        for (var ii in objetosDropadosDBSelection[0]) {
                                            console.log(objetosDropadosDBSelection[0][ii]);
                                        }
                                        console.log("data: " + objetosDropadosDBSelection[0].data)
                                        for (var j = 0; objetosDropadosDBSelection.length > j; j++) {
                                            console.log("objeto dropado: " + objetosDropadosDBSelection[j].data.nome);
                                            console.log("fk: " + dados.fk[i].entidade)
                                            // Se existe a representacao da tabela na lista entao
                                            if (objetosDropadosDBSelection[j].data.nome == dados.fk[i].entidade) {
                                                console.log("encontrada tabela lookup");
                                                // cria linha na superficie de desenho (x1 e y1 referentes ao quadro atual)
                                                // (x2 e y2 referentes a tabela lookup)
                                                var x1 = quadroMovel.node.style.left;
                                                var y1 = quadroMovel.node.style.top;
                                                var domTabelaLookup = dom.byId("dbi_tabela_" + objetosDropadosDBSelection[j].data.nome);
                                                var x2 = domTabelaLookup.style.left;
                                                var y2 = domTabelaLookup.style.top;
                                                console.log("x1: " + x1 + " y1: " + y1 + " - x2: " + x2 + " y2: " + y2);
                                                var linha = superficieGfx.createLine({x1: x1, y1: y1, x2: x2, y2: y2}).setStroke("black");
                                                var strIdLinha = objetoDOM.id + ">" + domTabelaLookup.id;
                                                linhasDBSelection.push({id: strIdLinha, obj: linha});
                                                console.log("criou linha " + strIdLinha);
                                                break;
                                            }
                                        }
                                    }
                                }


                                // PK - verifica se alguma tabela da lista de objetos dropados faz referência à tabela atual
                                // Para cada objeto dropado faça
                                for (var i = 0; objetosDropadosDBSelection.length > i; i++) {
                                    var chavesEstrangeiras = objetosDropadosDBSelection[i].data.fk
                                    if (chavesEstrangeiras != null && chavesEstrangeiras != undefined) {
                                        for (var iFK = 0; chavesEstrangeiras.length > iFK; iFK++) {
                                            // Se nome da tabela na fk é igual ao nome da tabela atual entao											
                                            if (chavesEstrangeiras[iFK].entidade == nomeTabela) {
                                                // cria linha, onde x2 e y2 são da tabela atual												
                                                var domTabelaOrigem = dom.byId("dbi_tabela_" + objetosDropadosDBSelection[i].data.nome);
                                                var x1 = domTabelaOrigem.style.left;
                                                var y1 = domTabelaOrigem.style.top;
                                                var x2 = quadroMovel.node.style.left;
                                                var y2 = quadroMovel.node.style.top;
                                                var linha = superficieGfx.createLine({x1: x1, y1: y1, x2: x2, y2: y2}).setStroke("black");
                                                var strIdLinha = domTabelaOrigem.id + ">" + objetoDOM.id;
                                                linhasDBSelection.push({id: strIdLinha, obj: linha});
                                                console.log("linha criada: " + strIdLinha);
                                            }
                                        }
                                    }
                                }

                                /*
                                 *	Toda vez que um quadro/tabela é movido atualiza a posicao da linha
                                 */
                                aspect.after(quadroMovel, "onMoveStop", function (mover) {

                                    console.log("x:" + quadroMovel.node.style.left + " y:" + quadroMovel.node.style.top);
                                    var novoX = quadroMovel.node.style.left;
                                    var novoY = quadroMovel.node.style.top;
                                    //verifica em cada linha
                                    for (var iLinha in linhasDBSelection) {
                                        var strIdLinha = linhasDBSelection[iLinha].id;
                                        console.log("id linha: " + strIdLinha);
                                        var identificadores = strIdLinha.split(">");
                                        if (quadroMovel.node.id == identificadores[0]) {
                                            // altera x1 e y1											
                                            x2Atual = linhasDBSelection[iLinha].obj.shape.x2;
                                            y2Atual = linhasDBSelection[iLinha].obj.shape.y2;
                                            // cria nova linha e apaga a antiga
                                            superficieGfx.remove(linhasDBSelection[iLinha].obj);
                                            var novaLinha = superficieGfx.createLine({x1: novoX, y1: novoY, x2: x2Atual, y2: y2Atual}).setStroke("black");
                                            linhasDBSelection[iLinha].obj = novaLinha;
                                        } else if (quadroMovel.node.id == identificadores[1]) {
                                            // altera x2 e y2
                                            x1Atual = linhasDBSelection[iLinha].obj.shape.x1;
                                            y1Atual = linhasDBSelection[iLinha].obj.shape.y1;
                                            // cria nova linha e apaga a antiga
                                            superficieGfx.remove(linhasDBSelection[iLinha].obj);
                                            var novaLinha = superficieGfx.createLine({x1: x1Atual, y1: y1Atual, x2: novoX, y2: novoY}).setStroke("black");
                                            linhasDBSelection[iLinha].obj = novaLinha;
                                        }

                                    }

                                });
                                // apaga o objeto de dentro do alvo
                                alvo.map = [];
                                alvo.selectAll().deleteSelectedNodes();
                            }

                        }

                        // oculta o target ( nesse caso: 'targetDragDrop')
                        alvo.node.style.display = 'none';
                    }
                });
            }

            function eraseTableDnd(nomeTabela, superficieGfx) {
                // Apaga tabela, recupera objeto e inclui de volta na lista
                var tabela = dom.byId("dbi_tabela_" + nomeTabela);
                domConstruct.destroy(tabela);
                var tabelaRemovida = null;
                for (var i in objetosDropadosDBSelection) {
                    if (objetosDropadosDBSelection[i].data.nome == nomeTabela) {
                        tabelaRemovida = objetosDropadosDBSelection[i].data;
                        objetosDropadosDBSelection.splice(i, 1);
                        break;
                    }
                }

                // Adiciona tabela de volta na lista
                widListaTabelasDBSelection.insertNodes(false, [tabelaRemovida]);
                // Apagar linha de relacionamento se estiver vinculada com a tabela				
                for (var iLinha = linhasDBSelection.length - 1; iLinha >= 0; iLinha--) { // do ultimo para o primeiro
                    if (linhasDBSelection[iLinha].id.indexOf(nomeTabela) > -1) {
                        superficieGfx.remove(linhasDBSelection[iLinha].obj);
                        linhasDBSelection.splice(iLinha, 1); // remove objeto da lista						
                    }
                }

            }

            function eraseTableFieldDnd(objeto) {
                var divCampoTabela = dom.byId(objeto.id.replace(/dbi_excluir_campo_/g, ""));
                if (divCampoTabela.excluido && divCampoTabela.excluido == true) {
                    divCampoTabela.style.textDecoration = "none";
                    divCampoTabela.style.color = "inherit";
                    divCampoTabela.excluido = false;
                } else {
                    divCampoTabela.style.textDecoration = "line-through";
                    divCampoTabela.style.color = "gray";
                    divCampoTabela.excluido = true;
                }

            }


            function saveDatabaseSelection() {
                // examina todos os elementos filhos da div para pegar as tabelas
                // para cada tabela pegar seus campos ainda habilitados/ativos
                var container = dom.byId("containerDragDrop");
                var tabelas = container.childNodes;
                for (var iNode = 0; tabelas.length > iNode; iNode++) {
                    if (tabelas[iNode].id && tabelas[iNode].id != "targetDragDrop") {
                        console.log("tabela localizada : " + tabelas[iNode].id);
                        // se o div com o campo tiver o atributo 'excluido' e este for igual a true
                        // nao inclui no objeto
                    }
                }
            }

            function refreshPhoneMask(event, campo) {
                var key = event.keyCode || event.charCode;
                var caracter = String.fromCharCode(key);
                var caracteresValidos = "0123456789";
                var valorAtual = campo.value;
                // keys : 8 (backspace), 46 (delete), 37(left arrow), 39 (right arrow), 9 (tab), 48 - 57 ( num 0 a 9 )
                if (key != 8 && key != 46 && key != 37 && key != 39 && key != 9) {
                    event.preventDefault();
                    if (caracteresValidos.indexOf(caracter) > -1 && valorAtual.length < 15) {
                        var novoValor = valorAtual;
                        //remove os caracteres especiais ( ) - espaço
                        var regexEspaco = new RegExp(" ", "g");
                        novoValor = valorAtual.replace("\)", "").replace("\(", "").replace("\-", "").replace(regexEspaco, "");
                        // insere o novo caracter no final
                        novoValor += caracter;
                        // transforma valorAtual em array de caracteres
                        var arrTelefone = novoValor.split("");
                        arrTelefone.splice(0, 0, "(");
                        arrTelefone.splice(3, 0, ")");
                        arrTelefone.splice(4, 0, " ");
                        if (valorAtual.length < 14) {
                            arrTelefone.splice(9, 0, "-");
                        } else {
                            arrTelefone.splice(10, 0, "-");
                        }

                        valorAtual = arrTelefone.toString();
                        var regexVirgula = new RegExp(",", "g");
                        valorAtual = valorAtual.replace(regexVirgula, "");
                        campo.value = valorAtual;
                    }
                }

            }

            function refreshInternationalPhoneMask(event, campo) {
                var key = event.keyCode || event.charCode;
                var caracter = String.fromCharCode(key);
                var caracteresValidos = "0123456789";
                var valorAtual = campo.value;
                // keys : 8 (backspace), 46 (delete), 37(left arrow), 39 (right arrow), 9 (tab), 48 - 57 ( num 0 a 9 )
                if (key != 8 && key != 46 && key != 37 && key != 39 && key != 9) {
                    event.preventDefault();
                    if (caracteresValidos.indexOf(caracter) > -1 && valorAtual.length < 17) {
                        var novoValor = valorAtual;
                        //remove os caracteres especiais e espaços
                        var regexEspaco = new RegExp(" ", "g");
                        var regexMais = new RegExp("\\+", "g")
                        novoValor = valorAtual.replace(regexMais, "").replace(regexEspaco, "");
                        // insere o novo caracter no final
                        novoValor += caracter;
                        // transforma valorAtual em array de caracteres
                        var arrTelefone = novoValor.split("");
                        arrTelefone.splice(0, 0, "+");
                        arrTelefone.splice(3, 0, " ");
                        arrTelefone.splice(6, 0, " ");
                        valorAtual = arrTelefone.toString();
                        var regexVirgula = new RegExp(",", "g");
                        valorAtual = valorAtual.replace(regexVirgula, "");
                        campo.value = valorAtual;
                    }
                }

            }

            /* Realiza a busca do endereço, verifica resultados e exibe num box especial */
            function showFoundedAddresses(strAddress) {
                if (geocoder == null) {
                    try {
                        geocoder = startGeocoder();
                    } catch (ex) {
                        console.log("Nao startou Geocoder = " + geocoder + " . " + ex);
                        modalMessage("Ocorreu um erro ao tentar realizar a busca.", "Erro");
                        return false;
                    }
                }
                domConstruct.empty("boxResultsProfileAddress");
                var resultados;
                geocoder.geocode({'address': strAddress}, function (results, status) {

                    if (status == google.maps.GeocoderStatus.OK) {
                        resultados = results;
                    } else {
                        resultados = null;
                    }
                    resProfileGeocoder = resultados;
                    if (resultados != null) {

                        var enderecosValidos = 0;
                        for (var iRes = 0; iRes < resultados.length; iRes++) {
                            //console.log(">" + resultados[iRes].formatted_address);
                            //console.log("  tipo: " + resultados[iRes].geometry.location_type);
                            // se for ROOFTOP - o resultado é preciso
                            // se for RANGE_INTERPOLATED - é aceitavel, pois o numero pode nao estar cadastrado ainda no sistema
                            // GEOMETRIC_CENTER - "Verifique se o nome da rua e número foram informados." - não aceita como endereço
                            // APPROXIMATE - "O local informado é muito abrangente." - não aceita como endereço
                            var tipoLocal = resultados[iRes].geometry.location_type;
                            if (tipoLocal != "ROOFTOP" && tipoLocal != "RANGE_INTERPOLATED") {
                                continue;
                            }
                            enderecosValidos++;
                            // cria uma div para cada resultado
                            var boxEndereco = domConstruct.toDom(
                                    "<div id='resultAddress_" + iRes + "' class='item-listagem'>" + resultados[iRes].formatted_address +
                                    "</div>"
                                    );
                            domConstruct.place(boxEndereco, "boxResultsProfileAddress");
                        }

                        if (enderecosValidos == 0) {
                            var boxMensagem = domConstruct.toDom(
                                    "<div id='resultAddress_zero' class='item-listagem'>" + textos.enderecoAbrangente +
                                    "</div>"
                                    );
                            domConstruct.place(boxMensagem, "boxResultsProfileAddress");
                        }

                        domAttr.set("boxResultsProfileAddress", "class", "componente-visivel");
                    } else {
                        var boxMensagem = domConstruct.toDom(
                                "<div id='resultAddress_zero' class='item-listagem'>" + textos.enderecoNaoEncontrado +
                                "</div>"
                                );
                        domConstruct.place(boxMensagem, "boxResultsProfileAddress");
                        domAttr.set("boxResultsProfileAddress", "class", "componente-visivel");
                    }
                });
            }

            function manageKeyProfileAddressSearch(evento, campo) {
                var key = evento.keyCode || evento.charCode;
                if (key == 13) { // ENTER
                    showFoundedAddresses(campo.value);
                } else if (key == 27) { // ESC
                    campo.value = "";
                    domAttr.set("boxResultsProfileAddress", "class", "componente-invisivel");
                }
            }

            function selectProfileAddress(strId) {
                var idDesmontado = strId.split("_");
                var indice = idDesmontado[1];
                if (indice != "zero") {
                    var strAddress = resProfileGeocoder[indice].formatted_address;
                    var objLatLng = resProfileGeocoder[indice].geometry.location;
                    selectedAddress = {endereco_formatado: strAddress,
                        latlng: objLatLng};
                    dom.byId("txtEnderecoRua").value = strAddress;
                    updateAddressMarker(objLatLng);
                }
                domAttr.set("boxResultsProfileAddress", "class", "componente-invisivel");
            }

            function updateAddressMarker(objLatLng) {
                map.setZoom(17);
                map.panTo(objLatLng);
                if (profileAddressMarker == null) {
                    profileAddressMarker = new google.maps.Marker({
                        map: map,
                        position: objLatLng,
                        title: textos.seuEndereco
                    });
                } else {
                    profileAddressMarker.setPosition(objLatLng);
                }
            }

            function saveProfileInfo() {
                if (!registry.byId("btToggleEULA").get("checked")) {
                    modalMessage(textos.aceiteEula, textos.gAtencao);
                    return false;
                }

                var id = dom.byId("hdnIdProfile");
                var name = registry.byId("txtNameProfile");
                var email = registry.byId("txtEmailProfile");
                var birthDate = registry.byId("txtBirthdateProfile");
                var cpfCnpj = registry.byId("txtCpfCnpjProfile");
                var password = registry.byId("txtPasswordProfile");
                var confirmPass = registry.byId("txtConfirmPassProfile");
                var bio = registry.byId("txtBioProfile");
                var telephone = registry.byId("txtTelefoneProfileInfo");
                var avatar = dom.byId("userAvatarInput");
                var lang = dom.byId("selectedFlagProfileInfo");
                var bio = dom.byId("txtBioProfile");
                var camposValidar = [name, email, birthDate, cpfCnpj, password, confirmPass, telephone];
                if (areFieldsValids(camposValidar)) {
                    var strId = id.value;
                    if (strId == undefined || strId == null || strId == "") {
                        strId = "-1";
                    }
                    // Put date into the format dd-mm-aaaa
                    var objBirthDate = new Date(birthDate.value);
                    var birthDay = objBirthDate.getDate().toString();
                    birthDay = (birthDay.length == 1) ? "0" + birthDay : birthDay;
                    var birthYear = objBirthDate.getFullYear().toString();
                    var birthMonth = (objBirthDate.getMonth() + 1).toString();
                    birthMonth = (birthMonth.length == 1) ? "0" + birthMonth : birthMonth;
                    var strBirthDate = birthMonth + "-" + birthDay + "-" + birthYear;
                    var vAvatar = "blank";
                    if (myProfile.uploadBean != undefined) {
                        vAvatar = myProfile.uploadBean.name;
                        dom.byId("userAvatarImage").src = myProfile.uploadBean.myUrl;
                    }

                    var url = "profiles/bio/" + name.value + "/" + email.value + "/" + strBirthDate + "/" + encodeURIComponent(cpfCnpj.value) + "/" + password.value + "/" + escape(telephone.value) + "/" + lang.value + "/" + bio.value + "/" + encodeURIComponent(vAvatar);
                    var resultado = restServices.salvaObjeto(url);
                    resultado.then(function (dados) {
                        if (typeof dados == "string") {
                            modalMessage(dados, "Erro");
                        } else if (dados instanceof Object) {
                            contentPane_PopUp.set("href", "info/profileInfo.html");
                            myDialog.set("title", "Sucess");
                            myDialog.set("width", "240px");
                            myDialog.set("height", "80px");
                            myDialog.resize();
                            myDialog.show();
                        }
                    });
                } else {
                    modalMessage(textos.gVerifiqueDados, textos.gAtencao);
                }
            }



            function loadUserCTX() {
                // Implementação anterior
                // restServices.loadCtx();
                //
                var resultado = restServices.loadCtx();
                return resultado.then(function (dados) {
                    if (typeof dados == "string") {
                        modalMessage(dados, "Erro");
                        return false;
                    } else if (dados instanceof Object) {
                        myProfile = eval(dados);
                        return true;
                    }
                })
            }

            function saveProfileAddress() {
                if (selectedAddress != null) {
                    var address = selectedAddress.endereco_formatado;
                    var latLng = selectedAddress.latlng;
                    var complement = dom.byId("txtEnderecoComplemento").value;
                    restServices.salvaProfileAddress(latLng, address, complement);
                    /* TODO: 
                     var url = "profile/p2/" + latLng +"/"+ address +"/"+ complement;
                     
                     var resultado = restServices.salvaObjeto(url);
                     resultado.then( function(texto){
                     alert(texto);
                     });*/

                } else {
                    modalMessage(textos.informeEndereco, textos.gAtencao);
                }
            }

            function saveProfileSecurity() {
                var email = registry.byId("txtSegurancaEmail");
                var telephone = registry.byId("txtSegurancaTelefone");
                var celphone = registry.byId("txtSegurancaCelular");
                var passphrase = registry.byId("txtSegurancaFrase");
                console.log(telephone + " - " + email + " - " + celphone + " - " + passphrase);
                var campos = [email, telephone, celphone, passphrase];
                if (areFieldsValids(campos)) {
                    var url = "profiles/security/" + email.value + "/" + escape(telephone.value) + "/" + escape(celphone.value) + "/" + encodeURIComponent(passphrase.value);
                    console.log("chama url " + url);
                    var resultado = restServices.salvaObjeto(url);
                    resultado.then(function (dados) {
                        contentPane_PopUp.set("href", "info/profileInfo.html");
                        myDialog.set("title", "Sucess");
                        myDialog.set("width", "240px");
                        myDialog.set("height", "80px");
                        myDialog.resize();
                        myDialog.show();
                    });
                } else {
                    modalMessage(textos.gVerifiqueDados, textos.gAtencao);
                }
            }


            function saveActiveDirectory() {
                var ip = dom.byId("txtIpActiveDirectory").value;
                var user = dom.byId("txtUserActiveDirectory").value;
                var password = dom.byId("txtPasswordActiverDir").value;
                var url = "importer/ac/" + ip + "/" + user + "/" + password;
                console.log("chama url " + url);
                //TODO colocar a chamada  no modulo restServices.js

                xhr(url, {handleAs: "json", preventCache: true, method: "POST"})
                        .then(function (data) {
                            console.log("requisicao ok: " + data);
                            modalMessage(textos.gSalvoSucesso, "Active Directory");
                        }, function (err) {
                            modalMessage(textos.gNaoSalvou + " " + textos.gCausa + ": " + err, textos.gErro);
                        });
            }

            function saveKML() {
                var kmlUrl = "";
                var kmlDescricao = "";
                var url = "importer/kml/" + kmlUrl + "/" + kmlDescricao;
                var resultado = restServices.salvaObjeto(url);
                resultado.then(function (dados) {
                    if (dados instanceof String) {
                        modalMessage(dados, textos.gErro);
                    } else if (dados instanceof Object) {
                        // Retorna { id: 1, kmlUrl: "www.com", kmlDesc: "nononono", idProfile: 1 }
                        modalMessage(textos.gSalvoSucesso, "KML");
                    }
                });
            }

            function saveFTP() {
                var usuario = "";
                var senha = "";
                var endereco = "";
                var porta = "";
                var url = "importer/ftp/ls/" + usuario + "/" + senha + "/" + endereco + "/" + porta;
                var resultado = restServices.salvaObjeto(url);
                resultado.then(function (dados) {
                    if (dados instanceof String) {
                        modalMessage(dados, textos.gErro);
                    } else if (dados instanceof Object) {
                        // Retorna { nodeName: "/", fullPath: null, type: "DIR", lFiles: [ { nodeName: "pub", ...} , size: 0 }
                        modalMessage(textos.gSalvoSucesso, "FTP");
                    }
                });
            }

            function saveXMLFile(parametrosTela) {

                var urlCSV = myProfile.uploadBean.name;
                var fName1 = dom.byId("txtSourceNameLocate").value;
                // TODO usar URLENCODE utf-8 para não perder os caracteres
                var description = dom.byId("txtDescriptionFile").value;
                //var http = ""; //"/file/{source}/{name}/{tp}/{description}"
                var url = "importer/file/" + escape(urlCSV) + "/" + fName1 + "/XML/" + escape(description);
                var resultado = restServices.salvaObjeto(url);
                resultado.then(function (dados) {
                    //alert(dados);
                    if (dados instanceof String) {
                        //modalMessage(dados, textos.gErro);
                    } else if (dados instanceof Object) {
                        //load window on Contentpane
                        carregaTelaFerramentaDados(DATAIMPORT_XML, parametrosTela, function () {

                            //Message to confirm
                            contentPane_PopUp.set("href", "info/dataImport.html");
                            myDialog.set("title", "Sucess");
                            myDialog.show();
                            //Set myProfile csv data on memory
                            myProfile.xml = dados;
                            select = document.getElementById('listCsvColumns');
                            //Somente o header
                            if (myProfile.xml.metadata.length > 0) {
                                //Pega o header

                                //Populates main combobox
                                for (i = 0; i < myProfile.xml.metadata.length; i++) {
                                    var opt = document.createElement('option');
                                    opt.value = myProfile.xml.metadata[i];
                                    opt.innerHTML = myProfile.xml.metadata[i];
                                    select.appendChild(opt);
                                }
                                //Atribui eventos apenas se tiver itens para rodar
                                on(dom.byId("btCsvIncludeCol"), "click", function () {
                                    listbox_moveacross("listCsvColumns", "listCsvSelectedCols");
                                });
                                on(dom.byId("btCsvRemoveCol"), "click", function () {
                                    listbox_moveacross("listCsvSelectedCols", "listCsvColumns");
                                });
                                on(dom.byId("btProximoImportCsv"), "click", function () {
                                    var elements = getALLSelectValues("listCsvSelectedCols");
                                    var a1 = "";
                                    for (i = 0; i < elements.length; i++) {
                                        a1 += elements[i];
                                        a1 += ",";
                                    }

                                    var url = "importer/xml_update/" + a1;
                                    var resultado = restServices.salvaObjeto(url);
                                    resultado.then(function (dados) {
                                        //alert(dados);
                                        if (dados instanceof String) {
                                            //modalMessage(dados, textos.gErro);
                                        } else if (dados instanceof Object) {
                                            //Message to confirm
                                            contentPane_PopUp.set("href", "info/dataImport.html");
                                            myDialog.set("title", "Sucess");
                                            myDialog.show();
                                            //Disable everything
                                            document.getElementById('listCsvColumns').setAttribute("disabled", true);
                                            document.getElementById("btCsvIncludeCol").setAttribute("disabled", true);
                                            document.getElementById("btCsvRemoveCol").setAttribute("disabled", true);
                                            document.getElementById("btProximoImportCsv").setAttribute("disabled", true);
                                            document.getElementById("listCsvSelectedCols").setAttribute("disabled", true);
                                            document.getElementById("btAnteriorFileLocate").setAttribute("disabled", true);
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }

            function saveCSVFile(parametrosTela) {

                var urlCSV = myProfile.uploadBean.name;
                var fName1 = dom.byId("txtSourceNameLocate").value;
                // TODO usar URLENCODE utf-8 para não perder os caracteres
                var description = dom.byId("txtDescriptionFile").value;
                //var http = ""; //"/file/{source}/{name}/{tp}/{description}"
                var url = "importer/file/" + escape(urlCSV) + "/" + fName1 + "/CSV/" + escape(description);
                var resultado = restServices.salvaObjeto(url);
                resultado.then(function (dados) {
                    //alert(dados);
                    if (dados instanceof String) {
                        //modalMessage(dados, textos.gErro);
                    } else if (dados instanceof Object) {
                        //load window on Contentpane
                        carregaTelaFerramentaDados(DATAIMPORT_CSV, parametrosTela, function () {

                            //Message to confirm
                            contentPane_PopUp.set("href", "info/dataImport.html");
                            myDialog.set("title", "Sucess");
                            myDialog.show();
                            //Set myProfile csv data on memory
                            myProfile.csv = dados;
                            select = document.getElementById('listCsvColumns');
                            //Somente o header
                            if (myProfile.csv.length > 0) {
                                //Pega o header
                                var csvHeader = myProfile.csv[0];
                                //Populates main combobox
                                for (i = 0; i < csvHeader.length; i++) {
                                    var opt = document.createElement('option');
                                    opt.value = i;
                                    opt.innerHTML = csvHeader[i];
                                    select.appendChild(opt);
                                }
                                //Atribui eventos apenas se tiver itens para rodar
                                on(dom.byId("btCsvIncludeCol"), "click", function () {
                                    listbox_moveacross("listCsvColumns", "listCsvSelectedCols");
                                });
                                on(dom.byId("btCsvRemoveCol"), "click", function () {
                                    listbox_moveacross("listCsvSelectedCols", "listCsvColumns");
                                });
                                on(dom.byId("btProximoImportCsv"), "click", function () {
                                    var elements = getALLSelectValues("listCsvSelectedCols");
                                    var a1 = "";
                                    for (i = 0; i < elements.length; i++) {
                                        a1 += elements[i];
                                        a1 += ",";
                                    }

                                    var url = "importer/csv_update/" + a1;
                                    var resultado = restServices.salvaObjeto(url);
                                    resultado.then(function (dados) {
                                        //alert(dados);
                                        if (dados instanceof String) {
                                            //modalMessage(dados, textos.gErro);
                                        } else if (dados instanceof Object) {
                                            //Message to confirm
                                            contentPane_PopUp.set("href", "info/dataImport.html");
                                            myDialog.set("title", "Sucess");
                                            myDialog.show();
                                            //Disable everything
                                            document.getElementById('listCsvColumns').setAttribute("disabled", true);
                                            document.getElementById("btCsvIncludeCol").setAttribute("disabled", true);
                                            document.getElementById("btCsvRemoveCol").setAttribute("disabled", true);
                                            document.getElementById("btProximoImportCsv").setAttribute("disabled", true);
                                            document.getElementById("listCsvSelectedCols").setAttribute("disabled", true);
                                            document.getElementById("btAnteriorFileLocate").setAttribute("disabled", true);
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }

            /*    function saveCSV() {
             // TODO no urlCSV replace em / por ø
             var urlCSV = "";
             // TODO usar URLENCODE utf-8 para não perder os caracteres
             var description = "";
             var http = "";
             var url = "importer/csv/" + urlCSV + "/" + description + "/" + http;
             
             var resultado = restServices.salvaObjeto(url);
             resultado.then(function (dados) {
             if (dados instanceof String) {
             modalMessage(dados, textos.gErro);
             } else if (dados instanceof Object) {
             modalMessage(textos.gSalvoSucesso, "CSV");
             }
             });
             }*/

            //exemplo de chamada
            // loadGenericData( "url", "POST", function handleData( data ){
            //  do something with data
            // });

            function loadGenericData(url, submitType, handler) {
                var result = restServices.loadObject(url, submitType);
                result.then(function (data) {
                    if (data instanceof String) {
                        modalMessage(data, textos.gErro); // Show the error
                    } else if (data instanceof Object) {
                        handler(data);
                    }
                });
            }

            function loadProfileData(idProfile) {
                var url = "profiles/ctx";
                var resultado = restServices.loadObject(url, "GET");
                resultado.then(function (dados) {
                    if (dados instanceof String) {
                        modalMessage(dados, textos.gErro); // Exibe o erro
                    } else if (dados instanceof Object) {
                        // Retorna { idprofile: 1, idProfileOrganization: null, nmUser: "Lam Mxrettx",
                        // email: "malacma@gmail.com", password: "8ddef0f4588c24e8d08307977c2d826b",
                        // cpfCnpj: null, online: null, bio: null, nascimento: null, telefone: null,
                        // securityInfo: [ ], profileLang: [ ] }
                        // Faz algo
                    }
                });
            }

            /**
             *  Verifica se os widgets possuem 'erro' ou estão 'incompletos'
             *  @param fields - É um array de dijit/form/ValidationTextBox
             */
            function areFieldsValids(fields) {
                for (var iCampos in fields) {
                    dom.byId(fields[iCampos].id).focus();
                }
                dom.byId(fields[0].id).focus();
                var isValid = true;
                for (var iCampos in fields) {
                    if (fields[iCampos].get("state") == "Error" || fields[iCampos].get("state") == "Incomplete") {
                        isValid = false;
                        break;
                    }
                }
                return isValid;
            }

            function selectProfileLocale(tag) {
                var locale = tag.id.replace("userLocale", "");
                dom.byId("selectedFlagProfileInfo").value = locale;
                // Deixa todas as bandeiras com a aparencia padrão
                // e destaca a bandeira selecionada
                var flagNodes = query(".icone-bandeira-ativa");
                for (var iNode = 0; iNode < flagNodes.length; iNode++) {
                    domClass.remove(flagNodes[iNode], "icone-bandeira-ativa");
                }
                domClass.add(tag, "icone-bandeira-ativa");
            }


            function campo_numerico() {
                if (event.keyCode < 45 || event.keyCode > 57)
                    event.returnValue = false;
            }

            /*function cnpj_cpf verifica qual das funcoes tem que chamar cpf ou cnpj
             
             function cnpj_cpf(campo, documento, f, formi) {
             form = formi;
             
             for (Count = 0; Count < 2; Count++) {
             
             if (form.rad[Count].checked)
             break;
             }
             
             
             if (Count == 0) {
             mascara_cpf(campo, documento, f);
             }
             
             else {
             mascara_cnpj(campo, documento, f);
             }
             }
             
             function mascara_cnpj(campo, documento, f) {
             var mydata = '';
             mydata = mydata + documento;
             
             if (mydata.length == 2) {
             mydata = mydata + '.';
             
             ct_campo = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo;
             }
             
             if (mydata.length == 6) {
             mydata = mydata + '.';
             
             ct_campo = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo;
             }
             
             if (mydata.length == 10) {
             mydata = mydata + '/';
             
             ct_campo1 = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo1;
             }
             
             if (mydata.length == 15) {
             mydata = mydata + '-';
             
             ct_campo1 = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo1;
             }
             
             if (mydata.length == 18) {
             
             valida_cnpj(f, campo);
             }
             }
             
             function mascara_cpf(campo, documento, f) {
             var mydata = '';
             mydata = mydata + documento;
             
             if (mydata.length == 3) {
             mydata = mydata + '.';
             
             ct_campo = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo;
             }
             
             if (mydata.length == 7) {
             mydata = mydata + '.';
             
             ct_campo = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo;
             }
             
             if (mydata.length == 11) {
             mydata = mydata + '-';
             
             ct_campo1 = eval("document." + f + "." + campo + ".value = mydata");
             ct_campo1;
             }
             
             if (mydata.length == 14) {
             
             valida_cpf(f, campo);
             }
             
             }
             */

            function validateCpfCnpj(domObj) {
                var valorCampo = domObj.value;
                var regexPonto = new RegExp("\\.", "g");
                var regexHifen = new RegExp("\-", "g");
                valorCampo = valorCampo.replace("\/", "").replace(regexPonto, "").replace(regexHifen, "");
                var result = true;
                if (valorCampo.length == 11) {
                    result = validaCpf(valorCampo);
                } else if (valorCampo.length == 14) {
                    result = validaCnpj(valorCampo);
                } else if (valorCampo.length > 8 || valorCampo.length < 8) { // O passaporte brasileiro tem 8 dígitos alfanumericos
                    result = false;
                }
                return result;
            }

            function validaCnpj(strNumero) {
                //Autor/fonte: Leandro Alexandre
                //Adaptação por: Maurício J Gomes

                var i;
                var result = true;
                s = strNumero;
                c = s.substr(0, 12);
                var dv = s.substr(12, 2);
                var d1 = 0;
                for (i = 0; i < 12; i++) {
                    d1 += c.charAt(11 - i) * (2 + (i % 8));
                }

                if (d1 == 0) {
                    result = false;
                }
                d1 = 11 - (d1 % 11);
                if (d1 > 9)
                    d1 = 0;
                if (dv.charAt(0) != d1) {
                    result = false;
                }

                d1 *= 2;
                for (i = 0; i < 12; i++) {
                    d1 += c.charAt(11 - i) * (2 + ((i + 1) % 8));
                }

                d1 = 11 - (d1 % 11);
                if (d1 > 9)
                    d1 = 0;
                if (dv.charAt(1) != d1) {
                    result = false;
                }

                return result;
            }

            function validaCpf(strNumero) {
                //Autor/fonte: Leandro Alexandre
                //Adaptação por: Maurício J Gomes

                var i;
                var result = true;
                console.log("strNumero " + strNumero);
                s = strNumero;
                c = s.substr(0, 9);
                var dv = s.substr(9, 2);
                var d1 = 0;
                for (i = 0; i < 9; i++) {
                    d1 += c.charAt(i) * (10 - i);
                }

                if (d1 == 0) {
                    result = false;
                }

                d1 = 11 - (d1 % 11);
                if (d1 > 9)
                    d1 = 0;
                if (dv.charAt(0) != d1) {
                    result = false;
                }

                d1 *= 2;
                for (i = 0; i < 9; i++) {
                    d1 += c.charAt(i) * (11 - i);
                }

                d1 = 11 - (d1 % 11);
                if (d1 > 9)
                    d1 = 0;
                if (dv.charAt(1) != d1) {
                    result = false;
                }

                return result;
            }

            function refreshIdentificationMask(event, campo) {
                var key = event.keyCode || event.charCode;
                var caracter = String.fromCharCode(key);
                //var caracteresValidos = "0123456789";
                var exprAlfanumerico = '^[a-zA-Z0-9]+$';
                var valorAtual = campo.value;
                // keys : 8 (backspace), 46 (delete), 37(left arrow), 39 (right arrow), 9 (tab), 48 - 57 ( num 0 a 9 )
                if (key != 8 && key != 46 && key != 37 && key != 39 && key != 9) {
                    event.preventDefault();
                    if (valorAtual.length < 17 && caracter.match(exprAlfanumerico)) {
                        var novoValor = valorAtual;
                        //remove os caracteres especiais . / - espaço
                        var regexEspaco = new RegExp(" ", "g");
                        var regexPonto = new RegExp("\\.", "g");
                        novoValor = valorAtual.replace("\/", "").replace(regexPonto, "").replace("\-", "").replace(regexEspaco, "");
                        // insere o novo caracter no final
                        novoValor += caracter;
                        // transforma valorAtual em array de caracteres
                        var arrIdent = novoValor.split("");
                        if (arrIdent.length > 8 && arrIdent.length <= 11) { // Até 8 caracteres é número de passaporte
                            arrIdent.splice(3, 0, ".");
                            arrIdent.splice(7, 0, ".");
                            arrIdent.splice(11, 0, "-");
                        } else if (arrIdent.length > 11 && arrIdent.length <= 13) {
                            // 00.000.000/0000-1
                            arrIdent.splice(2, 0, ".");
                            arrIdent.splice(6, 0, ".");
                            arrIdent.splice(10, 0, "/");
                            arrIdent.splice(15, 0, "-");
                        }

                        valorAtual = arrIdent.toString();
                        var regexVirgula = new RegExp(",", "g");
                        valorAtual = valorAtual.replace(regexVirgula, "");
                        campo.value = valorAtual;
                    }
                }
            }


            function limitTextArea(field, numCharacters, event) {
                var keyCode = event.keyCode;
                // keys : 8 (backspace), 9 (tab), 13 (enter), 35(end), 36(home), 37(left arrow), 38(up arrow), 39 (right arrow), 40 (down arrow), 46 (delete)
                console.log("keyCode: " + event.keyCode);
                console.log("charCode:" + event.charCode);
                console.log("num caract: " + field.value.length);
                if (keyCode != 8 && keyCode != 9 && (keyCode < 35 || keyCode > 40) && keyCode != 46) {
                    console.log("entrou")
                    if (field.value.length >= numCharacters) {
                        event.preventDefault();
                    }
                }
            }
            /*
             *	Fim da declaração das funções
             */
        }
);
