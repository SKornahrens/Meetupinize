'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('meetupinizeApp').
  component('eventList', {
    templateUrl: 'event-list/event-list.template.html',
    controller: function EventListController($scope, $http) {
      $scope.category = 34
      $scope.zipcode = 80203
      $scope.$root.createEvents($scope.category, $scope.zipcode)
    }
  });
