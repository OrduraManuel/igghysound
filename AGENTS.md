# IgghySound — Agent Instructions

## 1. Project overview

- IGGHYSOUND is a sound engineer portfolio with a public presentation and a Firebase-backed editing area. The interface looks like one continuous canvas, but its major sections are actual Vue Router pages. Treat the persistent visual shell and route changes as a deliberate composition. Evidence: `src/App.vue`, `src/router/index.js`, `src/components/newNav.vue`.
- This document describes repository code, not a verified production deployment. Preserve existing behavior unless the task explicitly requests a change. Do not infer a design rule from an unused or isolated file.

## 2. Technology stack and commands

| Area | Repository evidence |
| --- | --- |
| Runtime | Vue **3.3.4** in `package-lock.json`; Vite **4.4.8**; Vue Router **4.1.6**; Pinia **2.1.4**. `src/main.js` installs Router and Pinia. |
| Component API | Predominantly Composition API with `<script setup>`; Options API also occurs in `src/views/404.vue` and `src/components/track/tracksList.vue`. Do not impose one style across the repository. |
| Languages | Application source is JavaScript Vue SFCs. `vite.config.ts`, `tsconfig*.json`, and `vite-env.d.ts` use TypeScript for tooling; `allowJs` and `vue-tsc --noEmit` cover source files. |
| Styling | Bootstrap 5 SCSS/grid/utilities, Sass, PostCSS nesting, global SCSS and scoped SFC SCSS; Bootstrap JS is loaded from a CDN in `index.html` for modals. |
| Data | Firebase Auth, Firestore and Storage; `src/api/`, `src/auth/`, `src/store/`. Axios is declared but no application import was found. |
| Motion/media | Swiper 10 fade/autoplay, Lottie Web on track cards, Animate.css CDN classes, CSS animations and the Web Animations API. Font Awesome CDN plus selected local SVGs imported with `?raw`. |
| Forms | `vee-validate` and Yup in the track wizard; a contact form posts to Formspree. Browser image compression is declared; verify its individual call sites before changing uploads. |
| Package manager | npm (`package-lock.json`); `package.json` specifies Node 18.16.0 and npm 9.7.1. |

- Available scripts: `npm run dev` (Vite host, port 8082), `npm run build` (parallel type check and Vite build), `npm run build-only`, `npm run type-check`, `npm run preview`, `npm run lint:check`, `npm run lint:fix`, `npm run old_lint`. The two fix scripts mutate files; do not use them for read-only validation.
- ESLint, Prettier and Vue TypeScript tooling are dependencies, but no ESLint/Prettier configuration or test script/test suite is present in the tracked project. `postcss.config.js` also configures nesting; `vite.config.ts` configures it in Vite. Do not assume a passing test gate.

## 3. Repository map and ownership

| Path | Responsibility and change impact |
| --- | --- |
| `index.html`, `src/main.js`, `src/App.vue` | HTML mount and external CSS/JS; Vue creation/plugins/provide; persistent shell, initial collection fetch and routed outlet. Shell changes affect every route. |
| `src/router/index.js` | Explicit public and admin routes, history mode, dashboard auth guard. Route names and paths are consumer contracts. |
| `src/views/` | Public page content (`Home`, `About`, `Services`, `Contact`, `Selections`) and error pages. A page is the routed unit, not an anchor within a mounted mega-page. |
| `src/views/auth/` | Login and dashboard pages; nested track/author tables; track wizard and author/track editing screens. Check both route and form/data dependencies when editing. |
| `src/components/` | Persistent navigation, background and borders; route-level back control, modal and track/author cards. `auth/` contains table rows, modals, login and wizard steps. |
| `src/store/`, `src/api/`, `src/auth/` | Pinia track/author/user state; Firebase configuration and CRUD; module-level auth state and login/signup functions. These are shared across public and admin surfaces. |
| `src/assets/scss/` | CSS variables, reset, responsive root sizing, animations, global layout and page/auth/track selectors. Edit the relevant owning partial and account for global cascade. |
| `src/assets/icon/`, `src/assets/font/`, `public/` | Imported SVG icons and a font asset; URL-addressed logo, background images, Lottie JSON and favicon. Files under `public/` are referenced from `/`, not imported. |
| `src/assets/js/` | Small image utilities and a checked-in Font Awesome loader. Do not assume every file is active: `index.html` comments out `script.js`; inspect imports before reuse. |

