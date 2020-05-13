<template>
  <defs>
    <mask id="tableMask">
      <rect height="5" width="5" x="0" y="0" fill="white" />
      <g stroke="black" stroke-width="0.1">
        <line x1="0" y1="1" x2="5" y2="1" />
        <line x1="0" y1="1.7" x2="5" y2="1.7" />
        <line x1="0" y1="2.4" x2="5" y2="2.4" />
        <line x1="0" y1="3.1" x2="5" y2="3.1" />
        <line x1="0" y1="3.8" x2="5" y2="3.8" />
        <line x1="2" y1="0" x2="2" y2="5" />
        <line x1="3.5" y1="0" x2="3.5" y2="5" />
      </g>
    </mask>
    <mask id="heatMapMask">
      <g fill="white">
        <rect height="1.16667" width="5" x="5" y="1" opacity="0.05" />
        <rect height="1.16667" width="5" x="5" y="2.16667" opacity="0.2" />
        <rect height="1.16667" width="5" x="5" y="3.33333" opacity="0.4" />
      </g>

      <g fill="white">
        <rect width="1.16667" height="5" y="1" x="5.5" opacity="0.2" />
        <rect width="1.16667" height="5" y="1" x="6.66667" opacity="0.3" />
        <rect width="1.16667" height="5" y="1" x="7.9" opacity="0.4" />
      </g>
    </mask>
    <mask id="texasMask">
      <image href="../../../assets/icons/texas.jpeg" height="3.5" width="3.5" x="1" y="5.5" />
    </mask>
    <mask id="animationMask" maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill="white" />
      <circle r="0.1" cx=".125" cy=".125" fill="black" opacity="0.5" />
      <circle r="0.15" cx=".25" cy=".25" fill="black" opacity="0.6" />
      <circle r="0.225" cx=".425" cy=".425" fill="black" opacity="0.7" />
      <circle r="0.275" cx=".6" cy=".6" fill="black" opacity="1" />
    </mask>
  </defs>
  <!-- <g class="icons">
              <g v-if="viz.hasATable">
                <rect height="3.5" width="3.5" x="1" y="1" mask="url(#tableMask)" />
              </g>

              <g v-if="viz.hasAHeatMap">
                <rect height="3.5" width="3.5" x="5.5" y="1" mask="url(#heatMapMask)" />
              </g>

              <g v-if="viz.hasAChloropleth">
                <rect height="3.5" width="3.5" x="1" y="5.5" mask="url(#texasMask)" />
              </g>

              <g v-if="viz.hasAnimation">
                <rect height="3.5" width="3.5" x="5.5" y="5.5" mask="url(#animationMask)" />
              </g>
  </g>-->
</template>
<script>
export default {};
</script>