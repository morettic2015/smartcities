angular.module("smartcities")
.controller("CountriesCtrl", function ($scope, CountriesAPI){
	$scope.titulo = 'Smartcities - Countries';
	$scope.carregarCountries = function(){
		CountriesAPI.getCountries().success(function(data, status) {
			$scope.countries = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarCountry = function(country){
		CountriesAPI.incluirCountry(country).success(function(data, status) {
			$scope.carregarCountries();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarCountries();
})
.factory("CountriesAPI", function($http){
	var _getCountries = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/countries");
	};
	var _incluirCountry = function(country){
		return $http.post("http://localhost:8080/smartcitie_db/rest/countries", country);
	};
	return {
		getCountries : _getCountries,
		incluirCountry : _incluirCountry,
	}
});