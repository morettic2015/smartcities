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
                    } else {

                    }
                },
                salvaObjeto: function (url) {
                    return xhr(this.urlServer + url,
                            {
                                handleAs: "json",
                                preventCache: true,
                                method: "GET"
                            }
                    ).then(function (data) {
                            //alert("aqui");
                        return data;
                    }, function (err) {
                            //alert("deu pau");
                        return "Não foi possível salvar. Causa: " + err;
                    });
                },
                loadObject: function ( url, submitType ) {
                    return xhr(this.urlServer + url,
                            {
                                handleAs: "json",
                                preventCache: true,
                                method: submitType
                            }
                    ).then(function (data) {
                        return data;
                    }, function (erro) {
                        return "Não foi possivel carregar. Causa: " + erro;
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
                        alert( "Não foi possível salvar. Causa: " + err);
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
                        return "Não foi possível carregar os dados do usuario. As funcionalidades do sistema poderão ficar comprometidas. Causa: " + err;
                    });
                }
            }
        });