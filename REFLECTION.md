# Reflection

I came into this semester with basically one goal: learning d3. I sort of knew I wanted to do a project on Bill Cunningham but that was really it. I felt fortunate to have taken the first data visualization class last semester because it gave me a framework for a lot of the nuance involved in data visualization. It also gave me the ability to generate ideas quickly when I had a new data set I wanted to visualize.

I chose to use Vue for the built in state management and directives because I’m terrible at mentally managing those things on my own. I especially liked the computed values and templates. I lost out on d3 transitions by making that decision, but Vue plays nice with transitions and animation. Sadly, I ran out of time!

## Homework Assignments

I am a software engineer professionally so I really expected this semester to be informative but not necessarily technically challenging. I was wrong. As I worked through the homework assignments, I realized what a different ballgame d3 is. While the d3 documentation is extensive, the mixed bag of examples online due to versions of d3 in the wild can make it hard to pin down. I was happy to have some working templates and examples that were more tangible and had more context.

The more challenging aspect of d3 for me was often not knowing what sorts of calculations were being done under the hood. I’m not a fan of automagic code that I don’t understand.

There is a lot that I don’t think I would have been able to do later if it weren’t for the assignments.

## Exploratory Project

I'm a little bit obsessed with Bill Cunningham, so this was right up my alley. There were a lot of small design choices here that it would be easier to list out.

### Data process/decisions

This project required a lot of manual parsing! I used the data I was able to get from archives to create a csv. For the most part, these pieces were formatted in a way that could be pulled apart, but there were some glaring irregularities that needed help. This took a lot of regex to get right.
Coordinates were found for the most popular venues, but it was tedious to parse out locations for each of 5000 events, so many went untagged. Incredibly the majority were at the same 150+ venues.

### Bar chart

A user should be able to sweep to select dates to look at or click to select a single week. When a single week was selected, the date at the lower range should disappear.
The yellow bar below the chart that shows the range was important so the use knew the range they were selecting before the chart was actually updated.

### Article snippet

It was important to me that the reader be able to see the description of the event Bill went to that was in the column itself. One of the tricky things about this was the date formatting with d3.

### Nightingale’s rose

To see how many events Bill went to in a certain month, a nightingale's rose made the most sense because months are cyclical. I chose to calculate the paths myself so that I would be able to take advantage of textpaths more easily.

### Map of Manhattan

One small detail that was important to me was that the opacity of markers on the map should be based on how many dots there are for that particular selection. If there were a lot of events in the time frame selected, it was important that you could see clusters and not just big opaque blobs. Alternatively, when there were only a few events, it was important for those events to stand out a bit more. Related was the choice that events in the same location should not be on top of each other, but rather a tiny bit offset to create a cluster.

I noticed some performance issues when determining whether to show individual dots on the map. To optimize, I grouped events into weeks so that filtering by date would only require going through a few hundred list items instead of a few thousand.

## Explanatory Project

For this project I wanted to attempt something that I've wanted to do for a long time: a meta visualization. The Upshot is one of the most beloved parts of New York Times to data visualization enthusiasts and while I would love

Because I work for The Times, I have easy access to the archives. I did a search for all articles from The Upshot in 2019 and then went from there. I went through a few iterations of this. The first included data about collaboration between the journalists. For this, I needed to query the data and include the journalists' name, biography url, a headshot, and a few other things.

### Waffles

For the visualization attributes waffle charts, my husband and I spent a weekend going through all of these articles. I had the list from the queries I described above and I went through them one by one. My husband updated the spreadsheet as he prompted me for each column. This helped so that I wasn't trying to go back and forth between windows and a spreadsheet. My sister-in-law did not appreciate this exercise. "Color use?" "Diverging!" "Data types?" "Percentile! Poll! Money!" It was a lot of work but it also went more quickly than I expected.

For the visualization itself, my biggest consideration was articles that had multiple attributes. I needed a way to express this in the color while also keeping the reader from getting entirely lost. I found that primary colors allowed for me to do this highlighting in a natural way. Something that has both a line (yellow) chart and a bar chart (blue) could reasonably be colored green. This presented a new challenge though which was arranging the squares in a way that allowed for that overlapping but still used continuous blocks. This took a lot of planning and hours in Google draw to get it just right. Arranging well allowed for the large highlight blocks that you see as you scroll. This highlighting ability was important for me for a few reasons. Firstly the reader doesn't have to spend too long deciphering what the combined colors mean. It also allows for someone who is color blind to be able to see more clearly. I chose to label within the paragraphs so it would read more naturally. Unlike the exploratory project, I wanted the message to be clear and easy to understand.

### Wheel of subjects

To get the data for the different subjects covered in the articles, I needed to do a search on something called Times Tags. It's a tool for our archives that helps with searching. An article usually has three to five tags. From there I simply tallied up the number of articles that used each particular tag.

This was the trickiest part of the project. I experimented with a lot before I landed on the scrolling wheel. No matter what I did, it felt like a wall of text in a really bad way. It was hard to make the tags feel evenly spaced and aligned. Having a giant circle ended up being just the thing I needed to have a list that didn't feel so... listy? The tricky part once I landed there was using a scroll event listener to be able to scroll through the topics.

If I had more time, I would add more ways to interact with the stories themselves. Currently there are no links to the stories, and I think it would be nice for those to be part of it.

As a side note, I will probably never again in my life get to write the word "waffle" so much in my code. It was a delight.
