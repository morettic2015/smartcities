/*****************************************
 *		Controle do modelo / dados
 ****************************************/

/**
 *	Globais
 */
var configSmartcities = {};	// Objeto JSON que guarda dados que serão reutilizados nas telas
var parametrosTela = {}		// Parametros que são passados quando é carregada alguma tela
var geocoder = null;		// Serviço do Google para buscar a localização(lat. e lon.) de endereços 

// Apagar quando todos estiverem usando o poolStore
var storeMemory;			// Singleton de dojo/store/Memory
var storeModel;
// Apgar até aqui


var poolStore = {
	'dataSource': { 'st1': null, 'st2': null, 'st3': null, 'st4': null, 'st5': null },
	'profile': { 'st1': null, 'st2': null, 'st3': null, 'st4': null },
	'map': { 'st1': null, 'st2': null },
	'alarms': { 'st1': null, 'st2': null },
	'billing': { 'st1': null, 'st2': null },
	'circles': { 'st1': null, 'st2': null },
	'popup': { 'st1': null, 'st2': null },
	'treeDataSource': null,
	'treePendencies': null,
	'treeDataTransform': null,
	'treeFtpSelect': null,
	'treeDBSelect': null,
	'treeJsonOrigin': null,
	'treeJsonDestiny': null,
	'treeWsdl': null
}

var URL_DADOS = "http://localhost:8080/rest/";	// Url do webservice rest

require([
	"dojo/ready",
	"dojo/store/Memory",
	"dojo/data/ObjectStore",
	"dijit/tree/ObjectStoreModel",
	"dojo/store/JsonRest"
	],
	function(
		ready,
		Memory,
		ObjectStore,
		ObjectStoreModel,
		JsonRestStore
	){
		ready( function(){
			
			// TODO: apagar depois que todos os grids e trees estiverem utilizando o poolStore
			var dadosTeste = [{id:'treeRoot',label:"Root"},{id:1,label:"Teste", parent:"treeRoot"},{id:2,label:"sub_item",parent:1}];
			
			storeMemory = new Memory( {
				data: dadosTeste,
				getChildren: function( object ){ 
					return this.query({ parent : object.id });
				}
			});
			
			fillStoreMemory( poolStore.dataSource.st5, dadosTeste );
			
			storeModel = new ObjectStoreModel( {
				store: storeMemory,
				query: {id: 'treeRoot'},
				labelAttr: 'label',
				mayHaveChildren: function( item ){
					return !item.leaf;
				}
			});
			// Apagar até aqui

		});
		
		
		function autenticaUsuario( email, senha ){
			var autenticou = false;
			var storeUsuario = new JsonRestStore( {target: URL_DADOS + "profiles/"} );
			storeUsuario.query("email=" + email + "&pass=" + senha).then( function( results ){
				// verifica se no results (deve ser um array) vem algum resultado
				if( results.length > 0 ){
					autenticou = true;
				}
			});
			return autenticou;
		}
	}
);

function startGeocoder(){
	if( geocoder == null ){
		geocoder = new google.maps.Geocoder();
	}
	return geocoder;
}

function searchAddress( strQuery ){
	geocoder.geocode( {'address': strQuery}, function(resultados, status){
		if( status == google.maps.GeocoderStatus.OK ){
			console.log(" status OK")
			return resultados;
		}else{
			console.log(" nao OK")
			return null; 
		}
	});
}


// Apaga dados do store Memory e preenche com novos. Cria instância quando necessário
function fillStoreMemory( store, dados ){	
	require([
		"dojo/store/Memory",
		"dojo/store/Observable"
	],
	function( 
		Memory,
		Observable
	){
			
		if( store != null ){
			for(var i in store.data){
				store.remove( i );
			}			
			store.setData( dados );
		}else{
			console.log("criando memory");
			store = new Memory( {
				data: dados,
				getChildren: function( object ){ 
					return this.query({ parent : object.id });
				}
			});
			
			console.log("criou, "+ store);
		}
	});
	
	return store;
				
}

