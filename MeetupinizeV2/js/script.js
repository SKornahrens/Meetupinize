// Global Variables
// Meetup.com API Key for Steve Kornahrens
var MeetupKey = "6a3426d1c7d3565234713b22683948"
//Variables needed for Data Gathering and Looping
var GroupEventPairs = {}
var CategoryData = []
var EventData = []
var DateArray
var StartDate
var EndDate
var SetDates
var ZipCity
var ZipCodeChosen = $("#CityFinder").val()

$(document).ready(function() {
  window['moment-range'].extendMoment(moment)

  // Makes two function calls immediately when document.ready, one to populate Category List and the other to create Tech Event List for 80203
  CreateCategoryList()
  CreateEvents(34, 80203)

  $("#CityFinder").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      ZipCodeChosen = $("#CityFinder").val()
      IsValidZipCode(ZipCodeChosen)
    }
  })

  $("#Categories").change(function() {
    ZipCodeChosen = $("#CityFinder").val()
    IsValidZipCode(ZipCodeChosen)
  })

  // Checks if zip entered by user is valid, runs CreateEvents if valid is true
  function IsValidZipCode(zip) {
    var isValid = /^[0-9]{5}(?:-[0-9]{4})?$/.test(zip)
    if (isValid) {
      var CategoryChosen = $("#Categories").val()
      CreateEvents(CategoryChosen, zip)
    }
    else {
      alert('Invalid ZipCode')
    }
  }

  // Creates the list of current Event Categories available on Meetup.com
  // Called immediately when document is loaded
  function CreateCategoryList() {
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/categories/?key=" + MeetupKey
    })
    .then(function(GetCategoryData) {
      CategoryData.push(GetCategoryData.results)
    })
    .then(function () {
      CategoryData[0].forEach((Category) => {
        $('#Categories').append(new Option(Category.sort_name, Category.id))
      })
      $("#Categories").val("34")
    })
  }

  // Function Called on Document.ready, Zip Code change, and Event Category change
  // Creates Event List, changes " "'s Upcoming Events to zip's city, and creates date range based of range from EventData index 0 to last index
  function CreateEvents(Category, Zipcode) {
    //Clears Events and EventData for Get Call
    $("#EventList").empty()
    EventData = []
    $("#OneSecFindingResults").removeClass("hide")

    $.when(
      $.ajax({
        method: "GET",
        url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip="+ Zipcode + "&country=United%20States&city=Denver&state=CO&category=" + Category + "&time=,1w&radius=10&key=" + MeetupKey
      }),
      $.ajax({
        method: "GET",
        url: "http://maps.googleapis.com/maps/api/geocode/json?address="+ Zipcode + "&sensor=true"
      })
    )
    .then(function (GetEventData, GetZipCity) {
      EventData.push(GetEventData[0].results)
      console.log(EventData)
      console.log(EventData[0].length)
      ZipCity = GetZipCity[0].results[0].address_components[2].long_name
      var CategoryTitle = $("#Categories").find(":selected").text()
      if (EventData[0].length == 0) {
        throw new Error("Sorry no upcoming " + CategoryTitle + " Events found for " + ZipCity)
      }
    })
    .then(function(){
      $('#CityEventTitle').text(ZipCity + "'s Upcoming Events")
    })
    //Creates an array of Dates from first array index to last array index
    .then(function () {
      $("#OneSecFindingResults").addClass("hide")
      var count = 0
      StartDate = new Date(EventData[0][0].time)
      EndDate = new Date(EventData[0][EventData[0].length - 1].time)
      RangeOfDates = moment.range(StartDate, EndDate)
      DateArray = Array.from(RangeOfDates.by('day'))
      DateArray.map(m => m.format('DD'))
      DateArray.forEach((datefound) => {
        var DateToSet = moment(datefound._d).format("dddd, MMMM Do")
        var DayCount = "Day" + count
        $('#EventList').append(`
          <div id=${DayCount} class="animated fadeInLeft DateAdded">
          <h2 class="SetDate">${DateToSet}</h2>
          </div>
          `)
          count++
        })
        SetDates = $(".SetDate")
      })
      .then(function () {
        var EventCount = 0
        EventData[0].forEach((EventFound) => {
          Array.from(SetDates).forEach((datefound) => {
            // DateToSet = moment(datefound._d).format("dddd, MMMM Do")
            if (moment(EventFound.time).format("dddd, MMMM Do") === datefound.innerHTML) {
              //Convert Event's Time to usable format
              var Time = moment(EventFound.time).format("h:mma")
              //if statement to check if the EventFound contains a venue key
              var EventLoc
              if (!EventFound.venue) {
                EventLoc = "Location Not Selected"
              } else {
                EventLoc = EventFound.venue.name
              }

              $(datefound).parent().append(`
                <a class="EventLink" href="${EventFound.event_url}" target="_blank">
                <div id="Event${EventCount}" class="Event animated fadeInLeft">
                <div class="EventLeft">
                <p class="EventTimeDate">${Time}</p>
                </div>
                <div class="EventRight">
                <h4 class="EventName">${EventFound.name}</h4>
                <h4 class="GroupName">${EventFound.group.name}</h4>
                <h5 class="EventLocation">${EventLoc}</h5>
                </div>
                </div>
                </a>
                `)
                // use below for icon link
                // <i class="material-icons NTicon">open_in_new</i>
                //Creates Object Key Event# with array value Group Name and Event ID numbers for each event
                GroupEventPairs["Event" + EventCount] = []
                GroupEventPairs["Event" + EventCount].push(EventFound.group.urlname)
                GroupEventPairs["Event" + EventCount].push(EventFound.id)
                EventCount++
              }
            })
          })
        })
        .then(function() {
          var DateAdd = $('.DateAdded')
          Array.from(DateAdd).forEach((datefound) => {
            if($(datefound).children().length < 2) {
              $(datefound).append(`
                <h5 class="NoEvent">No Events Today.</h5>`)
              }
            })
          })
          .catch(function (error) {
            $("#OneSecFindingResults").addClass("hide")
            $("#CityEventTitle").text(error.message)
          })
        }
        //Event Listener for Hightlighting Events
        $('#EventList').on('mouseenter', '.Event', function() {
          $(this).toggleClass("EventHovered");
        });
        $('#EventList').on('mouseleave', '.Event', function() {
          $(this).toggleClass("EventHovered");
        });

      })