- `dist/` is build output and `node_modules/` is installed dependency output; neither is application source. `.env.local` is ignored and supplies Vite Firebase configuration; never copy its values into documentation. No composables, directives or plugins directory exists; the auth functions in `src/auth/` are the closest local composables. `src/components/navigation.vue` and some other source files are not wired into the current root/route tree; confirm use before editing them.
- `vite.config.ts` injects `@import "./src/assets/scss/style.scss"` as Sass `additionalData` for SCSS compilation. `style.scss` imports Bootstrap and the global partial tree through `src/assets/scss/components/_layout.scss`. This is a broad styling dependency even for scoped SFC blocks; inspect the compiled cascade before changing a global selector.

## 4. Application architecture and navigation

1. `index.html` mounts `src/main.js` into `#app`. `main.js` creates Vue, installs Pinia and Router, provides a reactive `GStore`, then mounts `App.vue`.
2. `App.vue` always renders `Swiping`, `NewNav`, `Borders` and one top-level `<router-view>` within `.container-fluid`. Its mounted hook fetches all tracks and authors ordered by `Number` into Pinia; the public Credits gallery and dashboard use this data. The root also has a flash-message watcher. Evidence: `src/App.vue`, `src/store/trackStore.js`, `src/store/authorStore.js`.
3. Public paths are `/`, `/about`, `/services`, `/contact`, `/selections`. `Home.vue` displays the hero; the other paths each render a separate view with a `toBack` link to `/`. `Selections.vue` renders Pinia tracks as `TrackCard` items. Evidence: `src/router/index.js`, `src/views/`, `src/components/toBack.vue`.
4. `NewNav.vue` is the active perimeter navigation. Its `router-link` controls go to those routes and login/dashboard; it watches `router.currentRoute.value.path`. On `/`, reactive inline position/opacity styles show the side, bottom, center and auth controls; on every other path, they are moved off canvas and faded. The logo link remains. CSS supplies the 1.5 s positional transition. Active state is derived from the route, not a separate global navigation store. Evidence: `src/components/newNav.vue`, `src/assets/scss/components/global/navigation.scss`.
5. Router uses `createWebHistory(import.meta.env.BASE_URL)`: URLs are real history paths, so browser Back/Forward reselects route and triggers the navigation watcher. No direct `pushState`/`replaceState`, hash-driven section switching, query-driven public navigation or router `scrollBehavior` was found. A few ordinary `href="#"` links exist; they are not the section navigation mechanism. Deep links require host-side SPA fallback, which cannot be verified from this repository. Evidence: `src/router/index.js`, `src/components/newNav.vue`.
6. `router-view` has Animate.css fade-in classes but no Vue `<Transition>`, `keep-alive` or route key. Routed components are ordinarily unmounted/replaced as the matched route changes; the shell stays mounted. There is no code that keeps all public sections mounted and toggles visibility. Do not promise synchronized exit/enter choreography that is not implemented. Evidence: `src/App.vue`.
7. `/dashboard` is a parent route with nested `tracks` and `authors` children in its own `<router-view>`. The root `/dashboard` does not redirect to a child. The dashboard `beforeEnter` checks `auth.currentUser`; the separate create/edit routes and stepper have no guard declared in the router. Other routes include `/firstLog`, `/404/:resource`, `/networkError` and a catch-all. Evidence: `src/router/index.js`, `src/views/auth/Dashboard.vue`.

### Scroll and viewport contract

