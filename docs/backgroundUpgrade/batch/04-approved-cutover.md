# Codex batch 04 — Cutover approvato e pulizia

**Comprende:** Step 8 (`../08-final-cutover.md`). Rimane un batch separato perché dipende dall'esito del batch 03 e da una decisione esplicita; accorparlo ai benchmark eliminerebbe il punto di controllo umano.

## Gate di ingresso

Leggi `AGENTS.md` e il report del batch 03. Procedi **solo** se la persona proprietaria ha deciso esplicitamente di adottare gli Ambient Radial Orbs e le verifiche essenziali sono `GO`. Se manca la decisione, è `NO-GO` o i dati sono insufficienti, fermati senza modifiche e riferisci cosa manca.

## Lavoro autorizzato da questo batch, dopo il gate

1. Cerca di nuovo tutti i consumer di `Swiper`, `Swiping`, CSS `.kenburns-slide-*` e asset associati. Verifica che non siano emersi usi nuovi.
2. In `src/App.vue`, rimuovi il flag `ambient-preview` e monta stabilmente `AmbientBackground` nel punto dello Swiper. Non cambiare navigazione, bordi, fetch, flash message, router o `router-view`.
3. Rimuovi `src/components/swiping.vue` se davvero senza consumer. Valuta la pulizia del CSS storico e la dipendenza `swiper`/lockfile solo dopo ricerca completa; conserva codice e asset che servono ad altro. Evita refactoring collaterali.
4. Riesegui controlli di compilazione e verifica Home, route pubbliche, Back/Forward, Credits/scroll, CTA, modali, dashboard accessibile, desktop/mobile e reduced motion. Confronta con il risultato approvato del batch 03.

## Output

Esegui `git diff --check`. Consegna elenco completo dei file modificati/rimossi, consumer verificati, esiti dei controlli, rischi residui e rollback concreto tramite diff/revisione precedente. Non creare commit e non distribuire il sito senza una richiesta separata.
