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
	"dojo/i18n!./nls/texts.js",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"dijit/registry",
	"dijit/form/FilteringSelect"
],
function (
		dom,
		domStyle,
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
	
	 
	return{
		
		/**
		 *	Métodos públicos
		 */
		
		loadSelectCircles: function( jsonObject ){
			var dados = [{'name':'familia','id':'1'}];			
			poolStore.circles.st2 = fillStoreMemory(poolStore.circles.st2, dados );
			var campoCirculo = dom.byId("circleNameSearch");
			//TODO refatorar colocando a criação do componente e o comportamento dentro do modulo circles.js(quando existir)
			if( campoCirculo == undefined || campoCirculo == null ){
				new FilterSelect({
					id: 'circleNameSearch',
					class: 'campo-contato',
					store: poolStore.circles.st2,
					onKeyPress: function( event ){
						// requisicao que adiciona o circulo para o contato
						// depois atualiza/renderiza as tags que são criadas em boxListContactCircles
					}
				}, "boxCircleNameSearch").startup();
			}else{
				registry.byId("circleNameSearch").setStore( poolStore.circles.st2 );
			}
		}
		 
	}
	
});