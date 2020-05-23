# Assignment 10

There are three pieces of code I used for the three visualizations in my final project.

- [Code for scatter plot](https://github.com/shaypepper/data-viz-vue/blob/master/src/components/WorkingWithData/ScatterPlot.vue)
- [Code for stacked-bar flow](https://github.com/shaypepper/data-viz-vue/blob/master/src/components/WorkingWithData/StackedBar.vue)
- [Code for quote comparison](https://github.com/shaypepper/data-viz-vue/blob/master/src/components/WorkingWithData/CompareQuotes.vue)

I have a _strong_ preference for letting visualizations speak for themselves.

For the scatter plot I needed to make a less than ideal choice. I used a square-root based scale because of what a big difference there was between the most common verbs generally and the others. I used the diagonal line to make it easy to tell which bucket the individual verbs fell into.

For the stacked bar it was important to me that the reader could easily see the difference in proprotions between article types. That's why it was important to me to actually connect the two sides. This required some convoluted math:

```html
<!-- html -->

<!-- a path is an SVG element which is used to draw vector graphics -->
<!-- 'v-for' allows us to loop through each of the tense types. -->
<!-- BW: bar-width, DM: double-margin, H: chart-height> -->
<path
  v-for="(tense, j) in data"
  :d="
        `M0,${tense.start * H} h${BW} l${DM},${(tenses.opinion[j].start -
        tense.start) *
        H} h${BW} v${tenses.opinion[j].p *
        H} h-${BW} l${-DM}, ${(tense.end - tenses.opinion[j].end) *
        H} h-${BW} Z`
    "
/>
```

While this was supposed to be a more narrative focused assignment, there was nothing I could say that was clearer than being able to see the differeences between opinion and reporting in the last section. I made a few design decisions for the sake of continuity. First, the colors of the verbs match the colors from the tenses of those verbs in the bar chart. Second, the noun + verb combo is highlighted do that your eye can quickly be drawn to the usage of that verb.