- Global `#app` is `100vw × 100dvh` with `overflow: hidden`; at `max-width: 960px` it gains vertical overflow. Routed views receive `.homethis` on `<router-view>` and use a framed viewport layout; below 960 px `.homethis` scrolls vertically and has custom scrollbar styling. `Selections.vue` additionally sets `#app.style.overflow` to `auto` on mount and `hidden` on unmount, while animating the bottom border. These layers can affect one another. Evidence: `src/assets/scss/style.scss`, `src/assets/scss/components/global/sections.scss`, `src/views/Selections.vue`.
- Do not replace the scroll container, alter `#app` overflow or move the Swiper outside the shell without checking desktop, mobile, Credits entry/exit and Back/Forward behavior.

## 5. Component and data contracts

| Component/area | Parent and contracts to preserve |
| --- | --- |
| `NewNav` | Child of `App`; no props/emits. Consumes current route and module-level Firebase `user`; logout calls `signOut`. Position styles depend on CSS margin variables and navigation selectors. |
| `Swiping` | Child of `App`; no props/emits. Fixed full-viewport decorative Swiper behind every route; three `public/images/homeHero/hero-bg-*.jpg` slides, fade effect and 2200 ms autoplay. |
| `Borders` | Child of `App`; no props/emits. On mount reads DOM IDs `logo`, `claim`, `t1/t2`, `b1/b2`, `border-r` and animates frame pieces via `Element.animate` and a timeout. The IDs and mount order are implicit dependencies. Hidden below Bootstrap `md`. |
| `toBack` | Child of most non-home views; `where: String` selects a `router-link` destination. It is navigation, not `history.back()`. |
| `ModalBtn` / `modalContact` | Public `About`, `Services`, `Contact`; `where` forms Bootstrap `data-bs-target` ID. Mobile CTA is teleported to `body`; modal is also teleported. Contact form submits to Formspree. Keep IDs/targets in sync. |
| `Selections` / `TrackCard` | `Selections` reads Pinia `Tracks` and passes `thisTrack` plus string `index` (track ID). `TrackCard` reads Pinia authors, loads album art, starts a per-card Lottie animation in `spoty-${index}`, then links to `Src.Href`. `TrackCard` does not explicitly destroy the Lottie instance on unmount. |
| `Dashboard` / tables | Nested routed table views render `tableTracks` or `tableAuthors`, which call paginated Pinia actions and render row components. Full collections and limited page collections are distinct store fields. Create/edit flows update Firebase and may navigate back to dashboard. |
| `Wizard` / `Step` | `CreateStepper` passes validation schemas to `Wizard`; wizard provides step index/counter with `provide`/`inject`, advances with vee-validate and emits `submitEvent`. Check the actual listener before changing submission; the current `CreateStepper` template comments out that listener. |

- Most SFCs use `<script setup>`, local PascalCase imports and lower/camel-case filenames (`newNav.vue`, `trackCard.vue`, `toBack.vue`); names are not fully uniform. There is no global component registration in `src/main.js`. Props are generally declared with `defineProps`; explicit `defineEmits` is uncommon. Do not infer a new shared convention from one legacy component.
- Collection reads/writes pass Firestore collection names `Tracks`/`Authors` and order by `Number`; track records also link author IDs, image paths, favorite state and external source links. `src/api/crud.js` owns query/pagination primitives. Preserve field names and IDs when changing gallery or editor code.
- `src/auth/getUser.js` stores a module-level `user` ref updated by `onAuthStateChanged`; this differs from Pinia's `userStore`, which is not the navigation's auth source. `src/main.js` separately provides `GStore` for the flash message. Do not merge these states casually.
- Lifecycle and side effects are local: root fetches, border DOM animations, gallery overflow changes, Lottie starts, Firebase auth subscription, and upload/preview work in editor views. Check cleanup before extending such effects. `src/api/getCollection.js` has an unsubscribe invalidation hook; it is not the root's collection-loading path.

## 6. Brand identity and design tokens — current implementation

