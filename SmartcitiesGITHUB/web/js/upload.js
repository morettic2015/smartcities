/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 var UploadBean = new function () {
 this.mForm = null;
 this.mFormData = null;
 this.xhr = null;
 this.fileInput = null;
 this.url = null
 //creates a DOM iframe to submit files to
 this.initialize = function () {
 
 this.xhr = new XMLHttpRequest();
 
 this.xhr.onreadystatechange = function () {
 if (xhr.readyState === 4 && xhr.status === 200) {
 console.log(xhr.responseText);
 alert(xhr.responseText)
 }
 }
 //
 this.xhr.upload.onprogress = function (e) {
 // it will never come inside here
 }
 }
 
 this.createDomForm = function (metodo, url) {
 this.url = url;
 this.mForm = document.createElement("form");
 this.mForm.setAttribute('method', metodo);
 this.mForm.setAttribute('enctype', 'multipart/form-data');
 this.mForm.setAttribute('action', this.url = url);      
 this.mFormData = new FormData(this.mForm);
 }
 
 this.setField = new function (ffield) {
 this.fileInput = document.getElementById(ffield);
 var file = this.fileInput.files[0];
 //this.mFormData = new FormData();
 this.mFormData.append('file', file);
 }
 
 //Post form data
 this.postForm = function () {
 this.xhr.open('POST', this.url , true);
 this.xhr.send(this.mFormData);
 }
 }
 */

function initFormUPLOAD() {
    if (supportAjaxUploadWithProgress()) {
        // Ajax uploads are supported!
        // Change the support message and enable the upload button
        var notice = document.getElementById('upload-status');
        var uploadBtn = document.getElementById('upload-button-id');
        
		/*require([
			"dojo/i18n!./nls/texts.js"
		],function(
			textos
		){
			notice.innerHTML = textos.escolhaArquivo;
		});*/
		
        uploadBtn.removeAttribute('disabled');
        // Init the Ajax form submission
        initFullFormAjaxUpload();
        // Init the single-field file upload
        //initFileOnlyAjaxUpload();
    }
}

function supportAjaxUploadWithProgress() {
    return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();
    // Is the File API supported?
    function supportFileAPI() {
        var fi = document.createElement('INPUT');
        fi.type = 'file';
        return 'files' in fi;
    }
    ;
    // Are progress events supported?
    function supportAjaxUploadProgressEvents() {
        var xhr = new XMLHttpRequest();
        return !!(xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
    }
    ;
    // Is FormData supported?
    function supportFormData() {
        return !!window.FormData;
    }
}
// Actually confirm support

function initFullFormAjaxUpload() {
    var form = document.getElementById('form-id');
    form.onsubmit = function () {
        // FormData receives the whole form
        var formData = new FormData(form);
        // We send the data where the form wanted
        var action = form.getAttribute('action');
        // Code common to both variants
        sendXHRequest(formData, action);
        // Avoid normal form submission
        return false;
    }
}
function initFileOnlyAjaxUpload() {
    var uploadBtn = document.getElementById('upload-button-id');
    uploadBtn.onclick = function (evt) {
        var formData = new FormData();
        // Since this is the file only, we send it to a specific location
        var action = 'rest/importer/upload';
        // FormData only has the file
        var fileInput = document.getElementById('file-id');
        var file = fileInput.files[0];
        formData.append('our-file', file);
        // Code common to both variants
        sendXHRequest(formData, action);
    }
}
// Once the FormData instance is ready and we know
// where to send the data, the code is the same
// for both variants of this technique
function sendXHRequest(formData, uri) {
    // Get an XMLHttpRequest instance
    var xhr = new XMLHttpRequest();
    // Set up events
    xhr.upload.addEventListener('loadstart', onloadstartHandler, false);
    xhr.upload.addEventListener('progress', onprogressHandler, false);
    xhr.upload.addEventListener('load', onloadHandler, false);
    xhr.addEventListener('readystatechange', onreadystatechangeHandler, false);
    // Set up request
    xhr.open('POST', uri, true);
    // Fire!
    xhr.send(formData);
}
// Handle the start of the transmission
function onloadstartHandler(evt) {
    var div = document.getElementById('upload-status');
    div.innerHTML = 'Upload started.';
}
// Handle the end of the transmission
function onloadHandler(evt) {
    var div = document.getElementById('upload-status');
    div.innerHTML += '<' + 'br>File uploaded. Waiting for response.';
}
// Handle the progress
function onprogressHandler(evt) {
    var div = document.getElementById('progress');
    var percent = evt.loaded / evt.total * 100;
    div.innerHTML = 'Progress: ' + percent + '%';
}
// Handle the response from the server
function onreadystatechangeHandler(evt) {
    var status, text, readyState;
    try {
        readyState = evt.target.readyState;
        text = evt.target.responseText;
        status = evt.target.status;
    }
    catch (e) {
        return;
    }
    if (readyState == 4 && status == '200' && evt.target.responseText) {
        var status = document.getElementById('upload-status');
        status.innerHTML += '<' + 'br>Success!';
        //var result = document.getElementById('result');
        
        myProfile.uploadBean = eval("("+evt.target.responseText+")");
        
        //result.innerHTML = '<p>OK</p>';
        myDialog.hide();
    }
}
