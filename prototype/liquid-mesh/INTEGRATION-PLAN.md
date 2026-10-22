# Liquid Mesh · integration readiness

## Current preset state

The original playground held color and slider values only in the `settings` object inside `main.js`; no code wrote URL parameters, localStorage, sessionStorage, or a file. The user supplied the selected values as a full export. [`approved-preset.json`](./approved-preset.json) now provides the initial and reset configuration. Later control edits remain in memory until explicitly exported.

The implemented export format contains the six palette colors, six controls, the exact fragment shader source and its fixed numeric parameter manifest, and the renderer configuration. Import validates the format and fixed shader identity before mutating live controls. A flat JSON capture from the original controls is also supported as input so the previously selected values can be promoted into a full export.

## Ownership for the future Vue implementation

| Concern | Planned owner | Constraint |
| --- | --- | --- |
| Approved values | Move `prototype/liquid-mesh/approved-preset.json` to `src/background/liquidMesh/approved-preset.json` | Preserve the user-supplied values exactly. Keep version and shader compatibility checks. |
| GLSL | `src/background/liquidMesh/shader.js` | Move the existing vertex and fragment source unchanged; retain one fullscreen draw pass. |
| Three.js lifecycle | `src/background/liquidMesh/renderer.js` | Own one renderer, scene, camera, plane, uniforms, rAF, resize, visibility, reduced motion, context events and disposal. Expose `mount(element, preset)` and `destroy()`; no UI dependencies. |
| Vue wrapper | `src/components/LiquidMeshBackground.vue` | Render only a fixed, noninteractive background host and fallback; mount renderer in `onMounted`, destroy in `onBeforeUnmount`. No palette controls. |
| Development controls | `prototype/liquid-mesh/` | Keep Export/Import and sliders here. The production bundle must not import this UI. |

## Performance and lifecycle audit of the current prototype

| Area | Current behavior | Gate before integration |
| --- | --- | --- |
| DPR and buffer size | `resize()` caps DPR at 1.75 and multiplies it by an area factor based on CSS pixels. This **does not strictly cap the final physical buffer at 2.6 million pixels** when DPR exceeds 1. The visual grain may also vary by screen density. | Measure desktop/mobile GPU cost; correct the physical-pixel cap only with a visual comparison to the approved preset. |
| Resize | Window `resize` updates canvas size and `uResolution`; canvas stays fixed to the viewport. | Check 390, 768, 960, 1440 px, orientation changes, and device DPR. Preserve the same aspect composition and central contrast. |
| Animation | One rAF loop, approximately 30 draws/s (`32 ms` threshold). Elapsed time is accumulated per rAF and each delta is clamped to `0.05 s`. | Profile FPS, CPU and GPU on a mid-range phone; verify motion speed after throttling. |
| Hidden tab | `visibilitychange` cancels rAF and restarts it when visible. | Confirm no draw calls while hidden and no jump on return. |
| Reduced motion | `matchMedia` prevents rAF; shader renders a still frame. | Confirm both initial load and live preference changes. |
| Context loss | `webglcontextlost` is prevented, stops rAF and hides the canvas to reveal the CSS fallback; restore shows the canvas, resizes and restarts. A browser test with `WEBGL_lose_context` restored the same canvas without console errors. A later Playwright screenshot after resizing that restored tab timed out; a fresh tab at the same mobile size succeeded. | Investigate the restored-tab capture timeout on target devices, including a real GPU reset where possible. |
| Cleanup | `pagehide` disposes geometry, material, renderer and context, removes major listeners. | Move cleanup to Vue unmount as well; check route changes do not unmount the shell background. |
| Fallback | A CSS gradient sits behind the canvas and appears if renderer construction fails. | Verify WebGL unavailable and context-loss cases. Sync fallback base color with the approved preset if it differs from `#090412`. |
| PNG export | `preserveDrawingBuffer: true` supports the playground's PNG button and can increase memory cost. | Production renderer can drop this option after confirming that no canvas export is needed. |

These are readiness findings. The current prototype's artistic shader values and resolution behavior remain as approved during this phase.

## SPA impact and incremental cutover

`src/App.vue` is the persistent shell: it renders `<Swiping />`, `<NewNav />`, `<Borders />`, then the routed view. `src/components/swiping.vue` is the sole active Swiper consumer found in `src/`. Its fixed fullscreen slides have a 70% black overlay and `z-index: 0`. The new Vue wrapper belongs in the same shell position as `Swiping`, outside `<router-view>`, so route changes keep one WebGL context alive. Do not mount it in `Home.vue`.

The current `prototype/liquid-mesh/index.html` is a Vite development page outside the production `vite.config.ts` build inputs. It does not ship as a Vue route. An existing untracked `src/components/AmbientBackground.vue` is a separate CSS study and is not mounted by `App.vue`; do not confuse it with the planned WebGL wrapper.

Layering requires inspection in the real app. Borders use `z-index: 2/3`; `.homethis` uses `9`; nav controls use local fixed positioning and `z-index: 1`. A new background host should remain noninteractive at the shell's background layer and should avoid `isolation` or negative `z-index` that could place it behind the body. Test logo, links, modals, dashboard and Credits interactions. `#app` scrolls below 960 px; `Selections.vue` changes its overflow on mount/unmount. A fixed canvas must not own or intercept this scrolling.

1. **Freeze preset — complete for this phase.** The user-supplied colors and controls are in `approved-preset.json`. The file passes schema/shader validation and exact JSON round-trip; the playground loads it on startup and reset. Approved desktop/mobile screenshots are saved. Do not alter this file during later performance work without another visual review.
2. **Extract renderer and Vue wrapper without cutover — complete (B01).** Added the planned files while `App.vue` still renders only Swiper. The isolated Vue preview verifies one canvas/context, identical approved preset at desktop and mobile, no controls in the production component, simulated context recovery and cleanup. See [`B01-REPORT.md`](./B01-REPORT.md) for measurements and remaining device-level limits.
3. **Shell preview — complete (B02).** A development-only query switch selects exactly one background in the real SPA shell. Public routes, Back/Forward, mobile scroll, modal interactions, reduced motion, fallback and simulated context recovery were checked. The unauthenticated Dashboard guard was checked; authenticated Dashboard access remains unverified. See [`B02-REPORT.md`](./B02-REPORT.md) and its visual contrast finding before deciding on cutover.
4. **Cutover — complete (B03).** After visual approval, `src/App.vue` mounts only the WebGL wrapper; the B02 switch and Swiper runtime/dependency were removed. Public hero images and legacy `carouselz.scss` remain. Typecheck, build and public route/WebGL regressions passed in Chromium; authenticated Dashboard and real-device tests remain outstanding. See [`B03-REPORT.md`](./B03-REPORT.md).

B04 local production verification is recorded in [`B04-RELEASE-REPORT.md`](./B04-RELEASE-REPORT.md). Remote release is blocked pending deployment configuration, authorized Dashboard verification and explicit deploy authorization.
