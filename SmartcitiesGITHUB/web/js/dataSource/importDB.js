/**
 *	Módulo ImportDB (Import Database)
 *	
 *	Descrição:
 *		Módulo de carregamento dos componentes e montagem do mecanismo
 *		Drag n Drop para importação de Banco de Dados
 *
 *	Funções públicas:
 *		loadListaDBSelection(), loadDragDropDBSelection(), saveDatabaseSelection()
 */

define([
    "dojo/on",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/aspect",
    "dojo/dnd/Source",
    "dojo/dnd/Target",
    "dojo/dnd/move",
    "dojox/gfx"
],
        function (
                on,
                dom,
                domConstruct,
                aspect,
                Source,
                Target,
                move,
                gfx
                ) {

            /**
             *	Atributos e métodos privados
             */

            // Array de dados das tabelas escolhidas pelo usuario na importacao de BD
            var objetosDropadosDB = [];

            // Array das linhas (relacionamentos) entre tabelas na importacao de BD
            var linhasDB = [];

            // Guarda referencia do objeto Source na importacao de DB
            var widListaTabelasDB = null;

            var eraseTableDnd = function (nomeTabela, superficieGfx) {
                // Apaga tabela, recupera objeto e inclui de volta na lista
                var tabela = dom.byId("dbi_tabela_" + nomeTabela);
                domConstruct.destroy(tabela);
                var tabelaRemovida = null;
                for (var i in objetosDropadosDB) {
                    if (objetosDropadosDB[i].data.nome == nomeTabela) {
                        tabelaRemovida = objetosDropadosDB[i].data;
                        objetosDropadosDB.splice(i, 1);
                        break;
                    }
                }

                // Adiciona tabela de volta na lista
                widListaTabelasDB.insertNodes(false, [tabelaRemovida]);
                // Apagar linha de relacionamento se estiver vinculada com a tabela				
                for (var iLinha = linhasDB.length - 1; iLinha >= 0; iLinha--) { // do ultimo para o primeiro
                    if (linhasDB[iLinha].id.indexOf(nomeTabela) > -1) {
                        superficieGfx.remove(linhasDB[iLinha].obj);
                        linhasDB.splice(iLinha, 1); // remove objeto da lista						
                    }
                }
            };

            var eraseTableFieldDnd = function (objeto) {
                var divCampoTabela = dom.byId(objeto.id.replace(/dbi_excluir_campo_/g, ""));
                if (divCampoTabela.excluido && divCampoTabela.excluido == true) {
                    divCampoTabela.style.textDecoration = "none";
                    divCampoTabela.style.color = "inherit";
                    divCampoTabela.excluido = false;
                } else {
                    divCampoTabela.style.textDecoration = "line-through";
                    divCampoTabela.style.color = "gray";
                    divCampoTabela.excluido = true;
                }
            };

            return{
                /**
                 *	Métodos públicos
                 */
                loadListaDBSelection: function (dataInfo) {
                    var boxLista = new Source("listaTabelas", {
                        creator: function (item, hint) {
                            var objDom = domConstruct.toDom("<div>" + item.nome + "</div>");
                            return {node: objDom, data: item, type: ["tabela"]};
                        },
                        accept: ["tabela"]
                    });
                    widListaTabelasDB = boxLista; // Guarda na global

                    console.log("tipo da lista : " + boxLista.declaredClass);
                    /*
                     *	Chamada da função que acessa o serviço que fornece os dados.
                     *	Esta deve retornar um array no padrão JSON com os seguintes dados: nome, type, campos.
                     *	Ex. [ { nome:'nome', type:'type', campos:['campo1','campo2'] } ]
                     */
                    var dados;
                    // dados = buscarTabelasDB();

                    /**
                     * myProfile.dsName = dom.byId("nome_fonte_dados_importacao");
                     myProfile.dbName = dom.byId("nome_bd_importacao");
                     myProfile.dbType = dom.byId("cmb_tipo_banco_dados");
                     myProfile.dbUrl = dom.byId("url_fonte_dados_importacao");
                     myProfile.dbSchema = dom.byId("url_schema");
                     myProfile.dbPort = dom.byId("porta_bd_importacao");
                     myProfile.dbUser = dom.byId("usuario_bd_importacao");
                     myProfile.dbPass
                     * 
                     * */
                    //alert();


                    dados = [
                        {nome: 'Pessoa', type: 'tabela', campos: ["nome", "cpf", "endereco", "dataNasc"]},
                        {nome: 'Cidade', type: 'tabela', campos: ["idCidade", "nome", "estado"], fk: [{atributo: "estado", entidade: "Estado"}, {atributo: "nome", entidade: "Pessoa"}]},
                        // fk: [{chave_estrangeira,lookup_table},{...}] 
                        {nome: 'Estado', type: 'tabela', campos: ["idEstado", "nome", "uf", "pais"]},
                        {nome: 'Usuario', type: 'tabela', campos: ["nome", "senha", "permissoes", "tipo"]},
                        {nome: 'Permissao', type: 'tabela', campos: ["descricao", "operacao", "leitura", "escrita", "execucao"]}
                    ];
                    boxLista.insertNodes(false, dataInfo);
                    // Listeners do boxLista
                    aspect.after(boxLista, "onMouseDown", function () {
                        dom.byId("targetDragDrop").style.display = '';
                    });
                    aspect.after(boxLista, "onMouseUp", function () {
                        dom.byId("targetDragDrop").style.display = 'none';
                    });
                    // TODO - apos cancelar: oculta o target
                },
                loadDragDropDBSelection: function () {
                    var alturaSuperficie = dom.byId("graphicsSurface").clientHeight;
                    var larguraSuperficie = dom.byId("graphicsSurface").clientWidth;
                    var superficieGfx = gfx.createSurface("graphicsSurface", larguraSuperficie - 1, alturaSuperficie - 2);
                    superficieGfx.whenLoaded(function () {
                        //var linha = superficieGfx.createLine({x1:0,y1:0,x2:larguraSuperficie,y2:alturaSuperficie}).setStroke("black");
                    });
                    var boxDrop = new Target("targetDragDrop", {
                        accept: ["tabela"]
                    });
                    aspect.around(boxDrop, "onDndDrop", function (originalCall) {
                        return function () {
                            originalCall.apply(this, arguments);
                            var fonte = arguments[0];
                            var alvo = arguments[3];
                            if (fonte.node.id == "listaTabelas") {

                                for (var i in alvo.map) {
                                    // move os dados para uma global
                                    objetosDropadosDB.push(alvo.map[i]);
                                    /*
                                     * Criação da representação visual das tabelas do banco de dados
                                     */
                                    var camposTabela = "";
                                    var dados = alvo.map[i].data;
                                    var nomeTabela = dados.nome;
                                    // Transforma cada div em DOM, seta listener e inclui no DOM pai.

                                    var objetoDOM = domConstruct.toDom(
                                            "<div id='dbi_tabela_" + nomeTabela + "' style='border:1px solid #777;min-width:100px;max-width:150px;width:100px;'>" +
                                            "	<div id='dbi_titulo_" + nomeTabela + "' class='titulo-tabela-dnd'>" + nomeTabela + "<span id='dbi_apagar_tabela_" + nomeTabela + "' class='icone-excluir-tabela-dnd' style='float:right'>X</span></div>" +
                                            "	<div id='dbi_campos_" + nomeTabela + "' style='background-color:white;padding:2px;cursor:default'></div>" +
                                            "</div>"
                                            );
                                    domConstruct.place(objetoDOM, "containerDragDrop");
                                    on(dom.byId("dbi_apagar_tabela_" + nomeTabela), "click", function () {
                                        eraseTableDnd(nomeTabela, superficieGfx);
                                    });
                                    // Prepara os campos para serem inseridos dentro das "tabelas"								
                                    for (var i = 0; i < dados.campos.length; i++) {
                                        var nomeCampo = dados.campos[i];
                                        var campoTabela = domConstruct.toDom(
                                                "<div class='campo-tabela-dnd' style='width:100%;' id='" + nomeCampo + "_" + nomeTabela + "'>" +
                                                nomeCampo + "<span id='dbi_excluir_campo_" + nomeCampo + "_" + nomeTabela + "' class='icone-excluir-campo-dnd'>X</span></div>"
                                                );
                                        domConstruct.place(campoTabela, "dbi_campos_" + nomeTabela);
                                        on(dom.byId("dbi_excluir_campo_" + nomeCampo + "_" + nomeTabela), "click", function () {
                                            eraseTableFieldDnd(this);
                                        });
                                    }

                                    // Transforma em componente moveable e comunica o que fazer ao terminar de arrastá-lo
                                    var quadroMovel = new move.parentConstrainedMoveable(objetoDOM, {area: 'padding', handle: "dbi_titulo" + nomeTabela, within: true});
                                    /*
                                     *	Criação das linhas de relacionamento/cardinalidade
                                     */
                                    // FK
                                    // Se existem chaves estrangeiras no objeto
                                    if (dados.fk != null && dados.fk != undefined) {
                                        // Para cada chave estrangeiras faça
                                        console.log("length fk: " + dados.fk.length);
                                        for (var i = 0; dados.fk.length > i; i++) {
                                            console.log("i: " + i);
                                            // Para cada objeto na lista de objetos dropados faça
                                            console.log("n objetos: " + objetosDropadosDB.length);
                                            console.log("teste: " + objetosDropadosDB[0]);
                                            for (var ii in objetosDropadosDB[0]) {
                                                console.log(objetosDropadosDB[0][ii]);
                                            }
                                            console.log("data: " + objetosDropadosDB[0].data)
                                            for (var j = 0; objetosDropadosDB.length > j; j++) {
                                                console.log("objeto dropado: " + objetosDropadosDB[j].data.nome);
                                                console.log("fk: " + dados.fk[i].entidade)
                                                // Se existe a representacao da tabela na lista entao
                                                if (objetosDropadosDB[j].data.nome == dados.fk[i].entidade) {
                                                    console.log("encontrada tabela lookup");
                                                    // cria linha na superficie de desenho (x1 e y1 referentes ao quadro atual)
                                                    // (x2 e y2 referentes a tabela lookup)
                                                    var x1 = quadroMovel.node.style.left;
                                                    var y1 = quadroMovel.node.style.top;
                                                    var domTabelaLookup = dom.byId("dbi_tabela_" + objetosDropadosDB[j].data.nome);
                                                    var x2 = domTabelaLookup.style.left;
                                                    var y2 = domTabelaLookup.style.top;
                                                    console.log("x1: " + x1 + " y1: " + y1 + " - x2: " + x2 + " y2: " + y2);
                                                    var linha = superficieGfx.createLine({x1: x1, y1: y1, x2: x2, y2: y2}).setStroke("black");
                                                    var strIdLinha = objetoDOM.id + ">" + domTabelaLookup.id;
                                                    linhasDB.push({id: strIdLinha, obj: linha});
                                                    console.log("criou linha " + strIdLinha);
                                                    break;
                                                }
                                            }
                                        }
                                    }


                                    // PK - verifica se alguma tabela da lista de objetos dropados faz referência à tabela atual
                                    // Para cada objeto dropado faça
                                    for (var i = 0; objetosDropadosDB.length > i; i++) {
                                        var chavesEstrangeiras = objetosDropadosDB[i].data.fk
                                        if (chavesEstrangeiras != null && chavesEstrangeiras != undefined) {
                                            for (var iFK = 0; chavesEstrangeiras.length > iFK; iFK++) {
                                                // Se nome da tabela na fk é igual ao nome da tabela atual entao											
                                                if (chavesEstrangeiras[iFK].entidade == nomeTabela) {
                                                    // cria linha, onde x2 e y2 são da tabela atual												
                                                    var domTabelaOrigem = dom.byId("dbi_tabela_" + objetosDropadosDB[i].data.nome);
                                                    var x1 = domTabelaOrigem.style.left;
                                                    var y1 = domTabelaOrigem.style.top;
                                                    var x2 = quadroMovel.node.style.left;
                                                    var y2 = quadroMovel.node.style.top;
                                                    var linha = superficieGfx.createLine({x1: x1, y1: y1, x2: x2, y2: y2}).setStroke("black");
                                                    var strIdLinha = domTabelaOrigem.id + ">" + objetoDOM.id;
                                                    linhasDB.push({id: strIdLinha, obj: linha});
                                                    console.log("linha criada: " + strIdLinha);
                                                }
                                            }
                                        }
                                    }

                                    /*
                                     *	Toda vez que um quadro/tabela é movido atualiza a posicao da linha
                                     */
                                    aspect.after(quadroMovel, "onMoveStop", function (mover) {

                                        console.log("x:" + quadroMovel.node.style.left + " y:" + quadroMovel.node.style.top);
                                        var novoX = quadroMovel.node.style.left;
                                        var novoY = quadroMovel.node.style.top;
                                        //verifica em cada linha
                                        for (var iLinha in linhasDB) {
                                            var strIdLinha = linhasDB[iLinha].id;
                                            console.log("id linha: " + strIdLinha);
                                            var identificadores = strIdLinha.split(">");
                                            if (quadroMovel.node.id == identificadores[0]) {
                                                // altera x1 e y1											
                                                x2Atual = linhasDB[iLinha].obj.shape.x2;
                                                y2Atual = linhasDB[iLinha].obj.shape.y2;
                                                // cria nova linha e apaga a antiga
                                                superficieGfx.remove(linhasDB[iLinha].obj);
                                                var novaLinha = superficieGfx.createLine({x1: novoX, y1: novoY, x2: x2Atual, y2: y2Atual}).setStroke("black");
                                                linhasDB[iLinha].obj = novaLinha;
                                            } else if (quadroMovel.node.id == identificadores[1]) {
                                                // altera x2 e y2
                                                x1Atual = linhasDB[iLinha].obj.shape.x1;
                                                y1Atual = linhasDB[iLinha].obj.shape.y1;
                                                // cria nova linha e apaga a antiga
                                                superficieGfx.remove(linhasDB[iLinha].obj);
                                                var novaLinha = superficieGfx.createLine({x1: x1Atual, y1: y1Atual, x2: novoX, y2: novoY}).setStroke("black");
                                                linhasDB[iLinha].obj = novaLinha;
                                            }

                                        }

                                    });
                                    // apaga o objeto de dentro do alvo
                                    alvo.map = [];
                                    alvo.selectAll().deleteSelectedNodes();
                                }

                            }

                            // oculta o target ( nesse caso: 'targetDragDrop')
                            alvo.node.style.display = 'none';
                        }
                    });
              },
                saveDatabaseSelection: function () {
                    // examina todos os elementos filhos da div para pegar as tabelas
                    // para cada tabela pegar seus campos ainda habilitados/ativos
                    var container = dom.byId("containerDragDrop");
                    var tabelas = container.childNodes;
                    for (var iNode = 0; tabelas.length > iNode; iNode++) {
                        if (tabelas[iNode].id && tabelas[iNode].id != "targetDragDrop") {
                            console.log("tabela localizada : " + tabelas[iNode].id);
                            // se o div com o campo tiver o atributo 'excluido' e este for igual a true
                            // nao inclui no objeto
                        }
                    }
                }

            }

        });