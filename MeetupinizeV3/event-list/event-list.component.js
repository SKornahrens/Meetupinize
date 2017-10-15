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
        getDateRange(self.event)
      })

      function getDateRange(events) {
        var allDates = []
        events.map(event => {
          allDates.push($filter('date')(event.time, 'EEEE, MMMM d'))
        })
        eliminateDuplicates(allDates)
      }

      function eliminateDuplicates(dates) {
        var obj={}
        var uniqueDates = []
        for (var i=0;i<dates.length;i++) {
          obj[dates[i]]=0
        }
        for (i in obj) {
          uniqueDates.push(i)
        }
        $scope.$root.uniqueDates = uniqueDates
      }

      $scope.filterEventToDays = (events, uniqueDates) => {
        var count = 0
        events.map(event => {
          var dateSimplified = $filter('date')(event.time, 'EEEE, MMMM d')
          console.log(dateSimplified)
          uniqueDates.map( date => {
            if (dateSimplified === date) {
              console.log("match")
              count++
            }
          })
        })
        console.log(count);
      }


    }
  });
