<template>
  <div class="container">
    <h2>How do verb tenses vary by article type?</h2>
    <svg :viewBox="`0 -10 ${W} ${H + 20}`">
      <g
        v-for="(data, articleType, i) in tenses"
        :key="articleType"
        :transform="`translate(${(1 - i) * (W / 2 + M)}, 0)`"
      >
        <text y="-1.5" x="0" class="article-type">{{ articleType }}</text>
        <g
          v-for="tense in data"
          :key="tense.name"
          :transform="`translate( 0,${tense.start * H})`"
          :class="tense.name"
        >
          <rect :height="tense.p * H" :width="BW" stroke="white" stroke-width="0.5" fill="white" />
          <g transform="translate(2.5, 6.5)">
            <text class="tense-name">{{tense.label}}</text>
            <text v-if="tense.name !== 'VBP'" y="5" class="tense-examples">{{ tense.first5 }}</text>
            <text v-if="tense.name !== 'VBP'" y="8.5" class="tense-examples">{{ tense.next5 }}</text>
          </g>
        </g>

        <g v-if="articleType === 'reporting'">
          <path
            v-for="(tense, j) in data"
            :key="tense.name"
            :class="`lasso ${tense.name}`"
            style="z-index: -1;"
            :d="
              `M0,${tense.start * H} h${BW} l${DM},${(tenses.opinion[j].start -
                tense.start) *
                H} h${BW} v${tenses.opinion[j].p *
                H} h-${BW} l${-DM}, ${(tense.end - tenses.opinion[j].end) *
                H} h-${BW} Z`
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
import gsap from "gsap";
import Fragment from "vue-fragment";

const H = 160, // svg height
  W = 225, // svg width
  M = 8; // svg margins
const BH = H / 2 - M, // bar height
  BW = W / 2 - M, // bar width
  DM = M * 2; // double margin

const StackedBar = {
  components: {
    Fragment
  },
  mounted() {
    const tl = gsap.timeline();

    tl.from(".lasso", {
      attr: {
        d: `M0,0 h${BW} l${M},0 h${BW} v0.01 h${-BW} l${-M},0 h${-BW} Z`
      },
      duration: 0.75
    });
    tl.from("text", {
      opacity: 0,
      duration: 0.75
    });
  },
  created() {
    Object.assign(this, { H, W, M, BH, BW, DM });
    this.verbs = { ...verbs };

    let currentPlace = {
      opinion: 0,
      reporting: 0
    };

    const mapVerbTense = articleType => ([name, count, p]) => {
      const thing = { name, count, p };
      thing.start = currentPlace[articleType];
      thing.end = currentPlace[articleType] += p;
      thing.label = `${verbs[name].label} - ${Math.floor(p * 1000) / 10}%`;
      thing.first5 = `Top 10: ${Object.keys(verbs[name][articleType])
        .slice(0, 5)
        .join(", ")},`;
      thing.next5 = Object.keys(verbs[name][articleType])
        .slice(5)
        .join(", ");
      return thing;
    };

    this.tenses = {
      opinion: opinionVerbTenses.map(mapVerbTense("opinion")),
      reporting: reportingVerbTenses.map(mapVerbTense("reporting"))
    };
  }
};

export default StackedBar;
</script>

<style lang="scss" scoped>
@import "../../assets/css/color-scheme.scss";
.container {
  grid-column: 1 / -1;
}
h2 {
  text-align: left;
  width: 100%;
}
text {
  fill: black;
  &.tense-examples {
    font-size: 3px;
    font-family: nyt-franklin;
  }
  &.tense-name {
    font-size: 4.5px;
    font-family: nyt-cheltenham;
  }
  &.article-type {
    font-size: 3px;
    font-family: nyt-franklin;
    text-transform: uppercase;
  }
}

div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lasso {
  transition: opacity 400ms ease;
  fill: var(--color);
  &:hover {
    opacity: 0.3;
  }
}
</style>
