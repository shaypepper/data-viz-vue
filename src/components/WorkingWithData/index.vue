<template>
  <div>
    <h1>Working with data project!</h1>
    <scatter-plot />
  </div>
</template>

<script>
import ScatterPlot from "./ScatterPlot.vue";
export default {
  components: {
    ScatterPlot
  }
};
</script>

<style lang="scss" scoped>
* {
  color: white;
}
</style>