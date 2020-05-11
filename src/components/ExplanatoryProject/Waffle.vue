<template>
  <div class="shaysClass">
    <h1>Sticking to the basics</h1>
    <p>
      While the Upshot is famous for some of its most interactive charts, the
      writers are usually able to make their analysis and visualizations
      approachable by sticking to the basics. <br /><br />In the ninety-five
      stories with visualizations in 2019, thirty-four included
      <span
        :class="`l ${hoveredType === 'line' && 'full-opacity'}`"
        data-hovered-type="line"
        @mouseenter="enterHover"
        @mouseleave="exitHover"
        >line graphs</span
      >, twenty included
      <span
        :class="`s ${hoveredType === 'scatter' && 'full-opacity'}`"
        data-hovered-type="scatter"
        @mouseenter="enterHover"
        @mouseleave="exitHover"
        >scatter plots</span
      >, and thirty-five included
      <span
        :class="`b ${hoveredType === 'bar' && 'full-opacity'}`"
        data-hovered-type="bar"
        @mouseenter="enterHover"
        @mouseleave="exitHover"
        >bar charts</span
      >. Twenty-four resorted to
      <span
        :class="`${hoveredType === 'other' && 'full-opacity'}`"
        data-hovered-type="other"
        @mouseenter="enterHover"
        @mouseleave="exitHover"
        >other chart-types</span
      >.
    </p>
    <svg viewBox="1.5 1.5 185 185">
      <g class="underlay">
        <path
          v-for="chartName in Object.keys(chartTypes)"
          :key="chartName"
          :class="`box ${chartName}`"
          :d="`${chartTypes[chartName].boxPath}`"
        />
      </g>

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
              <rect
                height="1.16667"
                width="5"
                x="5"
                y="2.16667"
                opacity="0.2"
              />
              <rect
                height="1.16667"
                width="5"
                x="5"
                y="3.33333"
                opacity="0.4"
              />
            </g>

            <g fill="white">
              <rect width="1.16667" height="5" y="1" x="5.5" opacity="0.2" />
              <rect
                width="1.16667"
                height="5"
                y="1"
                x="6.66667"
                opacity="0.3"
              />
              <rect width="1.16667" height="5" y="1" x="7.9" opacity="0.4" />
            </g>
          </mask>
          <mask id="texasMask">
            <image
              href="../../assets/icons/texas.jpeg"
              height="3.5"
              width="3.5"
              x="1"
              y="5.5"
            />
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
          :class="`${viz.bls}`"
          :transform="
            `translate(${5 + (index % 12) * 15},  ${5 +
              Math.floor(index / 12) * 15})`
          "
        >
          <g class="icons">
            <g v-if="viz.hasATable">
              <rect
                height="3.5"
                width="3.5"
                x="1"
                y="1"
                mask="url(#tableMask)"
              />
            </g>

            <g v-if="viz.hasAHeatMap">
              <rect
                height="3.5"
                width="3.5"
                x="5.5"
                y="1"
                mask="url(#heatMapMask)"
              />
            </g>

            <g v-if="viz.hasAChloropleth">
              <rect
                height="3.5"
                width="3.5"
                x="1"
                y="5.5"
                mask="url(#texasMask)"
              />
            </g>

            <g v-if="viz.hasAnimation">
              <rect
                height="3.5"
                width="3.5"
                x="5.5"
                y="5.5"
                mask="url(#animationMask)"
              />
            </g>
          </g>
          <rect class="square" height="10" width="10px" opacity="0.6" />
        </g>
      </g>

      <g class="overlay">
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
          @mouseenter="enterHover"
          @mouseleave="exitHover"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import works from "./json/works_by_url.json";

const pattern = [
  "n n n n n n n n n n s s",
  "n n b b b b bs s s s s s",
  "n n b b b b bs s s s s s",
  "n n b b b bl bls ls ls ls ls ls",
  "n n b b b bl bl l l l l l",
  "n n b b b bl bl l l l l l",
  "n n b b b bl bl l l l l l",
  "n n b b b bl bl l l l l",
];

