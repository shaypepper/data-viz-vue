<template>
  <div class="container">
    <svg :viewBox="`-10 -10 ${W + 20} ${H + 20}`">
      <g
        v-for="(data, articleType, i) in tenses"
        :key="articleType"
        :transform="`translate(${(1 - i) * (W / 2 + M)}, 0)`"
      >
        <text
          y="-2"
          x="1.5"
          class="article-type"
        >{{ articleType[0].toUpperCase() + articleType.slice(1) }}</text>
        <g
          v-for="tense in data"
          :key="tense.name"
          :transform="`translate( 0,${tense.start * H})`"
          :class="tense.name"
        >
          <rect :height="tense.p * H" :width="BW" stroke="white" stroke-width="0.5" fill="white" />
          <text y="5" x="2" class="tense-name">
            {{
            verbs[tense.name].label[6].toUpperCase() +
            verbs[tense.name].label.slice(7)
            }}
            - {{ Math.floor(tense.p * 1000) / 10 }}%
          </text>
          <text v-if="tense.name !== 'VBP'" y="8" x="2" class="tense-examples">
            Top 10:
            {{ verbs[tense.name][articleType].map((d) => d[0]).join(", ") }}
          </text>
        </g>
        <g v-if="articleType === 'reporting'">
          <path
            :class="`lasso ${tense.name}`"
            style="z-index: -1;"
            v-for="(tense, j) in data"
            :key="tense.name"
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

const H = 100, // svg height
  W = 175, // svg width
  M = 4; // svg margins
const BH = H / 2 - M, // bar height
  BW = W / 2 - M, // bar width
  DM = M * 2; // double margin

const StackedBar = {
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
  methods: {
    showPastTense() {
      const tl = gsap.timeline();
      tl.to(`text`, {
        opacity: 0,
        duration: 0.75
      });
      tl.to(".lasso", {
        attr: {
          d: `M0,0 h${BW} l${M},0 h${BW} v${H} h${-BW} l${-M},0 h${-BW} Z`
        },
        duration: 0.75
      });
    }
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

svg {
  max-width: 1200px;
  margin: 0 auto;
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

.VBD {
  @extend .purple;
}

.VB {
  @extend .orange;
}

.VBN {
  @extend .yellow;
}

.VBG {
  @extend .red;
}

.VBZ {
  @extend .blue;
}

.VBP {
  @extend .green;
}
</style>
