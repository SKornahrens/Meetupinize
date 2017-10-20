'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
module('meetupinizeApp').
component('eventFinder', {
  templateUrl: 'event-finder/event-finder.template.html',
  controller: function EventFinderController($scope, $http, $filter, $timeout) {
    var self = this
    var MeetupKey = "6a3426d1c7d3565234713b22683948"

    //automatically gets event Category list
    $http.get( "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/categories/?key=" + MeetupKey).then(function(response) {
      self.category = response.data.results;
      $scope.$root.category = self.category
    })

    $scope.category = "34"
    $scope.zipcode = "80203"

    $scope.cityFinder = function _cityFinder(keyEvent) {
      if (keyEvent.which === 13 && $scope.form.$valid) {
        $scope.$root.createEvents($scope.category, $scope.zipcode)
      }
    }

    $scope.categoryChange = function _categoryChange() {
      $scope.$root.createEvents($scope.category, $scope.zipcode)
    }

    function getZipCity(zip) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ $scope.zipcode + "&sensor=true").then(response => {
        $scope.zipCity = response.data.results[0].address_components[2].long_name + "\'s upcoming events"
      })
    }

    function hideElement(select) {
      var locations = [].slice.call(document.querySelectorAll(select))
        locations.map(el => el.classList.add('hide'))
    }

    function showElement(select) {
      var locations = [].slice.call(document.querySelectorAll(select))
        $timeout(() => locations.map(el => el.classList.remove('hide')), 500)
    }




    $scope.$root.createEvents = function _createEvents(category, zipcode) {
      hideElement('.EventCityLocation')
      hideElement('.AllEvents')
      $http.get("https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip="+ zipcode + "&country=United%20States&city=Denver&state=CO&category=" + category + "&time=,1w&radius=10&key=" + MeetupKey).then(function(response) {
        self.event = response.data.results;
        $scope.$root.event = self.event
        $scope.getDateRange($scope.$root.event)
      }).then(() => {
        getZipCity($scope.zipcode)
        showElement('.EventCityLocation')
        showElement('.AllEvents')
      })
    }

    $scope.getDateRange = function _getDateRange() {
        var upcomingWeek = {}
        for (var i = 0; i <= 7; i++) {
        upcomingWeek[(moment().add(i, 'days').format('dddd, MMMM Do'))] = []
        }
        $scope.getWeekDaysAndEvents(upcomingWeek, $scope.$root.event)
    }

    $scope.getWeekDaysAndEvents = function _getWeekDaysAndEvents(daysofweek, events) {
        var filterEventstoDays = events.reduce(function (allDates, eventData) {
          var eventDate = moment(eventData.time).format('dddd, MMMM Do')
          if (!("venue" in eventData)) {
            eventData["venue"] = {name : "Event has no location yet"}
            allDates[eventDate].push(eventData)
          } else {
            allDates[eventDate].push(eventData)
          }
          return allDates;
        }, daysofweek)
        $scope.$root.sortedevents = filterEventstoDays
    }

  }
});