`src/assets/scss/variables.scss` defines the active CSS custom properties on `:root`. `src/assets/scss/variableSTUDY.scss` is a commented study/reference, **not** an active token source. Some legacy SCSS uses literals instead of tokens; document them before changing them.

| Current value/token | Main use and source |
| --- | --- |
| `--brandPrimary: #ff264a`, `--brandPrimaryD15: #ae0d27` | Coral-red link/accent, nav indicator, CTA/button glow; darker accent in admin UI. `src/assets/scss/variables.scss`, `src/assets/scss/components/_layout.scss`, `src/assets/scss/components/global/navigation.scss`, `src/assets/scss/components/global/btnCta.scss`. |
| `--white` / `--txtLight: #e5e5db` | Warm pale text and light UI surfaces. `src/assets/scss/variables.scss`; heading, borders and masonry partials. |
| `--black` / `--txtDark: #363b48` | Dark text/base surface. `src/assets/scss/variables.scss`; body also sets literal `#363b48` in `src/assets/scss/components/_layout.scss`. |
| `--light: #fff`, `--dark: #000` | Absolute light/dark references. White and black literals occur in overlays/modals too. `src/assets/scss/variables.scss`, `src/components/swiping.vue`, `src/components/modal/`. |
| `--borderColor: #b2b2b2`, `--borderSize: 2px`, `--border` | Neutral frame, back control, separators. `src/assets/scss/variables.scss`, `src/assets/scss/components/global/borders.scss`. |
| `--brandSecondary: purple`, `--brandSpecial: green` | Declared along with button aliases; literal purple/green/red also appear in legacy/admin styling. They are not evidence of a consistent public palette. `src/assets/scss/variables.scss`, `src/assets/scss/components/global/masonry.scss`, `src/assets/scss/components/track/createTrack.scss`. |

- Geometry tokens in `src/assets/scss/variables.scss`: frame margins `--marginT`/`--marginB: 8dvh`, `--marginR`/`--marginL: 6.5vw`, negative navigation offsets (`--marginNT`, `--marginNB`, `--marginNR`, `--marginNL`), dashboard button size/padding/position, and radii `--radiusS/M/L/Xl` (`.5/1/2/3rem`). Section padding and widths are often expressed with these variables and `dvh`/`vw`. Bootstrap grid and utility spacing coexist with local `rem`, `vw` and `dvh` literals.
- No central shadow, gradient, z-index, duration or easing token scale exists. Shadows are local to cards/modals; the Swiper uses a black 70% overlay; the modal uses translucent white and backdrop blur. Layering is coordinated with local values: background Swiper `z-index: 0`, border wrapper `2/3`, routed `.homethis` `9`, flash message `999999`. Verify stacking before adding overlays. Evidence: `src/components/swiping.vue`, `src/assets/scss/components/global/borders.scss`, `src/assets/scss/components/global/sections.scss`, `src/assets/scss/style.scss`.
- Preserve `public/images/icon/logo.svg` as the existing logo. Navigation references it by URL from `src/components/newNav.vue`; do not recolor or replace it as part of unrelated styling.

## 7. Typography and responsive behavior

