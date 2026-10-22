# Codex prompt — Step 6: verifica funzionale della SPA

## Prerequisito

Leggi `AGENTS.md` e verifica che gli Step 2–5 siano stati completati. Questo prompt è prima di tutto una verifica: non aprire refactoring o bugfix estranei.

## Obiettivo

Accertare che il nuovo background non alteri route, input, scroll, stacking e leggibilità.

## Matrice di verifica

1. Con e senza `?ambient-preview=1`: Home → `/about`, `/services`, `/contact`, `/selections` → Home; Back/Forward e deep link se l'hosting locale lo consente.
2. Logo, navigazione perimetrale, pulsanti indietro, CTA, modali Bootstrap e link gallery restano cliccabili. Prova anche una vista dashboard se accessibile senza credenziali aggiuntive.
3. Desktop, 960 px, 768 px e mobile: nessuno scroll orizzontale; Credits conserva il proprio scroll e ripristino overflow; background resta dietro a navigazione, bordi e contenuto.
4. Controlla visivamente contrasto e leggibilità durante il ciclo degli orbs; verifica reduced motion e screenshot delle due varianti nelle stesse condizioni.

## Ambito e output

Correggi solo difetti **causati dal nuovo background**, preferibilmente in `AmbientBackground.vue` o nel suo punto di montaggio in `App.vue`. Se trovi problemi preesistenti, registrali separatamente. Esegui controlli non mutanti pertinenti e `git diff --check`. Restituisci una matrice pass/fail/not tested con browser, viewport, evidenza, correzioni e rischi residui. Non rimuovere Swiper in questo step.
