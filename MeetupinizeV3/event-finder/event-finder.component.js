'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('meetupinizeApp').
  component('eventFinder', {
    templateUrl: 'event-finder/event-finder.template.html',
  controller: function EventFinderController($scope, $http) {
    var self = this

    $http.get('data/category.json').then(function(response) {
      self.category = response.data.results;
      $scope.$root.category = self.category
    })

  }
});
