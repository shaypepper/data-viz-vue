<template>
  <div class="container">
    <svg :viewBox="`-10 -10 ${chartSize + 20} ${chartSize + 20}`">
      <g class="points">
        <g class="point" v-for="v of allVerbs" :key="v.verb">
          <circle
            :cx="v.position[0]"
            :cy="v.position[1]"
            @mouseover="() => showTooltip(v)"
            @mouseleave="hideTooltip"
            fill="black"
            r="2"
          />
        </g>
      </g>
      <g
        class="tooltip"
        :opacity="tooltipIsVisible ? 1 : 0"
        :transform="`translate(${tooltipPosition[0] +  3}, ${tooltipPosition[1] + 3})`"
      >
        <rect width="20" height="20" fill="white" />
        <text font-size="10" y="20">{{tooltipVerb}}</text>
      </g>
      <g class="axes">
        <path :d="`M0,0 v${chartSize}`" stroke="black" />
        <path :d="`M0,${chartSize} h${chartSize}`" stroke="black" />
        <path :d="`M0,${chartSize} l${chartSize - 2},-${chartSize - 2}`" stroke="black" />
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
    const addVerb = articleType => ([verb, count, p]) => {
      if (p > maxP) maxP = p;
      if (p < minP) minP = p;
      allVerbs[verb] = allVerbs[verb] || { verb };
      allVerbs[verb][articleType] = {
        count,
        p
      };
    };
    verbs.all.opinion.forEach(addVerb("opinion"));
    verbs.all.reporting.forEach(addVerb("reporting"));

    const xScale = d3
      .scaleLog()
      .domain([minP, maxP])
      .range([0, chartSize]);

    const yScale = d3
      .scaleLog()
      .domain([minP, maxP])
      .range([chartSize, 0]);

    Object.keys(allVerbs).forEach(verb => {
      const v = allVerbs[verb];
      allVerbs[verb].position = [
        v.opinion ? xScale(v.opinion.p) : 0,
        v.reporting ? yScale(v.reporting.p) : 0
      ];
    });

    return {
      allVerbs,
      maxP,
      xScale,
      yScale,
      chartSize,
      tooltipPosition: [0, 0],
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>