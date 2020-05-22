<template>
  <div>
    <svg :viewBox="`-10 -10 ${W + 20} ${H + 20}`">
      <g
        v-for="(data, articleType, i) in tenses"
        :key="articleType"
        :transform="`translate(${(1 - i) * (W / 2 + M)}, 0)`"
      >
        <text y="-2" x="1.5" class="article-type">
          {{ articleType[0].toUpperCase() + articleType.slice(1) }}
        </text>
        <g
          v-for="(tense, j) in data"
          :key="tense.name"
          :transform="`translate( 0,${tense.start * H})`"
        >
          <rect
            :height="tense.p * H"
            :width="BW"
            stroke="white"
            stroke-width="0.5"
            fill="white"
          />
          <text y="5" x="2" class="tense-name">
            {{
              verbs[tense.name].label[6].toUpperCase() +
                verbs[tense.name].label.slice(7)
            }}
            - {{ Math.floor(tense.p * 1000) / 10 }}%
          </text>
          <text y="8" x="2" class="tense-examples">
            Top 10:
            {{ verbs[tense.name][articleType].map((d) => d[0]).join(", ") }}
          </text>

          <path
            style="z-index: -1;"
            v-if="articleType === 'reporting'"
            :d="
              `M0,0 h${BW} l${DM},${(tenses.opinion[j].start - tense.start) *
                H} h${BW} v${tenses.opinion[j].p *
                H} h-${BW} l${-DM}, ${(tense.end - tenses.opinion[j].end) *
                H} h-${BW} Z`
            "
            :fill="
              ['red', 'yellow', 'steelblue', 'coral', 'hotpink', 'green'][j]
            "
            opacity="0.2"
            stroke="white"
          />
        </g>
      </g>
      <rect :x="BW" :height="W" :width="DM" fill="rgba(255, 255, 255, 0.5)" />
    </svg>
  </div>
</template>
<script>
import opinionVerbTenses from "./data/opinion_verb_tenses.json";
import reportingVerbTenses from "./data/reporting_verb_tenses.json";
import verbs from "./data/verbs.json";

const StackedBar = {
  created() {
    this.verbs = { ...verbs };
    this.H = 150; // svg height
    this.W = 200; // svg width
    this.M = 4; // svg margins
    this.BH = this.H / 2 - this.M; // bar height
    this.BW = this.W / 2 - this.M; // bar width
    this.DM = this.M * 2; // double margin

    let currentPlace = {
      opinion: 0,
      reporting: 0,
    };
    opinionVerbTenses.forEach(([name, , p]) => {
      verbs[name].opinion.p = p;
    });

    reportingVerbTenses.forEach(([name, , p]) => {
      verbs[name].reporting.p = p;
    });

    const mapVerbTense = (articleType) => ([name, count, p]) => {
      const thing = { name, count, p };
      thing.start = currentPlace[articleType];
      thing.end = currentPlace[articleType] += p;
      return thing;
    };

    this.tenses = {
      opinion: opinionVerbTenses.map(mapVerbTense("opinion")),
      reporting: reportingVerbTenses.map(mapVerbTense("reporting")),
    };
  },
};

export default StackedBar;
</script>

<style lang="scss" scoped>
text {
  fill: black;
  &.tense-examples {
    font-size: 2px;
    font-family: nyt-franklin;
  }
  &.tense-name {
    font-size: 3px;
    font-family: nyt-cheltenham;
  }
  &.article-type {
    font-size: 5px;
    font-style: italic;
  }
}
</style>
