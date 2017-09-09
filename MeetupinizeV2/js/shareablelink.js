
var EventsToDisplay;
var GroupSpecificData = [];
var EventData = [];

$(document).ready(function() {
  // window['moment-range'].extendMoment(moment);
  //geting string and removing ?
var GetEventData = location.search.substring(1);
EventsToDisplay = JSON.parse(decodeURI(GetEventData));
console.log(EventsToDisplay);
// Meetup.com API Key for Steve Kornahrens
var MeetupKey = "6a3426d1c7d3565234713b22683948";
var Groupname;
var EventID;
var LoopCount = 1;
var count = 1;
for (var i = 0; i < EventsToDisplay.length; i++) {
    GroupName = EventsToDisplay[i].Group;
    EventID = EventsToDisplay[i].EventID;

    $.when(
      $.ajax({
        method: "GET",
        url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/groups?key=" + MeetupKey + "&group_urlname=" + GroupName + "&sign=true"
      }),
      $.ajax({
        method: "GET",
        url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/events?key=" + MeetupKey + "&group_urlname="+ GroupName +"&event_id=" + EventID + "&sign=true"
      })
    )
    .then(function (GetGroupData, GetEventData) {
      GroupSpecificData = [];
      GroupSpecificData.push(GetGroupData[0].results[0]);

      EventData = [];
      EventData.push(GetEventData[0].results[0]);
      if($('.SetDates').text(moment(EventData[0].time).format("dddd, MMMM Do"))) {
        $('.EventList').append(`
          <h4 class="SetDates">${moment(EventData[0].time).format("dddd, MMMM Do")}</h4>
          `)
      } else {
        console.log("already Exists");
      }


      LoopCount++;

      var $EVENT = $('#LinkAggro');
        for (var x = 0; x < EventData.length; x++) {
          var $clone = $EVENT.find('a.hide').clone(true).removeClass('hide').attr('id', 'Event' + count);
          $EVENT.find('.EventList').append($clone);
          //Event Date and Time
          $("#Event" + count + " .EventTimeDate").find("p").text(moment(EventData[x].time).format("h:mma ") + moment(EventData[x].time).format("dddd, MMMM Do"));
          //Event Group, Event Name, and Event ID
          $("#Event" + count + " .GroupName").find("h5").text(EventData[x].group.name);
          $("#Event" + count + " .EventName").find("h5").text(EventData[x].name);

          //Group Photo
          if (!GroupSpecificData[0].group_photo) {
            var colors = ['#e1f7d5', '#ffbdbd', '#c9c9ff', '#f1cbff'];
            var random_color = colors[Math.floor(Math.random() * colors.length)];
            $("#Event" + count + " .GroupPhoto").css('backgroundColor', random_color);
            $("#Event" + count + " .GroupPhoto").find("p").text(EventData[x].group.name);

            // $("#Event" + count + " .PhotoLink").attr('src', "http://via.placeholder.com/100x100");
            // $("#Event" + count + " .PhotoLink").attr('alt', GroupSpecificData[0].name + " has no logo");
          } else {
            $("#Event" + count + " .PhotoLink").attr('src', GroupSpecificData[0].group_photo.photo_link);
            $("#Event" + count + " .PhotoLink").attr('alt', GroupSpecificData[0].name + " logo");
          }
          //if statement to check if the EventData Object contains a venue key
          if (!EventData[x].venue) {
            $("#Event" + count + " .EventLocation").find("p").text("Location Not Yet Selected");
          } else {
            $("#Event" + count + " .EventLocation").find("p").text(EventData[x].venue.name);
          }
          //Can call and create description
          // $("#Event" + count + " .EventDescription").html(EventData[x].description)

          //Appends link to a tag
          $("#Event" + count).attr('href', EventData[x].event_url);


          //count iterates so loops to create a new Event id for each Event
          count++;
        }

      // then end
    });

};

$(".Event")
  .mouseenter(function() {
    $(this).toggleClass("cyan lighten-5");
  })
  .mouseleave(function() {
    $(this).toggleClass("cyan lighten-5");
  });

//document ready end
});

$("#CreateTinyURL").click(function() {
  $.get("https://galvanize-cors-proxy.herokuapp.com/http://tinyurl.com/api-create.php?url=" + window.location.href, function(tinyurl){
  $("#TinyUrlHeader").find('h6').text("Upcoming Events worth your time: " + tinyurl);
});
});
