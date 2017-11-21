
# Materialize

![Materialize demo](https://github.com/SKornahrens/Meetupinize/blob/master/meetupinizedemo.gif)

## Synopsis

An app for easily finding meetup events in a 10 mile radius of the user given zipcode.

Meetupinize.com is currently running v2. v3 is in development which is switching the codebase to Angular.

## Motivation

Meetup's search function is not the best. It will not display all the events for a particular event category and in general isn't the easiest experience for quickly finding events in your area. This was built to solve that issue.

## MIT License

Copyright 2017 Steve Kornahrens

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
=======
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



>>>>>>> master
