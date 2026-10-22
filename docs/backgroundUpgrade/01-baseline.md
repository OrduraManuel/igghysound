# Codex prompt — Step 1: baseline dello Swiper

## Contesto

Lavora nella repository IgghySound. Leggi prima `AGENTS.md`. Il background attuale è `src/components/swiping.vue`, montato in `src/App.vue` prima di navigazione, bordi e `router-view`. Questo step precede qualsiasi modifica al background.

## Obiettivo

Raccogli una baseline riproducibile dell'aspetto, del comportamento e delle prestazioni dello Swiper esistente. Questo step è **read-only**: non modificare file della repository, non installare dipendenze e non creare commit.

## Attività

1. Verifica nel codice versione di Vue/Vite/Swiper, slides, autoplay, overlay, asset, layering e scroll; annota percorsi e righe. Non dare per attivo il CSS storico senza verificarne l'uso.
2. Se un browser locale e l'app sono avviabili senza alterare file tracciati, acquisisci screenshot e profili sulla home, `/about`, `/services`, `/contact`, `/selections` e, se accessibile senza credenziali aggiuntive, dashboard. Copri desktop, 960 px, 768 px e un mobile stretto. Prova Home → sezione → Home, Back/Forward e scroll Credits.
3. Registra browser/versione, viewport, DPR, dispositivo o emulazione, condizioni di rete, durata della registrazione, stato dei dati Firebase e presenza di errori preesistenti. Misura frame time, paint, layer e memoria solo se gli strumenti sono disponibili. Non inventare numeri.
4. Descrivi quali aree dello schermo restano scure per il testo e se lo sfondo intercetta input o causa scroll orizzontale.

## Output e gate

Restituisci in chat una tabella di baseline con osservazioni **VERIFIED / INFERRED / UNAVAILABLE**, condizioni di misura ed eventuali artefatti temporanei. Se il runtime non è disponibile, consegna la baseline statica e indica esattamente quali misure mancano. Non passare alla modifica del componente in questo prompt.
