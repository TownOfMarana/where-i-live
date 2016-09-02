'use strict';

/**
 * @ngdoc overview
 * @name whereILiveApp
 * @description
 * # whereILiveApp
 *
 * Main module of the application.
 */
angular
  .module('whereILiveApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
