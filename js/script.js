$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15, // Creates a dropdown of 15 years to control year,
  today: 'Today',
  clear: 'Clear',
  close: 'Ok',
  closeOnSelect: true // Close upon selecting a date,
});

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
  for (var i = 0; i < GroupData.length; i++) {
    parser.href= GroupData[i].group;
    GroupURLs.push(parser.pathname.replace(/\//g, ""));
  }
});


// Meetup.com API Key for Steve Kornahrens
var MeetupKey = "6a3426d1c7d3565234713b22683948";

//Variables needed for Data Gathering and Looping
var EventData = [];
var GroupData = [];
var GroupURLs = [];
//var count is used to create unique IDs for each event appended to #ListAggro
var count = 1;
var PassedUrl;

//Gets Group Event Data for Each Group Given
$("#GetData").click(function(){
  for (var i = 0; i < GroupURLs.length; i++) {
    //PassedUrl = Group Name represented by an index of GroupURLs
    PassedUrl = GroupURLs[i];
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/events?key=" + MeetupKey + "&group_urlname=" + PassedUrl + "&sign=true"
    })
    .then(function (data) {
      EventData = [];
      EventData.push(data.results);
      var $EVENT = $('#LinkAggro');
      for (var j = 0; j < EventData.length; j++) {
        var EventObject = EventData[j];

        for (var x = 0; x < EventObject.length; x++) {
          var $clone = $EVENT.find('div.hide').clone(true).removeClass('hide').attr('id', 'Event' + count);
          $EVENT.find('.EventList').append($clone);

          //Date Creation before assigning to EventLocation and EventTime
          var date = new Date(EventObject[x].time)
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
          $("#Event" + count + " .EventTimeDate").text(newdate + " " + time);
          //Event Group, Event Name, and Event ID
          $("#Event" + count + " .GroupName").text(EventObject[x].group.name);
          $("#Event" + count + " .EventName").text(EventObject[x].name);
          $("#Event" + count + " .EventID").text(EventObject[x].id);

          //if statement to check if the EventData Object contains a venue key
          if (!EventObject[x].venue) {
            $("#Event" + count + " .EventLocation").text("Location Not Selected");
          } else {
            $("#Event" + count + " .EventLocation").text(EventObject[x].venue.name);
          }
          //count iterates so loops to create a new Event id for each Event
          count++;
        }
        //Create Event List - for loop
      }
      //end of .then(function (data)
    })

    //end of get data for loop
  };
  //end of onclick event at #GetData
});

//Event Listener for highlighting tables
var SelectedEvents = [];
$(".Event").click(function(){
  $(this).toggleClass("teal EventSelected");
});

//Create array containing Event Information
$("#GetSelectedEvents").click(function() {
  $(".EventSelected").each(function (index){
    console.log(index + ": " + $(this).text());
    SelectedEvents.push(index + ": " + $(this).text());

  })



});
