// Historical playground defaults. The approved values live in approved-preset.json;
// these values only seed a new schema or a legacy flat-JSON import.
export const PALETTE_KEYS = ['base', 'violet', 'magenta', 'pink', 'blue', 'coral']
export const CONTROL_RANGES = {
  intensity: [0, 2],
  size: [0.55, 1.6],
  speed: [0, 2],
  distortion: [0, 1],
  dimming: [0, 1],
  grain: [0, 0.12],
}

export const DEFAULT_PALETTE = Object.freeze({
  base: '#090412', violet: '#6213c5', magenta: '#e71996',
  pink: '#ff3dad', blue: '#1768d6', coral: '#ff7a40',
})
export const DEFAULT_CONTROLS = Object.freeze({
  intensity: 1, size: 1, speed: 1.2, distortion: 0.85,
  dimming: 0.86, grain: 0.026,
})

// Snapshot of the non-editable shader parameters. `source` in the exported JSON
// is the final authority; imports reject a different source or fixed snapshot.
export const FIXED_SHADER_PARAMETERS = Object.freeze({
  coordinateSystem: 'aspect-scaled centered UV',
  fieldFalloff: 1.8,
  flow: {
    broadX: [4.4, 0.64, 0.6, 2.5, -0.31],
    broadY: [3.7, -0.52, 0.7, 3.1, 0.37],
    detailX: [0.42, 8.3, -2.1, -0.85],
    detailY: [0.38, 6.8, 2.7, 0.73],
    displacement: 0.105,
  },
  responsive: { aspectStart: 0.7, aspectEnd: 1.55, mobileLightScale: 0.82 },
  // xBase is a signed offset from the named viewport edge, as a fraction of aspect.
  // xDrift and yDrift are [amplitude, angularSpeed, phase, waveform].
  lights: [
    { name: 'violet', color: 'violet', edge: 'left', xBase: 0.14, yBase: 0.33, xDrift: [0.065, 0.48, 0, 'sin'], yDrift: [0.055, 0.39, 0, 'cos'], radius: [0.36, 0.38], intensity: 0.85 },
    { name: 'pink', color: 'pink', edge: 'left', xBase: 0.11, yBase: 0.30, xDrift: [0.075, 0.57, 0.8, 'sin'], yDrift: [0.065, 0.51, 0, 'cos'], radius: [0.19, 0.22], intensity: 0.95 },
    { name: 'rightMagenta', color: 'magenta', edge: 'right', xBase: -0.09, yBase: 0.015, xDrift: [0.09, 0.46, 1.2, 'sin'], yDrift: [0.075, 0.42, 0, 'cos'], radius: [0.27, 0.38], intensity: 0.75 },
    { name: 'rightCore', color: 'pink', edge: 'right', xBase: -0.13, yBase: 0.04, xDrift: [0.055, 0.54, 1.8, 'sin'], yDrift: [0.09, 0.48, 0, 'cos'], radius: [0.10, 0.13], intensity: 0.70 },
    { name: 'blue', color: 'blue', edge: 'left', xBase: 0.02, yBase: -0.41, xDrift: [0.055, 0.43, 0, 'cos'], yDrift: [0.055, 0.37, 0, 'sin'], radius: [0.26, 0.27], intensity: 0.55 },
    { name: 'lowerPink', color: 'magenta', edge: 'left', xBase: 0.09, yBase: -0.55, xDrift: [0.065, 0.38, 0, 'sin'], yDrift: [0, 0, 0, 'none'], radius: [0.29, 0.19], intensity: 0.30 },
    { name: 'coral', color: 'coral', edge: 'right', xBase: 0.02, yBase: 0.43, xDrift: [0.055, 0.36, 0, 'sin'], yDrift: [0.04, 0.47, 0, 'cos'], radius: [0.18, 0.19], intensity: 0.46 },
    { name: 'lowerBlue', color: 'blue', edge: 'right', xBase: -0.02, yBase: -0.50, xDrift: [0.05, 0.41, 0, 'cos'], yDrift: [0, 0, 0, 'none'], radius: [0.26, 0.20], intensity: 0.36 },
  ],
  center: { x: 0, y: 0.005, radiusX: 0.46, radiusY: 0.36, falloff: 1.55 },
  grain: { ditherAmplitude: 0.004, framesPerSecond: 16, cycle: 1019, seedX: 17, seedY: 91 },
})