export default {
  data() {
    const worksList = Object.values(works);
    const dataVizList = [];
    const vizMap = {};

    worksList.forEach(({ url, data_viz, first_of_type }) => {
      if (data_viz && first_of_type) {
        let bls = "";

        if (data_viz.chart_types.includes("bar")) {
          bls += "b";
        }

        if (data_viz.chart_types.includes("line")) {
          bls += "l";
        }

        if (data_viz.chart_types.includes("scatter")) {
          bls += "s";
        }

        bls = bls || "n";

        vizMap[bls] = vizMap[bls] || [];
        vizMap[bls].push(url);
      }
    });

    Object.keys(vizMap).forEach((key) => {
      const list = vizMap[key].sort((a, b) => {
        var isChartApproved = (c) =>
          ["table", "heat map", "chloropleth", "animation"].includes(c);
        const aCharts = works[a].data_viz.chart_types.filter(isChartApproved);
        const bCharts = works[b].data_viz.chart_types.filter(isChartApproved);

        const act = aCharts.length;
        const bct = bCharts.length;
        return bct - act;
      });
      vizMap[key] = list;
    });

    pattern.forEach((p) => {
      p.split(" ").forEach((bls) => {
        let url;
        url = vizMap[bls].pop();
        dataVizList.push({
          ...works[url],
          hasATable: works[url].data_viz.chart_types.includes("table"),
          hasAHeatMap: works[url].data_viz.chart_types.includes("heat map"),
          hasAChloropleth: works[url].data_viz.chart_types.includes(
            "chloropleth"
          ),
          hasAnimation: works[url].data_viz.chart_types.includes("animation"),
          hasSMallMultiples: works[url].data_viz.chart_types.includes(
            "small multiples"
          ),
          bls,
        });
      });
    });

    const chartTypes = {
      bar: {
        boxPath: "M2.5,2.5 m30,15 h75 v105 h-75 Z",
      },
      scatter: {
        boxPath: "M2.5,2.5 m90,15 h60 v-15 h30 v60 h-90 Z",
      },
      line: {
        boxPath: "M2.5 2.5 m75,45 h105 v60 h-15 v15 h-90 Z",
      },
      other: {
        boxPath: "M2.5 2.5 h150 v15 h-120 v105 h-30 Z",
      },
    };

    return {
      dataVizList,
      hoveredType: null,
      chartTypes,
    };
  },
  methods: {
    enterHover(el) {
      this.hoveredType = el.currentTarget.getAttribute("data-hovered-type");
    },
    exitHover() {
      this.hoveredType = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/color-scheme.scss";
.shaysClass {
  --rgb: 220, 220, 220;
  --hue: 0;
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
      background-color: rgba(var(--rgb), 0.2);
      padding: 0 3px;
      transition: background-color 250ms ease-in-out;
      white-space: nowrap;
      &:hover,
      &.full-opacity {
        background-color: rgba(var(--rgb), 0.5);
      }
    }
  }

  // GRID
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 5fr;
  grid-gap: 20px;

  h1 {
    grid-column: 1/-1;
  }
  p {
    grid-column: 1/-1;
  }
  svg {
    grid-column: 1/-1;
  }

  @media only screen and (min-width: 976px) {
    h1 {
      grid-column: 1/2;
    }

    p {
      grid-column: 1/2;
    }
    svg {
      grid-column: 2/4;
      grid-row: 1/3;
    }
  }
}

.b,
.bar {
  @extend .blue;
}
.l,
.line {
  @extend .yellow;
}
.s,
.scatter {
  @extend .red;
}
.bl {
  @extend .green;
}
.bs {
  @extend .purple;
}
.ls {
  @extend .orange;
}
.bls,
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
}
// .icons {
//   fill: hsl(var(--hue), 50%, 20%);
// }
// .n .icons {
//   fill: hsl(0, 0, 40%);
// }

rect.chart-overlay {
  opacity: 0;
}

path.box {
  opacity: 0.3;
  fill: var(--color);

  &.top {
    opacity: 0;
    stroke-width: 3;

    &:hover,
    &.full-opacity {
      opacity: 0.5;
    }
  }
}
</style>
