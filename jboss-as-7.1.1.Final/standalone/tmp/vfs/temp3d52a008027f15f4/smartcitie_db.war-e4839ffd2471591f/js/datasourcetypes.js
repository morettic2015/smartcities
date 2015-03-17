angular.module("smartcities")
.controller("DataSourceTypesCtrl", function ($scope, DataSourceTypesAPI){
	$scope.titulo = 'Smartcities - DataSourceTypes';
	$scope.carregarDataSourceTypes = function(){
		DataSourceTypesAPI.getDataSourceTypes().success(function(data, status) {
			$scope.datasourcetypes = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarDataSourceType = function(datasourcetype){
		DataSourceTypesAPI.incluirDataSourceType(datasourcetype).success(function(data, status) {
			$scope.carregarDataSourceTypes();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarDataSourceTypes();
})
.factory("DataSourceTypesAPI", function($http){
	var _getDataSourceTypes = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/datasourcetypes");
	};
	var _incluirDataSourceType = function(datasourcetype){
		return $http.post("http://localhost:8080/smartcitie_db/rest/datasourcetypes", datasourcetype);
	};
	return {
		getDataSourceTypes : _getDataSourceTypes,
		incluirDataSourceType : _incluirDataSourceType,
	}
});