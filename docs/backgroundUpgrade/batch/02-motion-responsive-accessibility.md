# Codex batch 02 — Animazione, responsive, accessibilità

**Comprende:** Step 4 → 5 (`../04-ambient-motion.md`, `../05-responsive-accessibility.md`). Esegui in sequenza, mantenendo verificabile ciascuna fase.

## Prerequisiti e vincoli

Leggi `AGENTS.md` e l'esito del batch 01. `src/components/AmbientBackground.vue` deve esistere ed essere selezionabile con `?ambient-preview=1` in `src/App.vue`. Se manca o la build è rotta, fermati e segnala il prerequisito. Non modificare Swiper, router, navigazione, logo, token globali o scroll. Non introdurre GSAP, Canvas/WebGL, timer, listener o nuove dipendenze; non creare commit.

## Fase 1 — Movimento

- In `AmbientBackground.vue`, anima `transform: translate3d(...) scale(...)` con keyframes, `ease-in-out`, `alternate`, durate iniziali 18–32 s e delay/direzioni asincroni. Scala circa 0.95–1.08. Il coral resta un accento discreto.
- Evita animazioni di posizioni CSS, dimensioni, gradienti, filtri o ombre; non applicare `will-change` a tutti gli orbs senza una misura che lo giustifichi.
- Ispeziona il ciclo completo per intersezioni troppo luminose con testo/logo e repaint estesi, dove possibile.

## Fase 2 — Adattamento e reduced motion

- Usa media query coerenti con il progetto, soprattutto 960 px e 768 px. Ridimensiona e riposiziona su tablet; su mobile mantieni due o tre luci meno intense e nessuno scroll orizzontale.
- Aggiungi `@media (prefers-reduced-motion: reduce)` che arresti gli orbs e lasci una composizione statica. Preserva `aria-hidden` e `pointer-events: none`.
- Prova Home, una vista testuale e Credits a desktop, tablet e mobile; verifica orientamento/viewport dinamica se disponibile. Non attribuire al nuovo componente la responsabilità delle animazioni preesistenti altrove.

## Gate e report

Esegui controlli non mutanti pertinenti e `git diff --check`. Riporta durate/direzioni, breakpoint, esito reduced motion, contrasto, browser/viewport testati, file modificati e prove non disponibili. Se la leggibilità o la fluidità peggiora nettamente, riduci il moto prima di chiudere il batch. Lascia attiva la scelta reversibile con Swiper.
