angular.module("smartcities")
.controller("DatasourcedriversCtrl", function ($scope, DatasourcedriversAPI){
	$scope.titulo = 'Smartcities - Datasourcedrivers';
	$scope.carregarDatasourcedrivers = function(){
		DatasourcedriversAPI.getDatasourcedrivers().success(function(data, status) {
			$scope.datasourcedrivers = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarDatasourcedriver = function(datasourcedriver){
		DatasourcedriversAPI.incluirDatasourcedriver(datasourcedriver).success(function(data, status) {
			$scope.carregarDatasourcedrivers();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarDatasourcedrivers();
})
.factory("DatasourcedriversAPI", function($http){
	var _getDatasourcedrivers = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/datasourcedrivers");
	};
	var _incluirDatasourcedriver = function(datasourcedriver){
		return $http.post("http://localhost:8080/smartcitie_db/rest/datasourcedrivers", datasourcedriver);
	};
	return {
		getDatasourcedrivers : _getDatasourcedrivers,
		incluirDatasourcedriver : _incluirDatasourcedriver,
	}
});