'use strict';

angular.module("smartcities",['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	    .when('/', {
	        templateUrl: 'view/smartcities.html',
	        controller: 'SmartcitiesCtrl',
	    })
        .when('/countries', {
            templateUrl: 'view/countries.html',
            controller: 'CountriesCtrl',
        })
        .when('/states', {
            templateUrl: 'view/states.html',
            controller: 'StatesCtrl',
        })
        .when('/cities', {
            templateUrl: 'view/cities.html',
            controller: 'CitiesCtrl',
        })
        .when('/adresses', {
            templateUrl: 'view/adresses.html',
            controller: 'AdressesCtrl',
        })
        .when('/profiles', {
            templateUrl: 'view/profiles.html',
            controller: 'ProfilesCtrl',
        })
        .when('/socialnetworks', {
            templateUrl: 'view/socialnetworks.html',
            controller: 'SocialNetworksCtrl',
        })
        .when('/socialnetworktypes', {
            templateUrl: 'view/socialnetworktypes.html',
            controller: 'SocialNetworkTypesCtrl',
        })
        .when('/avatars', {
            templateUrl: 'view/avatars.html',
            controller: 'AvatarsCtrl',
        })
        .when('/datasourcedrivers', {
            templateUrl: 'view/datasourcedrivers.html',
            controller: 'DatasourcedriversCtrl',
        })
        .when('/sharetypes', {
            templateUrl: 'view/sharetypes.html',
            controller: 'ShareTypesCtrl',
        })
        .when('/datasources', {
            templateUrl: 'view/datasources.html',
            controller: 'DataSourcesCtrl',
        })        
        .when('/datasourcetypes', {
            templateUrl: 'view/datasourcetypes.html',
            controller: 'DataSourceTypesCtrl',
        })
        .when('/securityinfos', {
            templateUrl: 'view/securityinfos.html',
            controller: 'SecurityInfosCtrl',
        })  
        .when('/langs', {
            templateUrl: 'view/langs.html',
            controller: 'LangsCtrl',
        })
        .when('/profilelangs', {
            templateUrl: 'view/profilelangs.html',
            controller: 'ProfileLangsCtrl',
        })
        .when('/drivers', {
            templateUrl: 'view/drivers.html',
            controller: 'DriversCtrl',
        })        
         .otherwise({
            redirectTo: '/',
         });
}])
.controller("SmartcitiesCtrl", function ($scope){
	$scope.titulo = 'Smartcities';
});