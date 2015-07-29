/**
 *	Módulo View ( Funcionalidades base da View )
 *	
 *	Descrição:
 *		Módulo base da camada View da aplicação. Funcionalidades comuns aos demais módulos
 *		da view devem ser declarados aqui.
 *
 *	Funções públicas:
 *		abrePopUpModal(), modalMessage()
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
	 
	var openModal = function (paginaConteudo, titulo, largura, altura, messageOnly) {
		var larguraModal = largura != undefined && largura != null ? largura : 400;
		var alturaModal = altura != undefined && altura != null ? altura : 200;
		var larguraContent = larguraModal - 25;
		var alturaContent = alturaModal - 52;
		if (messageOnly) {
			contentPane_PopUp.set("content", paginaConteudo);
		} else {
			contentPane_PopUp.set("href", paginaConteudo);
		}
		domStyle.set("myDialog", "width", larguraModal + "px");
		domStyle.set("myDialog", "height", alturaModal + "px");
		domStyle.set(contentPane_PopUp.domNode, "width", larguraContent + "px");
		domStyle.set(contentPane_PopUp.domNode, "height", alturaContent + "px");
		myDialog.set("title", titulo);
		myDialog.show();
	};
	
	return{
		
		/**
		 *	Métodos públicos
		 */
		 
		/**
		 * Função para abrir o modal. 
		 * @argument {paginaConteudo} paginaConteudo pagina html a ser carregada no modal, ou um texto (messageOnly=true)
		 * @argument {titulo} o texto que será exibido na barra de título do modal
		 * @argument {largura} define a largura do modal. Opcional.
		 * @argument {altura} define a altura do modal. Opcional.
		 * @argument {messageOnly} informa se o conteudo é um texto simples. Opcional.
		 * */
		abrePopUpModal: function (paginaConteudo, titulo, largura, altura, messageOnly) {
			openModal(paginaConteudo, titulo, largura, altura, messageOnly);
		},

		modalMessage: function (message, type) {
			openModal(message, type, null, 150, true);
		}
	}		

});