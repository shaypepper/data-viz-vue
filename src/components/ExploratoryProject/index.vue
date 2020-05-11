<template>
  <div id="app">
    <div class="description">
      <h1>Bill Cunningham in the evening hours</h1>
      <p>Over fifteen years, Bill Cunningham published a column weekly with photographs of charities, fundraisers, and various events in the arts. He had a heart for philanthropy. What is incredible is just how many events he would make it to in a given week. Note: this was in addition to his column called On the Street. For that, he captured photos of every day folks around town. He often worked 10-12 hour days up until he passed away in 2016. His last column was just two weeks before he passed. This is a tribute to his work.</p>
    </div>
    <bar-chart v-bind="{ events, startDate, endDate }" v-on:select-range="updateDateRange"></bar-chart>
    <manhattan-map
      v-bind="{ events, locations, startDate, endDate }"
      v-on:hover-on-event="updateHoveredEvent"
    ></manhattan-map>
    <article-text v-bind="{ event: hoveredEvent }"></article-text>
    <nightengales-rose v-bind="{ events }"></nightengales-rose>
    <!-- <tree-map></tree-map> -->
  </div>
</template>

<script>
import ManhattanMap from "./ManhattanMap";
import ArticleText from "./ArticleText";
import NightengalesRose from "./NightengalesRose";
import BarChart from "./BarChart";
// import TreeMap from "./components/TreeMap";
import * as d3 from "d3";

export default {
  name: "App",
  components: {
    ManhattanMap,
    ArticleText,
    NightengalesRose,
    BarChart
    // TreeMap
  },
  data() {
    return {
      events: [],
      hoveredEvent: {},
      locations: new Map([]),
      hover: {
        latitude: null,
        longitude: null,
        state: null,
        date: "2013-11-17",
        role: "end"
      },
      startDate: new Date("2004-06-20"),
      endDate: new Date("2009-07-18"),
      currentDate: "2016-06-12",
      playSpeed: 200,
      playMode: false,
      editingSelection: false
    };
  },
  methods: {
    updateHoveredEvent(hoveredEvent) {
      this.hoveredEvent = hoveredEvent;
    },
    updateDateRange(startDate, endDate) {
      const minDate = new Date(Math.min(startDate, endDate));
      const maxDate = new Date(Math.max(startDate, endDate));
      this.startDate = minDate;
      this.endDate = maxDate;
    }
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
      )
    ]).then(([locations, events]) => {
      console.table(locations);
      console.table(events);
      // SET STATE WITH DATA

      this.locations = new Map(
        locations.map(location => [
          location.place,
          { longitude: location.longitude, latitude: location.latitude }
        ])
      );
      this.publishDates = new Set(events.map(a => a.publishDate.toString()));

      this.events = events.map((a, i) => {
        a.index = i;
        return a;
      });
    });
    return;
  }
};
</script>

<style>
body {
  background-color: rgb(30, 30, 30);
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5vh;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  grid-template-rows: 0.75fr 1fr 1fr 2fr;
  grid-gap: 12px;
  max-height: 90vh;
  padding: 12px;
  margin: 5vh auto;
  max-width: 1024px;
}
#app > div {
  border-radius: 5px;
}
.description {
  grid-column: 1 / -1;
  background: #fc8649;
  grid-row: 1/2;
  text-align: left;
  padding: 15px;
}
.description > h1,
.description > p {
  margin: 0 0 10px 0;
}
</style>
