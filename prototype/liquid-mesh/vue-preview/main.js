import { createApp, h, nextTick, ref } from 'vue'
import LiquidMeshBackground from '../../../src/components/LiquidMeshBackground.vue'
import { getLiquidMeshController } from '../../../src/background/liquidMesh/renderer.js'

const visible = ref(true)
const app = createApp({
  setup() {
    return () => h('div', { class: 'stage' }, [
      visible.value ? h(LiquidMeshBackground) : null,
      h('main', { class: 'preview', 'aria-label': 'Anteprima Vue della leggibilità centrale' }, [
        h('p', { class: 'eyebrow' }, 'IGGHYSOUND · BACKGROUND STUDY'),
        h('h1', [ 'Mix ', h('span', '&'), h('br'), 'Mastering', h('br'), 'Engineer' ]),
        h('p', { class: 'caption' }, 'Luci atmosferiche, centro protetto.'),
      ]),
    ])
  },
})
app.mount('#app')

// Diagnostics are confined to this development page, never imported by the SPA.
window.liquidMeshPreview = {
  metrics: () => getLiquidMeshController(document.querySelector('.liquid-mesh-background'))?.getMetrics(),
  renderAtTime: (time) => getLiquidMeshController(document.querySelector('.liquid-mesh-background'))?.renderAtTime(time),
  async unmount() { visible.value = false; await nextTick() },
  async remount() { visible.value = true; await nextTick() },
}