- Body copy declares **Raleway** (`16px`, weight 500, line height 1.5), while navigation, hero and headings declare **Montserrat**. Headings commonly use uppercase, weight 700 and about `0.05rem` letter spacing; body paragraphs use `0.05em` tracking and line height 2. Hero text is a centered stacked composition with `Mix`/`Mastering` in the accent. Evidence: `src/assets/scss/components/_layout.scss`, `src/assets/scss/components/global/heading.scss`, `src/assets/scss/components/pages/home.scss`, `src/assets/scss/components/global/navigation.scss`.
- `index.html` loads **Roboto** from Google Fonts and external Animate.css/Font Awesome, but no Montserrat/Raleway import or local `@font-face` declaration was found. `src/assets/font/Swistblnk-Monthoers.*` exists without an active font-face rule. Effective rendered fallback fonts depend on the client environment; do not assert that Montserrat/Raleway are downloaded by this app.
- Breakpoints are local, not a single custom map: Bootstrap classes use `md`/`lg`; root and section scrolling/borders change at **960px**; perimeter nav has **640px** and **960px** rules; Home swaps desktop/mobile markup at Bootstrap `md` (768px); heading and body rules also use 575/576/767/768/880/992/995/1199/1200/1400/1920px and device pixel ratio queries. Evidence: `src/views/Home.vue`, `src/assets/scss/resize.scss`, `src/assets/scss/components/global/navigation.scss`, `src/assets/scss/components/global/sections.scss`, `src/assets/scss/components/global/borders.scss`.
- On smaller screens the border is hidden, CTA placement can use Teleport, routed content scrolls, and hero markup changes. Navigation remains route-based; no separate mobile router or menu is defined. No mobile-specific Swiper disablement was found. Test both sides of 960px and Bootstrap `md` before changing layout.

## 8. Motion and background system

- Root background: `src/components/swiping.vue` mounts a fixed, full-screen Swiper with three image slides, fade effect and autoplay every 2200 ms (`disableOnInteraction: true`). Scoped CSS gives each slide a 70% black overlay. `src/assets/scss/components/global/carouselz.scss` also contains older Ken Burns/background classes, including references to image numbers 4–8 that do not exist under `public/images/homeHero/`; those classes are not proof of active slides.
- Route entry: Animate.css classes on `router-view`; Home hero uses sequential animation durations generated by `@include delay`. The perimeter nav uses 1.5 s CSS transitions; the indicator pulses for 2 s. Borders use Web Animations API with 1450 ms and 666 ms phases. CTA and favorite-card edges use 1 s looping CSS keyframes; card hover and admin tab hover have local transition timings. Evidence: `src/App.vue`, `src/assets/scss/function.scss`, `src/assets/scss/animations.scss`, `src/assets/scss/components/global/navigation.scss`, `src/components/borders.vue`, `src/components/track/trackCard.vue`.
- No `requestAnimationFrame` loop or global DOM event listener is used by the active navigation. No `prefers-reduced-motion` rule was found in application source; treat reduced-motion support as an unmet concern, not an existing behavior. If adding motion, supply a reduced-motion path, avoid expensive continuous layout/paint effects, keep controls clickable, and clean up timers, listeners, animation frames and third-party instances when appropriate.
- Any future ambient background must preserve the Swiper's shell position, viewport coverage, overlay/contrast, layering, route visibility, navigation click targets and mobile scroll. Treat a replacement of `Swiping` as a background-system change that requires desktop/mobile and Back/Forward checks.

## 9. Development guardrails and file impact

1. Start at the owning route/view, then trace imports, Pinia actions, Firestore fields, global selectors and public assets. Identify all consumers of changed props, events, route names, DOM IDs and collection fields before editing.
2. Preserve the actual history-router model and persistent shell. Do not turn routes into anchors, add another router/state manager, or change Back/Forward and deep-link semantics without an explicit requirement and verification.
3. Keep changes local. Reuse `toBack`, existing modal/CTA/card conventions and active CSS variables. Avoid unrelated refactors, global style changes for local needs, arbitrary palette additions and logo alterations.
4. Preserve component lifecycle and scroll ownership, especially `Selections.vue`'s direct `#app` overflow mutations and `Borders`' DOM-ID dependency. Validate route entry/exit and mobile layout after any change to them.
5. Keep `Tracks`/`Authors` records and auth behavior compatible with existing public/admin consumers. Verify which editor routes are guarded before treating them as private.
6. For animation changes, prefer `transform`/`opacity` when feasible, keep contrast and input usability, and provide reduced-motion handling. Assess Swiper/Lottie/WAAPI cleanup and background layering.

### Quick change-impact map

