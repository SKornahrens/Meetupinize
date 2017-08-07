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
var GroupSpecificData = [];
var GroupEventPairs = {};
var TestGroup = {};
//var count is used to create unique IDs for each event appended to #ListAggro
var count = 1;
var PassedUrl;

// Fetch Specific Event Data https://api.meetup.com/2/events?key=6a3426d1c7d3565234713b22683948&group_urlname=Denver-Tech-Design-Community&event_id=241350598&sign=true
//

// Fetch specific Group Data https://api.meetup.com/2/groups?key=6a3426d1c7d3565234713b22683948&group_urlname=Denver-Tech-Design-Community&sign=true
//


//Gets Group Event Data for Each Group Given
$("#GetData").click(function(){
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

          //Group Photo
          if (!GroupSpecificData[0].group_photo) {
            $("#Event" + count + " .PhotoLink").attr('src', "http://via.placeholder.com/100x100");
            $("#Event" + count + " .PhotoLink").attr('alt', GroupSpecificData[0].name + " has no logo");
          } else {
            $("#Event" + count + " .PhotoLink").attr('src', GroupSpecificData[0].group_photo.thumb_link);
            $("#Event" + count + " .PhotoLink").attr('alt', GroupSpecificData[0].name + " logo");
          }
          //if statement to check if the EventData Object contains a venue key
          if (!EventObject[x].venue) {
            $("#Event" + count + " .EventLocation").text("Location Not Selected");
          } else {
            $("#Event" + count + " .EventLocation").text(EventObject[x].venue.name);
          }

          //Creates Object Key Event# with array value Group Name and Event ID numbers for each event
          GroupEventPairs["#Event" + count] = [];
          GroupEventPairs["#Event" + count].push(EventObject[x].group.urlname);
          GroupEventPairs["#Event" + count].push(parseInt(EventObject[x].id));


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
var SelectedEvents = {};
$(".Event").click(function(){
  $(this).toggleClass("teal EventSelected");
});

//Create array containing Event Information
$("#GetSelectedEvents").click(function() {
  $(".EventSelected").each(function (){
    for (var e = 0; e < Object.keys(GroupEventPairs).length; e++) {
      if (("#" + this.id) === Object.keys(GroupEventPairs)[e]) {
        console.log (Object.keys(GroupEventPairs)[e]);
        SelectedEvents[Object.keys(GroupEventPairs)[e]] = [];
        SelectedEvents[Object.keys(GroupEventPairs)[e]].push(Object.values(GroupEventPairs)[e]);
        //if statement end
      }
      //for loop end
    }
    //comparing selections to keys in GroupEventPairs end
  })
  // GetSelectedEvents End
});

function FindEventPairs(arraytocheck, value) {
  return value.some(function(acvalue) {
    return arraytocheck.indexOf(acvalue) >= 0;
  })
};

$("#RunSearch").click(function() {

});
