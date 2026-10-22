# Liquid Mesh B01 · renderer extraction

## Scope and architecture

- `src/background/liquidMesh/approved-preset.json` and `shader.js` are byte-for-byte copies of the approved playground files (SHA-1 `8bc40ca0e0b8a86f51f5ab24cac4bc49d6a87bb2` and `e6de47344cd2de1712d81ce22462d2f2c1851275`). No palette, light field, flow, grain, dimming or GLSL formula changed.
- `renderer.js` owns the one Three.js renderer, scene, camera, fullscreen plane, uniforms, frame loop, resize, visibility, media query, context events and GPU disposal. It imports no playground controls. A WeakMap prevents duplicate mounting on one host.
- `LiquidMeshBackground.vue` renders a fixed, noninteractive host and CSS fallback. Its script only mounts the renderer and destroys it on Vue unmount.
- `vue-preview/` is an isolated Vite development page. It is outside the SPA build inputs and does not change the public homepage. The original playground and Swiper remain intact.

The approved JSON retains `preserveDrawingBuffer: true` because it is an exact copy. The production renderer deliberately uses `false`; the playground alone needs PNG export. The new physical-pixel cap also changes the drawing resolution at large/high-DPR viewports. Neither change affects the GLSL or its numeric uniforms other than `uResolution` reflecting the actual buffer. These are the only technical deviations from the playground renderer.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Preset and GLSL identity | PASS | Identical file hashes; renderer rejects a preset with a different shader source. |
| Vue isolated mount | PASS | Preview loads one canvas and one WebGL context; the public SPA has no new import or mount. |
| Visual parity | PASS | At 1440×900 and 390×844, DPR 1 and shader time 0, `gl.readPixels` of the playground and Vue canvases had identical whole-buffer FNV-1a hashes: `1521798411` desktop and `1900052495` mobile. Same sampled center and edge pixel values. |
| Approved screenshots | PASS, qualitative | Compared [`approved-desktop.png`](./screenshots/approved-desktop.png) and [`approved-mobile.png`](./screenshots/approved-mobile.png) with [`b01-vue-desktop-t0.png`](./screenshots/b01-vue-desktop-t0.png) and [`b01-vue-mobile-t0.png`](./screenshots/b01-vue-mobile-t0.png). Composition, palette, grain and dark center remain consistent. The approved shots were captured at unspecified animation phases, so they are not valid pixel-diff references. |
| Animation and reduced motion | PASS | Active preview had one pending rAF; initial reduced motion had zero, time 0 and one draw. Live preference changes cancelled and restarted the loop. |
| Visibility | PASS, synthetic | Dispatching `visibilitychange` with `document.hidden` overridden to true cancelled the pending rAF; restoring false scheduled one. Headless Chromium did not mark a background tab hidden, so a real tab visibility transition was not measured. |
| Context loss and restoration | PASS, simulated | `WEBGL_lose_context` cancelled the loop, hid the canvas and revealed the fallback. Restore reused the same canvas, redrew, resumed one loop and updated dimensions/uniforms on subsequent resize. Screenshot after restore and resize succeeded. |
| Teardown | PASS | Three mount/unmount cycles each left zero canvases and zero pending rAF after unmount; one canvas and one pending rAF after remount. Teardown during a lost context also removed the canvas with no page error, and remount succeeded. |
| WebGL unavailable | PASS, simulated | Blocking WebGL context creation left zero canvases and the CSS fallback visible. |
| Typecheck | PASS | `npm run type-check`. |
| Production build | PASS | `npm run build-only -- --outDir /tmp/igghysound-b01-build`. Existing missing legacy hero-image warnings and bundle-size warning remain. The unused Vue component and renderer are absent from the current SPA output. |
| Lint | FAIL, baseline tooling | `npm run lint:check` reports parse errors for `import`/`export` across existing source and generated `dist`, consistent with the repository's missing ESLint configuration. No global lint configuration was changed in B01. |
| Real GPU reset / device profiling | NOT RUN | Browser extension simulation is not proof of behavior on a device GPU reset; no physical mobile device was available. |

### Drawing buffer measurements

The cap is 2,600,000 **physical** pixels, measured from the final canvas width and height. The effective ratio is bounded by device DPR, `maxDpr: 1.75`, and `sqrt(maxBufferPixels / CSS area)`; the renderer checks the allocated dimensions after `setSize` and reduces the ratio if rounding exceeds the cap.

| Viewport | Device DPR | Effective DPR | Drawing buffer | Pixels | Cap |
| --- | ---: | ---: | ---: | ---: | --- |
| 1440×900 | 1 | 1.000 | 1440×900 | 1,296,000 | PASS |
| 1440×900 | 2 | 1.4164 | 2039×1274 | 2,597,686 | PASS |
| 1440×900 | 3 | 1.4164 | 2039×1274 | 2,597,686 | PASS |
| 390×844 portrait | 1 | 1.000 | 390×844 | 329,160 | PASS |
| 390×844 portrait | 2 | 1.750 | 682×1477 | 1,007,314 | PASS |
| 390×844 portrait | 3 | 1.750 | 682×1477 | 1,007,314 | PASS |
| 844×390 landscape | 3 | 1.750 | 1477×682 | 1,007,314 | PASS |

## Previous Playwright timeout

The earlier playground experiment timed out on a screenshot after context restoration and mobile resize. B01 repeated that order in a fresh Chromium context: loss → fallback → restore → resize to 390×844 → screenshot → unmount/remount. All completed. The previous timeout did not reproduce, and its cause remains unknown. The fallback and shader recovery are verified for simulated loss in this browser, with no claim about a real driver reset.

## Recommendation

**GO for the separately approved shell preview.** Keep Swiper as the only active public background until that preview verifies layering, links, mobile scrolling, navigation and route persistence in the SPA. This is not a cutover recommendation.
