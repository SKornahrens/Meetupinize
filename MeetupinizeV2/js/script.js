//Needed Variables

// Meetup.com API Key for Steve Kornahrens
var MeetupKey = "6a3426d1c7d3565234713b22683948";

//Variables needed for Data Gathering and Looping
var CategoryData = [];
var EventData = [];
$(document).ready(function() {

  //Loops through given Group URLs
  $.when(
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/categories/?key=" + MeetupKey
    }),
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=80203&country=United%20States&city=Denver&state=CO&category=34&time=,1w&key=" + MeetupKey
    })
  )
  .then(function (GetCategoryData, GetEventData) {
    CategoryData.push(GetCategoryData[0].results);
    EventData.push(GetEventData[0].results);
  })
  .then(function () {
    CategoryData[0].forEach((Category) => {
      $('#Categories').append(new Option(Category.sort_name, Category.id));
    })
    $("#Categories").val("34");
  })
  .then(function () {
    //Process date and time
    //Date Creation before assigning to EventLocation and EventTime
    // var date = new Date();
    //
    // var month = new Array();
    // month[0] = "January";
    // month[1] = "February";
    // month[2] = "March";
    // month[3] = "April";
    // month[4] = "May"
    // month[5] = "June";
    // month[6] = "July";
    // month[7] = "August";
    // month[8] = "September";
    // month[9] = "October";
    // month[10] = "November";
    // month[11] = "December";
    //
    // var monthselection = month[date.getUTCMonth()];
    //
    // //Converts .getUTCDay into an actual day of the week to create var newdate
    // var weekday = new Array();
    // weekday[0] = "Sunday";
    // weekday[1] = "Monday";
    // weekday[2] = "Tuesday";
    // weekday[3] = "Wednesday";
    // weekday[4] = "Thursday";
    // weekday[5] = "Friday";
    // weekday[6] = "Saturday";
    // var dayofweek = weekday[date.getUTCDay()];
    // var day = date.getUTCDate();
    // var year = date.getUTCFullYear();
    // var newdate = dayofweek + " " + monthselection + " " + day + "/" + year;
    //
    // $("#DateList").append(`
    //   <h5>${monthselection + " " + day}</h5>
    //   <h5>${monthselection + " " + (day + 1)}</h5>
    //   <h5>${monthselection + " " + (day + 2)}</h5>
    //   <h5>${monthselection + " " + (day + 3)}</h5>
    //   <h5>${monthselection + " " + (day + 4)}</h5>
    //   <h5>${monthselection + " " + (day + 5)}</h5>
    //   <h5>${monthselection + " " + (day + 6)}</h5>
    //   <h5>${monthselection + " " + (day + 7)}</h5>
    //   `)

    EventData[0].forEach((EventFound) => {

      //Converts given time into AM PM time to create var time
      var d = new Date(EventFound.time);
      var hh = d.getHours();
      var m = d.getMinutes();
      var dd = "AM";
      var h = hh;
      if (h >= 12) {
        h = hh-12;
        dd = "PM";
      }
      if (h == 0) {
        h = 12;
      }
      m = m<10?"0"+m:m;
      h = h<10?+h:h;
      var time = h+":"+m+" "+dd;

      //if statement to check if the EventFound contains a venue key
      var EventLoc;
      if (!EventFound.venue) {
        EventLoc = "Not Selected";
      } else {
        EventLoc = EventFound.venue.name;
      }
      $("#EventList").append(`
        <div class="Event">
        <div class="EventLeft">
        <p class="EventTimeDate">${time}</p>
        </div>
        <div class="EventRight">
        <h2 class="EventName">${EventFound.name}</h2>
        <h4 class="GroupName">${EventFound.group.name}</h4>
        <h5 class="EventLocation">${"Location: " + EventLoc}</h5>
        </div>
        </div>
        </div>
        `)
      })
    });




    //Checks for change in selected #Categories. Replaces events with events pertaining to choice.
    $("#Categories").change(function() {
      $("select option:selected").each(function() {
        var CategoryChosen = $("select option:selected").val();
        console.log(CategoryChosen);
        $("#EventList").empty();
        EventData = [];
        console.log("https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=80203&country=United%20States&city=Denver&state=CO&category=" + CategoryChosen + "&time=,1w&key=" + MeetupKey);

        $.ajax({
          method: "GET",
          url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=80203&country=United%20States&city=Denver&state=CO&category=" + CategoryChosen + "&time=,1w&key=" + MeetupKey
        })
        .then(function (GetEventDataNew) {
          console.log(GetEventDataNew);
          console.log(GetEventDataNew.results);
          EventData.push(GetEventDataNew.results);
          console.log(EventData);
          //Process date and time
          //Date Creation before assigning to EventLocation and EventTime
          // var date = new Date();
          //
          // var month = new Array();
          // month[0] = "January";
          // month[1] = "February";
          // month[2] = "March";
          // month[3] = "April";
          // month[4] = "May"
          // month[5] = "June";
          // month[6] = "July";
          // month[7] = "August";
          // month[8] = "September";
          // month[9] = "October";
          // month[10] = "November";
          // month[11] = "December";
          //
          // var monthselection = month[date.getUTCMonth()];
          //
          // //Converts .getUTCDay into an actual day of the week to create var newdate
          // var weekday = new Array();
          // weekday[0] = "Sunday";
          // weekday[1] = "Monday";
          // weekday[2] = "Tuesday";
          // weekday[3] = "Wednesday";
          // weekday[4] = "Thursday";
          // weekday[5] = "Friday";
          // weekday[6] = "Saturday";
          // var dayofweek = weekday[date.getUTCDay()];
          // var day = date.getUTCDate();
          // var year = date.getUTCFullYear();
          // var newdate = dayofweek + " " + monthselection + " " + day + "/" + year;
          //
          // $("#DateList").append(`
          //   <h5>${monthselection + " " + day}</h5>
          //   <h5>${monthselection + " " + (day + 1)}</h5>
          //   <h5>${monthselection + " " + (day + 2)}</h5>
          //   <h5>${monthselection + " " + (day + 3)}</h5>
          //   <h5>${monthselection + " " + (day + 4)}</h5>
          //   <h5>${monthselection + " " + (day + 5)}</h5>
          //   <h5>${monthselection + " " + (day + 6)}</h5>
          //   <h5>${monthselection + " " + (day + 7)}</h5>
          //   `)

          EventData[0].forEach((EventFound) => {

            //Converts given time into AM PM time to create var time
            var d = new Date(EventFound.time);
            var hh = d.getHours();
            var m = d.getMinutes();
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
              h = hh-12;
              dd = "PM";
            }
            if (h == 0) {
              h = 12;
            }
            m = m<10?"0"+m:m;
            h = h<10?+h:h;
            var time = h+":"+m+" "+dd;

            //if statement to check if the EventFound contains a venue key
            var EventLoc;
            if (!EventFound.venue) {
              EventLoc = "Not Selected";
            } else {
              EventLoc = EventFound.venue.name;
            }
            $("#EventList").append(`
              <div class="Event">
              <div class="EventLeft">
              <p class="EventTimeDate">${time}</p>
              </div>
              <div class="EventRight">
              <h2 class="EventName">${EventFound.name}</h2>
              <h4 class="GroupName">${EventFound.group.name}</h4>
              <h5 class="EventLocation">${"Location: " + EventLoc}</h5>
              </div>
              </div>
              </div>
              `)
            });
          });
        });
      });

      //Event Listener for highlighting tables
      $('#EventList').on('click', '.Event', function() {
        console.log("click seen");
        $(this).toggleClass("EventSelected");
      });

      //Create array containing Event Information
      $("#GetSelectedEvents").click(function() {
        SelectedEvents = [];
        URLofGroups = [];
        $(".EventSelected").each(function (){
          for (var e = 0; e < Object.keys(GroupEventPairs).length; e++) {
            if (("#" + this.id) === Object.keys(GroupEventPairs)[e]) {

              //Object Setup with Group: and EventID: as keys
              var Events = {};
              var Group = "Group";
              var EventID = "EventID";
              Events[Group] = Object.values(GroupEventPairs)[e][0];
              Events[EventID] = Object.values(GroupEventPairs)[e][1];
              SelectedEvents.push(Events);
              //if statement end
            }
            //for loop end
          }

          //comparing selections to keys in GroupEventPairs end
        })
        URLofGroups = encodeURI(JSON.stringify(SelectedEvents));
        window.open("shareablelink.html?" + URLofGroups)
        // GetSelectedEvents End
      });

      //end of document ready
    });
