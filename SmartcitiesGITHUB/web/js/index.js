
require([
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
	"js/restServices.js"
],
    function (
        ready,
		on,
		dom,
		restServices
	){
		ready( function(){
			
			/* Listener que permite realizar o login pressionando a tecla 'Enter' */
			on( dom.byId("txtPass"), "keypress", function(){
				var evento = arguments[0] || window.event;
				var key = evento.keyCode || evento.charCode;
				if( key == 13 ){
					// dispara evento de click no btLogin
					on.emit(dom.byId("btLogin"), "click", {
						bubbles:true,
						cancelable:true
					});
				}
			});
			
			on(dom.byId("btLogin"), "click", function () {
				var user = document.getElementById("txtUser").value;
				var pass = document.getElementById("txtPass").value;				
				var resposta = restServices.autenticaUsuario( user, pass );
				
			});			
			
			on(dom.byId("linkRegister"), "click", function () {				
				abrePopUpModal("registerSocialNetwork.html", "Register");
			});
			
			contentPane_PopUp.set("onDownloadEnd", function(){
				configuraTela( this.get("href") );
			});
			
		});
		
		
		function abrePopUpModal( paginaConteudo, titulo ) {
			//parametrosTela = parametros;	// Setando variável global			
			contentPane_PopUp.set("href", paginaConteudo);
			myDialog.set("title", titulo);
			myDialog.show();
		}
                

	}
);
		