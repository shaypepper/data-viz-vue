<template>
  <main>
    <h1 style="position: fixed; bottom: 0; text-align: right; width:100%;">
      {{ currentScreen }}
    </h1>
    <div ref="intro" class="blue spacer" data-index="1">
      <h1>Welcome welcome welcome!</h1>
    </div>

    <section
      ref="waffleSection"
      data-index="2"
      :class="
        `double-container ${this.currentScreen > 2 ? 'complete' : ''} ${
          this.currentScreen === 2 ? 'container-in-view' : ''
        }`
      "
    >
      <div>
        <waffle
          :scrollPosition="scrollPosition"
          :currentScreen="this.currentScreen === 2"
          :screenHeight="screenHeight"
        />
      </div>
    </section>
    <section data-index="3" ref="spacer1" class="red spacer" />
    <section
      ref="tagsSection"
      data-index="4"
      :class="
        `double-container times2 ${this.currentScreen > 4 ? 'complete' : ''} ${
          this.currentScreen === 4 ? 'container-in-view' : ''
        }`
      "
    >
      <div>
        <tags
          :scrollPosition="scrollPosition"
          :currentScreen="this.currentScreen === 4"
          :tagsSection="this.$refs.tagsSection"
        />
      </div>
    </section>
    <!-- <section ref="spacer2" data-index="5" class="green spacer" /> -->
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
    Waffle,
  },
  data() {
    return {
      scrollPosition: 0,
      currentScreen: 0,
      states: [null, false, false, false, false],
    };
  },
  created() {
    return {};
  },
  mounted() {
    this.introDiv = document.getElementById("intro");
    let states = [false, false, false, false, false];
    const observer = new IntersectionObserver(([el]) => {
      const i = +el.target.dataset.index;
      states[i] = el.isIntersecting;

      if (!states[i] && states[i - 1]) {
        this.currentScreen = i - 1;
      } else if (!states[i] && states[i + 1]) {
        this.currentScreen = i + 1;
      } else if (states[i - 1]) {
        this.currentScreen = i - 0.5;
      } else if (states[i + 1]) {
        this.currentScreen = i + 0.5;
      }
    });

    const listOfElements = [
      this.$refs.intro,
      this.$refs.waffleSection,
      this.$refs.spacer1,
      this.$refs.tagsSection,
      this.$refs.spacer2,
    ];

    // const breakpoints = [0];

    for (const el of listOfElements) {
      observer.observe(el);
    }

    const screenHeight = this.$refs.intro.clientHeight;
    this.screenHeight = screenHeight;
  },
});

export default Component;
</script>

<style lang="scss">
@import "../../assets/css/color-scheme.scss";
* {
  background-color: --color;
}

main {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  // background-color: rgb(10, 10, 10);
}
.spacer {
  height: calc(120vh);
  width: 100%;
  color: white;
  h1 {
    padding-left: 20px;
  }
  overflow: hidden;
  display: flex;
}

.double-container {
  min-height: 200vh;
  width: 100%;

  display: flex;
  position: relative; //   background-color: gainsboo;/
  &.complete {
    align-items: flex-end;
  }
  &.times-two {
    // height: 200vh;
  }

  > div {
    // height: 100vh;
    width: 100%;
  }
}

.little-spacer {
  height: 200px;
}

.fixed-element:hover {
  background-color: white;
}

.end {
  align-items: flex-end;
}
</style>
