'use strict';

angular.
  module('meetupinizeApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template:
          '<site-header></site-header>' +
          '<event-main></event-main>' +
          '<site-footer></site-footer>'
        })
    }
  ]);
