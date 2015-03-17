angular.module("smartcities")
.controller("ProfileLangsCtrl", function ($scope, ProfileLangsAPI){
	$scope.titulo = 'Smartcities - ProfileLangs';
	$scope.carregarProfileLangs = function(){
		ProfileLangsAPI.getProfileLangs().success(function(data, status) {
			$scope.profilelangs = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarProfileLang = function(profilelang){
		ProfileLangsAPI.incluirProfileLang(profilelang).success(function(data, status) {
			$scope.carregarProfileLangs();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarProfileLangs();
})
.factory("ProfileLangsAPI", function($http){
	var _getProfileLangs = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/profilelangs");
	};
	var _incluirProfileLang = function(profilelang){
		return $http.post("http://localhost:8080/smartcitie_db/rest/profilelangs", profilelang);
	};
	return {
		getProfileLangs : _getProfileLangs,
		incluirProfileLang : _incluirProfileLang,
	}
});