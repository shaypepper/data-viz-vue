<template>
  <div id="home">
    <svg class="grid" height="max(1400px, 100vw)" viewBox="0 0 1200 1200">
      <thumbnails :brickWidth="brickWidth" :brickHeight="brickHeight" />
      <g v-for="i in 15" :key="i">
        <g
          v-for="j in 12"
          :key="j"
          class="brick"
          :data-place="i  + '-' + j"
          :transform="`rotate(-30) translate(${(j - 4) * (brickWidth + gap) + [0, 100, 40, 80][i % 4]} ${(i - 1) * (brickHeight + gap)} ) `"
        >
          <g v-if="layout[i] && layout[i][j]" :set="link =  links[layout[i][j]]">
            <use :xlink:href="'#'+link[0]" />
            <g class="overlay">
              <a target="_blank" :href="link[2]">
                <rect height="100" width="200" fill="black" mask="url(#brickMask)" />
                <text y="40" fill="white" font-size="26" x="180" text-anchor="end">{{link[1]}}</text>
              </a>
            </g>
          </g>

          <use v-else xlink:href="#solidBrick" />
        </g>
      </g>
    </svg>
    <div class="fixed bottom-bar">
      <shay />
      <nameplate />
    </div>
  </div>
</template>

<script>
import Shay from "./Shay";
import Nameplate from "./Nameplate";
import Thumbnails from "./Thumbnails";
import { links, layout } from "./Thumbnails/thumbnail-map";

export default {
  components: {
    Shay,
    Nameplate,
    Thumbnails
  },
  data: function() {
    return {
      windowWidth: window.innerWidth
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
  },
  computed: {
    brickWidth() {
      return Math.min(this.windowWidth / 3, 200);
    },
    brickHeight() {
      return this.brickWidth / 2;
    },
    gap() {
      return this.brickWidth / 10;
    }
  },
  created() {
    this.links = links;
    this.layout = layout;
    console.log(links);
  }
};
</script>

<style lang="scss" scoped>
#home {
  --brick-height: 100px;
  --brick-width: 200px;
}

.fixed {
  position: fixed;
}

.brick {
  .overlay {
    opacity: 0;
    transition: opacity 400ms ease-in-out;

    rect {
      fill: rgba(255, 255, 255, 0.7);
    }
    text {
      fill: black;
    }
    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }
}

.bottom-bar {
  position: fixed;
  width: 100%;
  height: 64px;
  background-color: black;
  bottom: 0;
}
.grid {
  position: fixed;
  p {
    margin: 0;
    padding: 0;
  }
}
</style>
