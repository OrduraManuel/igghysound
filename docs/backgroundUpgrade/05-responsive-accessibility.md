# Codex prompt — Step 5: responsive e reduced motion

## Prerequisito

Leggi `AGENTS.md` e gli Step 2–4. Controlla i breakpoint già presenti in `src/assets/scss/style.scss`, `src/assets/scss/components/global/sections.scss` e `src/views/Home.vue` prima di scegliere le media query.

## Obiettivo

Adatta la composizione a tablet/mobile e rendi statico il **nuovo background** quando il sistema richiede movimento ridotto.

## Modifica richiesta

- Lavora preferibilmente solo in `src/components/AmbientBackground.vue`. Usa i breakpoint già pertinenti al layout, in particolare 960 px e Bootstrap `md`/768 px; non introdurre un nuovo sistema globale.
- Su tablet ridimensiona/riposiziona le luci. Su mobile mostra due o tre sorgenti meno intense e mantieni una zona centrale scura. Non limitarti a scalare meccanicamente il desktop. Preserva il coral come accento quando visibile.
- Aggiungi `@media (prefers-reduced-motion: reduce)` che disattivi le animazioni degli orbs e lasci una composizione statica gradevole. Non promettere che questa regola disattivi le altre animazioni preesistenti del sito.
- Conserva `aria-hidden="true"` e `pointer-events: none`. Non cambiare logo, typography globale, `#app` overflow o router.

## Verifica e output

Prova almeno desktop, 960 px, 768 px e mobile stretto; includi orientamento mobile, viewport dinamica e scroll Credits se un browser è disponibile. Controlla contrasto di titoli, link, CTA e logo nelle posizioni degli orbs. Emula reduced motion e verifica che gli orbs non si muovano. Esegui `git diff --check`; riferisci file modificati e limiti della verifica.
