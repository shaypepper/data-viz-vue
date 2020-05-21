# Exploratory Project: Bill in the evenging hours

I'm a litte bit obsessed with Bill Cunningham, so this was right up my alley. There were a lot of small design choices here that it would be easier to list out.

Data process/decisions:
A lot of manual parsing! For the most part, these columns were formatted in a way that could be pulled apart, but there were some glaring irregularities that needed help.
Coordiinated were found for the most popular venues, but it was tedious to parse out location for each of 5000 events, so many went untagged. Incredibly the majority were at the same 150+ venues.

Design decisioins:
Opacity of dots on map should be based on how many dots there are for that particular selection.
You should be able to see the description of the event he went to that came from the column itself..
Events in the same location should not be on top of each other, but rather a tiny bit offset to create a cluster.
Months are cyclical, so to see how many events Bill went to in a certain month, a nightengale's rose made the most sense.
A user should be able to sweep to select dates to look at or click to select a single week. When a single week was selected, the date at the lower range should disappear.
The yellow bar below chart that shows the range was important so the use knew the range they were selecting before the chart was actually updated.

Performance and code decisions:
I chose to use Vue for the built in state management and directives. I lost out on d3 transitions by making that decision, but if I had the time I would have more options for that now.
Events were grouped into weeks so that filtering by date would only require going through a few hundred list items instead of a few thousand.
For nightengale's rose, I chose to calculate the paths myself so that I would be able to take advantage of textpaths more easily.
