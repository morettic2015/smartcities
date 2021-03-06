define([
    "dojo/request/xhr",
	"dojo/i18n!./nls/texts.js",
],
function (
		xhr,
		textos
		) {
	return{
		urlServer: "rest/",
		autenticaUsuario: function (user, pass) {
			var urlAutentica = this.urlServer + "profiles/authenticate/" + user + "/" + pass;
			
			xhr(urlAutentica, {handleAs: "json", preventCache: true, method: "GET"})
				.then(function (data) {						
					//Achou usuario
					if (data.nmUser != null) {
						window.location = "main.html";
					} else {
						contentPane_PopUp.set("href", "error/loginError.html");
						myDialog.set("title", "Error");
						myDialog.show();
					}
				}, function (err) {
					console.log("erro : " + err);
					// por segurança, posso dar um split nos espaços em branco da mensagem de erro
					// assim é possivel verificar se existe algum elemento do array que traz
					// a url e censura-la(o usuario nao precisa saber o link). Melhor até mostrar uma mensagem
					// mais amigavel e útil ao usuario.
				});
			
		},
		salvaObjetoPost: function (url) {
			return xhr(this.urlServer + url,
					{
						handleAs: "json",
						preventCache: true,
						method: "POST"
					}
			).then(function (data) {
				return data;
			}, function (err) {
				return textos.gNaoSalvou + " "+ textos.gCausa + ": " + err;
			});
		},
		salvaObjeto: function (url) {
			return xhr(this.urlServer + url,
					{
						handleAs: "json",
						preventCache: true,
						method: "GET"
					}
			).then(function (data) {
				return data;
			}, function (err) {
				return textos.gNaoSalvou + " "+ textos.gCausa + ": " + err;
			});
		},
		loadObject: function (url, submitType) {
			return xhr(this.urlServer + url,
					{
						handleAs: "json",
						preventCache: true,
						method: submitType
					}
			).then(function (data) {
				return data;
			}, function (erro) {
				return textos.gNaoCarregou + " "+ textos.gCausa + ": " + erro;
			});
		},
		salvaProfileAddress: function (latLng, address, complement) {
			return xhr(this.urlServer + "profiles/address/" + encodeURI(latLng) + "/" + encodeURI(address) + "/" + encodeURI(complement),
					{
						handleAs: "json",
						preventCache: true,
						method: "GET"
					}
			).then(function (data) {
				console.log("requisicao ok: " + data);
				contentPane_PopUp.set("href", "info/addressInfo.html");
				myDialog.set("title", "Sucess");
				myDialog.set("width", "240px");
				myDialog.set("height", "80px");
				myDialog.resize();
				myDialog.show();
				//alert( "En.");
			}, function (err) {
				alert(textos.gNaoSalvou + " "+ textos.gCausa + ": " + err);
			});
		},
		loadCtx: function () {
			return xhr(this.urlServer + "profiles/ctx",
					{
						handleAs: "json",
						preventCache: true,
						method: "GET"
					}
			).then(function (data) {
				//alert(data.email);
				//myProfile = eval(data);
				return data;
			}, function (err) {
				return textos.msgLoadProfileError + " " + textos.gCausa + ": " + err;
			});
		}
	}
});