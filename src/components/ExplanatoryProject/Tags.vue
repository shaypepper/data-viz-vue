<template>
  <div class="shaysClass tagsScreen" @scroll="captureScroll">
    <div id="chartWrapper">
      <svg viewBox="20 -90 130 100" id="radialChart">
        <g :transform="`rotate(${chartRotation})`">
          <g stroke="white" fill="transparent" stroke-width="0.02">
            <circle r="40" />
            <circle r="50" />
            <circle r="60" />
          </g>

          <g
            v-for="tag in tags"
            :key="tag.uri"
            :data-uri="tag.uri"
            :transform="`rotate(${tag.rotationAngle}) translate(70 0)`"
            :opacity="
              !highlightedBarUrl || highlightedBarUrl === tag.uri ? 1 : 0.4
            "
            @click="selectTag"
            fill="white"
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
              y="1.3"
              :x="-tag.works.length / 2 - 3"
              style="font-size:2"
            >
              {{ tag.works.length }}
            </text>

            <g
              :transform="
                `${
                  highlightedBarUrl === tag.uri
                    ? 'translate(-0.5 0) scale(1.2)'
                    : ''
                }`
              "
            >
              <text y="1.5" x="3" class="label">
                {{ tag.displayName }}
              </text>
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
        <g transform="translate(22 -17)" opacity="0.7">
          <g v-for="(tagType, i) in tagTypes" :key="tagType">
            <rect :y="`${i * 3}`" :class="tagType" height="1.5" width="1.5" />
            <text
              style="font-family: nyt-franklin"
              x="2.5"
              :y="`${1.25 + i * 3}`"
              fill="white"
              font-size="1.5"
            >
              {{ tagType }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <div class="box" style="height: 3000vh; margin-bottom: 10px"></div>
  </div>
</template>

<script>
import tags from "./json/tags.json";
import Vue from "vue";

const Component = Vue.extend({
  data() {
    let tagList = Object.values(tags)
      .sort((a, b) => (a.works.length - b.works.length) * 1000)
      .filter((w) => w.works.length > 1);
    tagList = tagList.map((w, i) => {
      w.rotationAngle = (-360 * (i + 1)) / tagList.length - 30;
      w.rectX = -w.works.length;
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
    };
  },
  methods: {
    selectTag(el) {
      this.highlightedBarUrl = el.target.getAttribute("data-uri");
    },
    captureScroll(el) {
      const container = el.target;
      const newIndex =
        this.tags.length -
        1 -
        (Math.floor(container.scrollTop / 75) % this.tags.length);
      this.highlightedBarUrl = this.tags[newIndex].uri;
      this.chartRotation = 330 - this.tags[newIndex].rotationAngle;
    },
  },
});

export default Component;
</script>

<style scoped lang="scss">
@import "../../assets/css/color-scheme.scss";
$unit: 0.4vmax;

div.shaysClass {
  margin: 0;
  padding: 60px 0 0;
  background-color: transparent;

  div.box {
    pointer-events: none;
  }
  color: hsl(51, 100%, 40);
}

#chartWrapper {
  position: fixed;
  height: 100vh;
  width: 100%;
  z-index: -1;
}

#radialChart {
  height: 100%;
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

text.label {
  font-size: 2.5px;
}
</style>
