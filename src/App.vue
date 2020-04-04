<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <manhattan-map></manhattan-map>
  </div>
</template>

<script>
import ManhattanMap from "./components/ManhattanMap";
import geojson from "../public/manhattan.js";
import * as d3 from "d3";

export default {
  name: "App",
  components: {
    ManhattanMap,
  },
  data() {
    return {
      geojson: null,
      articles: null,
      locations: [],
      hover: {
        latitude: null,
        longitude: null,
        state: null,
        date: "2013-11-17",
        role: "end",
      },
      startDate: "2004-06-20",
      endDate: "2009-07-18",
      currentDate: "2016-06-12",
      playSpeed: 200,
      playMode: false,
      editingSelection: false,
    };
  },
  mounted() {
    Promise.all([
      d3.csv(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTP7a4JsTDRMneysdxbhILySZbJ0NtxKrJPuYkPhBvNMT74d4B_7Oazju2U3b9wAs-abuMVqHscNmFD/pub?gid=1601565251&single=true&output=csv",
        d3.autoType
      ),
      d3.csv(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoU4ruZLXAnoFJOM3HCS1jI2EQy_TPvMQomJRi6i8sFROBlcE_Lz5o7745ilDCpYumiUwbC02M-zWH/pub?gid=1301057910&single=true&output=csv",
        d3.autoType
      ),
      // fetch("./public/evening_hours.csv")
    ]).then(([locations, articles]) => {
      // SET STATE WITH DATA
      const excludedNeighborhoods = new Set([
        "Washington Heights",
        "Inwood",
        "Marble Hill",
        "Governors Island",
        "Ellis Island",
        "Liberty Island",
      ]);

      geojson.features = geojson.features.filter((f) => {
        return !excludedNeighborhoods.has(f.properties.name);
      });
      this.geojson = geojson;
      this.data = {};
      this.locations = new Map(
        locations.map((location) => [
          location.place,
          { longitude: location.longitude, latitude: location.latitude },
        ])
      );
      this.publishDates = new Set(
        articles.map((a) => a.publishDate.toString())
      );

      this.articles = articles.map((a, i) => {
        a.index = i;
        return a;
      });
    });
    return;
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
