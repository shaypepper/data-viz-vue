<template>
  <p>
    <br />In the ninety-five stories with visualizations in 2019, eleven use
    <span
      :class="`blue ${highlightBox === 'hover' && 'full-opacity'}`"
      data-hovered-type="hover"
      >hover</span
    >, five allow the user to interact using
    <span
      :class="`yellow ${highlightBox === 'filter' && 'full-opacity'}`"
      data-hovered-type="filter"
      >filters</span
    >. Four allow the reader to take a
    <span
      :class="`red ${highlightBox === 'quiz' && 'full-opacity'}`"
      data-hovered-type="quiz"
      >quiz</span
    >.
  </p>
</template>

<script>
export default {
  props: ["highlightBox"],
};
</script>

<style lang="scss" scoped></style>
