# Codex prompt — Step 4: movimento ambientale

## Prerequisito

Leggi `AGENTS.md`; verifica gli esiti degli Step 1–3 e che gli orbs siano visibili con `?ambient-preview=1`. Lavora sulla composizione esistente, senza riscriverla arbitrariamente.

## Obiettivo

Anima i quattro orbs in modo lento, asincrono e quasi impercettibile.

## Modifica richiesta

- Modifica solo `src/components/AmbientBackground.vue`.
- Usa `transform: translate3d(...) scale(...)` con keyframes, `ease-in-out`, `alternate` e durate indicativamente tra 18 e 32 secondi. Dai a ogni orb direzione, durata e delay diversi; mantieni scala indicativamente tra 0.95 e 1.08.
- Non animare `top`, `left`, dimensioni, gradienti, ombre o filtri. Non aggiungere GSAP, Canvas, requestAnimationFrame, listener o reazioni al puntatore. Non applicare `will-change` a tutti gli elementi per precauzione.
- Mantieni una composizione leggibile in ogni posizione del ciclo; coral resta un accento, non la luce dominante.

## Verifica e output

Osserva almeno un ciclo significativo, anche con animazioni temporaneamente accelerate **solo negli strumenti di ispezione**, per rilevare spostamenti sgradevoli; confronta poi la velocità reale. Controlla input, assenza di layout shift e scroll orizzontale. Se disponibile, usa Paint flashing per identificare repaint ampi. Esegui `git diff --check`; riferisci durate finali, file modificati e verifiche non effettuabili. La regola reduced motion completa è oggetto dello Step 5.
