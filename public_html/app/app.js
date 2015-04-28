/// <reference path="../js/angular.min.js" />
// Register the main application
var app = angular.module('Application', [
    'ngRoute',
    'ngResource',
    'highcharts-ng',
    'ui.bootstrap'
]);

var controllers = {};
var factories = {};

// Register the controllers
app.controller(controllers);
// Register the factories
app.factory(factories);

// Set config
app.config(function ($routeProvider) {
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
            templateUrl: 'app/partials/static-hotels.html',
            controller: 'HotelsController'
        })
        .otherwise({ redirectTo: '/frontpage' });
});