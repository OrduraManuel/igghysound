# Codex prompt — Step 2: composizione statica degli orbs

## Contesto

Leggi `AGENTS.md` e la baseline dello Step 1, se disponibile. IgghySound usa Vue 3 con SFC JavaScript/SCSS. `src/App.vue` monta uno Swiper decorativo persistente; in questo step **non** modificarlo o integrarlo.

## Obiettivo

Crea `src/components/AmbientBackground.vue` come componente decorativo **statico**, pronto per essere montato nello stesso livello dello Swiper. Evita nuove dipendenze.

## Specifiche

- Base `#090412`; quattro radial gradients senza bordi visibili: violetto `#6213C5`, magenta `#E71996`, blu `#1768D6` e coral `#FF7A40` meno intenso. Lascia una zona centrale scura per titoli e contenuti. Sono valori iniziali da rifinire visivamente.
- Usa token CSS **locali** al componente. Se memorizzi gli RGB separati da virgole, usa `rgba(var(--token), alpha)`, non la sintassi slash di `rgb()`.
- Root con `position: fixed`, `inset: 0`, `z-index: 0`, `overflow: hidden`, `pointer-events: none`, `aria-hidden="true"`; valuta `isolation: isolate` senza modificare i livelli esterni.
- Nessun timer, listener, mouse tracking, Canvas, WebGL, animazione o texture noise in questo step. Evita `filter: blur()` iniziale: ottieni bordi morbidi con i gradienti.
- Mantieni il CSS scoped. `vite.config.ts` inietta il foglio globale in ogni blocco SCSS: verifica che i nuovi selettori non alterino altri componenti.

## Ambito e verifica

Modifica solo il nuovo componente. Non modificare router, logo, token globali o Swiper. Verifica sintassi SFC e CSS con i controlli non mutanti disponibili; se il componente non è ancora montato, dichiara che la resa non è verificabile nel browser. Controlla `git diff --check` e riferisci file modificati, decisioni cromatiche e limiti. Lo step è completo quando il componente rappresenta una composizione statica autonoma e compilabile.
