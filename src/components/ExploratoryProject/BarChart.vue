<template>
  <div id="barChart">
    <svg
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      @mousemove="handleHover"
      @mousedown="brushStart"
      @mouseup="brushEnd"
    >
      <g>
        <rect
          id="cursor"
          fill="orange"
          opacity="0.5"
          y="90"
          :transform="`translate(${selectionStartX - 1}, 0)`"
          height="12"
          :width="selectionWidth + 2"
        />
        <text
          v-if="formattedStartDate != formattedEndDate"
          y="98"
          font-size="6"
          width="34"
          :transform="`translate(${Math.max(0, selectionStartX - 34)} , 0)`"
        >
          {{ formattedStartDate }}
        </text>
        <text
          y="98"
          font-size="6"
          :transform="
            `translate(${Math.max(
              34,
              Math.min(selectionStartX + selectionWidth + 3, svgWidth - 34)
            )} , 0)`
          "
        >
          {{ formattedEndDate }}
        </text>
      </g>
      <g
        v-for="d in articles"
        v-bind:key="d.key"
        :transform="`translate(${d.x},${d.y})`"
      >
        <g v-if="d.nEvents > 16">
          <text y="-2" font-size="3" x="-1">{{ d.nEvents }}</text>
        </g>
        <rect
          :opacity="d.opacity"
          :stroke="d.stroke"
          :width="d.width"
          :height="d.height"
          :data-offset="d.x"
          @mouseenter="(e) => handleBrushChange(e, d)"
          @mousedown="(e) => setStartDate(e, d)"
          @mouseup="(e) => setEndDate(e, d)"
        />
      </g>

      <g ref="xAxis" transform="translate(0,90)" />
      <g ref="brush" x="brushStart" width="brushWidth" />
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import Vue from "vue";
import vueDebounce from "vue-debounce";

Vue.use(vueDebounce);

const margin = {
    bottom: 10,
    right: 10,
    top: 10,
    left: 10,
  },
  svgWidth = 400;

export default {
  name: "barchart",
  props: {
    events: Array,
    startDate: Date,
    endDate: Date,
  },
  data() {
    const { xScale, yScale, rawArticles } = this.manipulateArticleList();
    return {
      svgHeight: 100,
      svgWidth,
      currentBar: {},
      hovered: false,
      xScale,
      yScale,
      rawArticles,
      currentCursorLocation: 0,
      selectionStart: 0,
      selectionEnd: 0,
      clientOffset: 0,
      parentWidth: 0,
      tempStartDate: null,
      tempEndDate: null,
    };
  },
  computed: {
    tickValues() {
      return [this.startDate, this.endDate];
    },
    startDateKey() {
      return d3.timeFormat("%Y-%m-%d")(this.startDate);
    },
    endDateKey() {
      return d3.timeFormat("%Y-%m-%d")(this.endDate);
    },
    formattedStartDate() {
      const { tempStartDate, startDate } = this;
      return d3.timeFormat("%Y-%m-%d")(tempStartDate || startDate);
    },
    formattedEndDate() {
      const { tempEndDate, endDate } = this;
      return d3.timeFormat("%Y-%m-%d")(tempEndDate || endDate);
    },
    selectionStartX() {
      const {
        brushing,
        selectionStart,
        xScale,
        startDateKey,
        tempStartDate,
      } = this;
      return (
        (brushing && tempStartDate && selectionStart) ||
        xScale(startDateKey) ||
        0
      );
    },
    selectionWidth() {
      const {
        selectionEnd,
        selectionStart,
        startDateKey,
        endDateKey,
        brushing,
        xScale,
        tempStartDate,
      } = this;
      return Math.max(
        0,
        (brushing && tempStartDate && selectionEnd - selectionStart + 1) ||
          xScale(endDateKey) - xScale(startDateKey) ||
          0
      );
    },
    articles() {
      return this.rawArticles.map((article, index) => {
        const publishDate = article.values[0].publishDate;
        return {
          key: article.key,
          index,
          nEvents: article.values.length,
          publishDate,
          height: this.yScale(article.values.length),
          width: 0.5,
          stroke: "rgb(40,40,40)",
          opacity:
            publishDate >= this.startDate && publishDate <= this.endDate
              ? 1
              : 0.2,
          x: this.xScale(article.key),
          y:
            this.svgHeight - this.yScale(article.values.length) - margin.bottom,
        };
      });
    },
  },
  watch: {
    startDate() {
      this.manipulateArticleList();
    },
    events: {
      immediate: true,
      handler: function() {
        this.manipulateArticleList();
      },
    },
  },
  methods: {
    manipulateArticleList() {
      const rawArticles = d3
        .nest()
        .key((d) => d3.timeFormat("%Y-%m-%d")(d.publishDate))
        .entries(this.events)
        .sort((a, b) => a.key - b.key);
      const xScale = d3
        .scaleBand()
        .domain(rawArticles.map((d) => d.key))
        .range([0, svgWidth]);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(rawArticles.map((d) => d.values.length))])
        .range([0, this.svgHeight - margin.bottom - margin.top]);

      if (this.rawArticles) {
        this.rawArticles = rawArticles;
        this.xScale = xScale;
        this.yScale = yScale;
      } else {
        return {
          xScale,
          yScale,
          rawArticles,
        };
      }
    },
    getPublishDate(d) {
      return d.key;
    },
    drawXAxis() {
      const xAxis = d3.axisBottom(this.xScale).tickValues(this.tickValues);
      d3.select(this.$refs.xAxis).call(xAxis);
    },
    getCurrentHoverLocation(e) {
      let currentCursorLocation = 0;

      if (this.parentWidth !== e.currentTarget.clientWidth) {
        this.parentWidth = e.currentTarget.clientWidth;
      }

      switch (e.target.tagName) {
        case "svg":
          if (!this.clientOffset) {
            this.clientOffset = e.clientX - e.offsetX;
          }

          currentCursorLocation = e.offsetX / this.parentWidth;
          break;
        case "rect":
          if (!this.clientOffset) {
            this.clientOffset =
              e.clientX -
              (e.target.attributes["data-offset"].nodeValue / svgWidth) *
                this.parentWidth;
          }
          currentCursorLocation =
            (e.clientX - this.clientOffset) / this.parentWidth;
          break;
        default:
          break;
      }
      return currentCursorLocation * svgWidth;
    },
    handleHover(e) {
      if (this.brushing) {
        this.selectionEnd = this.getCurrentHoverLocation(e);
      }
    },
    handleBrushChange(e, article) {
      if (this.brushing) {
        this.tempEndDate = article.publishDate;
      }
    },
    setStartDate: function(e, article) {
      this.tempStartDate = article.publishDate;
    },
    setEndDate: function(e, article) {
      this.tempEndDate = article.publishDate;
      this.$emit("select-range", this.tempStartDate, article.publishDate);
      this.tempStartDate = null;
      this.tempEndDate = null;
    },
    brushStart: function(e) {
      let hoverLocation = this.getCurrentHoverLocation(e);
      this.selectionStart = hoverLocation;
      this.selectionEnd = hoverLocation;
      this.brushing = true;
    },
    brushEnd: function() {
      this.brushing = false;
      this.selectionStart = 0;
      this.selectionEnd = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/color-scheme.scss";
#barChart {
  padding: 15px;
  cursor: crosshair;

  svg {
    height: 100%;
    max-width: 100%;
  }
}

#cursor {
  transition: transform 50ms linear;
}
</style>
