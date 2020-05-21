<template>
  <div id="tagsScreen" class="shaysClass pin-target">
    <div id="chartWrapper">
      <svg viewBox="20 -90 100 90" id="radialChart">
        <g id="chartGroup" :style="`--chart-rotation: ${chartRotation}deg;`">
          <g stroke="white" fill="transparent" stroke-width="0.02">
            <circle r="40" />
            <circle r="50" />
            <circle r="60" />
          </g>

          <g
            v-for="(tag, i) in tags"
            :key="tag.uri"
            :data-uri="tag.uri"
            :data-index="i"
            :style="`--rotation-angle: ${tag.rotationAngle}deg`"
            :class="`tag ${highlightedBarUrl == tag.uri ? 'highlighted' : ''}`"
          >
            <rect
              :class="`bar ${tag.__typename}`"
              :height="highlightedBarUrl === tag.uri ? 2 : 0.5"
              :width="tag.works.length / 2"
              :x="-tag.works.length / 2"
              :y="highlightedBarUrl === tag.uri ? -0.4 : 0.5"
            />

            <text
              v-if="highlightedBarUrl === tag.uri"
              height="2"
              width="2"
              font-size="2"
              y="1.3"
              :x="-tag.works.length / 2 - 3"
            >
              {{ tag.works.length }}
            </text>

            <g class="label">
              <text y="-1" x="3">
                The Upshot wrote {{ tag.prettyLength }}
                {{ tag.works.length > 1 ? "stories" : "story" }} about
              </text>
              <text y="1.5" x="3">{{ tag.displayName }}</text>
            </g>
          </g>
        </g>
        <g
          style="font-size: 1.5px; font-family: nyt-franklin; opacity: 0.7"
          fill="white"
        >
          <text y="-0.5" transform="rotate(21) translate(0 -60)">
            20 stories
          </text>
          <text y="9.5" transform="rotate(25) translate(0 -60)">40</text>
          <text y="19.5" transform="rotate(31) translate(0 -60)">60</text>
        </g>
        <g transform="translate(22 -88) scale(0.75)" opacity="0.7">
          <rect height="18.5" width="15" fill="rgba(210 210 210, 0.2)" />
          <g v-for="(tagType, i) in tagTypes" :key="tagType">
            <rect
              :y="`${i * 3 + 1}`"
              x="1"
              :class="tagType"
              height="1.5"
              width="1.5"
            />
            <text
              style="font-family: nyt-franklin"
              x="3.5"
              :y="`${1.25 + i * 3 + 1}`"
              fill="black"
              font-size="1.5"
            >
              {{ tagType }}
            </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import tags from "./json/tags.json";
import Vue from "vue";
const rotationOffset = 50;

const Component = Vue.extend({
  props: ["currentScreen", "scrollPosition", "tagsSection"],
  mounted() {
    this.chartRotation =
      -rotationOffset - this.tags[this.tags.length - 1].rotationAngle;

    window.addEventListener("scroll", () => {
      if (!this.currentScreen) {
        return;
      }
      if (this.currentScreen && !this.yOffset) {
        this.yOffset = window.scrollY;
        this.clientHeight = this.$el.clientHeight - 100;
      }

      const relativeScrollPosition = window.scrollY - 50 - this.yOffset;
      const unit = this.clientHeight / this.tags.length;
      let newIndex =
        this.tags.length - 1 - Math.floor(relativeScrollPosition / unit);
      newIndex = Math.max(0, newIndex);
      newIndex = Math.min(this.tags.length - 1, newIndex);

      this.highlightedBarUrl = this.tags[newIndex].uri;
      this.chartRotation =
        -rotationOffset - this.tags[newIndex - 1].rotationAngle;
    });
  },
  data() {
    let tagList = Object.values(tags)
      .sort((a, b) => (a.works.length - b.works.length) * 1000)
      .filter((w) => w.works.length >= 1);
    tagList = tagList.map((w, i) => {
      w.rotationAngle = (-360 * (i + 1)) / tagList.length - rotationOffset;
      w.rectX = -w.works.length;
      w.index = i;
      w.prettyLength = getPrettyNumber(w.works.length);
      return w;
    });
    return {
      tags: tagList,
      highlightedBarUrl: "nyt://subject/6802f721-c0b7-5d51-900b-c87a450f58f7",
      chartRotation: 0,
      tagTypes: [
        "Subject",
        "Person",
        "Location",
        "Organization",
        "Keyword",
        "Title",
      ],
      activeScrolling: true,
      yOffset: 0,
    };
  },
});

export default Component;

export function getPrettyNumber(n) {
  if (n > 25) {
    return n;
  }

  let ones = n % 10;
  let tens = n - ones;

  let strings = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    20: "twenty",
  };

  if (n < 10) return strings[n];

  if (n >= 20) {
    return strings[tens] + (ones ? "-" + strings[ones] : "");
  }
  if (n > 15) {
    return strings[ones] + "teen";
  }
  return strings[n];
}
</script>

<style scoped lang="scss">
@import "../../assets/css/color-scheme.scss";
$unit: 0.4vmax;

#spacer {
  height: 75px;
  background-color: white;
  margin-bottom: 5px;
}

#tagsScreen {
  display: flex;
  flex-direction: column;
}

.pin-target {
  position: sticky;
  top: 0;
  width: 100%;
}

#chartGroup {
  transform: rotate(var(--chart-rotation));
}

#chartWrapper {
  position: relative;
  top: 0;
  height: 100vh;
}

div.shaysClass {
  margin: 0;
  background-color: transparent;
  overflow: visible;

  div.box {
    pointer-events: none;
  }
  color: hsl(51, 100%, 40);
}

rect {
  --color: 255, 255, 255;
  fill: rgba(var(--color), 1);
  &.Person {
    --color: var(--purple-rgb);
  }
  &.Subject {
    --color: var(--blue-rgb);
  }
  &.Location {
    --color: var(--orange-rgb);
  }
  &.Organization {
    --color: var(--green-rgb);
  }
  &.Keyword {
    --color: var(--red-rgb);
  }
  &.Title {
    --color: var(--yellow-rgb);
  }
}

.tag {
  transition: transform 400ms ease;
  transition-delay: 50ms;
  transform: rotate(var(--rotation-angle)) translate(70px, 0px);
  fill: white;
  opacity: 0.4;
  &.highlighted {
    opacity: 1;
    // transform: rotate(0deg) scale(1.5) translate(0px, 0px);
    .label {
      transform: rotate(50deg) scale(1.5) translate(-8px, -20.5px);
      text:first-of-type {
        font-size: 1px;
        opacity: 1;
      }
      text:last-of-type {
        font-size: 2px;
        font-style: italic;
      }
    }
  }
  .label {
    font-size: 1px;
    transition: transform 400ms ease 400ms;
    // transition-delay: 400ms;
    text:first-of-type {
      transition: opacity 400ms ease;
      transition-delay: 600ms;
      opacity: 0;
    }
  }
  .tagName {
    font-size: 2;
  }
}
</style>
