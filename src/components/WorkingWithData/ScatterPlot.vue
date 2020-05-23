<template>
  <div class="container">
    <h2>Most common verbs by article type</h2>
    <svg :viewBox="`0 -5 ${chartSize + 30} ${chartSize + 10}`">
      <g class="axes">
        <g
          class="annotation"
          font-size="2"
          stroke="none"
          :transform="`translate(${chartSize - 15}, 15)`"
        >
          <text y="2" x="-3.5" font-size="3">&nwarr;</text>
          <text y="-1" transform="rotate(-45)">More frequent in Reporting</text>
          <text y="3" x="-2.5" font-size="3">&searr;</text>
          <text y="2" transform="rotate(-45)">More frequent in Opinion</text>
        </g>
        <path :d="`M0,0 v${chartSize} h${chartSize} `" fill="none" />
        <path :d="`M0,${chartSize} l${chartSize},-${chartSize}`" stroke-dasharray="2 1" />
      </g>
      <g class="points">
        <g
          :class="`point ${v.verb} ${v.tense} ${pinned[v.verb] ? 'pinned': ''}`"
          v-for="v of allVerbs"
          :key="v.verb"
          :transform="`translate(${v.position[0]}, ${v.position[1]})`"
          @mouseover="() => showTooltip(v)"
          @mouseleave="hideTooltip"
        >
          <circle class="dot" fill="red" r="1" />
          <circle fill="transparent" r="3" />
          <g :transform="pinned[v.verb] || pinned.other">
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
const pinned = {
  is: "translate(-6.5,0)",
  has: "translate(-12.5,0)",
  was: "translate(-6,-8.5)",
  said: "translate(0,-6.5)",
  other: "translate(0,-6.5)"
};

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
    Object.entries(verbs.all.opinion)
      .slice(0, 20)
      .forEach(addVerb("opinion"));
    Object.entries(verbs.all.reporting)
      .slice(0, 20)
      .forEach(addVerb("reporting"));

    Object.entries(verbs).forEach(([code, { opinion, reporting }]) => {
      if (code === "all") return;
      for (let verb in { ...opinion, ...reporting }) {
        if (allVerbs[verb]) allVerbs[verb].tense = code;
      }
    });

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
  },
  created() {
    this.pinned = pinned;
  }
};
</script>

<style lang="scss" scoped>
.annotation {
  font-family: nyt-franklin;
  font-weight: 400;
}
.axes {
  stroke: rgb(143, 143, 143);
  stroke-width: 0.2;
}
.point {
  circle {
    opacity: 0.3;
    transition: opacity 400ms;
  }
  .dot {
    fill: var(--color);
  }
  text {
    visibility: hidden;
    &:nth-of-type(n + 2) {
      text-transform: capitalize;
      font-family: nyt-franklin;
    }
  }
  &:hover,
  &.pinned {
    circle {
      opacity: 1;
    }
    text {
      visibility: visible;
      text-shadow: 0px 0px 20px var(--color);
      opacity: 1;
      z-index: 1;
    }
  }
}
</style>