# Codex prompt — Step 8: sostituzione definitiva e pulizia

## Gate obbligatorio

Esegui questo prompt solo dopo una decisione **esplicita** di adottare gli Ambient Radial Orbs e dopo aver letto il confronto dello Step 7. Se l'esito è NO-GO, mancano dati essenziali o non c'è la decisione, fermati senza modificare file e riferisci cosa manca. Leggi `AGENTS.md`.

## Obiettivo

Rendere gli orbs l'unico background della shell, rimuovendo il flag temporaneo e l'implementazione Swiper esclusivamente dopo avere verificato tutti i consumer.

## Attività

1. Cerca nuovamente tutti gli import/usi di `swiper`, `Swiping`, classi `.kenburns-slide-*` e asset correlati. Non assumere che la ricerca del precedente audit sia ancora valida.
2. In `src/App.vue`, monta `AmbientBackground` nella posizione attuale e rimuovi flag/query preview e import di `Swiping`; lascia invariati `NewNav`, `Borders`, dati e `router-view`.
3. Rimuovi `src/components/swiping.vue` solo se non ha altri consumer. Considera `src/assets/scss/components/global/carouselz.scss` e `swiper` in `package.json`/lockfile **solo** dopo aver verificato che non servano ad altro; evita la cancellazione indiscriminata di CSS o asset storici. Le modifiche alle dipendenze sono parte di questo step, non dei precedenti.
4. Verifica Home e tutte le route pubbliche, Back/Forward, Credits/scroll, CTA/modali, dashboard accessibile, responsive e reduced motion. Esegui type-check/build/lint non mutante dove possibile e `git diff --check`; distingui errori preesistenti.

## Output

Riporta file rimossi/modificati, consumer verificati, risultati dei controlli, regressioni residue e rollback concreto tramite il diff/revisione precedente. Non creare commit o distribuire il sito salvo autorizzazione separata.
