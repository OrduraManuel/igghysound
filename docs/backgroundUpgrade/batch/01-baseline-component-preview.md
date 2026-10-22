# Codex batch 01 — Baseline, componente statico, anteprima reversibile

**Comprende:** Step 1 → 2 → 3 (`../01-baseline.md`, `../02-static-composition.md`, `../03-preview-integration.md`). Esegui nell'ordine indicato. Questo prompt è autonomo; consulta comunque i tre prompt singoli per i criteri dettagliati.

## Contesto e vincoli

Leggi `AGENTS.md`. IgghySound usa Vue 3 SFC JavaScript/SCSS. `src/App.vue` monta `src/components/swiping.vue` come background decorativo persistente, seguito da `NewNav`, `Borders` e `router-view`. Il router usa history HTML5; `#app` e `.homethis` gestiscono viewport e scroll. Mantieni questi contratti. Non installare dipendenze, non modificare router, logo, token globali o asset, non creare commit.

## Fase 1 — Baseline prima delle modifiche

- Leggi Swiper, CSS, immagini e livelli; cerca altri consumer.
- Se il runtime è disponibile, registra condizioni e screenshot/profili comparabili su Home, sezioni pubbliche e Credits a desktop, 960 px, 768 px e mobile. Prova Back/Forward, input e scroll. Non inventare benchmark.
- Conserva nel report finale i dati **prima** delle modifiche. Se il browser non è disponibile, registra una baseline statica e le verifiche mancanti; puoi proseguire con l'implementazione isolata.

## Fase 2 — Componente statico

- Crea solo `src/components/AmbientBackground.vue`: root `aria-hidden="true"`, `position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden`, base `#090412`, quattro gradienti morbidi viola `#6213C5`, magenta `#E71996`, blu `#1768D6`, coral `#FF7A40` attenuato.
- Mantieni token e CSS locali, centro scuro e nessuna animazione, filtro blur, libreria o texture. Controlla l'effetto dell'iniezione SCSS di `vite.config.ts`.

## Fase 3 — Anteprima

- Modifica `src/App.vue` per scegliere **una sola** istanza: `?ambient-preview=1` mostra il nuovo componente; senza parametro resta Swiper. Leggi il parametro una volta al caricamento senza cambiare router/History API.
- Mantieni intatti flash message, fetch dati, navigazione, bordi e `router-view`. Non eliminare Swiper, CSS storico o dipendenza.
- Verifica entrambe le varianti sulla home e una route interna; con un browser disponibile controlla anche Back/Forward e Credits.

## Gate e report

Esegui controlli non mutanti appropriati e `git diff --check`. Consegnami: baseline con ambiente e limiti; elenco file creati/modificati; verifica della compilazione e delle due varianti; problemi di stacking/contrasto; istruzione di rollback. Fermati se il componente non compila o se l'anteprima compromette la navigazione; non procedere al moto ambientale in questo batch.
