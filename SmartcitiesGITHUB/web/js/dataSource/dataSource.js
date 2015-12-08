/**
 *	Módulo Data Source
 *	
 *	Descrição:
 *		Módulo onde são declaradas as funcionalidades das telas de Data Source
 *		da view devem ser declarados aqui.
 *
 *	Funções públicas:
 *		
 */

define([
    "dojo/dom-style",
    "dojo/i18n!./nls/texts.js"
],
        function (
                domStyle,
                textos
                ) {

            /**
             *	Métodos privados (Uso interno)
             */

            return{
                /**
                 *	Métodos públicos
                 */

                loadDataSourcelistElements: function () {
                    var myFtpList = myProfile.myFtps;
                    var sourcesList = myProfile.mySources;
                    var myDbs = myProfile.myDbs;
                    //ZERA TODOS
                    document.getElementById("ftpGroup").innerHTML = "";
                    document.getElementById("xmlGroup").innerHTML = "";
                    document.getElementById("csvGroup").innerHTML = "";
                    document.getElementById("jsonGroup").innerHTML = "";
                    document.getElementById("kmlGroup").innerHTML = "";
                    document.getElementById("rssGroup").innerHTML = "";
                    document.getElementById("ldapGroup").innerHTML = "";
                    document.getElementById("adGroup").innerHTML = "";
                    document.getElementById("dbGroup").innerHTML = "";
                    for (i = 0; i < sourcesList.length; i++) {
                        var myTpInfo = sourcesList[i].myTp.toLowerCase() + "Group";
                        var selectDataOption = document.getElementById(myTpInfo)
                        var opt = document.createElement('option');
                        opt.value = sourcesList[i].id;
                        opt.style = "font-size: 8px;"
                        opt.innerHTML = sourcesList[i].fileTit + "(" + sourcesList[i].fileUrl + ")";
                        selectDataOption.appendChild(opt);
                    }
                    var selectDataOption = document.getElementById("ftpGroup");
                    for (i = 0; i < myFtpList.length; i++) {
                        var opt = document.createElement('option');
                        opt.value = myFtpList[i].id;
                        opt.style = "font-size: 8px;"
                        opt.innerHTML = myFtpList[i].host + "(" + myFtpList[i].user + ")";
                        selectDataOption.appendChild(opt);
                    }
                    var selectDataOption = document.getElementById("dbGroup");
                    for (i = 0; i < myDbs.length; i++) {

                        var opt = document.createElement('option');
                        opt.value = myDbs[i].iddataSource;
                        opt.innerHTML = myDbs[i].dataSourceUrl + "(" + myDbs[i].dataSourceDriver + " / " + myDbs[i].nmDatasource + ")";
                        selectDataOption.appendChild(opt);
                    }
                }
            }
        });