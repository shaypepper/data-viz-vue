<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import "./assets/css/nyt-fonts.scss";

body {
  background-color: rgb(30, 30, 30);
  font-family: "nyt-cheltenham";
  margin: 0;
}
</style>
