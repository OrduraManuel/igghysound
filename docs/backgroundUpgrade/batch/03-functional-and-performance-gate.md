# Codex batch 03 — Verifica funzionale e benchmark comparativo

**Comprende:** Step 6 → 7 (`../06-functional-review.md`, `../07-benchmark-refinement.md`). È il gate che prepara la decisione sulla sostituzione definitiva; **non** rimuovere Swiper in questo batch.

## Prerequisiti e vincoli

Leggi `AGENTS.md`, baseline del batch 01 ed esiti del batch 02. Entrambe le varianti devono essere selezionabili: URL normale = Swiper, `?ambient-preview=1` = orbs. Se mancano artefatti o runtime, esegui le verifiche possibili e classifica il risultato come `INSUFFICIENT DATA` quando necessario. Non installare dipendenze, non modificare router/scroll globale e non creare commit.

## Fase 1 — Matrice funzionale

- Prova Home → `/about`, `/services`, `/contact`, `/selections` → Home, Back/Forward e direct link dove possibile, con entrambe le varianti.
- Verifica logo, navigazione perimetrale, back control, CTA, modali Bootstrap, link gallery, scroll Credits e dashboard se accessibile.
- Copri desktop, 960 px, 768 px, mobile stretto e reduced motion. Osserva layering, contrasto nel ciclo completo, assenza di click bloccati e scroll orizzontale.
- Correggi solo regressioni causate dal nuovo background, preferibilmente in `AmbientBackground.vue` o nel suo punto di montaggio. Registra separatamente difetti preesistenti.

## Fase 2 — Prestazioni e rifinitura

- Confronta nelle stesse condizioni Swiper e orbs per 20–30 secondi: avvio, animazione continua, cambio route e scroll Credits. Registra browser, dispositivo, viewport, DPR, condizioni dati/rete, frame time, paint, layer e memoria quando disponibili.
- Usa DevTools Performance/Rendering e, se possibile, Safari/iOS reale. Non inventare numeri; considera i costi di rasterizzazione dei gradienti e di compositing.
- Rifinisci soltanto se un problema è osservato. Riduci dimensioni/numero/opacità prima di aggiungere ottimizzazioni complesse. Noise statico è facoltativo, subordinato a resa e costo misurati.

## Gate e report

Esegui controlli non mutanti pertinenti e `git diff --check` per eventuali correzioni. Restituisci matrice pass/fail/not tested, tabella baseline-vs-orbs, condizioni, file modificati, rischi residui e decisione tecnica `GO / NO-GO / INSUFFICIENT DATA`. Non interpretare `GO` come autorizzazione automatica a eliminare Swiper: consegna prima il confronto alla persona proprietaria del progetto.
