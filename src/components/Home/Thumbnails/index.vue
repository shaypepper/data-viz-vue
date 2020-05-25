<template>
  <defs>
    <mask id="brickMask" :width="brickWidth" :height="brickHeight">
      <rect :height="brickHeight" :width="brickWidth" rx="5" fill="white" />
    </mask>
    <g width="200" height="100" viewBox="0 0 200 100">
      <symbol v-for="[slug] in links" :key="slug" :id="slug">
        <image :xlink:href="getImageUrl(slug)" width="200" mask="url(#brickMask)" />
      </symbol>
    </g>
    <symbol id="solidBrick">
      <rect
        mask="url(#brickMask)"
        :fill="`hsl(${Math.random() * 360}, 50%, 50%`"
        :height="brickHeight"
        :width="brickWidth"
      />
    </symbol>
  </defs>
</template>

<script>
import { links } from "./thumbnail-map";
export default {
  props: ["brickHeight", "brickWidth"],
  created() {
    this.links = links;
    this.path = "";
  },
  methods: {
    getImageUrl(slug) {
      return require(`./images/${slug}.png`);
    }
  }
};
</script>

<style lang="scss">
</style>