<template>
  <div class="shaysClass waffleChart">
    <transition name="fade" mode="out-in">
      <div
        v-if="currentScreen && currentWaffle.name"
        class="fixed chart-wrapper"
      >
        <main>
          <transition-group name="fade" tag="p" mode="out-in">
            <chart-types
              v-if="currentScreen && currentWaffle.name === 'chartType'"
              key="chartType"
              :highlightBox="highlightBox"
            />

            <color-use
              v-if="currentScreen && currentWaffle.name === 'colorUse'"
              key="colorUse"
              :highlightBox="highlightBox"
            />

            <interaction-type
              v-if="currentScreen && currentWaffle.name === 'interactionType'"
              key="interactionType"
              :highlightBox="highlightBox"
            />
          </transition-group>
        </main>
        <svg viewBox="2.5 2.5 180 120">
          <g class="squares">
            <g
              v-for="(viz, index) in dataVizList"
              :key="viz.url"
              :class="viz[currentWaffle.name + 'Key']"
              :transform="
                `translate(${5 + (index % 12) * 15},  ${5 +
                  Math.floor(index / 12) * 15})`
              "
            >
              <rect
                class="square"
                height="10"
                width="10px"
                opacity="0.6"
                :stroke="viz.interactive && 'white'"
                :stroke-dasharray="viz.interactive && 1"
              />
              <circle
                v-if="
                  viz.hasHighlightColor && currentWaffle.name === 'colorUse'
                "
                r="4"
                cx="5"
                cy="5"
              />
            </g>
          </g>

          <g class="chart-type-overlay">
            <rect class="chart-overlay" height="125px" width="185px" />

            <path
              v-for="box in currentHighlightBoxData"
              :key="box.name"
              :class="
                `box ${box.name} top ${highlightBox === box.name &&
                  'highlighted'}`
              "
              :data-hovered-type="box.name"
              :d="box.path"
            />
          </g>
        </svg>
      </div>
    </transition>
    <div
      v-for="i in cardState.length"
      :key="i"
      :id="`card-${i}`"
      :data-index="i"
      class="card"
    />
  </div>
</template>

<script>
import works from "../json/works_by_url.json";
import ChartTypes from "./paragraphs/ChartTypes";
import ColorUse from "./paragraphs/ColorUse";
import InteractionType from "./paragraphs/InteractionType";
import {
  chartTypeWaffle,
  getChartTypesKey,
  getColorUseKey,
  getInteractionTypesKey,
  highlightBoxPaths,
  cardState,
} from "./waffle_templates";

window.works = works;

