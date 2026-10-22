# Codex prompt — Step 3: integrazione reversibile nella shell

## Prerequisito

Leggi `AGENTS.md`, verifica che `src/components/AmbientBackground.vue` dello Step 2 esista e comprendi `src/App.vue`, `src/components/swiping.vue`, `src/assets/scss/components/global/navigation.scss` e `src/assets/scss/components/global/sections.scss`.

## Obiettivo

Integra lo sfondo ambientale nello stesso punto dello Swiper, conservando entrambi per il confronto. Una sola implementazione deve essere montata alla volta.

## Modifica richiesta

- Modifica **solo** `src/App.vue`, salvo una correzione indispensabile nel nuovo componente.
- Usa un flag temporaneo semplice: `?ambient-preview=1` seleziona gli orbs al caricamento; senza parametro resta lo Swiper. Puoi leggere `window.location.search` una volta in `<script setup>`. Il flag non deve creare una route, cambiare History API o interferire con altri query parameter.
- Importa il nuovo componente e usa `v-if`/`v-else` nello slot attuale di `<Swiping />`; mantieni intatti `NewNav`, `Borders`, flash message, fetch Pinia e `router-view`. Evita di montare entrambe le versioni contemporaneamente.
- Non cambiare la palette del logo, lo scroll globale o il CSS di navigazione.

## Verifica e output

Verifica che URL senza parametro mostri lo Swiper e URL con `ambient-preview=1` mostri gli orbs su `/` e su una route interna. Prova Home → sezione → Home e Back/Forward; il flag può restare fisso per la durata della sessione SPA. Se il browser non è disponibile, indica la verifica manuale pendente. Esegui controlli non mutanti appropriati e `git diff --check`. Riporta file modificati, risultato e istruzione di rollback: rimuovere il parametro o tornare al ramo Swiper.
