<template>
  <div class="shaysClass">
    <main id="fixedTextBox" :class="currentScreen ? 'visible' : 'invisible'">
      <h1>Sticking to the basics</h1>
      <p>
        While the Upshot is famous for some of its most interactive charts, the
        writers are usually able to make their analysis and visualizations
        approachable by sticking to the basics.
        <br />
        <br />In the ninety-five stories with visualizations in 2019, thirty-four
        included
        <span
          :class="`l ${hoveredType === 'line' && 'full-opacity'}`"
          data-hovered-type="line"
        >line graphs</span>, twenty included
        <span
          :class="`s ${hoveredType === 'scatter' && 'full-opacity'}`"
          data-hovered-type="scatter"
        >scatter plots</span>, and thirty-five included
        <span
          :class="`b ${hoveredType === 'bar' && 'full-opacity'}`"
          data-hovered-type="bar"
        >bar charts</span>. Twenty-four resorted to
        <span
          :class="`${hoveredType === 'other' && 'full-opacity'}`"
          data-hovered-type="other"
        >other chart-types</span>.
      </p>
    </main>
    <div :class="currentScreen ? 'fixed chart-wrapper' : 'fixed chart-wrapper invisible'">
      <svg viewBox="2.5 2.5 180 120">
        <g class="squares">
          <defs>
            <mask id="tableMask">
              <rect height="5" width="5" x="0" y="0" fill="white" />
              <g stroke="black" stroke-width="0.1">
                <line x1="0" y1="1" x2="5" y2="1" />
                <line x1="0" y1="1.7" x2="5" y2="1.7" />
                <line x1="0" y1="2.4" x2="5" y2="2.4" />
                <line x1="0" y1="3.1" x2="5" y2="3.1" />
                <line x1="0" y1="3.8" x2="5" y2="3.8" />
                <line x1="2" y1="0" x2="2" y2="5" />
                <line x1="3.5" y1="0" x2="3.5" y2="5" />
              </g>
            </mask>
            <mask id="heatMapMask">
              <g fill="white">
                <rect height="1.16667" width="5" x="5" y="1" opacity="0.05" />
                <rect height="1.16667" width="5" x="5" y="2.16667" opacity="0.2" />
                <rect height="1.16667" width="5" x="5" y="3.33333" opacity="0.4" />
              </g>

              <g fill="white">
                <rect width="1.16667" height="5" y="1" x="5.5" opacity="0.2" />
                <rect width="1.16667" height="5" y="1" x="6.66667" opacity="0.3" />
                <rect width="1.16667" height="5" y="1" x="7.9" opacity="0.4" />
              </g>
            </mask>
            <mask id="texasMask">
              <image href="../../../assets/icons/texas.jpeg" height="3.5" width="3.5" x="1" y="5.5" />
            </mask>
            <mask id="animationMask" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="white" />
              <circle r="0.1" cx=".125" cy=".125" fill="black" opacity="0.5" />
              <circle r="0.15" cx=".25" cy=".25" fill="black" opacity="0.6" />
              <circle r="0.225" cx=".425" cy=".425" fill="black" opacity="0.7" />
              <circle r="0.275" cx=".6" cy=".6" fill="black" opacity="1" />
            </mask>
          </defs>
          <g
            v-for="(viz, index) in dataVizList"
            :key="viz.url"
            :class="`${viz.interactionTypesKey}`"
            :transform="
            `translate(${5 + (index % 12) * 15},  ${5 +
              Math.floor(index / 12) * 15})`
          "
          >
            <!-- <g class="icons">
              <g v-if="viz.hasATable">
                <rect height="3.5" width="3.5" x="1" y="1" mask="url(#tableMask)" />
              </g>

              <g v-if="viz.hasAHeatMap">
                <rect height="3.5" width="3.5" x="5.5" y="1" mask="url(#heatMapMask)" />
              </g>

              <g v-if="viz.hasAChloropleth">
                <rect height="3.5" width="3.5" x="1" y="5.5" mask="url(#texasMask)" />
              </g>

              <g v-if="viz.hasAnimation">
                <rect height="3.5" width="3.5" x="5.5" y="5.5" mask="url(#animationMask)" />
              </g>
            </g>-->
            <rect class="square" height="10" width="10px" opacity="0.6" />
            <!-- <circle v-if="viz.hasHighlightColor" r="4" cx="5" cy="5" /> -->
          </g>
        </g>

        <g class="chart-type-overlay">
          <rect class="chart-overlay" height="125px" width="185px" />

          <path
            v-for="chartName in Object.keys(chartTypes)"
            :key="chartName"
            :class="
              `box ${chartName} top ${hoveredType === chartName &&
              'full-opacity'}`
            "
            :data-hovered-type="chartName"
            :d="chartTypes[chartName].boxPath"
          />
        </g>
      </svg>
    </div>
    <div v-for="i in 10" :key="i" :id="`card-${i}`" :data-index="i" class="card">
      <h4>card {{i}}</h4>
    </div>
  </div>
</template>

<script>
import works from "../json/works_by_url.json";
import { interactionTypePaths, interactionTypeWaffe } from "./waffle_templates";

