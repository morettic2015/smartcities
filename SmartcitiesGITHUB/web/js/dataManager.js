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
	"dojo/dom-style",
	"dojo/i18n!./nls/texts.js",
	"dojo/store/Memory",
	"dojo/store/Observable"
],
function (
		domStyle,
		textos,
		Memory,
		Observable
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
				console.log("criando memory");
				store = new Memory({
					data: dados,
					getChildren: function (object) {
						return this.query({parent: object.id});
					}
				});

				console.log("criou, " + store);
			}

			return store;
		}	
	
	 
	return{
		
		/**
		 *	Métodos públicos
		 */
		 
	}
	
});