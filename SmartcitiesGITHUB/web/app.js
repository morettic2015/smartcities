/**************************************
 *		Controle da visão / telas
 *************************************/

/**
 *	Globais
 */

var map;			// MAPA DO GOOGLE
var storePais;
var objetosDropadosDBSelection = [];	// Array de dados das tabelas escolhidas pelo usuario na importacao de BD
var linhasDBSelection = []				// Array das linhas (relacionamentos) entre tabelas na importacao de BD
var widListaTabelasDBSelection = null;	// Guarda referencia do objeto Source na importacao de DB


require([
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
	"dojo/dom-attr",
	"dojo/dom-construct",
    "dojo/parser",
    "dojo/_base/xhr",
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
	"dojox/gfx"
],
        function (
                ready,
                on,
                dom,
				domAttr,
				domConstruct,
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
				gfx
                ) {

            ready(function () {

				/**
				 *	Configuração do pós-carregamento das páginas em cada ContentPane
				 */
				contentPane_Perfil.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});

				contentPane_FerramentaDados.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});

				contentPane_Mapa.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});

				contentPane_Alarmes.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});

				contentPane_Faturamento.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});

				contentPane_Circulos.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});

				contentPane_PopUp.set("onDownloadEnd", function(){
					configuraTela( this.get("href") );
				});


				/**
				 *	Carrega as telas de splash
				 */
				carregaTelaPerfil( "perfilSplash.html" );
				carregaTelaFerramentaDados( "fonteDadosSplash.html" );
				carregaTelaMapa( "mapSplash.html" );
				carregaTelaAlarmes( "alarmesSplash.html" );
				carregaTelaFaturamento( "faturamentoSplash.html" );
				carregaTelaCirculos( "circulosSplash.html" );


                /**
                 *	Atribuindo Eventos
                 */

				 // Cabeçalho / Header
				on(dom.byId("btConfigHeader"), "click", function () {
                    abrePopUpModal("configuration.html");
                });

                // Modulo Perfil
                on(dom.byId("btProfileInfo"), "click", function () {
                    carregaTelaPerfil("profileInfo.html");
                });
                on(dom.byId("btProfileAddress"), "click", function () {
                    carregaTelaPerfil("profileAddress.html")
                });
                on(dom.byId("btProfileLanguage"), "click", function () {
                    carregaTelaPerfil("profileLanguage.html")
                });
                on(dom.byId("btProfileSecurity"), "click", function () {
                    carregaTelaPerfil("profileSecurity.html")
                });
                on(dom.byId("btProfileHistory"), "click", function () {
                    carregaTelaPerfil("profileHistory.html")
                });

                // Modulo Ferramenta de dados
				on(dom.byId("mnuImportDataAD"), "click", function () {
                    carregaTelaFerramentaDados("importADConnection.html")
                });
				on(dom.byId("mnuImportDataDB"), "click", function () {
                    carregaTelaFerramentaDados("databaseImport.html")
                });
				on(dom.byId("mnuImportDataFtp"), "click", function () {
                    carregaTelaFerramentaDados("importFtpConection.html")
                });
				on(dom.byId("mnuImportDataLdap"), "click", function () {
                    carregaTelaFerramentaDados("importLdapConnection.html")
                });
				on(dom.byId("itemCsvImport"), "click", function () {
                    var param = { tipoArquivo: "CSV" };
					carregaTelaFerramentaDados("dataFileLocate.html", param );
                });
				on(dom.byId("itemHtmlImport"), "click", function () {
                    var param = { tipoArquivo: "HTML" };
					carregaTelaFerramentaDados("dataFileLocate.html", param );
                });
				on(dom.byId("itemJsonImport"), "click", function () {
                    var param = { tipoArquivo: "JSON" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                });
				on(dom.byId("itemKmlImport"), "click", function () {
                    var param = { tipo: "KML" };
					carregaTelaFerramentaDados("importKml.html", param );
                });
				on(dom.byId("itemPdfImport"), "click", function () {
                    var param = { tipoArquivo: "PDF" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                });
				on(dom.byId("itemRssImport"), "click", function () {
                    var param = { tipo: "RSS" };
					carregaTelaFerramentaDados("importKml.html", param );
                });
				on(dom.byId("itemWsdlImport"), "click", function () {
                    var param = { tipoArquivo: "WSDL" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                });
				on(dom.byId("itemXlsImport"), "click", function () {
                    var param = { tipoArquivo: "XLS" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                });
				on(dom.byId("itemXmlImport"), "click", function () {
                    var param = { tipoArquivo: "XML" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                });                
                on(dom.byId("btCopiarDados"), "click", function () {
                    carregaTelaFerramentaDados("copyData.html")
                });
				on(dom.byId("btTransformarDados"), "click", function () {
                    carregaTelaFerramentaDados("transform.html")
                });
				on(dom.byId("btHistoricoDados"), "click", function () {
                    carregaTelaFerramentaDados("historyData.html")
                });
                on(dom.byId("btDriversDados"), "click", function () {
                    carregaTelaFerramentaDados("dataDriver.html")
                });
                on(dom.byId("btCompartilharDados"), "click", function () {
                    carregaTelaFerramentaDados("shareData.html")
                });                
                on(dom.byId("btTarefaDados"), "click", function () {
                    carregaTelaFerramentaDados("task.html")
                });
                

				//Módulo Mapa
                on(dom.byId("btMapaSearch"), "click", function () {
                    abrePopUpModal("mapSearch.html");
                });
                on(dom.byId("btMapaLayers"), "click", function () {
                    abrePopUpModal("mapConfig.html");
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
                    carregaTelaFaturamento("billingTransactions.html")
                });
				on(dom.byId("btCreditoDebito"), "click", function () {
                    carregaTelaFaturamento("billingCreditDebt.html")
                });

				// Aba/Módulo Círculos
				on(dom.byId("btContatos"), "click", function () {
                    carregaTelaCirculos("circleContacts.html");
                });
				on(dom.byId("btCirculos"), "click", function () {
                    carregaTelaCirculos("circles.html");
                });


                /*
					Delegação de evento para conteudo carregado dinamicamente
				 */

				// Módulo Ferramenta de Dados

                query("#conteudo_ferr_dados").on("#btTestarConexaoDados:click", function (evt) {
                    event.stop(evt);
                });
				/*
                query("#conteudo_ferr_dados").on("#iconeDatabaseImportacao:click", function (evt) {
                    carregaTelaFerramentaDados("databaseImport.html");
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeKmlImportacao:click", function (evt) {
                    var param = { tipo: "KML" };
					carregaTelaFerramentaDados("importKml.html", param );
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeRssImportacao:click", function(evt){
					var param = { tipo: "RSS" };
					carregaTelaFerramentaDados("importKml.html", param );
					event.stop( evt );
				});
				query("#conteudo_ferr_dados").on("#iconeCsvImportacao:click", function (evt) {
                    var param = { tipoArquivo: "CSV" };
					carregaTelaFerramentaDados("dataFileLocate.html", param );
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeXlsImportacao:click", function (evt) {
					var param = { tipoArquivo: "XLS" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeJsonImportacao:click", function (evt) {
					var param = { tipoArquivo: "JSON" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeXmlImportacao:click", function (evt) {
					var param = { tipoArquivo: "XML" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeFtpImportacao:click", function (evt) {
                    carregaTelaFerramentaDados("importFtpConection.html");
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeActiveDirectoryImport:click", function(evt){
					carregaTelaFerramentaDados("importADConnection.html");
					event.stop( evt );
				});
				query("#conteudo_ferr_dados").on("#iconeHtmlImportacao:click", function(evt){
					var param = { tipoArquivo: "HTML" };
					carregaTelaFerramentaDados("dataFileLocate.html", param );
					event.stop( evt );
				});
				query("#conteudo_ferr_dados").on("#iconeLdapImportacao:click", function(evt){
					carregaTelaFerramentaDados("importLdapConnection.html" );
					event.stop( evt );
				});
				query("#conteudo_ferr_dados").on("#iconePdfImportacao:click", function (evt) {
					var param = { tipoArquivo: "PDF" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeWsdlImportacao:click", function (evt) {
					var param = { tipoArquivo: "WSDL" };
                    carregaTelaFerramentaDados("dataFileLocate.html", param );
                    event.stop(evt);
                });
				*/


				// Aba/Módulo Faturamento
				query("#conteudo_faturamento").on("#btCCCredito:click", function (evt) {
                    abrePopUpModal("formCartao.html");
                    event.stop(evt);
                });
				query("#conteudo_faturamento").on("#btPaypalCredito:click", function (evt) {
                    abrePopUpModal("formPaypal.html");
                    event.stop(evt);
                });
				query("#conteudo_faturamento").on("#btPagseguroCredito:click", function (evt) {
                    abrePopUpModal("formPagseguro.html");
                    event.stop(evt);
                });
				query("#conteudo_faturamento").on("#btBancoCredito:click", function (evt) {
                    abrePopUpModal("formBanco.html");
                    event.stop(evt);
                });

				// Modulo Circulos
				on( dom.byId("conteudo_circulos"), "#btImportarContatos:click", function () {
                    //abreImportarContato();
					alert(" importar contato");
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

				// Cabeçalho / Header
				dom.byId("headerNomeUsuario").innerHTML = textos.nomeUsuarioGenerico;

				// Main
				dom.byId("rotuloAbaPerfil").innerHTML = textos.rotAbaPerfil;
				dom.byId("rotuloAbaDados").innerHTML = textos.rotAbaDados;
				dom.byId("rotuloAbaMapa").innerHTML = textos.rotAbaMapa;
				dom.byId("rotuloAbaAlarmes").innerHTML = textos.rotAbaAlarmes;
				dom.byId("rotuloAbaFaturamento").innerHTML = textos.rotAbaFaturamento;
				dom.byId("rotuloAbaCirculos").innerHTML = textos.rotAbaCirculos;
				dom.byId("rotBtProfileInfo").innerHTML = textos.rotDadosPessoais;
				dom.byId("rotBtProfileAddress").innerHTML = textos.rotEndereco;
				dom.byId("rotBtProfileLanguage").innerHTML = textos.rotIdioma;
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

				/**
				 *	Carregamento das trees de 'Fonte de Dados'
				 */
				loadTreeDataSources();
				loadTreePendencies();

            });



			/*
             * Inicio da Declaracao das funções
             */

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
                var legendaMap = document.getElementById('mapLegend');//recupera div da legenda
                //
                //  var searchMap = document.getElementById('mapSearch');//recupera div da legenda
                //legendaMap.style.visibility="visible"; //Seta o layer pra ser visiveel
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendaMap);//Anexa no mapaBOTTOM_CENTER
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


            /**
			 *	Funções para carregar telas dinâmicas
			 */

            function carregaTelaPerfil( paginaConteudo, parametros ) {
                parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_Perfil;
				objContainer.set("href", paginaConteudo);
            }

			function carregaTelaFerramentaDados( paginaConteudo, parametros ) {
				parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_FerramentaDados;
				objContainer.set("href", paginaConteudo);
			}

			function carregaTelaMapa( paginaConteudo, parametros ){
				parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_Mapa;
				objContainer.set("href", paginaConteudo);
			}

			function carregaTelaAlarmes( paginaConteudo, parametros ){
				parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_Alarmes;
				objContainer.set("href", paginaConteudo);
			}

            function carregaTelaFaturamento( paginaConteudo, parametros ) {
                parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_Faturamento;
				objContainer.set("href", paginaConteudo);
			}

            function carregaTelaCirculos( paginaConteudo, parametros ) {
                parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_Circulos;
				objContainer.set("href", paginaConteudo);
            }

            /**
             * Função para abrir o modal. Basta passar o nome do html / pagina para carregar o conteudo
             * @argument {paginaConteudo} paginaConteudo pagina html a ser carregada no modal
             * */
            function abrePopUpModal( paginaConteudo, parametros ) {
				parametrosTela = parametros;	// Setando variável global
				var objContainer = contentPane_PopUp;
				objContainer.set("href", paginaConteudo);
                exibeModal();
            }

			function exibeModal(){
                myDialog.show();
            }


			function configuraTela( pagina ){
				console.log("Carregou " + pagina);
				if( pagina == "fonteDadosSplash.html"){
					i18nSplashDataSource();
					setEventsSplashDataSource();
				}else if( pagina == "perfilSplash.html" ){
					i18nSplashProfile();
					setEventsSplashProfile();
				}else if( pagina == "mapSplash.html" ){
					i18nSplashMap();
					setEventsSplashMap();
				}else if( pagina == "alarmesSplash.html" ){
					i18nSplashAlarms();
					setEventsSplashAlarms();
				}else if( pagina == "faturamentoSplash.html" ){
					i18nSplashBilling();
					setEventsSplashBilling();
				}else if( pagina == "circulosSplash.html" ){
					i18nSplashCircles();
					setEventsSplashCircles();
				}else if( pagina == "profileInfo.html" ){
					i18nProfileInfo();
				}else if( pagina == "profileAddress.html"){
					i18nProfileAdress();
				}else if( pagina == "profileLanguage.html"){
					i18nProfileLanguage();
				}else if( pagina == "profileSecurity.html"){
					i18nProfileSecurity();
				}else if( pagina == "profileHistory.html"){
					i18nProfileHistory();
					refreshGridProfileHistory();
				}else if( pagina == "choiceDataFormatImport.html"){
					i18nDataImport();
				}else if( pagina == "choiceDataFormatExport.html"){
					i18nDataExport();
				}else if( pagina == "copyData.html"){
					i18nCopyData();
				}else if( pagina == "transform.html"){
					i18nDataTransform();
					loadTreeDataTransform();
					refreshGridDataTransform();
				}else if( pagina == "shareData.html"){
					i18nDataShare();
					refreshGridDataShare();
				}else if( pagina == "dataDriver.html"){
					i18nDataDriver();
					refreshGridDataDriver();
				}else if( pagina == "task.html"){
					i18nDataTask();
					refreshGridTasks();
				}else if( pagina == "historyData.html"){
					i18nDataHistory();
					refreshGridDataHistory();
				}else if( pagina == "billingTransactions.html"){
					i18nBillingTransactions();
				}else if( pagina == "billingCreditDebt.html"){
					i18nBillingCredit();
				}else if( pagina == "circleContacts.html"){
					i18nContactCircle();
					setEventsCircleContacts();
					refreshGridCircleContacts();
				}else if( pagina == "circles.html"){
					i18nCircles();
					refreshGridCircles();
				}else if( pagina == "mapConfig.html" ){
					i18nMapConfig();
				}else if( pagina == "configuration.html" ){
					i18nGeneralConfig();
				}else if( pagina == "databaseImport.html" ){
					i18nImportBancoDados();
					setEventsImportDBConnection();
				}else if( pagina == "importDatabaseSelection.html" ){
					setEventsImportDBSelection();
					i18nImportDatabaseSelection();
					//loadTreeDBSelection();
					// a arvore foi substituida por uma lista em vista da imcompatibilidade do dijit/tree/dndSource com o dojo/dnd/source
					loadListaDBSelection();
					loadDragDropDBSelection();
					objetosDropadosDBSelection = [];
					linhasDBSelection = [];
				}else if( pagina == "importKml.html"){
					i18nImportKml();
					setEventsImportKml();
				}else if( pagina == "formPaypal.html" ){
					i18nFormPaypal();
				}else if( pagina == "formPagseguro.html" ){
					i18nFormPagseguro();
				}else if( pagina == "formBanco.html" ){
					i18nFormBanco();
				}else if( pagina == "formCartao.html" ){
					i18nFormCartao();
				}else if( pagina == "importFtpConection.html" ){
					setEventsImportFtpConn();
					i18nImportFtpConnection();
				}else if( pagina == "importFtpSelection.html" ){
					setEventsImportFtpSelect();
					i18nImportFtpSelect();
					dom.byId("tipoArquivoImportFtpSelection").innerHTML = parametrosTela.protocolo;
					refreshFileListFTPImport();	// preenchimento do grid
					loadTreeFtpImport();		// preenchimento da tree
				}else if( pagina == "importADConnection.html" ){
					i18nImportADConnection();
					setEventsImportADConnection();
				}else if( pagina == "dataFileLocate.html" ){
					dom.byId("tipoArquivoDataFileLocate").innerHTML = parametrosTela.tipoArquivo;
					dom.byId("hdnTipoArquivo").value = parametrosTela.tipoArquivo;
					setEventsDataFileLocate();
					i18nDataFileLocate();
				}else if( pagina == "importCsv.html" ){
					dom.byId("tipoArquivoCSV_XLS").innerHTML = parametrosTela.tipoArquivo;
					setEventsImportCsv();
					i18nImportCsv();
				}else if( pagina == "importLdapConnection.html" ){
					setEventsImportLdapConn();
					i18nImportLdapConnection();
				}else if( pagina == "importJson.html" ){
					dom.byId("tipoArquivoJson_Xml").innerHTML = parametrosTela.tipoArquivo;
					setEventsImportJson();
					i18nImportJson();
					loadTreeJsonOrigin();
					loadTreeJsonDestiny();
				}else if( pagina == "importWsdl.html" ){
					setEventsImportWsdl();
					i18nImportWsdl();
					loadTreeWsdl();
					refreshGridWsdl();
				}else if( pagina == "pendencyFileSelect.html" ){
					setEventsPendencyFileSelect();
					i18nPendencyFileSelect();
					refreshGridPendencyFileSelect();
				}

			}

			function setEventsPendencyFileSelect(){

			}

			function i18nPendencyFileSelect(){

			}


			/**
			 *	Atribuição de textos e internacionalização das telas
			 */
			{ // Profile
				function i18nProfileInfo(){
					dom.byId("rotBtSalvarProfileInfo").innerHTML = textos.rotSalvar;
					dom.byId("titleProfileInfo").innerHTML = textos.tituloDadosPessoais;
					dom.byId("nameProfileInfo").innerHTML = textos.rotNomePerfil;
					dom.byId("emailProfileInfo").innerHTML = textos.rotEmailPerfil;
					dom.byId("birthProfileInfo").innerHTML = textos.rotDataNascPerfil;
					dom.byId("passwordProfileInfo").innerHTML = textos.rotSenhaPerfil;
					dom.byId("confirmPassProfileInfo").innerHTML = textos.rotConfirmaSenhaPerfil;
					dom.byId("bioProfileInfo").innerHTML = textos.rotBioPerfil;
					dom.byId("acceptEulaProfileInfo").innerHTML = textos.btAceitoTermosPerfil;
					dom.byId("phoneProfileInfo").innerHTML = textos.rotTelefonePerfil;
					dom.byId("areaCodeProfileInfo").innerHTML = textos.rotCodigoAreaPerfil;
					dom.byId("avatarProfileInfo").innerHTML = textos.rotAvatarPerfil;
				}

				function i18nProfileAdress(){
					dom.byId("rotBtSalvarProfileAddress").innerHTML = textos.rotSalvar;
					dom.byId("tituloProfileAddress").innerHTML = textos.tituloEnderecoPerfil;
					dom.byId("ruaProfileAddress").innerHTML = textos.rotRuaPerfil;
					dom.byId("complProfileAddress").innerHTML = textos.rotComplementoPerfil;
					dom.byId("cepProfileAddress").innerHTML = textos.rotCepPerfil;
					dom.byId("bairroProfileAddress").innerHTML = textos.rotBairroPerfil;
					dom.byId("paisProfileAddress").innerHTML = textos.rotPaisPerfil;
					//dom.byId("cmbCountryProfileAddress").innerHTML = textos.selecionePais;
					dom.byId("estadoProfileAddress").innerHTML = textos.rotEstadoPerfil;
					//dom.byId("cmdStateAddress").innerHTML = textos.selecioneEstado;
					dom.byId("cidadeProfileAddress").innerHTML = textos.rotCidadePerfil;
					//dom.byId("cmdCityAddress").innerHTML = textos.selecioneCidade;

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
				function i18nProfileLanguage(){
					dom.byId("rotBtSalvarProfileLanguage").innerHTML = textos.rotSalvar;
					dom.byId("tituloProfileLanguage").innerHTML = textos.tituloIdiomaPerfil
					dom.byId("idiomaProfileLanguage").innerHTML = textos.rotIdiomaPerfil;
					dom.byId("varianteProfileLanguage").innerHTML = textos.rotVarianteIdiomaPerfil;
					dom.byId("outrosProfileLanguage").innerHTML = textos.rotOutrosPerfil;
				}
				function i18nProfileSecurity(){
					dom.byId("rotBtSalvarProfileSecurity").innerHTML = textos.rotSalvar;
					dom.byId("tituloProfileSecurity").innerHTML = textos.tituloSegurancaPerfil
					dom.byId("emailProfileSecurity").innerHTML = textos.rotEmailRecuperaPerfil;
					dom.byId("telefoneProfileSecurity").innerHTML = textos.rotTelefonePerfil;
					dom.byId("celularProfileSecurity").innerHTML = textos.rotCelularPerfil;
					dom.byId("fraseProfileSecurity").innerHTML = textos.rotFraseSecretaPerfil;
				}
				function i18nProfileHistory(){
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
				function i18nDataImport(){
					dom.byId("tituloImportacaoDados").innerHTML = textos.tituloImportarDados;
					dom.byId("p1ImportacaoDados").innerHTML = textos.p1ImportacaoDados;
				}
				function i18nDataExport(){
					dom.byId("tituloExportacaoDados").innerHTML = textos.tituloExportarDados;
					dom.byId("p1ExportacaoDados").innerHTML = textos.p1ExportacaoDados;
				}
				function i18nCopyData(){
					dom.byId("rotBtCopiarCopyData").innerHTML = textos.rotCopiar;
					dom.byId("tituloCopyData").innerHTML = textos.tituloCopiarDados;
					dom.byId("p1CopyData").innerHTML = textos.p1CopiarDados;
					dom.byId("rotNomeCopyData").innerHTML = textos.rotNomeDestinoDados;
					dom.byId("rotChkDadosCopyData").innerHTML = textos.rotCopiarDados;
					dom.byId("rotChkCompartCopyData").innerHTML = textos.rotCopiarCompartDados;
				}
				function i18nDataTransform(){
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
				function i18nDataShare(){
					console.log("1");
					dom.byId("tituloShareData").innerHTML = textos.tituloCompartilharDados;
					console.log("2");
					dom.byId("p1ShareData").innerHTML = textos.p1CompartilharDados;
					console.log("3");
					dom.byId("rotNomeShareData").innerHTML = textos.gNome;
					console.log("4");
					dom.byId("rotEnviarShareData").innerHTML = textos.rotEnviarParaDados;
					console.log("5");
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
					console.log("12");
					dom.byId("rotGridInfoShareData").innerHTML = textos.gInfo;
				}
				function i18nDataDriver(){
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
				function i18nDataTask(){
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
				function i18nDataHistory(){
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
				function i18nImportBancoDados(){
					dom.byId("rotBtAnteriorImportDB").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoImportDB").innerHTML = textos.gProximo;
					dom.byId("rotBtSalvarImportDB").innerHTML = textos.rotSalvar;
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
				function i18nImportDatabaseSelection(){
					dom.byId("rotBtAnteriorDatabaseSelection").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoDatabaseSelection").innerHTML = textos.gProximo;
					dom.byId("tituloImportDBSelection").innerHTML = textos.tituloImportDBSelection;
					dom.byId("p1ImportDBSelection").innerHTML = textos.p1ImportDBSelection;
				}
				function i18nImportKml(){
					console.log("import kml i18n");
					dom.byId("rotBtAnteriorImportKml").innerHTML = textos.gAnterior;
					dom.byId("rotBtSalvarImportKml").innerHTML = textos.rotSalvar;
					dom.byId("tituloImportKml").innerHTML = textos.rotImportar;
					dom.byId("rotLinkImportKml").innerHTML = textos.gLink;
					dom.byId("rotDescricaoImportKml").innerHTML = textos.gDescricao;
				}
				function i18nImportADConnection(){
					dom.byId("tituloImportADConnection").innerHTML = textos.rotImportar;
					dom.byId("rotBtAnteriorADConnection").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoADConnection").innerHTML = textos.gProximo;
					dom.byId("p1ImportADConnection").innerHTML = textos.p1ImportADConnection;
					dom.byId("rotIPImportADConnection").innerHTML = textos.rotIP;
					dom.byId("rotUsuarioImportADConnection").innerHTML = textos.gUsuario;
					dom.byId("rotSenhaImportADConnection").innerHTML = textos.gSenha;
					dom.byId("rotBtTestarImportADConn").innerHTML = textos.gTestar;
				}
				function i18nImportFtpConnection(){
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
				function i18nImportFtpSelect(){
					dom.byId("rotBtAnteriorFtpSelect").innerHTML = textos.gAnterior;
					dom.byId("rotBtFinalizarFtpSelect").innerHTML = textos.gFinalizar;
					dom.byId("tituloImportFtpSelection").innerHTML = textos.rotImportar;
					dom.byId("p1ImportFtpSelection").innerHTML = textos.p1ImportFtpSelection;
				}
				function i18nDataFileLocate(){
					dom.byId("rotBtAnteriorFileLocate").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoFileLocate").innerHTML = textos.gProximo;
					dom.byId("tituloDataFileLocate").innerHTML = textos.rotImportar;
					dom.byId("rotArquivoFileLocate").innerHTML = textos.localArquivo;
					dom.byId("rotNomeFonteFileLocate").innerHTML = textos.nomeFonteDados;
					dom.byId("rotDescricaoFileLocate").innerHTML = textos.gDescricao;
				}
				function i18nImportCsv(){
					dom.byId("rotBtAnteriorImportCsv").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoImportCsv").innerHTML = textos.gFinalizar;
					dom.byId("tituloImportCSV").innerHTML = textos.rotImportar;
					dom.byId("p1ImportCsv").innerHTML = textos.p1ImportCsv;
				}
				function i18nImportLdapConnection(){
					dom.byId("rotBtAnteriorLdapConnect").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoLdapConnect").innerHTML = textos.gProximo;
					dom.byId("tituloImportLdap").innerHTML = textos.importarLdap;
					dom.byId("rotUrlImportLdap").innerHTML = textos.gUrl;
					dom.byId("rotPortaImportLdap").innerHTML = textos.gPorta;
					dom.byId("rotPesquisaImportLdap").innerHTML = textos.pesquisaLdap;
					dom.byId("rotUsuarioImportLdap").innerHTML = textos.gUsuario;
					dom.byId("rotSenhaImportLdap").innerHTML = textos.gSenha;
				}
				function i18nImportJson(){
					dom.byId("rotBtAnteriorImportJson").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoImportJson").innerHTML = textos.gFinalizar;
					dom.byId("tituloImportJson").innerHTML = textos.rotImportar;
					dom.byId("p1ImportJson").innerHTML = textos.p1ImportJson;
				}
				function i18nImportWsdl(){
					dom.byId("rotBtAnteriorImportWsdl").innerHTML = textos.gAnterior;
					dom.byId("rotBtProximoImportWsdl").innerHTML = textos.gProximo;
					dom.byId("rotBtSalvarImportWsdl").innerHTML = textos.rotSalvar;
					dom.byId("tituloImportImportWsdl").innerHTML = textos.tituloImportImportWsdl;
					dom.byId("p1ImportWsdl").innerHTML = textos.p1ImportWsdl;
					dom.byId("rotFiltroImportWsdl").innerHTML = textos.filtroWsdl;
				}

			}

			{ // Billing
				function i18nBillingTransactions(){
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
				function i18nBillingCredit(){
					dom.byId("tituloBillingCreditDebit").innerHTML = textos.tituloCreditoDebito;
					dom.byId("p1BillingCreditDebit").innerHTML = textos.p1CreditoDebito;
					dom.byId("colGridNomeBillingCredit").innerHTML = textos.gNome;
					dom.byId("colGridContaBillingCredit").innerHTML = textos.gConta;
					dom.byId("colGridAgenciaBillingCredit").innerHTML = textos.gAgencia;
					dom.byId("colGridBancoBillingCredit").innerHTML = textos.gBanco;
				}
			}

			{ // Circles
				function i18nContactCircle(){
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
				function i18nCircles(){
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

			function i18nMapConfig(){
				dom.byId("tituloModal").innerHTML = textos.tituloMapConfig;
				dom.byId("rotBtFiltrarMapConfig").innerHTML = textos.rotFiltrar;
				dom.byId("rotBtSalvarMapConfig").innerHTML = textos.rotSalvar;
			}
			function i18nGeneralConfig(){
				dom.byId("tituloModal").innerHTML = textos.gConfiguracao;
				dom.byId("tituloConfiguracao").innerHTML = textos.gConfiguracao;
				dom.byId("rotConfigRegion").innerHTML = textos.gRegiao;

			}


			/*
			 *	Internacionalização das telas de Splash
			 */
			function i18nSplashDataSource(){
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
			function i18nSplashProfile(){
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
			function i18nSplashMap(){
				dom.byId("rotSplashViewMap").innerHTML = textos.gVisualizar;
				dom.byId("pSplashViewMap").innerHTML = textos.descVisualizarMapa;
				dom.byId("rotSplashSearchMap").innerHTML = textos.rotFiltrar;
				dom.byId("pSplashSearchMap").innerHTML = textos.descFiltrarMapa;
				dom.byId("rotSplashMapLayers").innerHTML = textos.gCamadas;
				dom.byId("pSplashMapLayers").innerHTML = textos.descCamadasMapa;
				dom.byId("rotSplashExportMap").innerHTML = textos.rotExportar;
				dom.byId("pSplashExportMap").innerHTML = textos.descExportarMapa;
			}
			function i18nSplashAlarms(){
				dom.byId("rotSplashRefreshAlarm").innerHTML = textos.rotAtualizar;
				dom.byId("pSplashRefreshAlarm").innerHTML = textos.descAtualizarAlarme;
				dom.byId("rotSplashSearchAlarm").innerHTML = textos.rotFiltrar;
				dom.byId("pSplashSearchAlarm").innerHTML = textos.descFiltrarAlarme;
				dom.byId("rotSplashConfigAlarm").innerHTML = textos.rotConfigurar;
				dom.byId("pSplashConfigAlarm").innerHTML = textos.descConfigurarAlarme;
			}
			function i18nSplashBilling(){
				dom.byId("rotSplashCredit").innerHTML = textos.gCredito;
				dom.byId("pSplashCredit").innerHTML = textos.descCreditoFaturamento;
				dom.byId("rotSplashDebit").innerHTML = textos.gDebito;
				dom.byId("pSplashDebit").innerHTML = textos.descDebitoFaturamento;
				dom.byId("rotSplashTransactions").innerHTML = textos.rotTransacoes;
				dom.byId("pSplashTransactions").innerHTML = textos.descTransacoesFaturamento;
			}
			function i18nSplashCircles(){
				dom.byId("rotSplashImportContacts").innerHTML = textos.rotImportarContatos;
				dom.byId("pSplashImportContacts").innerHTML = textos.descImportarContatosCirculos;
				dom.byId("rotSplashNewContact").innerHTML = textos.rotNovoContato;
				dom.byId("pSplashNewContact").innerHTML = textos.descNovoContatoCirculos;
				dom.byId("rotSplashCircles").innerHTML = textos.rotCirculos;
				dom.byId("pSplashCircles").innerHTML = textos.descCirculos;
			}

			function i18nFormPaypal(){
				dom.byId("tituloPaypal").innerHTML = textos.paypal;
				dom.byId("p1Paypal").innerHTML = textos.p1Paypal;
				dom.byId("rotBtSalvarPaypal").innerHTML = textos.rotSalvar;
			}
			function i18nFormPagseguro(){
				dom.byId("tituloPagseguro").innerHTML = textos.pagSeguro;
				dom.byId("p1Pagseguro").innerHTML = textos.p1Pagseguro;
				dom.byId("rotBtSalvarPagseguro").innerHTML = textos.rotSalvar;
			}
			function i18nFormBanco(){
				dom.byId("tituloFormBanco").innerHTML = textos.gContaBancaria;
				dom.byId("p1FormBanco").innerHTML = textos.p1FormBanco;
				dom.byId("rotBtNovaFormBanco").innerHTML = textos.btNovaConta;
				dom.byId("rotBtSalvarFormBanco").innerHTML = textos.rotSalvar;
				dom.byId("rotBtExcluirFormBanco").innerHTML = textos.rotExcluir;
			}
			function i18nFormCartao(){
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

			// Eventos nas telas do módulo Fonte de Dados
			function setEventsImportFtpConn(){
				on( dom.byId("btAnteriorFtpConnection"), "click", function(){
					carregaTelaFerramentaDados( "choiceDataFormatImport.html" );
				});
				on( dom.byId("btProximoFtpConnection"), "click", function(){
					var param = { protocolo: "FTP" };
					carregaTelaFerramentaDados( "importFtpSelection.html", param );
				});
			}
			function setEventsImportFtpSelect(){
				on( dom.byId("btAnteriorFtpSelection"), "click", function(){
					var pagina = "importFtpConection.html";
					if( parametrosTela && parametrosTela.protocolo == "Active Directory" ){
						pagina = "importADConnection.html";
					}
					carregaTelaFerramentaDados( pagina );
				});
				on( dom.byId("btFinalizarFtpSelection"), "click", function(){
					// sem implementacao

				});
			}
			function setEventsImportADConnection(){
				on( dom.byId("btAnteriorADConnection"), "click", function(){
					carregaTelaFerramentaDados( "choiceDataFormatImport.html" );
				});
				on( dom.byId("btProximoADConnection"), "click", function(){
					var param = { protocolo: "Active Directory" };
					carregaTelaFerramentaDados( "importFtpSelection.html", param );
				});
			}
			function setEventsImportDBConnection(){
				on( dom.byId("btAnteriorImportDBConnect"), "click", function(){
					carregaTelaFerramentaDados( "choiceDataFormatImport.html" );
				});
				on( dom.byId("btProximoImportDBConnect"), "click", function(){
					carregaTelaFerramentaDados( "importDatabaseSelection.html" );
				});
			}
			function setEventsImportDBSelection(){
				on( dom.byId("btAnteriorDBSelection"), "click", function(){
					carregaTelaFerramentaDados( "databaseImport.html" );
				});
				on( dom.byId("btProximoDBSelection"), "click", function(){
					//carregaTelaFerramentaDados( ".html" );
				});
			}

			function setEventsDataFileLocate(){
				on( dom.byId("btAnteriorFileLocate"), "click", function(){
					carregaTelaFerramentaDados( "choiceDataFormatImport.html" );
				});
				on( dom.byId("btProximoFileLocate"), "click", function(){
					var pagina = "";
					if( parametrosTela.tipoArquivo == "CSV" ){
						pagina = "importCsv.html";
					}else if( parametrosTela.tipoArquivo == "HTML" ){
						pagina = "";
					}else if( parametrosTela.tipoArquivo == "JSON" ){
						pagina = "importJson.html";
					}else if( parametrosTela.tipoArquivo == "PDF" ){
						pagina = "";
					}else if( parametrosTela.tipoArquivo == "XLS" ){
						pagina = "importCsv.html";
					}else if( parametrosTela.tipoArquivo == "XML" ){
						pagina = "importJson.html";
					}else if( parametrosTela.tipoArquivo == "WSDL" ){
						pagina = "importWsdl.html";
					}
					var param = parametrosTela;
					carregaTelaFerramentaDados( pagina, param );
				});
				on( dom.byId("btUploadFileLocate"), "click", function(){
					// sem implementacao
				});
				on( dom.byId("btPendencyDirectory"), "click", function(){
					abrePopUpModal( "pendencyFileSelect.html" );
				});
			}
			function setEventsImportCsv(){
				on( dom.byId("btAnteriorImportCsv"), "click", function(){
					var param = parametrosTela;
					carregaTelaFerramentaDados( "dataFileLocate.html", param );
				});
			}
			function setEventsImportLdapConn(){
				on( dom.byId("btAnteriorLdapConnect"), "click", function(){
					carregaTelaFerramentaDados("choiceDataFormatImport.html");
				});
				on( dom.byId("btProximoLdapConnect"), "click", function(){
					var param = { tipoArquivo: "LDAP" };
					carregaTelaFerramentaDados("importJson.html", param );
				});
			}
			function setEventsImportJson(){
				on( dom.byId("btAnteriorImportJson"), "click", function(){
					if( parametrosTela && parametrosTela.tipoArquivo == "LDAP"){
						carregaTelaFerramentaDados("importLdapConnection.html");
					}else{
						var param = parametrosTela;
						carregaTelaFerramentaDados("dataFileLocate.html", param );
					}
				});
				on( dom.byId("btFinalizarImportJson"), "click", function(){

				});
			}
			function setEventsImportKml(){
				on( dom.byId("btAnteriorImportKml"), "click", function(){
					carregaTelaFerramentaDados("fonteDadosSplash.html");
				});
			}
			function setEventsImportWsdl(){
				on( dom.byId("btAnteriorImportWsdl"), "click", function(){
					var param = parametrosTela;
					carregaTelaFerramentaDados("dataFileLocate.html", param );
				});
			}

			function setEventsSplashDataSource(){
				/* TODO Remover? ou terá outra funcao?
				on(dom.byId("rotSplashImportData"), "click", function () {
                    carregaTelaFerramentaDados("choiceDataFormatImport.html")
                });
				on(dom.byId("rotSplashExportData"), "click", function () {
                    carregaTelaFerramentaDados("choiceDataFormatExport.html")
                });
				*/
                on(dom.byId("rotSplashDataHistory"), "click", function () {
                    carregaTelaFerramentaDados("historyData.html")
                });
                on(dom.byId("rotSplashDrivers"), "click", function () {
                    carregaTelaFerramentaDados("dataDriver.html")
                });
                on(dom.byId("rotSplashShareData"), "click", function () {
                    carregaTelaFerramentaDados("shareData.html")
                });
                on(dom.byId("rotSplashCopyData"), "click", function () {
                    carregaTelaFerramentaDados("copyData.html")
                });
                on(dom.byId("rotSplashDataTasks"), "click", function () {
                    carregaTelaFerramentaDados("task.html")
                });
                on(dom.byId("rotSplashTransformData"), "click", function () {
                    carregaTelaFerramentaDados("transform.html")
                });
			}
			function setEventsSplashProfile(){
				on( dom.byId("rotSplashPersonalInfo"), "click", function(){
					carregaTelaPerfil("profileInfo.html");
				});
				on( dom.byId("rotSplashProfileAddress"), "click", function(){
					carregaTelaPerfil("profileAddress.html");
				});
				on( dom.byId("rotSplashProfileLanguage"), "click", function(){
					carregaTelaPerfil("profileLanguage.html");
				});
				on( dom.byId("rotSplashProfileSecurity"), "click", function(){
					carregaTelaPerfil("profileSecurity.html");
				});
				on( dom.byId("rotSplashProfileHistory"), "click", function(){
					carregaTelaPerfil("profileHistory.html");
				});
			}
			function setEventsSplashMap(){
				on( dom.byId("rotSplashViewMap"), "click", function(){
					makeGmap();
				});
				on( dom.byId("rotSplashSearchMap"), "click", function(){
					abrePopUpModal("mapSearch.html");
				});
				on( dom.byId("rotSplashMapLayers"), "click", function(){
					abrePopUpModal("mapConfig.html");
                    addMarkerToMap("TEXTO INFORMATIVO NONONONO", "INFO TITULO", "42", "-88");
				});
				on( dom.byId("rotSplashExportMap"), "click", function(){
					// sem implementacao
				});
			}
			function setEventsSplashAlarms(){
				on( dom.byId("rotSplashRefreshAlarm"), "click", function(){
					// sem implementacao
				});
				on( dom.byId("rotSplashSearchAlarm"), "click", function(){
					// sem implementacao
				});
				on( dom.byId("rotSplashConfigAlarm"), "click", function(){
					// sem implementacao
				});
			}
			function setEventsSplashBilling(){
				on( dom.byId("rotSplashCredit"), "click", function(){
					carregaTelaFaturamento("billingCreditDebt.html");
				});
				on( dom.byId("rotSplashDebit"), "click", function(){
					carregaTelaFaturamento("billingCreditDebt.html");
				});
				on( dom.byId("rotSplashTransactions"), "click", function(){
					carregaTelaFaturamento("billingTransactions.html");
				});
			}
			function setEventsSplashCircles(){
				on( dom.byId("rotSplashImportContacts"), "click", function(){
					abrePopUpModal( "opcoesImportacaoContato.html" );
				});
				on( dom.byId("rotSplashNewContact"), "click", function(){
					carregaTelaCirculos("circleContacts.html")
				});
				on( dom.byId("rotSplashCircles"), "click", function(){
					carregaTelaCirculos("circles.html")
				});
			}

			// Eventos nas telas do módulo Círculos
			function setEventsCircleContacts(){
				on( dom.byId("btImportarContatos"), "click", function(){
					abrePopUpModal( "opcoesImportacaoContato.html" );
				});
			}



			/**
			 *	Funções para montar as árvores
			 */

			function loadTreeFtpImport( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Teste", parent:"treeRoot"},{id:2,label:"item_modificado",parent:1, leaf:true },{id:'pendencies',label:"Pendencias", parent: 'treeRoot'}];
				poolStore.treeFtpSelect = fillStoreTree( poolStore.treeFtpSelect, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.treeFtpSelect,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeFtpSelection") );

				tree.onDblClick = function(  ){
					poolStore.treeFtpSelect.put({id:3, label:'adicionou aqui', parent:'treeRoot', leaf:true});
				}
			}

			function loadTreeDBSelection( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Tabela1", parent:"treeRoot"},{id:2,label:"campo1",parent:1, leaf:true },{id:3,label:"Tabela2", parent: 'treeRoot'}];
				poolStore.treeDBSelect = fillStoreTree( poolStore.treeDBSelect, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.treeDBSelect,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeDBSelection") );

				tree.onDblClick = function(  ){
					poolStore.treeDBSelect.put({id:4, label:'campo2', parent:1, leaf:true});
				}
			}

			function loadTreeDataSources( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"FTP", parent:"treeRoot"},{id:2,label:"ftp do senai",parent:1, leaf:true },{id:3,label:"ftp da estacio", parent: 1, leaf:true}];
				poolStore.treeDataSource = fillStoreTree( poolStore.treeDataSource, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.treeDataSource,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeDataSources") );

				tree.onDblClick = function(  ){
					poolStore.treeDataSource.put({id:4, label:'campo2', parent:1, leaf:true});
				}
			}

			function loadTreePendencies( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Importacao 09/02", parent:"treeRoot"},{id:2,label:"CSV",parent:1 },{id:3,label:"Morettic.csv", parent: 2, leaf:true}];
				poolStore.treePendencies = fillStoreTree( poolStore.treePendencies, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.treePendencies,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreePendency") );

			}

			function loadTreeDataTransform( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Importacao 09/02", parent:"treeRoot"},{id:2,label:"CSV",parent:1 },{id:3,label:"Morettic.csv", parent: 2, leaf:true}];
				poolStore.dataSource.st1 = fillStoreTree( poolStore.dataSource.st1, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.dataSource.st1,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeDataTransform") );

			}

			function loadTreeJsonOrigin( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Importacao 09/02", parent:"treeRoot"},{id:2,label:"CSV",parent:1 },{id:3,label:"Morettic.csv", parent: 2, leaf:true}];
				poolStore.dataSource.st1 = fillStoreTree( poolStore.dataSource.st1, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.dataSource.st1,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeJsonOrigin") );
			}

			function loadTreeJsonDestiny( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Importacao 09/02", parent:"treeRoot"},{id:2,label:"CSV",parent:1 },{id:3,label:"Morettic.csv", parent: 2, leaf:true}];
				poolStore.dataSource.st2 = fillStoreTree( poolStore.dataSource.st2, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.dataSource.st2,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeJsonDestiny") );
			}

			function loadTreeWsdl( arrDados ){
				var arrDadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Rest", parent:"treeRoot"},{id:2,label:"endpoint1",parent:1, leaf:true },{id:3,label:"endpoint2", parent: 1, leaf:true}];
				poolStore.dataSource.st1 = fillStoreTree( poolStore.dataSource.st1, arrDadosTeste );

				// cria model
				var model = new StoreModel( {
					store: poolStore.dataSource.st1,
					query: {id: 'treeRoot'},
					labelAttr: 'label',
					mayHaveChildren: function( item ){ return !item.leaf; }
				} );

				// cria tree apontando para um local reservado
				var tree = new Tree( {
					model: model,
					showRoot: false,
					dndController: dndSource
				} ).placeAt( dom.byId("espacoTreeWsdl") );
			}

			function loadListaDBSelection(){
				var boxLista = new Source("listaTabelas", {
					creator: function( item, hint ){
						var objDom = domConstruct.toDom("<div>"+item.nome+"</div>");
						return { node: objDom, data: item, type: ["tabela"]};
					},
					accept:["tabela"]
				});
				
				widListaTabelasDBSelection = boxLista; // Guarda na global
				
				console.log( "tipo da lista : "+boxLista.declaredClass );

				/*
				 *	Chamada da função que acessa o serviço que fornece os dados.
				 *	Esta deve retornar um array no padrão JSON com os seguintes dados: nome, type, campos.
				 *	Ex. [ { nome:'nome', type:'type', campos:['campo1','campo2'] } ]
				 */
				 var dados;
				 // dados = buscarTabelasDB();
				 
				 
				 dados = [
					{nome:'Pessoa', type:'tabela', campos:["nome","cpf","endereco","dataNasc"]},
					{nome:'Cidade', type:'tabela', campos:["idCidade", "nome", "estado"], fk:[{atributo:"estado", entidade:"Estado"},{atributo:"nome",entidade:"Pessoa"}] },	
																		// fk: [{chave_estrangeira,lookup_table},{...}] 
					{nome:'Estado', type:'tabela', campos:["idEstado", "nome", "uf", "pais"]},
					{nome:'Usuario', type:'tabela', campos:["nome", "senha","permissoes", "tipo"]},
					{nome:'Permissao', type:'tabela', campos:["descricao", "operacao", "leitura", "escrita", "execucao"]}
				];

				boxLista.insertNodes( false, dados );

				// Listeners do boxLista
				aspect.after( boxLista, "onMouseDown", function(){
					dom.byId("targetDragDrop").style.display = '';
				});
				aspect.after( boxLista, "onMouseUp", function(){
					dom.byId("targetDragDrop").style.display = 'none';
				});
				
				// TODO - apos cancelar: oculta o target
			}

			function loadDragDropDBSelection(){				
				var alturaSuperficie = dom.byId("graphicsSurface").clientHeight;
				var larguraSuperficie = dom.byId("graphicsSurface").clientWidth;
				var superficieGfx = gfx.createSurface("graphicsSurface", larguraSuperficie - 1, alturaSuperficie - 2);
				
				superficieGfx.whenLoaded(function(){												
					//var linha = superficieGfx.createLine({x1:0,y1:0,x2:larguraSuperficie,y2:alturaSuperficie}).setStroke("black");
				});
				
				var boxDrop = new Target("targetDragDrop",{
					accept: ["tabela"]
				});
				
				aspect.around( boxDrop, "onDndDrop", function( originalCall ){
					return function(){
						originalCall.apply( this, arguments );								
							
						var fonte = arguments[0];
						var alvo = arguments[3];
						
						if( fonte.node.id == "listaTabelas" ){							
							
							for( var i in alvo.map ){
								// move os dados para uma global
								objetosDropadosDBSelection.push( alvo.map[i] );
								
								/*
								 * Criação da representação visual das tabelas do banco de dados
								 */
								var camposTabela = "";
								var dados = alvo.map[i].data;
								var nomeTabela = dados.nome;								
								
								// Transforma cada div em DOM, seta listener e inclui no DOM pai.
								
								var objetoDOM = domConstruct.toDom(
									"<div id='dbi_tabela_" + nomeTabela + "' style='border:1px solid #777;min-width:100px;max-width:150px;width:100px;'>" +
									"	<div id='dbi_titulo_" + nomeTabela + "' class='titulo-tabela-dnd'>"+ nomeTabela + "<span id='dbi_apagar_tabela_" + nomeTabela + "' class='icone-excluir-tabela-dnd' style='float:right'>X</span></div>" +
									"	<div id='dbi_campos_" + nomeTabela + "' style='background-color:white;padding:2px;cursor:default'></div>" +
									"</div>"
								);
								domConstruct.place( objetoDOM, "containerDragDrop" );								
								
								on( dom.byId("dbi_apagar_tabela_" + nomeTabela ), "click", function(){ eraseTableDnd( nomeTabela, superficieGfx ) });
								
								// Prepara os campos para serem inseridos dentro das "tabelas"								
								for( var i = 0; i < dados.campos.length; i++ ){
									var nomeCampo = dados.campos[i];
									var campoTabela = domConstruct.toDom(
										"<div class='campo-tabela-dnd' style='width:100%;' id='" + nomeCampo + "_" + nomeTabela + "'>" +
										nomeCampo + "<span id='dbi_excluir_campo_" + nomeCampo +"_" + nomeTabela + "' class='icone-excluir-campo-dnd'>X</span></div>"
									);
									domConstruct.place( campoTabela, "dbi_campos_" + nomeTabela );
									
									on( dom.byId("dbi_excluir_campo_" + nomeCampo + "_" + nomeTabela), "click", function(){ eraseTableFieldDnd( this ) });
								}
								
								// Transforma em componente moveable e comunica o que fazer ao terminar de arrastá-lo
								var quadroMovel = new move.parentConstrainedMoveable( objetoDOM, { area:'padding', handle: "dbi_titulo" + nomeTabela, within:true } );

								/*
								 *	Criação das linhas de relacionamento/cardinalidade
								 */
								// FK
								// Se existem chaves estrangeiras no objeto
								if( dados.fk != null && dados.fk != undefined ){
									// Para cada chave estrangeiras faça
									console.log("length fk: " +dados.fk.length);										
									for( var i = 0; dados.fk.length > i; i++ ){
										console.log("i: " +i);
										// Para cada objeto na lista de objetos dropados faça
										console.log("n objetos: "+objetosDropadosDBSelection.length);
										console.log("teste: "+objetosDropadosDBSelection[0]);
										for( var ii in objetosDropadosDBSelection[0] ){
											console.log( objetosDropadosDBSelection[0][ii]);
										}
										console.log("data: "+objetosDropadosDBSelection[0].data)
										for( var j = 0; objetosDropadosDBSelection.length > j; j++ ){
											console.log( "objeto dropado: "+objetosDropadosDBSelection[j].data.nome);
											console.log("fk: "+dados.fk[i].entidade)
											// Se existe a representacao da tabela na lista entao
											if( objetosDropadosDBSelection[j].data.nome == dados.fk[i].entidade ){
												console.log("encontrada tabela lookup");
												// cria linha na superficie de desenho (x1 e y1 referentes ao quadro atual)
												// (x2 e y2 referentes a tabela lookup)
												var x1 = quadroMovel.node.style.left;
												var y1 = quadroMovel.node.style.top;
												var domTabelaLookup = dom.byId("dbi_tabela_"+objetosDropadosDBSelection[j].data.nome);
												var x2 = domTabelaLookup.style.left;
												var y2 = domTabelaLookup.style.top;
												console.log("x1: "+x1+" y1: "+y1+" - x2: "+x2+" y2: "+y2);
												var linha = superficieGfx.createLine({x1: x1,y1: y1,x2: x2,y2: y2}).setStroke("black");
												var strIdLinha = objetoDOM.id +">"+ domTabelaLookup.id;
												linhasDBSelection.push( { id: strIdLinha, obj: linha} );
												console.log("criou linha " + strIdLinha);
												break;
											}
										}
									}
								}
								
								
								// PK - verifica se alguma tabela da lista de objetos dropados faz referência à tabela atual
								// Para cada objeto dropado faça
								for( var i = 0; objetosDropadosDBSelection.length > i; i++ ){
									var chavesEstrangeiras = objetosDropadosDBSelection[i].data.fk
									if( chavesEstrangeiras != null && chavesEstrangeiras != undefined ){										
										for( var iFK = 0; chavesEstrangeiras.length > iFK; iFK++ ){
											// Se nome da tabela na fk é igual ao nome da tabela atual entao											
											if( chavesEstrangeiras[iFK].entidade == nomeTabela ){
												// cria linha, onde x2 e y2 são da tabela atual												
												var domTabelaOrigem = dom.byId("dbi_tabela_"+objetosDropadosDBSelection[i].data.nome);
												var x1 = domTabelaOrigem.style.left;
												var y1 = domTabelaOrigem.style.top;
												var x2 = quadroMovel.node.style.left;
												var y2 = quadroMovel.node.style.top;
												var linha = superficieGfx.createLine({x1: x1,y1: y1,x2: x2,y2: y2}).setStroke("black");
												var strIdLinha = domTabelaOrigem.id +">"+ objetoDOM.id;
												linhasDBSelection.push( { id: strIdLinha, obj: linha} );
												console.log("linha criada: " + strIdLinha);
											}
										}
									}
								}
								
								/*
								 *	Toda vez que um quadro/tabela é movido atualiza a posicao da linha
								 */
								aspect.after( quadroMovel, "onMoveStop", function( mover ){
									
									console.log("x:" + quadroMovel.node.style.left + " y:" +quadroMovel.node.style.top);
									var novoX = quadroMovel.node.style.left;
									var novoY = quadroMovel.node.style.top;
									//verifica em cada linha
									for( var iLinha in linhasDBSelection ){
										var strIdLinha = linhasDBSelection[iLinha].id;
										console.log("id linha: " + strIdLinha);
										var identificadores = strIdLinha.split(">");
										if( quadroMovel.node.id == identificadores[0] ){											
											// altera x1 e y1											
											x2Atual = linhasDBSelection[iLinha].obj.shape.x2;
											y2Atual = linhasDBSelection[iLinha].obj.shape.y2;
											
											// cria nova linha e apaga a antiga
											superficieGfx.remove( linhasDBSelection[iLinha].obj );											
											var novaLinha = superficieGfx.createLine({x1: novoX,y1: novoY,x2: x2Atual,y2: y2Atual}).setStroke("black");
											linhasDBSelection[iLinha].obj = novaLinha;																						
											
										}else if( quadroMovel.node.id == identificadores[1] ){
											// altera x2 e y2
											x1Atual = linhasDBSelection[iLinha].obj.shape.x1;
											y1Atual = linhasDBSelection[iLinha].obj.shape.y1;
											
											// cria nova linha e apaga a antiga
											superficieGfx.remove( linhasDBSelection[iLinha].obj );											
											var novaLinha = superficieGfx.createLine({x1: x1Atual,y1: y1Atual,x2: novoX,y2: novoY}).setStroke("black");
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
						alvo.node.style.display= 'none';

					}
				});

			}
			
			function eraseTableDnd( nomeTabela, superficieGfx ){
				// Apaga tabela, recupera objeto e inclui de volta na lista
				var tabela = dom.byId("dbi_tabela_" + nomeTabela);
				domConstruct.destroy( tabela );
				
				var tabelaRemovida = null;
				for( var i in objetosDropadosDBSelection ){					
					//if( objetosDropadosDBSelection[i].data.nome.indexOf( nomeTabela ) > -1 ){
					if( objetosDropadosDBSelection[i].data.nome == nomeTabela ){
						tabelaRemovida = objetosDropadosDBSelection[i].data;
						objetosDropadosDBSelection.splice( i, 1 );	
						break;
					}
				}
				
				// Adiciona tabela de volta na lista
				widListaTabelasDBSelection.insertNodes( false, [ tabelaRemovida ] );
				
				//TODO descobrir bug, nao apaga mais de uma linha
				// Apagar linha de relacionamento se estiver vinculada com a tabela
				console.log(linhasDBSelection.length);
				for( var iLinha = 0; linhasDBSelection.length > iLinha; iLinha++ ){
					console.log("iLinha: "+iLinha);
					if( linhasDBSelection[iLinha].id.indexOf( nomeTabela ) > -1 ){
						console.log("linha removida: "+ linhasDBSelection[iLinha].id);
						superficieGfx.remove( linhasDBSelection[iLinha].obj );
						linhasDBSelection.splice( iLinha, 1); // remove objeto da lista			
						
					}
				}
				
			}
			
			
			function eraseTableFieldDnd ( objeto ){				
				var divCampoTabela = dom.byId( objeto.id.replace(/dbi_excluir_campo_/g, "") );
				if( divCampoTabela.excluido && divCampoTabela.excluido == true ){
					divCampoTabela.style.textDecoration = "none";
					divCampoTabela.style.color = "inherit";
					divCampoTabela.excluido = false;
				}else{
					divCampoTabela.style.textDecoration = "line-through";
					divCampoTabela.style.color = "gray";
					divCampoTabela.excluido = true;
				}				
				
			}


			function alteraLocale( locale ){
				location.search = "?locale=" + locale;
			}

            /*
             *	Fim da declaração das funções
             */
        }
);

