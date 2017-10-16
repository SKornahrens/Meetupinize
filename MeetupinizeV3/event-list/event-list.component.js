'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('meetupinizeApp').
  component('eventList', {
    templateUrl: 'event-list/event-list.template.html',
    controller: function EventListController($scope, $http, $filter) {
      var self = this;

      $scope.$root.event = []
      $scope.$root.uniqueDates = []

      function getData() {
        return $scope.$root.event
      }

      $http.get('data/event.json').then(function(response) {
        self.event = response.data.results;
        $scope.$root.event = self.event
        getWeekDaysAndEvents(self.event)
      })

      // if key for date does not exist create it and push first event to new object
      // if it does exist push data to corresponding object

      function getWeekDaysAndEvents(events) {
          var filterEventstoDays = events.reduce(function (allDates, eventData) {
            var eventDate = $filter('date')(eventData.time, 'EEEE, MMMM d')
            if (!allDates[eventDate]) allDates[eventDate] = []
              allDates[eventDate].push(eventData)
            return allDates;
          }, {});
          console.log(filterEventstoDays);
      }





    }
  });
