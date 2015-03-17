angular.module("smartcities")
.controller("CitiesCtrl", function ($scope, CitiesAPI){
	$scope.titulo = 'Smartcities - Cities';
	$scope.carregarCities = function(){
		CitiesAPI.getCities().success(function(data, status) {
			$scope.cities = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarCity = function(city){
		CitiesAPI.incluirCity(city).success(function(data, status) {
			$scope.carregarCities();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarCities();
})
.factory("CitiesAPI", function($http){
	var _getCities = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/cities");
	};
	var _incluirCity = function(city){
		return $http.post("http://localhost:8080/smartcitie_db/rest/cities", city);
	};
	return {
		getCities : _getCities,
		incluirCity : _incluirCity
	}
});