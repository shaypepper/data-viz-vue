<template>
  <div id="manhattanMap">
    <svg :viewBox="`10 -10 ${svgWidth - 10} ${svgHeight + 10}`">
      <g id="map">
        <path
          v-for="feature in geojson.features"
          :key="feature.properties.name"
          fill="black"
          stroke="white"
          stroke-width="0.25"
          opacity="0.6"
          :d="generatePath(feature)"
        />
        <g :transform="`translate(${svgWidth - 40}, ${svgHeight * 0.57})`">
          <path
            id="everywhereCircle"
            r="19"
            opacity="0.6"
            d="M0,20 A20,20,0 1 1 40,20 A20,20,0 1 1 0,20 Z"
          />
          >
          <text stroke="black" font-size="5" stroke-width="0.05">
            <textPath
              xlink:href="#everywhereCircle"
              textLength="50"
              side="left"
              opacity="0.6"
            >
              OTHER / UNKNOWN
            </textPath>
          </text>
        </g>
        <text
          stroke="black"
          font-size="6"
          stroke-width="0.1"
          y="38"
          x="-14"
          textLength="45"
          opacity="0.6"
          transform="rotate(-75.5, 20, 30)"
        >
          MANHATTAN
        </text>
      </g>

      <g id="events" v-for="article in filteredArticles" :key="article.index">
        <circle
          v-for="event in article.values"
          :key="event.index"
          @mouseover="$emit('hover-on-event', event)"
          :transform="getCoordinatesForEvent(event)"
          :opacity="markerOpacity"
          fill="#ffa600"
          r="1"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import manhattanGeojson from "./data/manhattan.ts";

const excludedNeighborhoods = new Set([
  "Washington Heights",
  "Inwood",
  "Marble Hill",
  "Governors Island",
  "Ellis Island",
  "Liberty Island",
]);

export default {
  name: "manhattanmap",
  props: {
    events: Array,
    locations: Map,
    startDate: Date,
    endDate: Date,
  },
  data() {
    const svgHeight = 175;
    const svgWidth = 100;
    const geojson = {
      type: "FeatureCollection",
      features: manhattanGeojson.features.filter((f) => {
        return !excludedNeighborhoods.has(f.properties.name);
      }),
    };

    const projection = d3
      .geoAlbersUsa()
      .scale(1)
      .fitSize([svgWidth - 15, svgHeight - 15], geojson);

    const generatePath = d3.geoPath().projection(projection);

    return {
      svgHeight,
      svgWidth,
      projection,
      generatePath,
      geojson,
    };
  },
  computed: {
    filteredArticles() {
      const { rawArticles, startDate, endDate } = this;

      const articles = rawArticles.filter((article) => {
        return (
          article.publishDate >= startDate && article.publishDate <= endDate
        );
      });
      return articles;
    },
    mappedEvents() {
      const { events, getCoordinatesForEvent } = this;
      return events.map((d) => {
        return Object.assign(
          {
            tranform: getCoordinatesForEvent(d),
          },
          d
        );
      });
    },
    markerOpacity() {
      const o = Math.min(1, Math.pow(1 / this.filteredArticles.length, 0.3));
      return o;
    },
    rawArticles() {
      const rawArticles = d3
        .nest()
        .key((d) => d3.timeFormat("%Y-%m-%d")(d.publishDate))
        .entries(this.events)
        .sort((a, b) => a.key - b.key);

      return rawArticles.map((a) =>
        Object.assign({ publishDate: a.values[0].publishDate }, a)
      );
    },
  },
  methods: {
    getCoordinatesForEvent(d) {
      let coordinates;
      let loc = this.locations.get(d.location);

      if (!loc || !loc.longitude) {
        const { PI, cos, random, sin } = Math;
        const t = 2 * PI * random();
        const u = random() + random();
        const r = (u > 1 ? 2 - u : u) * 18;
        const [x, y] = [r * cos(t), r * sin(t)];
        coordinates = [this.svgWidth - x - 20, y + this.svgHeight * 0.685];
      } else {
        coordinates = this.projection([
          -loc.longitude + Math.random() * 0.002,
          loc.latitude + Math.random() * 0.002,
        ]);
      }
      if (!coordinates) return;
      const stringRep = coordinates.join(",");
      return `translate(${stringRep || "0,0"})`;
    },
  },
};
</script>
<style lang="scss" scoped>
#manhattanMap {
  padding: 15px;
  svg {
    height: 100%;
    max-width: 100%;
  }
}
#manhattanMap circle {
  transition: opacity 200ms linear;
}
</style>