export default {
  props: ["scrollPosition", "currentScreen"],
  data() {
    const worksList = Object.values(works);
    const dataVizList = [];
    const vizMap = {};
    const colorUseMap = {};
    const interactionTypesMap = {};

    worksList.forEach(w => {
      const { url, data_viz, first_of_type } = w;
      if (data_viz && first_of_type) {
        const { chart_types, color_use, interaction_types } = data_viz;

        let chartTypesKey = "";

        if (chart_types.includes("bar")) chartTypesKey += "b";
        if (chart_types.includes("line")) chartTypesKey += "l";
        if (chart_types.includes("scatter")) chartTypesKey += "s";
        chartTypesKey = chartTypesKey || "n";

        vizMap[chartTypesKey] = vizMap[chartTypesKey] || [];
        vizMap[chartTypesKey].push(url);

        let colorUseKey = "";
        if (color_use) {
          if (color_use.includes("categorical")) colorUseKey += "c";
          if (color_use.includes("diverging")) colorUseKey += "d";
          if (color_use.includes("highlight")) colorUseKey += "h";
          if (color_use.includes("sequential")) colorUseKey += "q";
        }
        colorUseKey = colorUseKey || "-";
        vizMap[colorUseKey] = vizMap[colorUseKey] || [];
        vizMap[colorUseKey].push(url);
        colorUseMap[url] = colorUseKey;

        let interactionTypesKey = "";
        if (interaction_types) {
          if (interaction_types.includes("hover")) interactionTypesKey += "hv";
          if (interaction_types.includes("filter")) interactionTypesKey += "f";
          if (interaction_types.includes("quiz")) interactionTypesKey += "qz";
        }
        interactionTypesKey = interactionTypesKey || "*";
        vizMap[interactionTypesKey] = vizMap[interactionTypesKey] || [];
        vizMap[interactionTypesKey].push(url);
        interactionTypesMap[url] = interactionTypesKey;
      }
    });
    console.log(new Map(Object.keys(vizMap).map(d => [d, vizMap[d].length])));

    Object.keys(vizMap).forEach(key => {
      const list = vizMap[key].sort((a, b) => {
        var isChartApproved = c =>
          ["table", "heat map", "chloropleth", "animation"].includes(c);
        const aCharts = works[a].data_viz.chart_types.filter(isChartApproved);
        const bCharts = works[b].data_viz.chart_types.filter(isChartApproved);

        const act = aCharts.length;
        const bct = bCharts.length;
        return bct - act;
      });
      vizMap[key] = list;
    });

    interactionTypeWaffe.forEach(p => {
      p.split(" ").forEach(bls => {
        let url;
        // console.log(bls);
        url = vizMap[bls]?.shift();
        if (!url) {
          console.log("list is empty", bls);
          // for (let list.filter(d => d.) in vizMap) {
          //   console.log(list, vizMap[list].length);
          // }
          return;
        }
        // vizMap[bls].push(url);
        let colorUseKey = colorUseMap[url];
        let interactionTypesKey = interactionTypesMap[url];

        Object.assign(works[url], {
          hasATable: works[url].data_viz.chart_types.includes("table"),
          hasAHeatMap: works[url].data_viz.chart_types.includes("heat map"),
          hasAChloropleth: works[url].data_viz.chart_types.includes(
            "chloropleth"
          ),
          hasAnimation: works[url].data_viz.chart_types.includes("animation"),
          hasSmallMultiples: works[url].data_viz.chart_types.includes(
            "small multiples"
          ),
          hasHighlightColor: works[url].data_viz.color_use?.includes(
            "highlight"
          ),
          bls,
          colorUseKey,
          interactionTypesKey
        });
        dataVizList.push(works[url]);
      });
    });

    return {
      dataVizList,
      hoveredType: null,
      chartTypes: interactionTypePaths,
      fixed: false,
      states: new Array(12).fill(false),
      currentCard: 0,
      colorUseMap,
      interactionTypesMap
    };
  },
  created() {
    this.callbackList = [
      "barChartsHighlighted",
      "lineChartsHighlighted",
      "scatterChartsHighlighted"
    ];
  },
  mounted() {
    // const observer = new IntersectionObserver(this.respondToEntry);
    // for (const el of this.$el.getElementsByClassName("card")) {
    //   observer.observe(el);
    // }
  },
  methods: {
    respondToEntry([el]) {
      const { states } = this;
      const i = +el.target.dataset.index;
      states[i] = el.isIntersecting;

      if (!states[i] && states[i - 1]) {
        this.currentCard = i - 1;
      } else if (!states[i] && states[i + 1]) {
        this.currentCard = i + 1;
      } else if (states[i - 1]) {
        this.currentCard = i - 0.5;
      } else if (states[i + 1]) {
        this.currentCard = i + 0.5;
      }
    }
    // enterHover(el) {
    //   this.previousHoverState = this.hoveredType;
    //   this.hoveredType = el.currentTarget.getAttribute("data-hovered-type");
    // },
    // exitHover() {
    //   this.hoveredType = this.previousHoverState;
    // },
    // mockHover(hoveredType) {
    //   this.hoveredType = hoveredType;
    //   this.previousHoverState = hoveredType;
    // }
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
  // width: 100 %;
  height: 30vh;
  padding: 10vh;
}

.card {
  &#card-1 {
    height: 100vh;
  }
  height: 100vh;
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
    margin: 0;
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

.square {
  fill: rgba(var(--rgb), 0.8);
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
</style>
