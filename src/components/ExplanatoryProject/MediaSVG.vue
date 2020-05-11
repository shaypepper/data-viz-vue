<template>
  <svg viewBox="0 0 100 100">
    <mask :id="`circle-mask`">
      <circle r="49" cx="50" cy="50" fill="white" />
    </mask>
    <mask :id="`square-mask`">
      <rect width="100" height="100" rx="15" fill="white" />
    </mask>
    <rect height="100" width="100" fill="grey" :mask="`url(#${maskType}-mask)`" />
    <image
      v-if="promotionalMedia"
      :href="promotionalMedia.url"
      height="100"
      width="100"
      :mask="`url(#${maskType}-mask)`"
      :alt="displayName"
    />
  </svg>
</template>

<script>
export default {
  props: {
    promotionalMedia: Object,
    displayName: String,
    maskType: {
      default: "circle",
      type: String
    }
  },
  methods: {
    setFallbackImage(el) {
      console.log("!!");
      el.target.setAttribute("href", "../../assets/icons/black-square.svg");
    }
  }
};
</script>