<template>
  <div class="shaysClass">
    <p
      v-if="currentScreen"
      id="currentCardTracker"
      style="position:fixed;color: white; top:0; right:0;"
    >{{currentCard}} {{highlightBox}}</p>
    <main id="fixedTextBox" :class="currentScreen ? 'visible' : 'invisible'">
      <!-- <h1>Sticking to the basics</h1> -->
      <p>
        <!--
        While the Upshot is famous for some of its most interactive charts, the
        writers are usually able to make their analysis and visualizations
        approachable by sticking to the basics.
        <br />-->
        <br />In the ninety-five stories with visualizations in 2019, thirty-four
        included
        <span
          :class="`l ${highlightBox === 'line' && 'full-opacity'}`"
          data-hovered-type="line"
        >line graphs</span>, twenty included
        <span
          :class="`s ${highlightBox === 'scatter' && 'full-opacity'}`"
          data-hovered-type="scatter"
        >scatter plots</span>, and thirty-five included
        <span
          :class="`b ${highlightBox === 'bar' && 'full-opacity'}`"
          data-hovered-type="bar"
        >bar charts</span>. Twenty-four resorted to
        <span
          :class="`${highlightBox === 'other' && 'full-opacity'}`"
          data-hovered-type="other"
        >other chart-types</span>.
      </p>
    </main>
    <div :class="currentScreen ? 'fixed chart-wrapper' : 'fixed chart-wrapper invisible'">
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
            <rect class="square" height="10" width="10px" opacity="0.6" />
            <!-- <circle v-if="viz.hasHighlightColor" r="4" cx="5" cy="5" /> -->
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
    <div v-for="i in cardState.length" :key="i" :id="`card-${i}`" :data-index="i" class="card">
      <h4>card {{i}}</h4>
    </div>
  </div>
</template>

<script>
import works from "../json/works_by_url.json";
import {
  chartTypeWaffle,
  getChartTypesKey,
  getColorUseKey,
  getInteractionTypesKey,
  highlightBoxPaths,
  cardState
} from "./waffle_templates";

export default {
  props: ["scrollPosition", "currentScreen"],
  data() {
    const worksList = Object.values(works);
    const vizMap = {};
    const colorUseMap = {};
    const interactionTypesMap = {};

    worksList.forEach(w => {
      const { url, data_viz, first_of_type } = w;
      if (data_viz && first_of_type) {
        const { chart_types, color_use, interaction_types } = data_viz;

        const chartTypeKey = getChartTypesKey(chart_types);
        vizMap[chartTypeKey] = vizMap[chartTypeKey] || [];
        vizMap[chartTypeKey].push(url);

        const colorUseKey = getColorUseKey(color_use);
        vizMap[colorUseKey] = vizMap[colorUseKey] || [];
        vizMap[colorUseKey].push(url);
        colorUseMap[url] = colorUseKey;

        const interactionTypeKey = getInteractionTypesKey(interaction_types);
        vizMap[interactionTypeKey] = vizMap[interactionTypeKey] || [];
        vizMap[interactionTypeKey].push(url);
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
          interactionTypeKey
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
      currentWaffle: chartTypeWaffle
    };
  },
  computed: {
    currentHighlightBoxData() {
      return highlightBoxPaths.filter(d => d.type === this.currentWaffle.name);
    },
    currentCardState() {
      const { currentScreen } = this;
      return cardState[Math.floor(currentScreen)];
    },
    dataVizList() {
      const currentWaffle = this.currentWaffle || [];
      const dataVizList = [];
      currentWaffle.pattern.forEach(p => {
        p.split(" ").forEach(bls => {
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
    }
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
      console.log(cardState);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/color-scheme.scss";
.fixed {
  position: fixed;

  z-index: 1;
  width: 100%;

  &.chart-wrapper {
    bottom: 0;
  }
}
#fixedTextBox {
  position: fixed;
  top: 0;
  height: 30vh;
  padding: 10vh;
}

.card {
  // &#card-1 {
  //   height: 100vh;
  // }
  margin-bottom: 110vh;
  height: 100px;
  border: black 3px solid;
  background-color: black;
}

.visible {
  opacity: 1;
}
.invisible {
  opacity: 0;
}
.shaysClass {
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
        background-color: rgba(var(--rgb), 0.8);
      }
    }
  }
  svg {
    max-width: 80vw;
    max-height: 50vh;
    margin: 10vw;
  }
}

.squares > g {
  transition: transform 400ms ease;
}

.square {
  fill: rgba(var(--rgb), 0.8);
  transition: fill 400ms ease;
  // fill: rgba(250, 250, 250, 0.7);
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

    // &:hover,
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
  --color: rgb(80, 72, 82);
}

* {
  --color: rgb(80, 72, 82);
  --lighter-highlight: rgba(var(--rgb), 0.5);
}
</style>
