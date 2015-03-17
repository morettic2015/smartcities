angular.module("smartcities")
.controller("DriversCtrl", function ($scope, DriversAPI){
	$scope.titulo = 'Smartcities - Drivers';
	$scope.carregarDrivers = function(){
		DriversAPI.getDrivers().success(function(data, status) {
			$scope.drivers = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarDriver = function(driver){
		DriversAPI.incluirDriver(driver).success(function(data, status) {
			$scope.carregarDrivers();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarDrivers();
})
.factory("DriversAPI", function($http){
	var _getDrivers = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/drivers");
	};
	var _incluirDriver = function(driver){
		return $http.post("http://localhost:8080/smartcitie_db/rest/drivers", driver);
	};
	return {
		getDrivers : _getDrivers,
		incluirDriver : _incluirDriver,
	}
});