| If changing… | Inspect together… |
| --- | --- |
| Routes/nav | `src/router/index.js`, `src/components/newNav.vue`, `src/components/toBack.vue`, all links in `src/views/`, `src/assets/scss/components/global/navigation.scss`. |
| Frame, viewport, background | `src/App.vue`, `src/components/swiping.vue`, `src/components/borders.vue`, `src/views/Selections.vue`, `src/assets/scss/style.scss`, `src/assets/scss/components/global/sections.scss`, `src/assets/scss/components/global/borders.scss`, `src/assets/scss/components/global/carouselz.scss`. |
| Gallery/content records | `src/views/Selections.vue`, `src/components/track/trackCard.vue`, `src/store/trackStore.js`, `src/store/authorStore.js`, `src/api/crud.js`, relevant admin views. |
| Modal/form | `src/components/modal/`, calling views, `index.html` Bootstrap bundle, Formspree endpoint or Firebase upload code as applicable. |
| Shared visuals | `src/assets/scss/variables.scss`, `src/assets/scss/components/_layout.scss`, relevant global/page partial, scoped styles, `public/images/icon/logo.svg`. |

## 10. Validation for future changes

- Use non-mutating checks first: `npm run type-check`, `npm run lint:check`, and `npm run build-only` as relevant. Build writes `dist/`; avoid it when only reviewing documentation. There is no configured automated test suite. Do not run `lint:fix`/`old_lint` unless a code-edit task authorizes formatting changes.
- Manually verify direct public URLs, Home-to-section-to-Home navigation, Back/Forward, dashboard nested routes and auth state where relevant. Check desktop and mobile viewport/scroll, especially at 768px and 960px; inspect modal stacking and background contrast for visual changes.
- Baseline success of type check, lint and runtime behavior has **not** been established by this documentation-only audit. Do not attribute pre-existing errors to a future patch without checking the baseline.

## 11. Proposed visual evolution — reference only

The voucher's **Ambient Radial Orbs** direction is **not implemented** in this repository. It proposes a night base, soft radial light sources and ambient motion; it is not a mandate to replace the current Swiper or CSS tokens.

| Proposed name | Hex | Comparison with current code |
| --- | --- | --- |
| Night Background | `#090412` | Much darker/purpler than current `#363b48` body base. |
| Electric Violet | `#6213C5` | New exact shade; current `purple` token/literals are different. |
| Neon Magenta | `#E71996` | New; current primary is red-coral `#ff264a`. |
| Warm Coral | `#FF7A40` | Warm accent related in role, not equal to `#ff264a`. |
| Electric Blue | `#1768D6` | New; no equivalent active brand token. |
| Pure White | `#FFFFFF` | Matches current `--light`/some literals, but differs from warm `--txtLight: #e5e5db`. |

Any adoption needs a separate design decision and scoped implementation. Check text contrast, CTA/nav visibility, image overlay, motion cost and reduced motion across all routes before replacing the current background.

## 12. Known limitations and open questions

- **Verified source limitations:** no router scroll behavior, no application reduced-motion rules, no route-level `keep-alive`; `TrackCard` does not explicitly destroy its Lottie instance; `Borders` schedules a timeout without an unmount cleanup. These are audit observations, not permission to refactor them during unrelated work.
- **Potential navigation issue:** `NewNav.vue` uses relative `to` values such as `about` and `services`; from a non-root path, their resolution should be checked in a browser before assuming those links always point to top-level routes. Its off-screen styles include unusual string values, so do not claim a specific rendering outcome without runtime inspection.
- **Potential auth issue:** only `/dashboard` and its children declare `requireAuth`; the separate create/edit routes do not. The redirect helper passes `next.fullPath` rather than the incoming route's `to.fullPath`; confirm intended redirect behavior with the owner before changing auth flow.
- **Runtime unknowns:** hosting fallback for direct history URLs, deployed Firebase collection shape/content, actual browser font fallback, and production visual behavior were not verified by source inspection. Ask for a runtime target or owner decision when these affect a requested change.
