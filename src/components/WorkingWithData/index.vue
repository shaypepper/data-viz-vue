<template>
  <div id="verbs">
    <h1>Working with data project!</h1>
    <!-- <scatter-plot /> -->
    <stacked-bar />
    <compare-quotes />
  </div>
</template>

<script>
// import ScatterPlot from "./ScatterPlot.vue";
import StackedBar from "./StackedBar.vue";
import CompareQuotes from "./CompareQuotes.vue";
export default {
  components: {
    // ScatterPlot,
    StackedBar,
    CompareQuotes
  }
};
</script>

<style lang="scss">
@import "../../assets/css/color-scheme.scss";
#verbs {
  background-color: white;
}
</style>
