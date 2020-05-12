<template>
  <main>
    <div id="intro" class="full-screen blue">
      <h1>Welcome welcome welcome!</h1>
    </div>

    <section
      :class="`double-container ${this.currentScreen > 1 ? 'complete' : ''} ${this.currentScreen === 1 ? 'container-in-view' : ''}`"
    >
      <div>
        <waffle
          :scrollPosition="scrollPosition"
          :currentScreen="this.currentScreen === 1"
          :screenHeight="screenHeight"
        />
      </div>
    </section>
    <section class="full-screen red" />
    <section
      :class="`double-container times2 ${this.currentScreen >= 2 ? 'complete' : ''} ${this.currentScreen === 2 ? 'container-in-view' : ''}`"
    >
      <div>
        <tags
          :scrollPosition="scrollPosition"
          :currentScreen="this.currentScreen === 2"
          :screenHeight="screenHeight"
        />
      </div>
    </section>
    <section class="full-screen green" />
  </main>
</template>

<script>
import Vue from "vue";
import Waffle from "./Waffle";
// import Credits from "./Credits.vue";
import Tags from "./Tags.vue";

const Component = Vue.extend({
  components: {
    // Credits,
    Tags,
    Waffle
  },
  data() {
    return {
      scrollPosition: 0,
      currentScreen: 0
    };
  },
  created() {
    return {};
  },
  mounted() {
    this.introDiv = document.getElementById("intro");
    const screenHeight = this.introDiv.clientHeight;
    this.screenHeight = screenHeight;
    console.log(screenHeight);

    window.addEventListener("scroll", () => {
      //   this.introDiv = document.getElementById("intro");
      const screenHeight = this.introDiv.clientHeight;
      this.screenHeight = screenHeight;

      let currentScreen = 0;
      if (window.scrollY > screenHeight && window.scrollY < 2 * screenHeight) {
        currentScreen = 1;
      }

      if (window.scrollY > 2 * screenHeight) {
        currentScreen = 1.5;
      }
      if (window.scrollY > 4 * screenHeight) {
        currentScreen = 2;
      }

      if (window.scrollY > 5 * screenHeight) {
        currentScreen = 3;
      }

      this.currentScreen = currentScreen;
      console.log(screenHeight, currentScreen);
    });
    // console.log((document.getElementById("spacer1") || {}).clientHeight);
  }
});

export default Component;
</script>

<style lang="scss" scoped>
@import "../../assets/css/color-scheme.scss";
* {
  background-color: --color;
}

main {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
.full-screen {
  height: 100vh;
  width: 100%;
  //   background-color: var(--color);
  color: white;
  h1 {
    padding-left: 20px;
  }
}

.container {
}

.double-container {
  height: 200vh;
  width: 100%;

  display: flex;
  //   background-color: gainsboo;/

  &.complete {
    align-items: flex-end;
  }
  &.times-two {
    height: 200vh;
  }

  > div {
    height: 100vh;
  }
}

.container-in-view {
  &.above-viewport {
  }

  > div {
    position: fixed;
    // overflow: scroll;
    top: 0;
  }
}

.pinned {
  position: fixed;
  overflow: scroll;
  top: 0;
}

.little-spacer {
  height: 200px;
}

.spacer {
  height: 100vh;
  width: 100%;
  //   background-color: var(--color);
  overflow: hidden;
  display: flex;
}

.fixed-element:hover {
  background-color: white;
}

.end {
  align-items: flex-end;
}
</style>