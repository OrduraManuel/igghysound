# IgghySound · Liquid Mesh prototype

## Review

Run `npm run dev` and open `http://localhost:8082/prototype/liquid-mesh/`.

- [Approved desktop, 1440 × 900](./screenshots/approved-desktop.png)
- [Approved mobile, 390 × 844](./screenshots/approved-mobile.png)
- [Mobile controls](./screenshots/mobile-controls.png)
- [Motion frame A](./screenshots/motion-a.png) and [motion frame B](./screenshots/motion-b.png), captured four seconds apart
- [Static fallback during simulated WebGL context loss](./screenshots/context-loss.png)

This is an isolated study. The Vue router, `App.vue`, navigation, logo, content, and existing Swiper are untouched. The title is a readability stand-in, not a proposed site content change. The user-approved values are stored in [`approved-preset.json`](./approved-preset.json), which is the playground's initial and reset configuration.

## Preset capture

The original controls were memory-only: a reload reset them. The user supplied a full export with the chosen values. `approved-preset.json` was generated from the current shader and fixed parameter manifest plus those exact six colors and six slider values, then validated by the import parser. Open the panel and select **Export Preset**, then **Copia JSON** or **Scarica JSON**. The JSON includes the current values, the exact shader source, a manifest of fixed light positions, radii, intensities, flow, center and grain constants, and renderer settings. **Import Preset** accepts a pasted full JSON or the original 12-value flat JSON; a file input accepts a downloaded JSON. It rejects incompatible shader revisions before changing any live value.

Approved palette: base `#090412`, violet `#6213c5`, magenta `#e318e7`, pink `#ff3dcb`, blue `#1768d6`, coral `#ff7a40`. Approved controls: intensity `1.36`, size `0.95`, speed `1.43`, distortion `0.67`, dimming `0.86`, grain `0.101`.

The export captures a configuration, not the current animation frame or the device's DPR. Replaying the same preset begins at time zero and may produce different per-pixel grain on another screen density. See [integration readiness](./INTEGRATION-PLAN.md) for the SPA cutover and performance gates.

Browser round-trip check under reduced motion: changing light size changed the canvas; importing the preceding export restored a byte-identical canvas PNG at the same viewport and static time. A modified shader source was rejected without changing the live controls. Simulated WebGL loss displayed the fallback, and restore resumed the same canvas without console errors.
An additional browser check changed all six colors and all six sliders to distinct values; Export → Reset → Import restored every input exactly.
With the approved preset loaded, the browser's Export output matched `approved-preset.json` byte for byte, and the reset button restored intensity from `0.50` to the approved `1.36`.

## References and rights

| Source | Observed technique | Rights check / use here |
| --- | --- | --- |
| [21st.dev Liquid Shader](https://21st.dev/@dhileepkumargm/components/liquid-shader) | React/Three.js fullscreen shader, animated wave appearance, optional center dimming. The public component page describes these features; the full shader source was not accessible in the reviewed page. | No component-specific license was visible. [21st marketplace terms](https://docs.21st.dev/terms) distinguish component code from protected demos and media. No source code or media was copied. |
| [Netoun Mesh Gradient](https://www.netoun.com/labs/mesh-background/) | Its published GLSL shows three drifting light fields, vignette, pixel hash dither, and animated grain in one fragment pass. | The [linked repository](https://github.com/netoun/netoun.github.io) did not present a license file in its root listing; the site states “All rights reserved.” No source code or assets were copied. |
| [Three.js](https://github.com/mrdoob/three.js/blob/dev/LICENSE) | WebGL renderer, shader material, fullscreen plane. | MIT license; installed as `three@0.180.0`. |

The shader in `shader.js` is an original implementation of general rendering techniques: analytic Gaussian light fields, sinusoidal UV warping, a broad center mask, and hash grain. It does not reproduce the reference functions, constants, geometry, or UI.

## Architecture

- One HTML canvas, one Three.js `WebGLRenderer`, one plane and one `ShaderMaterial` draw call. No render targets or postprocessing.
- The fragment shader does color fields, movement, soft cores, center dimming, dither, and film grain. `uTime` drives coupled traveling UV waves and a larger drift of the light centers. The default flow was strengthened after review because the first version looked static.
- Six color pickers and six sliders set uniforms directly; speed scales elapsed time. The panel can collapse for visual review.
- Animation caps near 30 fps. DPR is capped at 1.75 and buffer area at about 2.6 million pixels. Resize updates buffer size and shader resolution.
- Hidden tabs, manual pause, and `prefers-reduced-motion` stop the animation loop. `pagehide` removes listeners and disposes geometry, material, renderer, and GPU context. A CSS still is shown if WebGL initialization fails.

## Checks and compromises

Browser checks at 1440 × 900, 768 × 1024, and 390 × 844 found one canvas, full viewport coverage, no horizontal overflow, and no console errors. The intensity control and pause state changed as expected. Reloading under reduced motion produced a static frame. `node --check` passed for both JS files and `npm run type-check` passed.

After strengthening the default flow, two desktop frames captured four seconds apart differed by about 17 RGB levels on average in the outer 20% of the image after downsampling to 72 × 45 pixels. This confirms visible motion in the light fields, beyond the animated grain. The collapsed panel now keeps the motion status visible so a reduced-motion setting or manual pause is apparent.

The bloom is computed analytically in the fragment shader, so its softness and brightness are less independent than with multipass blur. This avoids extra framebuffer memory and passes. Grain is monochrome and low amplitude; it can flicker on high contrast displays. `preserveDrawingBuffer` is enabled for the demo's PNG export and may cost memory or throughput; it should be removed if a production integration does not need canvas export. Measured GPU timings and device coverage beyond the browser viewports above remain open. The fallback does not animate.

The voucher supplies color placement and contrast direction, while this study omits its stars, arcs, logo, and typography. Those are not part of a background shader. The brighter left hotspot and right magenta rim are intentional starting points for visual approval; all major color and motion parameters are adjustable.
