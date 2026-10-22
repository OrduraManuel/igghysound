import * as THREE from 'three'
import approvedPreset from './approved-preset.json'
import { fragmentShader, vertexShader } from './shader.js'

const activeHosts = new WeakMap()
const colorKeys = ['base', 'violet', 'magenta', 'pink', 'blue', 'coral']

export function getLiquidMeshController(host) {
  return activeHosts.get(host)
}

function displayColor(hex) {
  // The approved shader consumes display-space channel values directly.
  const value = Number.parseInt(hex.slice(1), 16)
  return new THREE.Vector3((value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255)
}

function makeUniforms(preset) {
  const uniforms = {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uIntensity: { value: preset.controls.intensity },
    uSize: { value: preset.controls.size },
    uDistortion: { value: preset.controls.distortion },
    uDimming: { value: preset.controls.dimming },
    uGrain: { value: preset.controls.grain },
  }
  for (const key of colorKeys) {
    uniforms[`u${key[0].toUpperCase()}${key.slice(1)}`] = { value: displayColor(preset.palette[key]) }
  }
  return uniforms
}

/** Mounts a single fullscreen pass in a host. Calling it twice on the same host returns the same controller. */
export function mountLiquidMesh(host, preset = approvedPreset) {
  if (!host) throw new TypeError('Liquid Mesh requires a host element')
  const existing = activeHosts.get(host)
  if (existing) return existing
  if (preset.format !== 'igghysound-liquid-mesh-preset' || preset.version !== 1 || preset.shader.source !== fragmentShader) {
    throw new Error('Liquid Mesh preset is incompatible with the approved shader')
  }

  let renderer
  let geometry
  let material
  let scene
  let camera
  let frameId = 0
  let elapsed = 0
  let previous = 0
  let lastDraw = 0
  let drawCount = 0
  let lost = false
  let destroyed = false
  let supported = false
  let motionQuery
  const uniforms = makeUniforms(preset)

  function metrics() {
    const canvas = renderer?.domElement
    return {
      supported,
      lost,
      destroyed,
      canvasCount: host.querySelectorAll('canvas').length,
      scheduledFrames: frameId ? 1 : 0,
      drawCount,
      cssWidth: window.innerWidth,
      cssHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      effectivePixelRatio: renderer?.getPixelRatio() ?? 0,
      bufferWidth: canvas?.width ?? 0,
      bufferHeight: canvas?.height ?? 0,
      bufferPixels: canvas ? canvas.width * canvas.height : 0,
      time: uniforms.uTime.value,
    }
  }

  function draw() {
    if (!renderer || lost || destroyed) return
    renderer.render(scene, camera)
    drawCount += 1
  }

  function resize() {
    if (!renderer || lost || destroyed) return
    const width = Math.max(1, window.innerWidth)
    const height = Math.max(1, window.innerHeight)
    const { maxDpr, maxBufferPixels } = preset.renderer
    let ratio = Math.min(window.devicePixelRatio || 1, maxDpr, Math.sqrt(maxBufferPixels / (width * height)))
    renderer.setPixelRatio(ratio)
    renderer.setSize(width, height, false)
    // Check actual allocations, including renderer rounding on unusual viewports.
    while (renderer.domElement.width * renderer.domElement.height > maxBufferPixels) {
      ratio *= 0.999
      renderer.setPixelRatio(ratio)
      renderer.setSize(width, height, false)
    }
    uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
    draw()
  }

  function shouldAnimate() {
    return supported && !lost && !destroyed && !document.hidden && !motionQuery?.matches
  }

  function loop(now) {
    frameId = 0
    if (!shouldAnimate()) return
    if (!previous) previous = now
    const dt = Math.min((now - previous) / 1000, preset.renderer.deltaCapSeconds)
    previous = now
    elapsed += dt * preset.controls.speed
    if (now - lastDraw >= preset.renderer.frameIntervalMs) {
      uniforms.uTime.value = elapsed
      draw()
      lastDraw = now
    }
    frameId = requestAnimationFrame(loop)
  }

  function syncAnimation() {
    if (frameId) cancelAnimationFrame(frameId)
    frameId = 0
    previous = 0
    if (shouldAnimate()) frameId = requestAnimationFrame(loop)
  }

  function onMotionChange() {
    uniforms.uTime.value = 0
    draw()
    syncAnimation()
  }

  function onContextLost(event) {
    event.preventDefault()
    lost = true
    if (renderer) renderer.domElement.hidden = true
    syncAnimation()
  }

  function onContextRestored() {
    if (destroyed || !renderer) return
    lost = false
    renderer.domElement.hidden = false
    resize()
    syncAnimation()
  }

  function destroy() {
    if (destroyed) return
    destroyed = true
    if (frameId) cancelAnimationFrame(frameId)
    frameId = 0
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', syncAnimation)
    motionQuery?.removeEventListener('change', onMotionChange)
    if (renderer) {
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored)
      geometry?.dispose()
      material?.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      renderer = undefined
    }
    activeHosts.delete(host)
  }

  const controller = { destroy, resize, getMetrics: metrics, renderAtTime(time) {
    uniforms.uTime.value = time
    draw()
  } }
  activeHosts.set(host, controller)

  try {
    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, preserveDrawingBuffer: false, powerPreference: 'low-power' })
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setClearColor(preset.palette.base)
    renderer.domElement.className = 'liquid-mesh-canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored)
    host.append(renderer.domElement)
    scene = new THREE.Scene()
    camera = new THREE.Camera()
    geometry = new THREE.PlaneGeometry(2, 2)
    material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false })
    scene.add(new THREE.Mesh(geometry, material))
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', onMotionChange)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', syncAnimation)
    supported = true
    resize()
    syncAnimation()
  } catch (error) {
    console.warn('Liquid Mesh WebGL unavailable; using static fallback.', error)
    destroy()
  }
  return controller
}
