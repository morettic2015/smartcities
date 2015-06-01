define([
    "dojo/request/xhr"
],
        function (
                xhr
                ) {
            return{
                urlServer: "rest/",
                autenticaUsuario: function (user, pass) {
                    var urlAutentica = this.urlServer + "profiles/authenticate/" + user + "/" + pass;

                    if (user != "testador") {
                        xhr(urlAutentica, {handleAs: "json", preventCache: true, method: "GET"})
                                .then(function (data) {
                                    console.log("requisicao ok: " + data);
                                    //Achouo usuario
                                    if (data.nmUser != null) {
                                        window.location = "main.html";
                                    }else{
                                        alert("email or password dont match.")
                                    }
                                }, function (err) {
                                    console.log("erro : " + err);
                                    // por segurança, posso dar um split nos espaços em branco da mensagem de erro
                                    // assim é possivel verificar se existe algum elemento do array que traz
                                    // a url e censura-la(o usuario nao precisa saber o link). Melhor até mostrar uma mensagem
                                    // mais amigavel e útil ao usuario.
                                });
                    } else {

                    }
                },
                salvaObjeto: function (url) {
                    return xhr(this.urlServer + url,
                            {
                                handleAs: "json",
                                preventCache: true,
                                method: "POST"
                            }
                    ).then(function (data) {
                        console.log("requisicao ok: " + data);
                        return "Dados salvos com sucesso.";
                    }, function (err) {
                        return "Não foi possível salvar. Causa: " + err;
                    });
                }
            }

        });