<template>
  <transition name="fade">
    <p>
      <!--
        While the Upshot is famous for some of its most interactive charts, the
        writers are usually able to make their analysis and visualizations
        approachable by sticking to the basics.
        <br />-->
      <br />In the ninety-five stories with visualizations in 2019, thirty-four
      included
      <span
        :class="`l ${highlightBox === 'line' && 'full-opacity'}`"
        data-hovered-type="line"
        >line graphs</span
      >, twenty included
      <span
        :class="`s ${highlightBox === 'scatter' && 'full-opacity'}`"
        data-hovered-type="scatter"
        >scatter plots</span
      >, and thirty-five included
      <span
        :class="`b ${highlightBox === 'bar' && 'full-opacity'}`"
        data-hovered-type="bar"
        >bar charts</span
      >. Twenty-four resorted to
      <span
        :class="`${highlightBox === 'other' && 'full-opacity'}`"
        data-hovered-type="other"
        >other chart-types</span
      >.
    </p>
  </transition>
</template>

<script>
export default {
  props: ["highlightBox"],
};
</script>

<style lang="scss" scoped></style>
