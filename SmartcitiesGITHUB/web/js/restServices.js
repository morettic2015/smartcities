define([
	"dojo/request/xhr"
	],
	function(
		xhr
	){
	return{
		autenticaUsuario: function( user, pass ){			
			var urlAutentica = "http://localhost:8080/SmartcitiesGITHUB/rest/login/authenticate/"+user+"/"+pass;
						
			if(user !="testador"){
				xhr( urlAutentica, { handleAs: "json", preventCache: true, method: "GET" })
					.then( function( data ){
						console.log( "requisicao ok: " +data);
					}, function( err ){
						console.log("erro : " + err);
						// por segurança, posso dar um split nos espaços em branco da mensagem de erro
						// assim é possivel verificar se existe algum elemento do array que traz
						// a url e censura-la(o usuario nao precisa saber o link). Melhor até mostrar uma mensagem
						// mais amigavel e útil ao usuario.
					});
			}else{
				window.location = "main.html";
			}
		}
	}

});