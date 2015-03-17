angular.module("smartcities")
.controller("LangsCtrl", function ($scope, LangsAPI){
	$scope.titulo = 'Smartcities - Langs';
	$scope.carregarLangs = function(){
		LangsAPI.getLangs().success(function(data, status) {
			$scope.langs = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarLang = function(lang){
		LangsAPI.incluirLang(lang).success(function(data, status) {
			$scope.carregarLangs();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarLangs();
})
.factory("LangsAPI", function($http){
	var _getLangs = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/langs");
	};
	var _incluirLang = function(lang){
		return $http.post("http://localhost:8080/smartcitie_db/rest/langs", lang);
	};
	return {
		getLangs : _getLangs,
		incluirLang : _incluirLang,
	}
});