export const FIXED_RENDER_PARAMETERS = Object.freeze({
  maxDpr: 1.75,
  maxBufferPixels: 2600000,
  frameIntervalMs: 32,
  deltaCapSeconds: 0.05,
  outputColorSpace: 'LinearSRGBColorSpace',
  preserveDrawingBuffer: true,
})

const copy = (value) => JSON.parse(JSON.stringify(value))
const hasKeys = (object, expected) => object && typeof object === 'object' && !Array.isArray(object) &&
  Object.keys(object).sort().join('|') === [...expected].sort().join('|')

export function createPreset(shaderSource) {
  return {
    format: 'igghysound-liquid-mesh-preset',
    version: 1,
    palette: copy(DEFAULT_PALETTE),
    controls: copy(DEFAULT_CONTROLS),
    shader: { source: shaderSource, parameters: copy(FIXED_SHADER_PARAMETERS) },
    renderer: copy(FIXED_RENDER_PARAMETERS),
  }
}

export function serializePreset(preset) {
  return `${JSON.stringify(preset, null, 2)}\n`
}

export function parsePreset(json, shaderSource) {
  let input
  try { input = JSON.parse(json) } catch { throw new Error('JSON non valido.') }
  // DevTools may copy JSON.stringify's result as a quoted JSON string.
  if (typeof input === 'string') {
    try { input = JSON.parse(input) } catch { throw new Error('JSON non valido.') }
  }
  const preset = createPreset(shaderSource)

  // Accept the flat JSON snippet supplied for capturing values from the old UI.
  const legacyKeys = [...PALETTE_KEYS, ...Object.keys(CONTROL_RANGES)]
  if (hasKeys(input, legacyKeys)) {
    for (const key of PALETTE_KEYS) preset.palette[key] = input[key]
    for (const key of Object.keys(CONTROL_RANGES)) preset.controls[key] = Number(input[key])
  } else {
    if (!hasKeys(input, ['format', 'version', 'palette', 'controls', 'shader', 'renderer']) ||
        input.format !== preset.format || input.version !== preset.version) {
      throw new Error('Formato o versione del preset non compatibile.')
    }
    if (!hasKeys(input.shader, ['source', 'parameters']) || input.shader.source !== shaderSource ||
        JSON.stringify(input.shader.parameters) !== JSON.stringify(preset.shader.parameters) ||
        JSON.stringify(input.renderer) !== JSON.stringify(preset.renderer)) {
      throw new Error('Shader o parametri fissi diversi: importazione annullata per evitare un risultato visivo diverso.')
    }
    preset.palette = input.palette
    preset.controls = input.controls
  }

  if (!hasKeys(preset.palette, PALETTE_KEYS) ||
      PALETTE_KEYS.some((key) => typeof preset.palette[key] !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(preset.palette[key]))) {
    throw new Error('La palette deve contenere sei colori esadecimali #RRGGBB.')
  }
  if (!hasKeys(preset.controls, Object.keys(CONTROL_RANGES)) ||
      Object.entries(CONTROL_RANGES).some(([key, [min, max]]) =>
        typeof preset.controls[key] !== 'number' || !Number.isFinite(preset.controls[key]) || preset.controls[key] < min || preset.controls[key] > max)) {
    throw new Error('Uno o più controlli sono mancanti o fuori intervallo.')
  }
  for (const key of PALETTE_KEYS) preset.palette[key] = preset.palette[key].toLowerCase()
  return preset
}
