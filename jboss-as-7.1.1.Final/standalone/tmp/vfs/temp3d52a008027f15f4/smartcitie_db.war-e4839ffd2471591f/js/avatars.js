angular.module("smartcities")
.controller("AvatarsCtrl", function ($scope, AvatarsAPI){
	$scope.titulo = 'Smartcities - Avatars';
	$scope.carregarAvatars = function(){
		AvatarsAPI.getAvatars().success(function(data, status) {
			$scope.avatars = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarAvatar = function(avatar){
		AvatarsAPI.incluirAvatar(avatar).success(function(data, status) {
			$scope.carregarAvatars();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarAvatars();
})
.factory("AvatarsAPI", function($http){
	var _getAvatars = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/avatars");
	};
	var _incluirAvatar = function(avatar){
		return $http.post("http://localhost:8080/smartcitie_db/rest/avatars", avatar);
	};
	return {
		getAvatars : _getAvatars,
		incluirAvatar : _incluirAvatar,
	}
});