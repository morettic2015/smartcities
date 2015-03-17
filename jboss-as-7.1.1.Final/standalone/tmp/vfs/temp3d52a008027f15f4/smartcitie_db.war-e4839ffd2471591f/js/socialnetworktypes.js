angular.module("smartcities")
.controller("SocialNetworkTypesCtrl", function ($scope, SocialNetworkTypesAPI){
	$scope.titulo = 'Smartcities - Countries';
	$scope.carregarSocialNetworkTypes = function(){
		SocialNetworkTypesAPI.getSocialNetworkTypes().success(function(data, status) {
			$scope.socialnetworktypes = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarSocialNetworkType = function(socialnetworktype){
		SocialNetworkTypesAPI.incluirSocialNetworkType(socialnetworktype).success(function(data, status) {
			$scope.carregarSocialNetworkTypes();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarSocialNetworkTypes();
})
.factory("SocialNetworkTypesAPI", function($http){
	var _getSocialNetworkTypes = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/socialnetworktypes");
	};
	var _incluirSocialNetworkType = function(socialnetworktype){
		return $http.post("http://localhost:8080/smartcitie_db/rest/socialnetworktypes", socialnetworktype);
	};
	return {
		getSocialNetworkTypes : _getSocialNetworkTypes,
		incluirSocialNetworkType : _incluirSocialNetworkType,
	}
});