import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shader.js'
import approvedPresetData from './approved-preset.json'
import { createPreset, parsePreset, serializePreset, DEFAULT_CONTROLS } from './preset.js'

const approvedPreset = parsePreset(JSON.stringify(approvedPresetData), fragmentShader)
const defaults = Object.freeze({ ...approvedPreset.palette, ...approvedPreset.controls })
const settings = { ...defaults }
const stage = document.getElementById('stage')
const status = document.getElementById('status')
const fallback = document.getElementById('fallback')
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
let renderer, geometry, material, scene, camera, frameId = 0
let elapsed = 0, previous = 0, lastDraw = 0, manualPause = false, lost = false
const colors = ['base', 'violet', 'magenta', 'pink', 'blue', 'coral']
const labels = { base: 'Background', violet: 'Violet', magenta: 'Magenta', pink: 'Hot Pink', blue: 'Electric Blue', coral: 'Coral' }
const uniforms = {
  uResolution: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 },
  uIntensity: { value: settings.intensity }, uSize: { value: settings.size },
  uDistortion: { value: settings.distortion }, uDimming: { value: settings.dimming },
  uGrain: { value: settings.grain },
  ...Object.fromEntries(colors.map((key) => [`u${key[0].toUpperCase()}${key.slice(1)}`, { value: new THREE.Vector3() }])),
}

function setColor(key, hex) {
  // The shader writes display-space values directly; retain the requested hex values.
  const value = Number.parseInt(hex.slice(1), 16)
  uniforms[`u${key[0].toUpperCase()}${key.slice(1)}`].value.set((value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255)
}
function updateUniforms() {
  colors.forEach((key) => setColor(key, settings[key]))
  for (const [key, uniform] of [['intensity', 'uIntensity'], ['size', 'uSize'], ['distortion', 'uDistortion'], ['dimming', 'uDimming'], ['grain', 'uGrain']]) uniforms[uniform].value = settings[key]
  document.querySelectorAll('input[name]').forEach((input) => {
    input.value = settings[input.name]
    const output = document.getElementById(`${input.name}-value`)
    if (output) output.value = Number(settings[input.name]).toFixed(input.name === 'grain' ? 3 : 2)
  })
  if (renderer) draw()
}
function draw() {
  renderer.render(scene, camera)
}
function resize() {
  if (!renderer) return
  // DPR and area caps keep the full-screen pass affordable on mobile GPUs.
  const width = window.innerWidth, height = window.innerHeight
  const areaScale = Math.min(1, Math.sqrt(2600000 / (width * height)))
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75) * areaScale)
  renderer.setSize(width, height, false)
  uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
  draw()
}
function shouldAnimate() {
  return !manualPause && !motionQuery.matches && !document.hidden && !lost && !!renderer
}
function loop(now) {
  frameId = 0
  if (!shouldAnimate()) return
  if (!previous) previous = now
  const dt = Math.min((now - previous) / 1000, 0.05)
  previous = now
  elapsed += dt * settings.speed
  if (now - lastDraw >= 32) {
    uniforms.uTime.value = elapsed
    draw()
    lastDraw = now
  }
  frameId = requestAnimationFrame(loop)
}
function syncAnimation() {
  cancelAnimationFrame(frameId)
  frameId = 0
  previous = 0
  if (shouldAnimate()) frameId = requestAnimationFrame(loop)
  document.getElementById('pause').textContent = manualPause ? 'Riprendi' : 'Pausa'
  status.textContent = lost ? 'Contesto WebGL perso' : motionQuery.matches ? 'Reduced motion: fotogramma statico' : document.hidden ? 'Scheda nascosta: in pausa' : manualPause ? 'Animazione in pausa' : 'WebGL · 1 canvas · 1 draw call'
}
function onContextLost(event) {
  event.preventDefault()
  lost = true
  renderer.domElement.hidden = true
  syncAnimation()
}
function onContextRestored() {
  lost = false
  renderer.domElement.hidden = false
  resize()
  syncAnimation()
}
function cleanup() {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', syncAnimation)
  motionQuery.removeEventListener('change', onMotionChange)
  if (renderer) {
    renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
    renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored)
    geometry?.dispose()
    material?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
    renderer = null
  }
}
function onMotionChange() { uniforms.uTime.value = 0; if (renderer && !lost) draw(); syncAnimation() }

