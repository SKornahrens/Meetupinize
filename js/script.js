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

var GroupData = [];
var GroupURLs = [];

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

    // Use the headers from earlier to name our hash keys
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
var EventData = [];

//Gets Group Event Data for Each Group Given
$("#GetData").click(function(event){
  for (var i = 0; i < GroupURLs.length; i++) {
    var PassedUrl = GroupURLs[i];
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/events?key=" + MeetupKey + "&group_urlname=" + PassedUrl + "&sign=true"
    })
    .then(function (data) {
      console.log(data);

      EventData.push(data.results);
      var $EVENT = $('#LinkAggro');
      var EventObject;
      var count = 1;
      for (var i = 0; i < EventData.length; i++) {
        EventObject = EventData[i];
        for (var i = 0; i < EventObject.length; i++) {
          console.log("Event " + count)
          console.log(EventObject[i].name)
          console.log(new Date(EventObject[i].time))
          console.log(EventObject[i].group.name)
          console.log(EventObject[i].venue.name)
          console.log(EventObject[i].event_url)
          console.log("------")
          var $clone = $EVENT.find('div.hide').clone(true).removeClass('hide').attr('id', 'Event' + count);
          $EVENT.find('.EventList').append($clone);
          //Date Creation before assigning to EventLocation and EventTime
          var date = new Date(EventObject[i].time)
          var month = date.getUTCMonth() + 1; //months from 1-12

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
          

          $("#Event" + count + " .GroupName").text(EventObject[i].group.name);
          $("#Event" + count + " .EventName").text(EventObject[i].name);
          $("#Event" + count + " .EventLocation").text(EventObject[i].venue.name);
          $("#Event" + count + " .EventDate").text(newdate);
          count++;
        }
      }
    });
  }

  //Create Event List
  //Loops through each EventData index grabbing necessary details about group events
  //Creates one new .Event div per EventData index



});
