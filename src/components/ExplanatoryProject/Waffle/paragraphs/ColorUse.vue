<template>
  <div>
    <h1>Color use</h1>
    <p>
      Many folks when they think of a killer visualization, they immediately think of scales.
      The visualizations in 2019 often didn't even use color.
      Thirty-two used colors to differentiate between
      <span
        :class="`blue ${highlightBox === 'categorical' && 'full-opacity'}`"
        data-hovered-type="categorical"
      >categories</span>, eight used color to
      <span
        :class="`other ${highlightBox === 'highlight' && 'full-opacity'}`"
        data-hovered-type="highlight"
      >highlight</span>
      a particular data point. As for flashy color use, only eleven used
      <span
        :class="`red ${highlightBox === 'sequential' && 'full-opacity'}`"
        data-hovered-type="sequential"
      >sequential color</span>, and only ten used
      <span
        :class="`yellow ${highlightBox === 'diverging' && 'full-opacity'}`"
        data-hovered-type="diverging"
      >diverging color</span>.
    </p>
  </div>
</template>

<script>
export default {
  props: ["highlightBox"]
};
</script>

<style lang="scss" scoped></style>
