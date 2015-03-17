angular.module("smartcities")
.controller("ProfilesCtrl", function ($scope, ProfilesAPI){
	$scope.titulo = 'Smartcities - Profiles';
	$scope.carregarProfiles = function(){
		ProfilesAPI.getProfiles().success(function(data, status) {
			$scope.profiles = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarProfile = function(profile){
		ProfilesAPI.incluirProfile(profile).success(function(data, status) {
			$scope.carregarProfiles();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarProfiles();
})
.factory("ProfilesAPI", function($http){
	var _getProfiles = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/profiles");
	};
	var _incluirProfile = function(profile){
		return $http.post("http://localhost:8080/smartcitie_db/rest/profiles", profile);
	};
	return {
		getProfiles : _getProfiles,
		incluirProfile : _incluirProfile
	}
});