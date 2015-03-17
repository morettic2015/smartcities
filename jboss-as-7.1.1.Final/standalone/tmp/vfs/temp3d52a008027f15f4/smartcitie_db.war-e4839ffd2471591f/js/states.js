angular.module("smartcities")
.controller("StatesCtrl", function ($scope, StatesAPI){
	$scope.titulo = 'Smartcities - States';
	$scope.carregarStates = function(){
		StatesAPI.getStates().success(function(data, status) {
			$scope.states = data;
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.adicionarState = function(state){
		StatesAPI.incluirState(state).success(function(data, status) {
			$scope.carregarStates();
		}).error(function(data, status) {
			console.error(data);
		});
	};
	$scope.carregarStates();
})
.factory("StatesAPI", function($http){
	var _getStates = function(){
		return $http.get("http://localhost:8080/smartcitie_db/rest/states");
	};
	var _incluirState = function(state){
		return $http.post("http://localhost:8080/smartcitie_db/rest/states", state);
	};
	return {
		getStates : _getStates,
		incluirState : _incluirState
	}
});