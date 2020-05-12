<template>
  <div id="tagsScreen" :class="`shaysClass ${currentScreen ? 'currentScreen' : ''}`">
    <div id="chartWrapper" :class="activeScrolling ? 'fixed' : ''">
      <svg viewBox="20 -90 100 200" id="radialChart">
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
            >{{ tag.works.length }}</text>

            <g
              :transform="
                `${
                  highlightedBarUrl === tag.uri
                    ? 'translate(-1.1 -0.7) scale(1.5)'
                    : ''
                }`
              "
            >
              <text y="1.5" x="3" class="label">{{ tag.displayName }}</text>
            </g>
          </g>
        </g>
        <g style="font-size: 1.5px; font-family: nyt-franklin; opacity: 0.7" fill="white">
          <text y="-0.5" transform="rotate(21) translate(0 -60)">20 stories</text>
          <text y="9.5" transform="rotate(25) translate(0 -60)">40</text>
          <text y="19.5" transform="rotate(31) translate(0 -60)">60</text>
        </g>
        <g transform="translate(22 -88) scale(0.75)" opacity="0.7">
          <rect height="18.5" width="15" fill="rgba(210 210 210, 0.2)" />
          <g v-for="(tagType, i) in tagTypes" :key="tagType">
            <rect :y="`${i * 3 + 1}`" x="1" :class="tagType" height="1.5" width="1.5" />
            <text
              style="font-family: nyt-franklin"
              x="3.5"
              :y="`${1.25 + i * 3 + 1}`"
              fill="black"
              font-size="1.5"
            >{{ tagType }}</text>
          </g>
        </g>
      </svg>
    </div>
    <!-- <div style="height: 100vh"></div> -->
  </div>
</template>

<script>
import tags from "./json/tags.json";
import Vue from "vue";
const rotationOffset = 20;

const Component = Vue.extend({
  props: ["currentScreen", "scrollPosition", "screenHeight"],
  mounted() {
    const observer = new IntersectionObserver(() => {
      // console.log("yo");
    });
    const screen = document.getElementById("tagsScreen");
    observer.observe(screen);

    this.chartRotation =
      -rotationOffset - this.tags[this.tags.length - 1].rotationAngle;

    window.addEventListener("scroll", () => {
      if (!this.currentScreen) {
        return;
      }
      if (this.currentScreen && !this.yOffset) {
        this.yOffset = window.scrollY;
      }

      const relativeScrollPosition = window.scrollY - this.yOffset;
      const unit = this.screenHeight / this.tags.length;
      let newIndex =
        this.tags.length - 1 - Math.floor(relativeScrollPosition / unit);
      newIndex = Math.max(0, newIndex);
      newIndex = Math.min(this.tags.length - 1, newIndex);
      console.log(
        relativeScrollPosition,
        unit,
        this.highlightedBarUrl,
        newIndex
      );
      this.highlightedBarUrl = this.tags[newIndex].uri;
      this.chartRotation = -rotationOffset - this.tags[newIndex].rotationAngle;
    });
  },
  data() {
    let tagList = Object.values(tags)
      .sort((a, b) => (a.works.length - b.works.length) * 1000)
      .filter(w => w.works.length > 1);
    tagList = tagList.map((w, i) => {
      w.rotationAngle = (-360 * (i + 1)) / tagList.length - rotationOffset;
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
        "Title"
      ],
      activeScrolling: true,
      yOffset: 0
    };
  }
});

export default Component;
</script>

<style scoped lang="scss">
@import "../../assets/css/color-scheme.scss";
$unit: 0.4vmax;

.fixed {
  // position: fixed;
}

div.shaysClass {
  margin: 0;
  // padding: 60px 0 0;
  background-color: transparent;
  overflow: visible;

  div.box {
    pointer-events: none;
  }
  color: hsl(51, 100%, 40);
}

#chartWrapper {
  height: 100vh;
  width: 100%;
}

#radialChart {
  height: 250vh;
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
  font-size: 1.5px;
  &:hover {
    fill: green;
  }
}
</style>
