Meetupinize.com

Problem: Galvanize community would slack out a large list of individual links every week of upcoming events. It was a tedious process for the poster to find, copy, and paste the individual URLs.

Solution: By making requests to the Meetup.com API to retrieve a list of events for the upcoming week within the 80203 area. Meetupinize.com provides a user with the upcoming events without the need to make a search on meetup.com themselves. 

v1 required the user to provide group urls to find events for those specific events. While it would list events it was still tedious to the user. After a round of feedback event searching would be done by radius of a zip code instead of by group.

v2 now requires no input from the user to work. Meetupinize by default now provides all events for specified categories for the 80203 area code for the next 7 days. The user can choose any category they would like but tech is presented by default. Two requests are made when loaded, one for a list of categories and two for the list of events for selected category. The rest of the parameters are built into the request (date range and zip). 

Tech used:
HTML
CSS
Javascript
jQuery
Materialize (v1 only, discontinued for custom css in v2)
moment.js
moment-range.js
animate.css



