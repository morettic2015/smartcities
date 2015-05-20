
require([
    "dojo/ready",
    "dojo/on",
    "dojo/dom"
],
    function (
        ready,
		on,
		dom
	){
		ready( function(){
			
			on(dom.byId("btLogin"), "click", function () {
				var user = document.getElementById("txtUser").value;                
				var pass = document.getElementById("txtPass").value;
				console.log("passou pelo index.js");
				var resposta = autenticaUsuario( user, pass );
				berraNaTela("Peehh!!");
				console.log("nao deu erro aqui");
			});
			
		});
	}
);
		