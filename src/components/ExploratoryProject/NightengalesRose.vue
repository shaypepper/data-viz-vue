<template>
  <div id="nightengalesRose">
    <svg height="100%" width="100%" viewBox="-10 -10 120 120">
      <g v-for="month in articlesByMonth" :key="month.index">
        <path opacity="0.6" :d="`${month.wedgePath}`" stroke="white" />
        <path
          :id="`outer-month-arc-${month.index}`"
          fill-opacity="0"
          :d="`${month.outerArcPath}`"
        />

        <path
          :id="`inner-month-arc-${month.index}`"
          fill-opacity="0"
          :d="`${month.innerArcPath}`"
          stroke="#ffa600"
          stroke-opacity="0.7"
        />
        <text>
          <textPath
            :xlink:href="`#outer-month-arc-${month.index}`"
            font-size="4"
          >
            {{ getMonthFromIndex(month.index) }}
          </textPath>
        </text>
        <circle r="60" cx="50" cy="50" opacity="0.01" />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "nightengalesrose",
  props: {
    events: Array,
  },
  data() {
    return {};
  },
  computed: {
    nakedMonths() {
      const { events } = this;
      const nakedMonths = new Array(12).fill(0);
      (events || []).forEach((event) => {
        const month = event.publishDate.getMonth();
        const publishYear = event.publishDate.getYear();
        const eventDate = d3.timeParse("%b %d %Y")(
          `${event.eventDate} ${publishYear}`
        );
        if (eventDate - event.publishDate < 0) {
          console.log("this one");
        }
        nakedMonths[month] += 1;
      });
      return nakedMonths;
    },
    articlesByMonth() {
      const maxSqrt = Math.max(...this.nakedMonths.map(Math.sqrt));
      const multiplier = 50 / (maxSqrt || 1);

      const months = this.nakedMonths.map((m, i) => {
        let r = Math.sqrt(m) * multiplier;
        const [x1, y1, x2, y2] = this.getArc(r, i);
        const innerPath = this.getArc(r - 1, i);

        return {
          index: i,
          wedgePath: `M${x1},${y1}L${50},${50}L${x2},${y2}A${r},${r} 0,0,1 ${x1},${y1}`,
          outerArcPath: `M${x2},${y2}A${r},${r} 0,0,1 ${x1},${y1}`,
          innerArcPath: `M${innerPath[2]},${innerPath[3]}A${r},${r} 0,0,1 ${innerPath[0]},${innerPath[1]}`,
          count: m,
        };
      });
      return months || [];
    },
  },
  methods: {
    getArc(r, i) {
      let x1 = r * Math.sin((Math.PI * (-i + 5)) / 6) + 50;
      let y1 = r * Math.cos((Math.PI * (-i + 5)) / 6) + 50;
      let x2 = r * Math.sin((Math.PI * (-i + 6)) / 6) + 50;
      let y2 = r * Math.cos((Math.PI * (-i + 6)) / 6) + 50;
      return [x1, y1, x2, y2];
    },
    getMonthFromIndex(i) {
      return [
        "JAN",
        "FEB",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ][i];
    },
  },
};
</script>

<style scoped></style>
