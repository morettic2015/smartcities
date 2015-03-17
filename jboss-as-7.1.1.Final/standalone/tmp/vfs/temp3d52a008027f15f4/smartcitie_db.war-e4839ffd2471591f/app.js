// Globais
var widgetsCarregados; // guarda as referencias dos widgets que ja foram carregados
var widgetsFerramentaDados;
var widgetsPerfil = [];
var widgetsFaturamento;
var widgetsCirculos;
var map;//MAPA DO GOOGLE

require([
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
	"dojo/dom-attr",
    "dojo/parser",
    "dojo/_base/xhr",
	"dojo/_base/array",
    "dojo/query",
    "dojo/_base/event",
	"dojo/i18n!./nls/texts.js"
],
        function (
                ready,
                on,
                dom,
				domAttr,
                parser,
                xhr,
				array,
                query,
                event,
				textos
                ) {

            ready(function () {
				
                /**
                 *	Atribuindo Eventos
                 */
				 
				 // Cabeçalho / Header
				on(dom.byId("btConfigHeader"), "click", function () {
                    abrePopUpModal("configuration.html");					
                });

                //Aba Perfil
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

                // Aba Ferramenta de dados
                on(dom.byId("btImportarDados"), "click", function () {
                    carregaTelaFerramentaDados("choiceDataFormatImport.html")
                });
                on(dom.byId("btExportarDados"), "click", function () {
                    carregaTelaFerramentaDados("choiceDataFormatExport.html")
                });
                on(dom.byId("btHistoricoDados"), "click", function () {
                    carregaTelaFerramentaDados("historyData.html")
                });//btDriversDados
                on(dom.byId("btDriversDados"), "click", function () {
                    carregaTelaFerramentaDados("dataDriver.html")
                });
                on(dom.byId("btCompartilharDados"), "click", function () {
                    carregaTelaFerramentaDados("shareData.html")
                });//btCopiarDados
                on(dom.byId("btCopiarDados"), "click", function () {
                    carregaTelaFerramentaDados("copyData.html")
                });
                on(dom.byId("btTarefaDados"), "click", function () {
                    carregaTelaFerramentaDados("task.html")
                });
				//btTransformarDados
                on(dom.byId("btTransformarDados"), "click", function () {
                    carregaTelaFerramentaDados("transform.html")
                });
							
				//Módulo Mapa
                on(dom.byId("btMapaSearch"), "click", function () {
                    abrePopUpModal("mapSearch.html")
                });
                on(dom.byId("btMapaConfig"), "click", function () {
                    abrePopUpModal("mapConfig.html");
                    addMarkerToMap("TEXTO INFORMATIVO NONONONO", "INFO TITULO", "42", "-88");
                });
				
				
				// Aba/Módulo Faturamento
				on(dom.byId("btTransacoes"), "click", function () {
                    carregaTelaFaturamento("billingTransactions.html")
                });
				on(dom.byId("btCreditoDebito"), "click", function () {
                    carregaTelaFaturamento("billingCreditDebt.html")
                });
				
				// Aba Contatos
				/*
                on(dom.byId("btImportarContatos"), "click", function () {
                    abreImportarContato();
                });
				*/
				// Aba/Módulo Círculos
				on(dom.byId("btContatos"), "click", function () {
                    carregaTelaCirculos("circleContacts.html")
                });
				on(dom.byId("btCirculos"), "click", function () {
                    carregaTelaCirculos("circles.html")
                });


                /* 
					Delegação de evento para conteudo carregado dinamicamente
				 */
				 
				// Módulo Ferramenta de Dados
				
                query("#conteudo_ferr_dados").on("#btTestarConexaoDados:click", function (evt) {
                    event.stop(evt);
                });
                query("#conteudo_ferr_dados").on("#iconeDatabaseImportacao:click", function (evt) {
                    carregaTelaFerramentaDados("databaseImport.html");
                    event.stop(evt);
                });
				query("#conteudo_ferr_dados").on("#iconeKmlImportacao:click", function (evt) {
                    carregaTelaFerramentaDados("importKml.html");
                    event.stop(evt);
                });
				
				// Módulo Mapa
                 
                on(dom.byId("btMapaLoad"), "click", function () {
                    //carregaTelaMapa("map/index.html");
                    makeGmap();
                });
                on(dom.byId("tabMap"), "onShow", function () {
                    //carregaTelaMapa("map/index.html");
                    makeGmap();
                });

                
				
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
				dom.byId("rotBtMapaLoad").innerHTML = textos.rotAtualizar;
				dom.byId("rotBtMapaSearch").innerHTML = textos.rotFiltrar;
				dom.byId("rotBtMapaConfig").innerHTML = textos.rotConfigurar;
				dom.byId("rotBtMapaImagem").innerHTML = textos.rotImagem;
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
				
				// Carrega as telas de splash
				atualizaConteudo("conteudo_perfil", "perfilSplash.html");
				atualizaConteudo("conteudo_ferr_dados", "fonteDadosSplash.html");
				atualizaConteudo("conteudo_mapa", "mapSplash.html");
				atualizaConteudo("conteudo_alarmes", "alarmesSplash.html");
				atualizaConteudo("conteudo_faturamento", "faturamentoSplash.html");
				atualizaConteudo("conteudo_circulos", "circulosSplash.html");
				
				// Splash Perfil		
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
				
				// Splash Dados
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
				
				// Splash Mapa				
				//dom.byId("rotSplashViewMap").innerHTML = textos.rotCompartilhar;
				dom.byId("pSplashViewMap").innerHTML = textos.descVisualizarMapa;
				//dom.byId("rotSplashSearchMap").innerHTML = textos.rotDrivers;
				dom.byId("pSplashSearchMap").innerHTML = textos.descFiltrarMapa;
				//dom.byId("rotSplashMapLayers").innerHTML = textos.rotTarefa;
				dom.byId("pSplashMapLayers").innerHTML = textos.descCamadasMapa;
				//dom.byId("rotSplashExportMap").innerHTML = textos.rotHistorico;
				dom.byId("pSplashExportMap").innerHTML = textos.descExportarMapa;				
				
				// Splash Alarmes
				dom.byId("rotSplashRefreshAlarm").innerHTML = textos.rotAtualizar;
				dom.byId("pSplashRefreshAlarm").innerHTML = textos.descAtualizarAlarme;
				dom.byId("rotSplashSearchAlarm").innerHTML = textos.rotFiltrar;
				dom.byId("pSplashSearchAlarm").innerHTML = textos.descFiltrarAlarme;
				dom.byId("rotSplashConfigAlarm").innerHTML = textos.rotConfigurar;
				dom.byId("pSplashConfigAlarm").innerHTML = textos.descConfigurarAlarme;
				
				// Splash Faturamento
				//dom.byId("rotSplashCredit").innerHTML = textos.rotCreditoDebito;
				dom.byId("pSplashCredit").innerHTML = textos.descCreditoFaturamento;
				//dom.byId("rotSplashDebit").innerHTML = textos.rotCreditoDebito;
				dom.byId("pSplashDebit").innerHTML = textos.descDebitoFaturamento;
				dom.byId("rotSplashTransactions").innerHTML = textos.rotTransacoes;
				dom.byId("pSplashTransactions").innerHTML = textos.descTransacoesFaturamento;
				
				// Splash Círculos
				dom.byId("rotSplashImportContacts").innerHTML = textos.rotImportarContatos;
				dom.byId("pSplashImportContacts").innerHTML = textos.descImportarContatosCirculos;
				dom.byId("rotSplashNewContact").innerHTML = textos.rotNovoContato;
				dom.byId("pSplashNewContact").innerHTML = textos.descNovoContatoCirculos;
				dom.byId("rotSplashCircles").innerHTML = textos.rotCirculos;
				dom.byId("pSplashCircles").innerHTML = textos.descCirculos;

				
				//widgetsCarregados = parser.parse();
				
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

            

            function atualizaConteudo(idContainer, paginaConteudo) {
			
                xhr.get({                    
                    url: paginaConteudo, // O URL da requisição
                    
					// O retorno(callback) de sucesso com o resultado do servidor
                    load: function (newContent) {
                        dom.byId(idContainer).innerHTML = newContent;
						//TODO chamar alguma função que força a atualizacao dos componentes em tela (tentativa de resolver o caso do bordercontainer dinamico)					
                    },
                    // Tratador de erros
                    error: function (msg) {
                        alert("Erro : " + msg + " - Container: #" + idContainer);                        
                    },
                    // Variável GET extra para evitar que o browser guarde cache
                    preventCache: true,
					// Força a espera do término da requisição
                    sync: true
                });
            }

            // Função para apagar conteudo anterior e carregar o novo
            function carregaTelaFerramentaDados(paginaConteudo) {
                var idContainer = "conteudo_ferr_dados";
                if (widgetsFerramentaDados) {
                    widgetsFerramentaDados.forEach(function (widget) {
                        widget.destroy();
                    });
                }
                atualizaConteudo(idContainer, paginaConteudo);
				// A Chamada da função de internacionalizacao para páginas assincronas é feita
				// depois do 'parse' para que funcione nos widgets
                parser.parse(dom.byId(idContainer)).then(function( objetos ){
					widgetsFerramentaDados = objetos;
					i18nAssincrono( paginaConteudo );
				});
			}
			
            // Função para apagar conteudo atual do container 'perfil' e carregar o novo junto com a internacionalização
            function carregaTelaPerfil(paginaConteudo) {
                var idContainer = "conteudo_perfil";				
                //if (widgetsPerfil != undefined && widgetsPerfil != null && widgetsPerfil.length > 0 ) {
				if ( widgetsPerfil ){
                    widgetsPerfil.forEach(function (widget) {
                        widget.destroy();
                    });
                }
                atualizaConteudo(idContainer, paginaConteudo);				
				// A Chamada da função de internacionalizacao para páginas assincronas é feita
				// depois do 'parse' para que funcione nos widgets
                parser.parse(dom.byId(idContainer)).then(function( objetos ){
					widgetsPerfil = objetos;
					i18nAssincrono( paginaConteudo );
				});
            }
			
			// Função para apagar conteudo atual do container 'faturamento' e carregar o novo junto com a internacionalização
            function carregaTelaFaturamento( paginaConteudo ) {
                var idContainer = "conteudo_faturamento";
                if ( widgetsFaturamento ) {
                    widgetsFaturamento.forEach(function (widget) {
                        widget.destroy();
                    });
                }
                atualizaConteudo( idContainer, paginaConteudo );				
				// A Chamada da função de internacionalizacao para páginas assincronas é feita
				// depois do 'parse' para que funcione nos widgets
                parser.parse(dom.byId(idContainer)).then(function( objetos ){
					widgetsFaturamento = objetos;
					i18nAssincrono( paginaConteudo ); 
				});
			}
			
			// Função para apagar conteudo atual do container 'circulos' e carregar o novo junto com a internacionalização
            function carregaTelaCirculos( paginaConteudo ) {
                var idContainer = "conteudo_circulos";
                if ( widgetsCirculos ) {
                    widgetsCirculos.forEach(function (widget) {
                        widget.destroy();
                    });
                }
                atualizaConteudo( idContainer, paginaConteudo );				
				// A Chamada da função de internacionalizacao para páginas assincronas é feita
				// depois do 'parse' para que funcione nos widgets
                parser.parse(dom.byId(idContainer)).then(function( objetos ){
					widgetsCirculos = objetos;
					i18nAssincrono( paginaConteudo );
				});
            }

            /**
             * 
             * Função para abrir o modal. Basta passar o nome do html / pagina para carregar o conteudo
             * @argument {paginaConteudo} paginaConteudo pagina html a ser carregada no modal
             * 
             * */
            function abrePopUpModal( paginaConteudo ) {
				var idContainer = "container_modal";
                atualizaConteudo(idContainer, paginaConteudo);
				
				// A Chamada da função de internacionalizacao para páginas assincronas é feita
				// depois do 'parse' para que funcione nos widgets
				parser.parse(dom.byId(idContainer)).then(function( objetos ){ 
					widgetsModal = objetos;
					i18nAssincrono( paginaConteudo ); 
				});
                exibeModal();
            }
			
			function exibeModal(){
                myDialog.show();
            }

            function habilitaCamposImportacao() {
                console.log("funcao habilitaCamposImportacao");
                var opcao = dom.byId("cmb_tipo_fonte_dados").value;
                if (opcao == "database") {
                    habilitaCamposDados_DB();
                } else {
                    habilitaCamposDados_Arquivo();
                }
            }
            function habilitaCamposDados_DB() {
                // Campos para ocultar
                dom.byId("div_caminho_arquivo_importacao").style.display = 'none';

                // Campos para exibir
                dom.byId("div_nome_bd_importacao").style.display = '';
            }
            function habilitaCamposDados_Arquivo() {
                // Campos para ocultar
                dom.byId("div_nome_bd_importacao").style.display = 'none';

                // Campos para exibir
                dom.byId("div_caminho_arquivo_importacao").style.display = '';
            }
			
			
			function i18nAssincrono( pagina ){
				if( pagina == "profileInfo.html" ){
					i18nProfileInfo();
				}else if( pagina == "profileAddress.html"){
					i18nProfileAdress();
				}else if( pagina == "profileLanguage.html"){
					i18nProfileLanguage();
				}else if( pagina == "profileSecurity.html"){
					i18nProfileSecurity();
				}else if( pagina == "profileHistory.html"){
					i18nProfileHistory();
				}else if( pagina == "choiceDataFormatImport.html"){
					i18nDataImport();
				}else if( pagina == "choiceDataFormatExport.html"){
					i18nDataExport();
				}else if( pagina == "copyData.html"){
					i18nCopyData();
				}else if( pagina == "transform.html"){
					i18nDataTransform();
				}else if( pagina == "shareData.html"){
					i18nDataShare();
				}else if( pagina == "dataDriver.html"){
					i18nDataDriver();
				}else if( pagina == "task.html"){
					i18nDataTask();
				}else if( pagina == "historyData.html"){
					i18nDataHistory();
				}else if( pagina == "billingTransactions.html"){
					i18nBillingTransactions();
				}else if( pagina == "billingCreditDebt.html"){
					i18nBillingCredit();
				}else if( pagina == "circleContacts.html"){
					i18nContactCircle();
				}else if( pagina == "circles.html"){
					i18nCircles();
				}else if( pagina == "mapConfig.html" ){
					i18nMapConfig();
				}else if( pagina == "configuration.html" ){
					i18nGeneralConfig();
				}else if( pagina == "databaseImport.html" ){
					i18nImportBancoDados();
				}else if( pagina == "importKml.html"){
					i18nImportKml();
				}else if( pagina == "formPaypal.html" ){
					i18nFormPaypal();
				}else if( pagina == "formPagseguro.html" ){
					i18nFormPagseguro();
				}else if( pagina == "formBanco.html" ){
					i18nFormBanco();
				}else if( pagina == "formCartao.html" ){
					i18nFormCartao();
				}
				
			}
			
			// atribui textos na pagina profileInfo
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
			
			function setDadosComboPais(){
				// cria store memory
				// valores...
				//atribui ao combo pais
			}
			
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
				dom.byId("opViewPermissionShare").innerHTML = textos.gVisualizar;
				console.log("7");
				dom.byId("opEditPermissionShare").innerHTML = textos.gEditar;				
				console.log("8");
				dom.byId("rotVisibilidadeShareData").innerHTML = textos.rotVisibilidadeDados;
				console.log("9");
				dom.byId("opPublicoVisibShare").innerHTML = textos.gPublico;
				console.log("10");
				dom.byId("opPrivadoVisibShare").innerHTML = textos.gPrivado;				
				console.log("11");
				dom.byId("rotGridIDShareData").innerHTML = textos.gID;
				console.log("12");
				dom.byId("rotGridNomeShareData").innerHTML = textos.gNome;
				console.log("13");
				dom.byId("rotGridCirculosShareData").innerHTML = textos.rotCirculos;
				console.log("14");
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
			function i18nBillingTransactions(){
				dom.byId("tituloBillingTransactions").innerHTML = textos.tituloHistoricoTransacoes;
				dom.byId("rotDeBillingTransactions").innerHTML = textos.rotDe;
				dom.byId("rotAteBillingTransactions").innerHTML = textos.rotAte;
				//dom.byId("btBuscarBillingTransactions").innerHTML = textos.btBuscar;
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
			function i18nImportBancoDados(){
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
			function i18nImportKml(){
				dom.byId("tituloImportKml").innerHTML = textos.tituloImportKml;
				dom.byId("rotLinkImportKml").innerHTML = textos.gLink;
				dom.byId("rotDescricaoImportKml").innerHTML = textos.gDescricao;
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
			
			function alteraLocale( locale ){				
				location.search = "?locale=" + locale;
			}
			
			
            /*
             *	Fim da declaração das funções
             */
            // makeGmap();
        }
);

