<template>
  <div id="masterContainer">
    <div id="navbar">
      <button class="left" @click="handleBackClick">
        <svg viewBox="0 0 100 225" height="42px">
          <path
            d="m88,16 l-80,96 l80,96"
            fill="transparent"
            stroke="black"
            stroke-width="16"
          />
        </svg>
      </button>
      <button class="right" @click="handleNextClick">
        <svg viewBox="0 0 100 225" height="42px">
          <path
            d="m8,16 l80,96 l-80,96"
            fill="transparent"
            stroke="black"
            stroke-width="16"
          />
        </svg>
      </button>
      <h1>What I've learned from TheUpshot</h1>
    </div>

    <tags currentScreen="" />
    <credits />
    <waffle />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Waffle from "./Waffle.vue";
import Credits from "./Credits.vue";
import Tags from "./Tags.vue";

const Component = Vue.extend({
  components: {
    Credits,
    Tags,
    Waffle,
  },
  data() {
    return {
      screenOrder: ["tags", "credits", "waffle"],
      currentScreen: 0,
    };
  },
  methods: {
    handleNextClick() {
      const vwidth = window.innerWidth;
      const masterContainer = document.getElementById("masterContainer");
      if (masterContainer) {
        masterContainer.scrollLeft += vwidth;
      }
    },
    handleBackClick() {
      const vwidth = window.innerWidth;
      const masterContainer = document.getElementById("masterContainer");
      if (masterContainer) {
        masterContainer.scrollLeft -= vwidth;
      }
    },
  },
  mounted() {
    document.addEventListener("backbutton", this.handleBackClick, false);
  },
  beforeDestroy() {
    document.removeEventListener("backbutton", this.handleBackClick);
  },
});

export default Component;
</script>

<style lang="scss">
* {
  --outermost-horizontal-padding: 60px;
}

#masterContainer {
  overflow-x: hide;
  overflow-y: hidden;
  height: 100vh;
  width: 100vw;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

#navbar {
  button.left {
    float: left;
  }
  button.right {
    float: right;
  }
  h1 {
    margin-left: var(--outermost-horizontal-padding);
  }
  position: fixed;
  width: 100%;
  background-color: rgba(10, 10, 10, 0.9);
  height: 50px;
  z-index: 10000000007;
}

h1 {
  width: 100%;
  color: white;
  text-justify: center;
  margin: 0;
  font-family: nyt-karnak;
}

.shaysClass {
  scroll-snap-align: center;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  overflow-y: scroll;
  padding: 60px var(--outermost-horizontal-padding);
  background-color: rgb(30, 30, 30);
}
</style>
