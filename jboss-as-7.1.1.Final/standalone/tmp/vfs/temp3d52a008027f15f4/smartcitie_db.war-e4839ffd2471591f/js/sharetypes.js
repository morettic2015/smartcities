angular.module("smartcities")
.controller("ShareTypesCtrl", function ($scope, ShareTypesAPI){
	$scope.titulo = 'Smartcities - ShareTypes';
	$scope.carregarShareTypes = function(){
		ShareTypesAPI.getShareTypes().success(function(data, status) {
			$scope.sharetypes = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarShareType = function(sharetype){
		ShareTypesAPI.incluirShareType(sharetype).success(function(data, status) {
			$scope.carregarShareTypes();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarShareTypes();
})
.factory("ShareTypesAPI", function($http){
	var _getShareTypes = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/sharetypes");
	};
	var _incluirShareType = function(sharetype){
		return $http.post("http://localhost:8080/smartcitie_db/rest/sharetypes", sharetype);
	};
	return {
		getShareTypes : _getShareTypes,
		incluirShareType : _incluirShareType,
	}
});