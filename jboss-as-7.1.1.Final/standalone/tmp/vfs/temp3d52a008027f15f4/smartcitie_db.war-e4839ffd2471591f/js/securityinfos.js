angular.module("smartcities")
.controller("SecurityInfosCtrl", function ($scope, SecurityInfosAPI){
	$scope.titulo = 'Smartcities - SecurityInfos';
	$scope.carregarSecurityInfos = function(){
		SecurityInfosAPI.getSecurityInfos().success(function(data, status) {
			$scope.securityInfos = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarSecurityInfo = function(securityInfo){
		SecurityInfosAPI.incluirSecurityInfo(securityInfo).success(function(data, status) {
			$scope.carregarSecurityInfos();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarSecurityInfos();
})
.factory("SecurityInfosAPI", function($http){
	var _getSecurityInfos = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/securityinfos");
	};
	var _incluirSecurityInfo = function(securityInfo){
		return $http.post("http://localhost:8080/smartcitie_db/rest/securityinfos", securityInfo);
	};
	return {
		getSecurityInfos : _getSecurityInfos,
		incluirSecurityInfo : _incluirSecurityInfo,
	}
});