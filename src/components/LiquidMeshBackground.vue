<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { mountLiquidMesh } from '@/background/liquidMesh/renderer.js'

const host = ref(null)
let controller

onMounted(() => {
  controller = mountLiquidMesh(host.value)
})

onBeforeUnmount(() => {
  controller?.destroy()
  controller = undefined
})
</script>

<template>
  <div ref="host" class="liquid-mesh-background" aria-hidden="true">
    <div class="liquid-mesh-fallback"></div>
  </div>
</template>

<style scoped>
.liquid-mesh-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #090412;
}
.liquid-mesh-fallback {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 48% 50% at 0% 0%, #651079, transparent),
    radial-gradient(ellipse 35% 55% at 100% 45%, #68104e, transparent), #090412;
}
.liquid-mesh-background :deep(.liquid-mesh-canvas) {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.liquid-mesh-background :deep(.liquid-mesh-canvas[hidden]) {
  display: none;
}
</style>

<style lang="scss">
// B02-R1: content backing exists only while the Liquid Mesh host is mounted.
.container-fluid:has(> .liquid-mesh-background) {
  :is(#about, #services, #contact) > .row,
  #selections > .row > .col-12:first-child {
    //position: relative;
    isolation: isolate;
  }

  #about .btn-about:not(:hover),
  :is(#about, #services, #contact) .ctaContainer .createBtn:not(:hover) {
    //background: rgba(9, 4, 18, .92);
  }

  #about .btn-about {
    isolation: isolate;

    &::before,
    &::after {
      z-index: -1;
    }
  }

  #about .btn-about .btn-label,
  :is(#about, #services, #contact) .ctaContainer .cta-label {
    position: relative;
    z-index: 1;
    //background: #090412;
    padding: 0 6px;
  }
}

// The mobile CTA is teleported to body, outside .container-fluid.
body:has(.liquid-mesh-background) > .ctaContainer.d-md-none {
  .createBtn:not(:hover) {
    //background: rgba(9, 4, 18, .92);
  }

  .cta-label {
    position: relative;
    z-index: 1;
    //background: #090412;
    padding: 0 6px;
  }
}
</style>
