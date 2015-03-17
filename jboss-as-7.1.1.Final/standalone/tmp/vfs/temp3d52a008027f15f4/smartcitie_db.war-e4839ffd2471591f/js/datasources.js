angular.module("smartcities")
.controller("DataSourcesCtrl", function ($scope, DataSourcesAPI){
	$scope.titulo = 'Smartcities - DataSources';
	$scope.carregarDataSources = function(){
		DataSourcesAPI.getDataSources().success(function(data, status) {
			$scope.datasources = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarDataSource = function(datasource){
		DataSourcesAPI.incluirDataSource(datasource).success(function(data, status) {
			$scope.carregarDataSources();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarDataSources();
})
.factory("DataSourcesAPI", function($http){
	var _getDataSources = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/datasources");
	};
	var _incluirDataSource = function(datasource){
		return $http.post("http://localhost:8080/smartcitie_db/rest/datasources", datasource);
	};
	return {
		getDataSources : _getDataSources,
		incluirDataSource : _incluirDataSource,
	}
});