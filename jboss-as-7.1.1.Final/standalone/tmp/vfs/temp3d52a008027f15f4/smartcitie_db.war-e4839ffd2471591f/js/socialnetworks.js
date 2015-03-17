angular.module("smartcities")
.controller("SocialNetworksCtrl", function ($scope, SocialNetworksAPI){
	$scope.titulo = 'Smartcities - Countries';
	$scope.carregarSocialNetworks = function(){
		SocialNetworksAPI.getSocialNetworks().success(function(data, status) {
			$scope.socialnetworks = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarSocialNetwork = function(socialnetwork){
		SocialNetworksAPI.incluirSocialNetwork(socialnetwork).success(function(data, status) {
			$scope.carregarSocialNetworks();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarSocialNetworks();
})
.factory("SocialNetworksAPI", function($http){
	var _getSocialNetworks = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/socialnetworks");
	};
	var _incluirSocialNetwork = function(socialnetwork){
		return $http.post("http://localhost:8080/smartcitie_db/rest/socialnetworks", socialnetwork);
	};
	return {
		getSocialNetworks : _getSocialNetworks,
		incluirSocialNetwork : _incluirSocialNetwork,
	}
});