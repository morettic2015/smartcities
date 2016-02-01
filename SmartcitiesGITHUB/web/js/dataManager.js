/**
 *	Módulo Data Manager
 *	
 *	Descrição:
 *		Módulo onde são armazenados e manipulados os dados da View
 *
 *	Funções públicas:
 *		
 */

define([
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/i18n!./nls/texts.js",
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dijit/registry",
    "dijit/form/FilteringSelect"
],
        function (
                dom,
                domStyle,
                domConstruct,
                textos,
                Memory,
                Observable,
                registry,
                FilterSelect
                ) {

            /**
             *	Atributos e Métodos privados (Uso interno)
             */

            var poolStore = {
                'dataSource': {'st1': null, 'st2': null, 'st3': null, 'st4': null, 'st5': null},
                'profile': {'st1': null, 'st2': null, 'st3': null, 'st4': null},
                'map': {'st1': null, 'st2': null},
                'alarms': {'st1': null, 'st2': null},
                'billing': {'st1': null, 'st2': null},
                'circles': {'st1': null, 'st2': null},
                'popup': {'st1': null, 'st2': null},
                'treeDataSource': null,
                'treePendencies': null,
                'treeDataTransform': null,
                'treeFtpSelect': null,
                'treeDBSelect': null,
                'treeJsonOrigin': null,
                'treeJsonDestiny': null,
                'treeWsdl': null
            };

            // Apaga dados do store Memory e preenche com novos. Cria instância quando necessário
            var fillStoreMemory = function (store, dados) {

                if (store != null) {
                    for (var i in store.data) {
                        store.remove(i);
                    }
                    store.setData(dados);
                } else {
                    store = new Memory({
                        data: dados,
                        getChildren: function (object) {
                            return this.query({parent: object.id});
                        }
                    });
                }

                return store;
            }

            //TODO mover funcao para circles.js em futura refatoração
            var deleteCircleContact = function (idCircle) {
                //TODO requisicao rest que deleta circulo vinculado ao contato (quais os dados/informacoes necessarias??)

                //TODO chama novamente a função que atualiza as tags
            }

            //TODO mover funcao para circles.js em futura refatoração
            var updateCircleContacts = function (circulos) {
                for (var i = 0; i < circulos.length; i++) {
                    var strDOM = "<div id='contactCircle" + circulos[i].id + "' class='tag-contact-circle'>" +
                            circulos[i].name +
                            " <span id='delete_circle_contact_" + circulos[i].id + "' class='delete-circle-contact'>X</span></div>";
                    var objDOM = domConstruct.toDom(strDOM);
                    domConstruct.place(objDOM, "boxListContactCircles");
                    on(dom.byId("delete_circle_contact_" + circulos[i].id), "click", function () {
                        deleteCircleContact(circulos[i].id);
                    });
                }
            }

            return{
                /**
                 *	Métodos públicos
                 */

                loadSelectCircles: function (jsonObject) {
                    var dados = [{'name': 'familia', 'id': '1'}];
                    poolStore.circles.st2 = fillStoreMemory(poolStore.circles.st2, dados);
                    var campoCirculo = dom.byId("circleNameSearch");
                    //TODO refatorar colocando a criação do componente e o comportamento dentro do modulo circles.js(quando existir)
                    if (campoCirculo == undefined || campoCirculo == null) {
                        new FilterSelect({
                            id: 'circleNameSearch',
                            class: 'campo-contato',
                            required: false,
                            store: poolStore.circles.st2,
                            onKeyPress: function (event) {
                                if (event.keyCode == 13) {
                                    //TODO requisicao rest que adiciona o circulo para o contato(nao esta criando novo e sim vinculando ao contato)
                                    // uma lista atualizada com esses relacionamentos devem estar disponiveis logo em seguida
                                    var dadosTeste = [{'id': '1', 'name': 'empresa'}];

                                    //limpa area antes de exibir qualquer conteudo
                                    //domConstruct.empty("boxListContactCircles");

                                    // depois atualiza/renderiza as tags que são criadas em boxListContactCircles
                                    var circulos = dadosTeste;
                                    updateCircleContacts(circulos);
                                }
                            }
                        }, "boxCircleNameSearch").startup();
                    } else {
                        registry.byId("circleNameSearch").setStore(poolStore.circles.st2);
                    }
                },
                loadCirclesSearch: function (jsonObject) {
                    var dados = [{'name': 'familia', 'id': '1'}];
                    poolStore.circles.st2 = fillStoreMemory(poolStore.circles.st2, dados);
                    var campoCirculo = dom.byId("circleNameSearch");
                    //TODO refatorar colocando a criação do componente e o comportamento dentro do modulo circles.js(quando existir)
                    if (campoCirculo == undefined || campoCirculo == null) {
                        new FilterSelect({
                            id: 'circleNameSearch',
                            class: 'campo-contato',
                            required: false,
                            //placeHolder: textos.nomeCirculo,
                            store: poolStore.circles.st2,
                            onKeyPress: function (event) {
                                // realiza a busca no grid
                            }
                        }, "boxCircleNameSearch").startup();
                    } else {
                        registry.byId("circleNameSearch").setStore(poolStore.circles.st2);
                    }
                }
            }

        });