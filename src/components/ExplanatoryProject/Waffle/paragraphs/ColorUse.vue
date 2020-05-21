<template>
  <p>
    <br />In the ninety-five stories with visualizations in 2019, eleven use
    <span
      :class="`red ${highlightBox === 'sequential' && 'full-opacity'}`"
      data-hovered-type="sequential"
      >sequential color</span
    >, thirty-two used colors to differentiate between
    <span
      :class="`blue ${highlightBox === 'categorical' && 'full-opacity'}`"
      data-hovered-type="categorical"
      >categories</span
    >, and eight used color to
    <span
      :class="`other ${highlightBox === 'highlight' && 'full-opacity'}`"
      data-hovered-type="highlight"
      >highlight</span
    >
    a particular data point. Ten used
    <span
      :class="`yellow ${highlightBox === 'diverging' && 'full-opacity'}`"
      data-hovered-type="diverging"
      >diverging color</span
    >.
  </p>
</template>

<script>
export default {
  props: ["highlightBox"],
};
</script>

<style lang="scss" scoped></style>
