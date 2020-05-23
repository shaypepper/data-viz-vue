<template>
  <div class="container">
    <svg :viewBox="`-15 -5 ${chartSize + 30} ${chartSize + 10}`">
      <g class="axes" stroke="gainsboro" stroke-width="0.2">
        <path :d="`M0,0 v${chartSize} h${chartSize} `" fill="none" />
        <path :d="`M0,${chartSize} l${chartSize},-${chartSize}`" stroke-dasharray="2 1" />
        <text
          font-size="4"
          :x="chartSize - 62"
          y="-1"
          stroke="none"
        >&larr; Verbs more common in Reporting</text>

        <text
          transform="rotate(90)"
          font-size="4"
          :y="-chartSize -1"
          x="2"
          stroke="none"
        >Verbs more common in Opinion &rarr;</text>
      </g>
      <g class="points">
        <g
          :class="`point ${v.verb}`"
          v-for="v of allVerbs"
          :key="v.verb"
          :transform="`translate(${v.position[0]}, ${v.position[1]})`"
          @mouseover="() => showTooltip(v)"
          @mouseleave="hideTooltip"
        >
          <circle fill="black" r="0.5" />
          <circle fill="transparent" r="3" />
          <g class=".tooltip" :transform="`translate(${v.verb === 'is' ?-15 :0}, -6.5)`">
            <text font-size="6" y="0" x="1">{{v.verb}}</text>
            <text font-size="2" y="3" x="1">{{v.stats.reporting}}</text>
            <text font-size="2" y="6" x="1">{{v.stats.opinion}}</text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import verbs from "./data/verbs.json";
import * as d3 from "d3";
const chartSize = 100;

export default {
  data() {
    const allVerbs = {};
    let maxP = 0;
    let minP = 1;
    const addVerb = articleType => ([verb, [count, p]]) => {
      if (p > maxP) maxP = p;
      if (p < minP) minP = p;
      allVerbs[verb] = allVerbs[verb] || { verb };
      allVerbs[verb][articleType] = {
        count,
        p
      };
      allVerbs[verb].stats = allVerbs[verb].stats || {};
      allVerbs[verb].stats[articleType] = `${articleType}: ${this.prettyPercent(
        p
      )}`;
    };
    Object.entries(verbs.all.opinion).forEach(addVerb("opinion"));
    Object.entries(verbs.all.reporting).forEach(addVerb("reporting"));

    const domain = [0, maxP].map(d => d);

    const xScale = d3
      .scaleSqrt()
      .domain(domain)
      .range([0, chartSize]);

    const yScale = d3
      .scaleSqrt()
      .domain(domain)
      .range([chartSize, 0]);

    Object.keys(allVerbs).forEach(verb => {
      const v = allVerbs[verb];
      allVerbs[verb].position = [
        xScale(v.opinion ? v.opinion.p : 0),
        yScale(v.reporting ? v.reporting.p : 0)
      ];
    });

    return {
      allVerbs,
      maxP,
      xScale,
      yScale,
      chartSize,
      tooltipIsVisible: false,
      tooltipVerb: ""
    };
  },
  methods: {
    showTooltip(v) {
      if (this.tooltipIsVisible) return;
      this.tooltipPosition = v.position;
      this.tooltipIsVisible = true;
      this.tooltipVerb = v.verb;
    },
    hideTooltip() {
      this.tooltipIsVisible = false;
      this.tooltipPosition = [0, 0];
    },
    prettyPercent(val) {
      return `${Math.floor(val * 1000) / 10}%`;
    }
  }
};
</script>

<style lang="scss" scoped>
.point {
  circle {
    opacity: 0.3;
  }
  text {
    visibility: hidden;
    &:nth-of-type(n + 2) {
      text-transform: capitalize;
      font-family: nyt-franklin;
    }
  }
  &:hover {
    circle {
      opacity: 1;
    }
    text {
      visibility: visible;
      text-shadow: 0px 0px 20px yellow;
      opacity: 1;
      z-index: 1;
    }
  }
}
</style>