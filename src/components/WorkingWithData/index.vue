<template>
  <div id="verbs">
    <h1>Working with data project!</h1>
    <scatter-plot />
    <stackedBar />
  </div>
</template>

<script>
import ScatterPlot from "./ScatterPlot.vue";
import StackedBar from "./StackedBar.vue";
export default {
  components: {
    ScatterPlot,
    StackedBar,
  },
};
</script>

<style lang="scss" scoped>
#verbs {
  background-color: white;
}
</style>
