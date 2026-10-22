# Codex prompt — Step 7: benchmark e rifinitura

## Prerequisito

Leggi `AGENTS.md`, la baseline dello Step 1 e la matrice dello Step 6. Lo Swiper e gli orbs devono essere ancora confrontabili tramite il flag temporaneo.

## Obiettivo

Confronta prestazioni e UX in condizioni equivalenti; rifinisci il nuovo componente solo sulla base di problemi osservati.

## Attività

- Su stesso dispositivo/browser/viewport, registra versioni Swiper e orbs per 20–30 secondi ciascuna, includendo Home e scroll Credits. Annota condizioni, frame time, paint, layer, memoria e carico percepito; ripeti su mobile reale/Safari iOS se disponibile.
- Usa Chrome Performance/Rendering (Paint flashing, Layers) dove disponibile. Distingui caricamento iniziale, moto continuo e navigazione. Non trattare `transform` come automaticamente gratuito e non inventare risultati mancanti.
- Se trovi repaint, layer troppo grandi, calore o cali di fluidità, riduci dimensioni, numero, opacità o complessità degli orbs **nel solo** `AmbientBackground.vue`; ripeti la misura dopo ogni cambiamento significativo.
- Valuta noise **statico** solo se migliora davvero la composizione e non peggiora costo/contrasto. Non aggiungere dipendenze.

## Output e gate

Fornisci tabella baseline-vs-orbs, ambiente, valori misurati, limiti e giudizio visivo. Indica **GO / NO-GO / INSUFFICIENT DATA** per la rimozione dello Swiper. Esegui `git diff --check` se modifichi il componente. Non fare la pulizia finale in questo step: richiede una decisione esplicita successiva.
