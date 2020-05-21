<template>
  <div>
    <h1>Interaction types</h1>
    <p>
      Another aspect of data visualizations that tends to grab a lot of eyes is interactivity.
      The upshot did use it a bit, but more conservatively than you might expect.
      Twenty-eight used a modest
      <span
        :class="`blue ${highlightBox === 'hover' && 'full-opacity'}`"
        data-hovered-type="hover"
      >hover</span>. Five allow the user to interact using
      <span
        :class="`yellow ${highlightBox === 'filter' && 'full-opacity'}`"
        data-hovered-type="filter"
      >filters</span>. Four allow the reader to take a
      <span
        :class="`red ${highlightBox === 'quiz' && 'full-opacity'}`"
        data-hovered-type="quiz"
      >quiz</span>.
    </p>
  </div>
</template>

<script>
export default {
  props: ["highlightBox"]
};
</script>

<style lang="scss" scoped></style>
