// Meetup.com API Key for Steve Kornahrens
var MeetupKey = "6a3426d1c7d3565234713b22683948";
//Variables needed for Data Gathering and Looping
var GroupEventPairs = {};
var CategoryData = [];
var EventData = [];
var DateArray;
var StartDate;
var EndDate;
var SetDates;
$(document).ready(function() {
  window['moment-range'].extendMoment(moment);
  //When Document is loaded immediately makes API call to Meetup for: Catagories to populate dropdown and all events for the catagory Tech (id 34)
  $.when(
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/categories/?key=" + MeetupKey
    }),
    $.ajax({
      method: "GET",
      url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=80203&country=United%20States&city=Denver&state=CO&category=34&time=,1w&radius=10&key=" + MeetupKey
    })
  )
  .then(function (GetCategoryData, GetEventData) {
    CategoryData.push(GetCategoryData[0].results);
    EventData.push(GetEventData[0].results);
    //Creates an array of Dates from first array index to last array index
    StartDate = new Date(EventData[0][0].time);
    EndDate = new Date(EventData[0][EventData[0].length - 1].time);
    RangeOfDates = moment.range(StartDate, EndDate);
    DateArray = Array.from(RangeOfDates.by('day'));
    DateArray.map(m => m.format('DD'))
  })
  .then(function () {
    var count = 0;
    DateArray.forEach((datefound) => {
      var DateToSet = moment(datefound._d).format("dddd, MMMM Do");
      var DayCount = "Day" + count;
      $('#EventList').append(`
        <div id=${DayCount} class="animated fadeInLeft DateAdded">
        <h2 class="SetDate">${DateToSet}</h2>
        </div>
        `)
        count++
      })
      SetDates = $(".SetDate");
    })
    .then(function () {
      CategoryData[0].forEach((Category) => {
        $('#Categories').append(new Option(Category.sort_name, Category.id));
      })
      $("#Categories").val("34");
    })
    .then(function () {
      var EventCount = 0;
      $('#CityEventTitle').append(EventData[0][0].venue.city + "'s Upcoming Events")
      EventData[0].forEach((EventFound) => {
        Array.from(SetDates).forEach((datefound) => {
          // DateToSet = moment(datefound._d).format("dddd, MMMM Do");
          if (moment(EventFound.time).format("dddd, MMMM Do") === datefound.innerHTML) {
            //Convert Event's Time to usable format
            var Time = moment(EventFound.time).format("h:mma");
            //if statement to check if the EventFound contains a venue key
            var EventLoc;
            if (!EventFound.venue) {
              EventLoc = "Location Not Selected";
            } else {
              EventLoc = EventFound.venue.name;
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
              GroupEventPairs["Event" + EventCount] = [];
              GroupEventPairs["Event" + EventCount].push(EventFound.group.urlname);
              GroupEventPairs["Event" + EventCount].push(EventFound.id);
              EventCount++;
            }
          })
        })
      })
      .then(function() {
        var DateAdd = $('.DateAdded');
        Array.from(DateAdd).forEach((datefound) => {
          if($(datefound).children().length < 2) {
            $(datefound).append(`
              <h5 class="NoEvent">No Events Today.</h5>`)
          };
        });
      });

      //Checks for change in selected #Categories. Replaces events with events pertaining to choice.
      $("#Categories").change(function() {
        $("select option:selected").each(function() {
          var CategoryChosen = $("select option:selected").val();
          var ZipCodeChosen = $("#CityFinder").val();
          $("#EventList").empty();
          EventData = [];
          $.ajax({
            method: "GET",
            url: "https://galvanize-cors-proxy.herokuapp.com/https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip="+ ZipCodeChosen + "&country=United%20States&city=Denver&state=CO&category=" + CategoryChosen + "&time=,1w&radius=10&key=" + MeetupKey
          })
          .then(function (GetEventDataNew) {
            console.log(ZipCodeChosen);
            EventData.push(GetEventDataNew.results);
            StartDate = new Date(EventData[0][0].time);
            EndDate = new Date(EventData[0][EventData[0].length - 1].time);
            RangeOfDates = moment.range(StartDate, EndDate);
            DateArray = Array.from(RangeOfDates.by('day'));
            DateArray.map(m => m.format('DD'))
          })
          .then(function () {
            GroupEventPairs = {};
            var count = 0;
            DateArray.forEach((datefound) => {
              var DateToSet = moment(datefound._d).format("dddd, MMMM Do");
              var DayCount = "Day" + count;
              $('#EventList').append(`
                <div id=${DayCount} class="animated fadeInLeft DateAdded">
                <h3 class="SetDate">${DateToSet}</h3>
                </div>
                `)
                count++
              })
              SetDates = $(".SetDate");
            })
            .then(function () {
              var EventCount = 0;
              $('#CityEventTitle').text(EventData[0][0].venue.city + "'s Upcoming Events")
              EventData[0].forEach((EventFound) => {
                Array.from(SetDates).forEach((datefound) => {
                  // DateToSet = moment(datefound._d).format("dddd, MMMM Do");
                  if (moment(EventFound.time).format("dddd, MMMM Do") === datefound.innerHTML) {
                    //Convert Event's Time to usable format
                    var Time = moment(EventFound.time).format("h:mma");
                    //if statement to check if the EventFound contains a venue key
                    var EventLoc;
                    if (!EventFound.venue) {
                      EventLoc = "Location Not Selected";
                    } else {
                      EventLoc = EventFound.venue.name;
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
                      //Creates Object Key Event# with array value Group Name and Event ID numbers for each event
                      GroupEventPairs["Event" + EventCount] = [];
                      GroupEventPairs["Event" + EventCount].push(EventFound.group.urlname);
                      GroupEventPairs["Event" + EventCount].push(EventFound.id);
                      EventCount++
                    }
                  })
                })
              })
              .then(function() {
                var DateAdd = $('.DateAdded');
                Array.from(DateAdd).forEach((datefound) => {
                  if($(datefound).children().length < 2) {
                    $(datefound).append(`
                      <h5 class="NoEvent">No Events Today.</h5>`)
                  };
                });
              });
            });
          });
          // //Event Listener for Selecting Events to be queried later
          //Currently off to see if Submittable Page is needed
          $('#EventList').on('mouseenter', '.Event', function() {
            $(this).toggleClass("EventHovered");
          });
          $('#EventList').on('mouseleave', '.Event', function() {
            $(this).toggleClass("EventHovered");
          });


          //Event Listener for Selecting Events to be queried later
          $('#EventList').on('click', '.Event', function() {
            $(this).toggleClass("EventSelected");
          });

          //Clears any Events that have been clicked
          $('#ClearSelectedEvents').click(function() {
            $(".EventSelected").each(function (){
              $(this).removeClass("EventSelected");
            })
          })

          //Create array containing Event Information
          $("#GetSelectedEvents").click(function() {
            var SelectedEvents = [];
            var URLofGroups = [];
            $(".EventSelected").each(function (){
              for (var e = 0; e < Object.keys(GroupEventPairs).length; e++) {
                console.log(this.id);
                if ((this.id) === Object.keys(GroupEventPairs)[e]) {

                  //Object Setup with Group: and EventID: as keys
                  var Events = {};
                  var Group = "Group";
                  var EventID = "EventID";
                  Events[Group] = Object.values(GroupEventPairs)[e][0];
                  Events[EventID] = Object.values(GroupEventPairs)[e][1];
                  SelectedEvents.push(Events);
                  console.log(SelectedEvents);
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


//Function Called on Document.ready, Zip Code change, and Event Category change
//Creates Event List, changes " "'s Upcoming Events to zip's city, and creates date range based of range from EventData index 0 to last index