export default {
  props: ["scrollPosition", "currentScreen"],
  components: {
    ChartTypes,
    ColorUse,
    InteractionType,
  },
  data() {
    const worksList = Object.values(works);
    const vizMap = {};
    const colorUseMap = {};
    const interactionTypesMap = {};

    worksList.forEach((w) => {
      const { url, data_viz, first_of_type, interactive } = w;
      if (data_viz && first_of_type) {
        const { chart_types, color_use, interaction_types } = data_viz;

        const chartTypeKey = getChartTypesKey(chart_types);
        vizMap[chartTypeKey] = vizMap[chartTypeKey] || [];
        vizMap[chartTypeKey][!interactive ? "push" : "unshift"](url);

        const colorUseKey = getColorUseKey(color_use);
        vizMap[colorUseKey] = vizMap[colorUseKey] || [];
        vizMap[colorUseKey][!interactive ? "push" : "unshift"](url);
        colorUseMap[url] = colorUseKey;

        const interactionTypeKey = getInteractionTypesKey(interaction_types);
        vizMap[interactionTypeKey] = vizMap[interactionTypeKey] || [];
        vizMap[interactionTypeKey][!interactive ? "push" : "unshift"](url);
        interactionTypesMap[url] = interactionTypeKey;

        Object.assign(works[url], {
          hasATable: chart_types.includes("table"),
          hasAHeatMap: chart_types.includes("heat map"),
          hasAChloropleth: chart_types.includes("chloropleth"),
          hasAnimation: chart_types.includes("animation"),
          hasSmallMultiples: chart_types.includes("small multiples"),
          hasHighlightColor: color_use?.includes("highlight"),
          chartTypeKey,
          colorUseKey,
          interactionTypeKey,
        });
      }
    });

    return {
      highlightBox: null,
      chartTypes: highlightBoxPaths,
      fixed: false,
      states: new Array(12).fill(false),
      currentCard: 0,
      vizMap,
      cardState,
      currentWaffle: chartTypeWaffle,
    };
  },
  computed: {
    currentHighlightBoxData() {
      return highlightBoxPaths.filter(
        (d) => d.type === this.currentWaffle.name
      );
    },
    currentCardState() {
      const { currentScreen } = this;
      return cardState[Math.floor(currentScreen)];
    },
    dataVizList() {
      const currentWaffle = this.currentWaffle || { pattern: [] };
      const dataVizList = [];
      currentWaffle.pattern.forEach((p) => {
        p.split(" ").forEach((bls) => {
          let url;

          url = this.vizMap[bls]?.shift();
          this.vizMap[bls].push(url);

          if (!works[url]) {
            return;
          }
          dataVizList.push(works[url]);
        });
      });
      return dataVizList;
    },
  },
  mounted() {
    const observer = new IntersectionObserver(this.respondToEntry);
    for (const el of this.$el.getElementsByClassName("card")) {
      observer.observe(el);
    }
  },
  methods: {
    respondToEntry(entries) {
      for (let entry of entries) {
        const { states } = this;
        const i = +entry.target.dataset.index;
        states[i] = entry.isIntersecting;

        if (entry.isIntersecting) {
          this.currentCard = i;
        }
      }
      Object.assign(this, cardState[this.currentCard]);
      console.log(this.currentWaffle);
    },
  },
};
</script>

<style lang="scss">
@import "../../../assets/css/color-scheme.scss";
.fixed {
  position: fixed;
  z-index: 1;
  margin: 10vmin;
  display: grid;
  height: 80vmin;
  width: 80vmin;
  left: calc(50vw - 50vmin);

  &.chart-wrapper {
    bottom: 0;
  }
}

.card {
  height: 110vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.shaysClass.waffleChart {
  --rgb: 220, 220, 220;
  --hue: 0;
  color: white;

  * {
    transition: opacity ease-in-out 400ms, fill ease-in-out 400ms;
  }
  h1 {
    font-family: nyt-cheltenham;
    font-style: italic;
    font-weight: 700;
    font-size: 42px;
  }
  p {
    font-size: 22px;

    span {
      background-color: rgba(var(--rgb), 0.5);
      padding: 0 3px;
      transition: background-color 250ms ease-in-out;
      white-space: nowrap;
      &:hover,
      &.full-opacity {
        background-color: rgba(var(--rgb), 0.9);
      }
    }
  }
}

.squares > g {
  transition: transform 1000ms ease;
}

.square {
  fill: rgba(var(--rgb), 0.8);
  transition: fill 1000ms ease;
}

rect.chart-overlay {
  opacity: 0;
}

path.box {
  opacity: 0;
  fill: var(--color);

  &.highlighted {
    opacity: 0.3;
    stroke-width: 3;

    &.full-opacity {
      opacity: 0.8;
    }
  }
}

.b,
.bar,
.c,
.categorical,
.hover,
.hv {
  @extend .blue;
}
.l,
.line,
.d,
.diverging,
.filter,
.f {
  @extend .yellow;
}
.s,
.scatter,
.q,
.sequential,
.quiz,
.qz {
  @extend .red;
}
.bl,
.cd,
.cdh,
.hover.filter,
.hvf {
  @extend .green;
}
.bs,
.cq,
.hover.quiz {
  @extend .purple;
}
.ls,
.dq,
.filter.quiz {
  @extend .orange;
}
.bls,
.cdq,
.other {
  --rgb: 80, 72, 82;
  --color: #ffffff;
}

* {
  --color: white;
}
</style>