function refreshFileListFTPImport( arrDados ){
	// setar dados no store memory
	var dados = [ {'unique_id':1, 'check':'<input type=\'checkbox\' data-dojo-type=\'dijit/form/CheckBox\'>', 'nome':'arquivo_qualquer.doc', 'data':'06/03/2015' , 'tipo':'doc', 'tamanho':'1kb' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );	
	// atribuir ao grid
	gridFtpSelection.setStore( poolStore.dataSource.st1 );
}

function refreshGridPendencyFileSelect( arrDados ){
	var dados = [ {'unique_id':1, 'nome':'arquivo_imaginario.csv', 'tamanho':'12kb', 'dataOrigem':'06/03/2015' , 'origem':'ftp:br.morettic', 'selectionar':'link' } ];	
	poolStore.popup.st1 = fillStoreMemory( poolStore.popup.st1, dados );
	gridPendencyFileSelect.setStore( poolStore.popup.st1 );
}



function refreshGridProfileHistory( arrDados ){
	var dados = [ {'unique_id':1, 'tipo':'modificacao', 'id':1, 'data':'02/03/2015', 'ip':'200.201.90.30' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridProfileHistory.setStore( poolStore.dataSource.st1 );
}

function refreshGridDataTransform( arrDados ){
	var dados = [ {'unique_id':1, 'nome':'transform1', 'id':1 } ];		
	poolStore.dataSource.st2 = fillStoreMemory( poolStore.dataSource.st2, dados );
	gridDataTransform.setStore( poolStore.dataSource.st2 );
}

function refreshGridDataShare( arrDados ){
	var dados = [ {'unique_id':1, 'nome':'transform1', 'id':1, 'circulos':'???', 'info':'no comments' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridDataShare.setStore( poolStore.dataSource.st1 );
}

function refreshGridDataDriver( arrDados ){
	var dados = [ {'unique_id':1, 'driver':'jdbc', 'id':1, 'descricao':'nonono', 'icone':'imagem.gif', 'classpath':'C:/' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridDataDriver.setStore( poolStore.dataSource.st1 );
}

function refreshGridTasks( arrDados ){
	var dados = [ {'unique_id':1, 'nome':'tarefa de importacao', 'id':1, 'periodo':'2h' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridTasks.setStore( poolStore.dataSource.st1 );
}

function refreshGridDataHistory( arrDados ){
	var dados = [ {'unique_id':1, 'data':'10/03/2015', 'id':1, 'usuario':'Mauricio', 'operacao':'importacao' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridDataHistory.setStore( poolStore.dataSource.st1 );
}

function refreshGridWsdl( arrDados ){
	var dados = [ {'unique_id':1, 'id':1, 'data':10, 'tipo':'Rest' } ];		
	poolStore.dataSource.st2 = fillStoreMemory( poolStore.dataSource.st2, dados );
	gridWsdl.setStore( poolStore.dataSource.st2 );
}

function refreshGridCircleContacts( arrDados ){
	var dados = [ {'unique_id':1, 'nome':'nome', 'email':'email@server.com' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridCircleContacts.setStore( poolStore.dataSource.st1 );
}

function refreshGridCircles( arrDados ){
	var dados = [ {'unique_id':1, 'circulo':'familia', 'membros':'mae, filho, gato, papagaio' } ];		
	poolStore.dataSource.st1 = fillStoreMemory( poolStore.dataSource.st1, dados );
	gridCircles.setStore( poolStore.dataSource.st1 );
}


	
	/*
	obs: a tree mapeia um 'item array' que precisa ser limpo para evitar vazamento de memoria
	suponho que se trata das linhas abaixo
	treeFtpSelection._itemNodesMap = {};
	treeFtpSelection.rootNode.state = "UNCHECKED";
    treeFtpSelection.model.root.children = null;
	*/


function fillStoreTree( store, dados ){
	require([
		"dojo/store/Memory",
		"dojo/store/Observable",
		"dojo/aspect"
	],
	function( 
		Memory,
		Observable,
		aspect
	){
			
		if( store != null ){
			for(var i in store.data){
				store.remove( i );
			}
			for( var i in dados ){
				store.put( dados[i] );
			}
		}else{			
			store = new Memory( {
				data: dados,
				getChildren: function( object ){ 
					return this.query({ parent : object.id });
				}
			});
			
			aspect.around( store, "put", function(originalPut){
				// Para dar suporte ao drag and drop
				return function(obj, options){
					if(options && options.parent){
						obj.parent = options.parent.id;
					}
					return originalPut.call(store, obj, options);
				}
			});
				
			store = new Observable( store );
			
		}
	});
	
	return store;
}


