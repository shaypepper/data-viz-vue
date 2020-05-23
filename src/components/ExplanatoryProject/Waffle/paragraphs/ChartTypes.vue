<template>
  <transition name="fade">
    <div>
      <h1 class="h1">Chart Types</h1>
      <p>
        While the team at The Upshot is endlessly creative,
        they still leaned on well executed basics to tell their stories.
        In the ninety-five stories with visualizations in 2019, thirty-four
        included
        <span
          :class="`l ${highlightBox === 'line' && 'full-opacity'}`"
          data-hovered-type="line"
        >line graphs</span>, twenty included
        <span
          :class="`s ${highlightBox === 'scatter' && 'full-opacity'}`"
          data-hovered-type="scatter"
        >scatter plots</span>, and thirty-five included
        <span
          :class="`b ${highlightBox === 'bar' && 'full-opacity'}`"
          data-hovered-type="bar"
        >bar charts</span>. Twenty-four resorted to
        <span
          :class="`${highlightBox === 'other' && 'full-opacity'}`"
          data-hovered-type="other"
        >other chart-types</span>.
      </p>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["highlightBox"]
};
</script>

<style lang="scss" scoped>
</style>
