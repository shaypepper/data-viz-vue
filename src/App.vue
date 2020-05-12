<template>
  <div id="app">
    <!-- <exploratory-project /> -->
    <explanatory-project />
  </div>
</template>

<script>
// import ExploratoryProject from "./components/ExploratoryProject";
import ExplanatoryProject from "./components/ExplanatoryProject/Scroller";
import Vue from "vue";
const Component = Vue.extend({
  name: "App",
  components: {
    // ExploratoryProject,
    ExplanatoryProject
  },
  data() {
    return {};
  },
  methods: {}
});

export default Component;
</script>

<style>
@import "./assets/css/nyt-fonts.scss";

body {
  background-color: rgb(30, 30, 30);
  font-family: "nyt-cheltenham";
  margin: 0;
}
</style>
