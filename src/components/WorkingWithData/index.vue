<template>
  <div id="verbs">
    <h1>Verb tenses in The New York Times</h1>
    <scatter-plot />
    <div>
      <p>
        In a world where Americans have trouble telling the difference
        <a
          target="_blank"
          href="https://www.journalism.org/2018/06/18/distinguishing-between-factual-and-opinion-statements-in-the-news/"
        >between fact and opinion</a>, it helps to have extra cues to determine the difference.
      </p>
      <p>
        For this project, I analyzed all New York Times articles that their archives
        <a
          target="_blank"
          href="https://developer.nytimes.com/docs/timestags-product/1/overview"
        >tagged</a> as having to do with President Trump. I particularly wanted to look at the differences between opinion pieces and more journalistic pieces. Using the
        <a
          target="_blank"
          href="https://www.npmjs.com/package/natural"
        >node.js text-analysis library, natural</a>, I was able to find some consistent differences in verb use. For example, the word "said" is used much more regularly articles on the news side than on the opinion side. Presumably, this is because getting quotes from others is a regular part of reporting.
      </p>
      <p>Looking more broadly at use of any verb tenses, I was able to see a couple of patterns. First, I noticed that reporting tended to include more past tense verbs. Additionally, opinion pieces were more likely to use non-3rd person singular present verbs. A clear example of this is the word "is". Opinion pieces are much more likely to use the word perhaps because pinion columns are a place where authors are more free to make judgments about instiutions, people, and presidents. If you look below at how "is" is used, you can easily infer that this is the reason why.</p>
    </div>

    <stacked-bar />
    <compare-quotes />
  </div>
</template>

<script>
import ScatterPlot from "./ScatterPlot.vue";
import StackedBar from "./StackedBar.vue";
import CompareQuotes from "./CompareQuotes.vue";
export default {
  components: {
    ScatterPlot,
    StackedBar,
    CompareQuotes
  }
};
</script>

<style lang="scss">
@import "../../assets/css/color-scheme.scss";
#verbs {
  background-color: white;

  width: calc(100vw - 20px);
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 42px;

  h1 {
    grid-column: 1 /-1;
    font-style: italic;
  }

  h3 {
    font-family: "Assistant", sans-serif;
    text-transform: uppercase;
    font-weight: 800;
  }
  p {
    line-height: 20px;
  }

  .VBD {
    @extend .purple;
  }

  .VB {
    @extend .orange;
  }

  .VBN {
    @extend .yellow;
  }

  .VBG {
    @extend .red;
  }

  .VBZ {
    @extend .blue;
  }

  .VBP {
    @extend .green;
  }
}
</style>
