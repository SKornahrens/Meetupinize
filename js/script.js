//Needed Variables

// Meetup.com API Key for Steve Kornahrens
var MeetupKey = "6a3426d1c7d3565234713b22683948";

//Variables needed for Data Gathering and Looping
var GroupData = [];
var GroupURLs = [];

$(document).ready(function() {

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year,
  today: 'Today',
  clear: 'Clear',
  close: 'Ok',
  closeOnSelect: true // Close upon selecting a date,
});

SetDefaultStartDate = new Date();
$('#StartDate').val(SetDefaultStartDate);
SetDefaultEndDate = new Date(SetDefaultStartDate.setDate(SetDefaultStartDate.getDate() + 7));
$('#EndDate').val(SetDefaultEndDate);

// Editable Group Table
var $TABLE = $('#Table');
var $BTN = $('#GetData');
var $EXPORT = $('#Export');


$('#AddGroup').click(function () {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide');
  $TABLE.find('table').append($clone);
});

$("#EnterGroupHere").keyup(function(event){
  if(event.keyCode == 13){
    var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide');
    $TABLE.find('table').append($clone);
  }
});

$('#RemoveGroup').click(function () {
  $(this).parents('tr').detach();
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];


  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });

  // Turn all existing rows into a loopable array
  GroupData = [];
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};

    // Grabs hidden header (group) to create an object key

    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();
    });

    GroupData.push(h);
  });

  //URL parser for GroupData
  var parser = document.createElement("a");
  //Clears GroupURLs so multiple button presses (error) can be caught
  GroupURLs = [];

  for (var i = 0; i < GroupData.length; i++) {
    parser.href= GroupData[i].group;
    GroupURLs.push(parser.pathname.replace(/\//g, ""));
  }
});

//Variables Shared between #GetData and #GetSelectedEvents click function
var GroupEventPairs = {};
var SelectedEvents = [];
var StartDate = new Date();
var EndDate = StartDate + 7;

//Gets Group Event Data for Each Group Given
$("#GetData").click(function(){
  //Clears Events posted and array containing selected events. Can reuse web load without refreshing
  $(".EventPosted").remove();
  GroupEventPairs = {};
  SelectedEvents = [];

  //Variables scoped to only #GetData click function
  var URLofGroups = [];
  var GroupSpecificData = [];
  var URLofGroups;
  var EventData = [];
  var PassedUrl;

  //var count is used to create unique IDs for each event appended to #ListAggro
  var count = 1;

  // Saves Start and End Dates
  StartDate = new Date($('#StartDate').val());
  EndDate = new Date($('#EndDate').val());

  //Loops through given Group URLs
  for (var i = 0; i < GroupURLs.length; i++) {
    //PassedUrl = Group Name represented by an index of GroupURLs
    PassedUrl = GroupURLs[i];
    $.when(
      $.ajax({
        method: "GET",
        url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/groups?key=" + MeetupKey + "&group_urlname=" + PassedUrl + "&sign=true"
      }),
      $.ajax({
        method: "GET",
        url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/events?key=" + MeetupKey + "&group_urlname=" + PassedUrl + "&sign=true"
      })
    )
    .then(function (GetGroupData, GetEventData) {
      GroupSpecificData = [];
      GroupSpecificData.push(GetGroupData[0].results[0]);

      EventData = [];
      EventData.push(GetEventData[0].results);

      var $EVENT = $('#LinkAggro');
      for (var j = 0; j < EventData.length; j++) {
        var EventObject = EventData[j];

        for (var x = 0; x < EventObject.length; x++) {
          var DateChecker = new Date(EventObject[x].time);
          if (DateChecker >= StartDate && DateChecker <= EndDate ) {
          var $clone = $EVENT.find('div.hide').clone(true).removeClass('hide').attr('id', 'Event' + count).addClass('EventPosted');
          $EVENT.find('.EventList').append($clone);


          //Date Creation before assigning to EventLocation and EventTime
          var date = new Date(EventObject[x].time);
          var month = date.getUTCMonth() + 1;

          //Converts .getUTCDay into an actual day of the week to create var newdate
          var weekday = new Array();
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";
          var dayofweek = weekday[date.getUTCDay()];
          var day = date.getUTCDate();
          var year = date.getUTCFullYear();
          var newdate = dayofweek + " " + month + "/" + day + "/" + year;

          //Converts given time into AM PM time to create var time
          var d = new Date(EventObject[x].time);
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
          //Event Date and Time
          $("#Event" + count + " .EventTimeDate").find("p").text(newdate + " at " + time);
          //Event Group, Event Name, and Event ID
          $("#Event" + count + " .GroupName").find("h5").text(EventObject[x].group.name);
          $("#Event" + count + " .EventName").find("h5").text(EventObject[x].name);

          //Group Photo
          if (!GroupSpecificData[0].group_photo) {
            $("#Event" + count + " .PhotoLink").attr('src', "http://via.placeholder.com/100x100");
            $("#Event" + count + " .PhotoLink").attr('alt', GroupSpecificData[0].name + " has no logo");
          } else {
            $("#Event" + count + " .PhotoLink").attr('src', GroupSpecificData[0].group_photo.photo_link);
            $("#Event" + count + " .PhotoLink").attr('alt', GroupSpecificData[0].name + " logo");
          }
          //if statement to check if the EventData Object contains a venue key
          if (!EventObject[x].venue) {
            $("#Event" + count + " .EventLocation").find("p").text("Location Not Yet Selected");
          } else {
            $("#Event" + count + " .EventLocation").find("p").text(EventObject[x].venue.name);
          }

          //Creates Object Key Event# with array value Group Name and Event ID numbers for each event
          GroupEventPairs["#Event" + count] = [];
          GroupEventPairs["#Event" + count].push(EventObject[x].group.urlname);
          GroupEventPairs["#Event" + count].push(EventObject[x].id);

          //count iterates so loops to create a new Event id for each Event
          count++;
        }
        //Create Event List - for loop
      }
      //DateCheker if statement end
      }
      //end of .then(function (data)
    })
    //end of get data for loop
  };
  //end of onclick event at #GetData
  $("#GetSelectedEvents").removeClass("hide");
  $("#LinkAggro").removeClass("hide")
});

//Event Listener for highlighting tables

$(".Event").click(function(){
  $(this).toggleClass("white EventSelected cyan lighten-5");
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
