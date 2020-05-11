<template>
  <div class="shaysClass">
    <div class="parentContainer">
      <fragment v-for="(c, i) in creditsAndWorks" :key="c && c.id">
        <div :class="`mediaContainer row-${i + 2} col-1`">
          <a :href="c.url || c.bioUrl" target="_blank">
            <media-svg
              :i="i"
              :promotionalMedia="c.promotionalMedia"
              :displayName="c.displayName"
            ></media-svg>
          </a>
        </div>
        <div :class="`mediaContainer row-1 col-${i + 2}`">
          <a :href="c.url || c.bioUrl" target="_blank">
            <media-svg
              :i="i"
              :promotionalMedia="c.promotionalMedia"
              :displayName="c.displayName"
            ></media-svg>
          </a>
          <h3>{{ c.displayName }}</h3>
        </div>

        <div
          v-for="(collabs, j) in collaborationMap[i]"
          :key="`${i}-${j}`"
          :class="
            `row-${j + 2} col-${i + 2} grid-${collabs.length > 10 ? 4 : 3} cell`
          "
        >
          <fragment v-if="i >= j">
            <div
              v-for="collab in collabs"
              :key="collab && collab.url"
              class="thumbnail"
              :style="
                `
              background-image: url(${collab && collab.url});`
              "
            ></div>
            <!-- <media-svg v-if="collab" :promotionalMedia="collab" maskType="square" /> -->
          </fragment>

          <div
            v-if="i >= j && collabs && collabs.length"
            :class="`count  ${i === j && 'solo'}`"
          >
            <p>{{ collabs.length }}</p>
          </div>
        </div>
      </fragment>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Fragment } from "vue-fragment";
import MediaSvg from "./MediaSVG.vue";
import credits from "./json/credits.json";
import works from "./json/works_by_url.json";
const GRID_SIZE = 10;
const Component = Vue.extend({
  components: {
    MediaSvg,
    Fragment,
  },
  data() {
    const creditsAndWorks = Object.values(credits)
      .map((c) => {
        return {
          ...c,
          works:
            c.works &&
            c.works.map((w) => works[w]).filter((w) => w.first_of_type),
        };
      })
      .filter((c) => c.works.length)
      .sort((a, b) => b.works.length - a.works.length)
      .slice(0, GRID_SIZE);

    const collaborationMap = new Array(GRID_SIZE);
    for (let i = 0; i < creditsAndWorks.length; i++) {
      const soloProjects = new Set(creditsAndWorks[i].works);
      collaborationMap[i] = [];
      for (let j = 0; j < creditsAndWorks.length; j++) {
        collaborationMap[i][j] = [];
        if (i == j) continue;
        creditsAndWorks[i].works.forEach((w) => {
          if (creditsAndWorks[j].works.includes(w)) {
            soloProjects.delete(w);
            collaborationMap[i][j].push(w.promotionalMedia);
          }
        });
      }
      collaborationMap[i][i] = [...soloProjects].map((w) => w.promotionalMedia);
    }
    return {
      creditsAndWorks,
      collaborationMap,
    };
  },
});
export default Component;
</script>

<style lang="scss" scoped>
@import "../../assets/css/color-scheme.scss";
$grid-size: 10;

h3 {
  font-family: nyt-franklin;
  font-size: 18px;
}

@for $i from 1 through $grid-size + 1 {
  .col-#{$i} {
    grid-column: #{$i} / #{$i + 1};
    &:not(.col-1) {
      border-right: 1px dotted gainsboro;
    }
    padding: 2px;
  }

  .row-#{$i} {
    grid-row: #{$i} / #{$i + 1};
    &:not(.row-1) {
      border-bottom: 1px dotted gainsboro;
    }
  }
}

div.grid-3,
div.grid-4 {
  display: grid;
  position: relative;
  grid-gap: 1px;

  .count {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--purple-rgb), 0.7);

    &.solo {
      background-color: rgba(var(--yellow-rgb), 0.7);
    }

    p {
      font-size: 40px;
      font-family: nyt-karnak;
      font-weight: 900;
      text-shadow: rgb(100, 100, 100) 0px 0px 3px;
      color: white;
    }
  }

  div.thumbnail {
    background-color: black;
    border-radius: 3px;
    border: 0.5px black;
    background-repeat: no-repeat;
    background-size: 110%;
  }
}
div.grid-3 {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
div.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}

.shaysClass {
  background-color: white;
}

div.parentContainer {
  display: grid;
  grid-template-columns: 50px repeat(#{$grid-size}, 1fr);
  margin: 0 auto;
  max-width: 1200px;
}
</style>