function currentPreset() {
  const preset = createPreset(fragmentShader)
  for (const key of colors) preset.palette[key] = settings[key]
  for (const key of Object.keys(DEFAULT_CONTROLS)) preset.controls[key] = settings[key]
  return preset
}
function presetMessage(message, error = false) {
  const element = document.getElementById('preset-status')
  element.textContent = message
  element.dataset.error = String(error)
}
function exportPreset() {
  const json = serializePreset(currentPreset())
  const textarea = document.getElementById('preset-json')
  textarea.value = json
  textarea.select()
  presetMessage('Preset completo pronto da copiare o scaricare. Conserva questo JSON per l’integrazione.')
  return json
}
function importPreset(json) {
  try {
    const preset = parsePreset(json, fragmentShader)
    Object.assign(settings, preset.palette, preset.controls)
    elapsed = 0
    previous = 0
    uniforms.uTime.value = 0
    updateUniforms()
    document.querySelectorAll('input[type=color]').forEach((input) => { input.nextElementSibling.value = settings[input.name].toUpperCase() })
    document.getElementById('preset-json').value = serializePreset(currentPreset())
    presetMessage('Preset importato. Valori, colori e shader verificati.')
  } catch (error) {
    presetMessage(error.message, true)
  }
}

for (const key of colors) {
  const label = document.createElement('label')
  label.className = 'color-row'
  label.innerHTML = `<span>${labels[key]}</span><input type="color" name="${key}" value="${settings[key]}"><output>${settings[key].toUpperCase()}</output>`
  document.getElementById('color-controls').append(label)
}
document.querySelectorAll('input[name]').forEach((input) => input.addEventListener('input', () => {
  settings[input.name] = input.type === 'color' ? input.value : Number(input.value)
  if (input.type === 'color') input.nextElementSibling.value = input.value.toUpperCase()
  updateUniforms()
  presetMessage('Valori cambiati: esporta di nuovo il preset per salvarli.')
}))
document.getElementById('pause').addEventListener('click', () => { manualPause = !manualPause; syncAnimation() })
document.getElementById('reset').addEventListener('click', () => {
  Object.assign(settings, defaults)
  document.querySelectorAll('input[type=color]').forEach((input) => { input.nextElementSibling.value = settings[input.name].toUpperCase() })
  updateUniforms()
})
document.getElementById('export-preset').addEventListener('click', exportPreset)
document.getElementById('import-preset').addEventListener('click', () => importPreset(document.getElementById('preset-json').value))
document.getElementById('preset-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]
  if (file) importPreset(await file.text())
  event.target.value = ''
})
document.getElementById('copy-preset').addEventListener('click', async () => {
  const textarea = document.getElementById('preset-json')
  exportPreset()
  try {
    await navigator.clipboard.writeText(textarea.value)
    presetMessage('JSON copiato negli appunti.')
  } catch {
    textarea.select()
    presetMessage('Copia automatica non disponibile: premi Ctrl+C o ⌘C sul testo selezionato.', true)
  }
})
document.getElementById('download-preset').addEventListener('click', () => {
  const json = exportPreset()
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'igghysound-liquid-mesh-preset.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  presetMessage('Preset JSON scaricato.')
})
document.getElementById('save').addEventListener('click', () => {
  if (!renderer) return
  draw()
  const link = document.createElement('a')
  link.download = 'igghysound-liquid-mesh.png'
  link.href = renderer.domElement.toDataURL('image/png')
  link.click()
})
document.getElementById('panel-toggle').addEventListener('click', (event) => {
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true'
  event.currentTarget.setAttribute('aria-expanded', String(!expanded))
  document.getElementById('controls').hidden = expanded
})

try {
  renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, preserveDrawingBuffer: true, powerPreference: 'low-power' })
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setClearColor(defaults.base)
  renderer.domElement.className = 'shader-canvas'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.addEventListener('webglcontextlost', onContextLost)
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored)
  stage.insertBefore(renderer.domElement, fallback.nextSibling)
  scene = new THREE.Scene()
  camera = new THREE.Camera()
  geometry = new THREE.PlaneGeometry(2, 2)
  material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false })
  scene.add(new THREE.Mesh(geometry, material))
  updateUniforms()
  resize()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', syncAnimation)
  motionQuery.addEventListener('change', onMotionChange)
  window.addEventListener('pagehide', cleanup, { once: true })
  syncAnimation()
} catch (error) {
  console.error('WebGL initialization failed:', error)
  cleanup()
  status.textContent = 'WebGL non disponibile · anteprima CSS statica'
}
