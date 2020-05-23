<template>
  <div class="container">
    <div>
      <h2>How do the verbs get used in articles?</h2>
      <p>These are randomly generated quotes from New York Times articles. Toggle between verbs and nouns to see more. Click on any quote to see the corresponding article</p>
      <p>
        Noun:
        <button
          :class="noun === '[Pp]resident' && 'selected'"
          @click="() => updateNoun('[Pp]resident')"
        >President</button>
        <button :class="noun === 'Trump' && 'selected'" @click="() => updateNoun('Trump')">Trump</button>
        <button
          :class="noun === '[Aa]dministration' && 'selected'"
          @click="() => updateNoun('[Aa]dministration')"
        >Administration</button>
      </p>
      <p>
        Verb:
        <button
          :class="`blue ${verb === 'is' && 'selected'}`"
          @click="() => updateVerb('is')"
        >is</button>
        <button :class="`blue ${verb === 'has' && 'selected'}`" @click="() => updateVerb('has')">has</button>
        <button
          :class="`purple ${verb === 'was' && 'selected'}`"
          @click="() => updateVerb('was')"
        >was</button>
        <button
          :class="`purple ${verb === 'said' && 'selected'}`"
          @click="() => updateVerb('said')"
        >said</button>
      </p>
    </div>

    <div :class="verb">
      <h3>Reporting</h3>
      <p v-for="([quote, url], i) in reportingStatements" :key="url + i">
        <a :href="url" target="_blank">
          {{quote[0]}}
          <span class="highlight">{{quote[1]}}</span>
          {{quote[2]}}
        </a>
      </p>
    </div>
    <div :class="verb">
      <h3>Opinion</h3>
      <p v-for="([quote, url], i) in opinionStatements" :key="url + i">
        <a :href="url" target="_blank">
          {{quote[0]}}
          <span class="highlight">{{quote[1]}}</span>
          {{quote[2]}}
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import statements from "./data/statements.json";

export default {
  data() {
    return {
      noun: "Trump",
      verb: "is"
    };
  },
  computed: {
    reportingStatements() {
      const { noun, verb } = this;
      const statements = [...this.statements[noun][verb].reporting];
      return this.getStatements(statements);
    },
    opinionStatements() {
      const { noun, verb } = this;
      const statements = [...this.statements[noun][verb].opinion];
      return this.getStatements(statements);
    }
  },
  methods: {
    updateVerb(verb) {
      this.verb = verb;
    },
    updateNoun(noun) {
      this.noun = noun;
    },
    getStatements(arr) {
      const { noun, verb } = this;
      for (let i = 0; i < arr.length; i++) {
        var x = Math.floor(Math.random() * arr.length);
        var y = Math.floor(Math.random() * arr.length);
        [arr[x], arr[y]] = [arr[y], arr[x]];
      }
      var z = Math.floor(Math.random() * arr.length);
      const shortList = arr.slice(z, z + 10);
      return shortList.map(([quote, url]) => {
        const match = quote.match(`${noun} ${verb}`);
        const length = match[0].length;
        const i = match.index;
        return [[quote.slice(0, i), match[0], quote.slice(length + i)], url];
      });
    }
  },
  mounted() {
    const tl = gsap.timeline();
    tl.from(".button-bar", { opacity: 0, duration: 0.75 });
  },
  created() {
    this.statements = statements;
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/color-scheme.scss";

* {
  --color: rgb(71, 71, 71);
}

.container {
  display: grid;
  grid-column: 1/-1;
  grid-template-columns: 1fr 1fr;
  grid-gap: 26px;
  > *:first-child {
    grid-column: 1 / -1;
  }
}

button {
  color: white;
  border-radius: 4px;
  border: none;
  margin: 2px;
  font-size: 14px;
  padding: 5px 10px;
  text-transform: uppercase;
  background-color: var(--color);
  opacity: 0.4;
  text-shadow: rgb(100, 100, 100) 0px 0px 3px;

  &.selected {
    opacity: 1;
  }
}

.button-bar {
  grid-column: 1 / -1;
  //   display: flex;
}

p {
  margin-bottom: 24px;
}

a {
  text-decoration: none;
  color: rgb(71, 71, 71);
  .highlight {
    background-color: rgba(var(--rgb), 0.4);
  }
  &:hover {
    color: rgb(0, 0, 0);
  }
}

.is,
.has {
  @extend .blue;
}
.was,
.said {
  @extend .purple;
}
</style>