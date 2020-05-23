<template>
  <div id="articleText">
    <div v-if="event">
      <h3>{{ formattedEventDate }}</h3>
      <p>{{ eventText }}</p>
      <p v-if="formattedPublishDate">Published {{ formattedPublishDate }}</p>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
const monthParser = d3.timeFormat("%m");

export default {
  name: "articletext",
  props: {
    event: Object
  },
  data() {
    return {};
  },
  computed: {
    eventText() {
      if (!this.event.column) {
        return "Hover over a point in Manhattan to see how Bill described the event that took place there. Select a range of weeks to see events over a shorter period. ";
      }
      return (
        this.event.column.slice(0, 300) +
        (this.event.column.length > 300 ? "..." : "")
      );
    },
    publishYear() {
      return +d3.timeFormat("%Y")(this.event.publishDate);
    },
    eventYear() {
      return monthParser(this.formattedPublishDate) === "01" &&
        monthParser(this.parsedEventDate) === "12"
        ? this.publishYear - 1
        : this.publishYear;
    },
    parsedEventDate() {
      return d3.timeParse("%b %d %Y")(
        `${this.event.eventDate} ${this.eventYear}`
      );
    },
    formattedPublishDate() {
      if (!+this.event.publishDate) return false;
      return d3.timeFormat("%B %_d")(this.event.publishDate);
    },
    formattedEventDate() {
      if (!+this.parsedEventDate) {
        return "This page is interactive.";
      }
      return d3.timeFormat("%a. %B %e, %Y")(this.parsedEventDate);
    }
  }
};
</script>

<style scoped>
#articleText {
  text-align: left;
  padding: 15px;
}

h3 {
  line-height: 1.2em;
  font-size: 1.2em;
  font-style: italic;
  margin: 0;
}

p {
  font-size: 1em;
}
</style>
