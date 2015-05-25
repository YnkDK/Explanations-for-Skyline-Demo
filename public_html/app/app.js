/// <reference path="../js/angular.min.js" />
// Register the main application

var backend = location.protocol + "//" + location.host + '/backend/';


var factories = {};

var app = angular.module('Application', [
    'ngRoute',
    'ngResource',
    'highcharts-ng',
    'ui.bootstrap',
    'uiGmapgoogle-maps'
]);

var controllers = {};
var directives = {};
app.factory(factories);

// Register the controllers
app.controller(controllers);
// Register the directives
app.directive(directives);

// Set config
app.config(function ($routeProvider, uiGmapGoogleMapApiProvider) {
    $routeProvider
        .when('/frontpage',
            {
                templateUrl: 'app/partials/frontpage.html',
                controller: 'TestController'
            })
        .when('/license',
            {
                templateUrl: 'app/partials/license.html'
            })
        .when('/hotels',
        {
            templateUrl: 'app/partials/hotels.html',
            controller: 'HotelsController'
        })
        .when('/hotels-map',
        {
            templateUrl: 'app/partials/hotels-map.html',
            controller: 'HotelsMapController'
        })
        .otherwise({ redirectTo: '/frontpage' });

    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});