angular.module("smartcities")
.controller("AdressesCtrl", function ($scope, AdressesAPI){
	$scope.titulo = 'Smartcities - Adresses';
	$scope.carregarAdresses = function(){
		AdressesAPI.getAdresses().success(function(data, status) {
			$scope.adresses = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarAdress = function(adress){
		AdressesAPI.incluirAdress(adress).success(function(data, status) {
			$scope.carregarAdresses();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarAdresses();
})
.factory("AdressesAPI", function($http){
	var _getAdresses = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/adresses");
	};
	var _incluirAdress = function(adress){
		return $http.post("http://localhost:8080/smartcitie_db/rest/adresses", adress);
	};
	return {
		getAdresses : _getAdresses,
		incluirAdress : _incluirAdress
	}
});