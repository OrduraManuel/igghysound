# Liquid Mesh B03 — Final cutover

## Scope e file

**Esito: GO per la verifica B04 locale.** `src/App.vue` importa staticamente `LiquidMeshBackground.vue` nello stesso slot persistente occupato da Swiper, prima di `NewNav`, `Borders` e `router-view`. Rimossi switch, import asincrono e rendering condizionale B02. `src/main.js` non contiene più la cattura di `background` né l'uso di `sessionStorage` (ora coincide con HEAD). `src/components/swiping.vue` è stato eliminato: era l'unico import di Swiper in `src/`. `npm uninstall swiper --ignore-scripts --no-audit --no-fund` ha rimosso la dipendenza da `package.json` e `package-lock.json`; `npm ls swiper three --depth=0` mostra solo Three 0.180.0.

`src/background/liquidMesh/approved-preset.json` e `shader.js` sono invariati: SHA-1 `8bc40ca0e0b8a86f51f5ab24cac4bc49d6a87bb2` e `e6de47344cd2de1712d81ce22462d2f2c1851275`, identici ai file del playground. I supporti di contrasto B02-R1 in `LiquidMeshBackground.vue`, `btnModal.vue` e `About.vue` restano intatti. Nessuna route, contenuto, navigazione o regola di layout è stata cambiata. Gli asset `public/images/homeHero/` e `carouselz.scss` restano: il CSS globale importa quest'ultimo e cita le immagini; rimuoverli richiederebbe un audit separato. La build aggiorna i file tracciati in `dist/`. **Incidente:** Vite ha svuotato `dist/` e cancellato anche `dist/images/reference-voucher.png`, file non tracciato presente all'inizio; non ne è stata trovata una copia nella repository o in `/private/tmp`. Va ripristinato da una copia esterna, se necessario. Nessun commit.

## Regressione SPA — bundle compilato in Chromium

| Percorso / funzione | Esito | Evidenza |
| --- | --- | --- |
| `/` Home | PASS | Apertura diretta, canvas visibile, logo e navigazione visibili. |
| `/about`, `/services`, `/contact`, `/selections`, `/firstLog` | PASS | Apertura diretta e refresh esplicito; un canvas e zero Swiper in ogni route. Click dalla Home, Back/Forward mantengono lo stesso nodo canvas e un solo contesto iniziale. |
| `/dashboard` senza sessione | PASS guardia | Reindirizza a `/firstLog`; nessun bypass. |
| Dashboard, Tracks, Authors autenticati | NOT RUN | Nessuna sessione di test autorizzata. |
| Contact modal | PASS | A 390 e 1440 px apre/chiude; textarea presente e canvas unico. Invio esterno NOT RUN. |
| Touch e scroll | PASS | Tap su About a 390 px; `.homethis` scorre 0→500 px. A 1440 px la stessa vista ha altezza viewport senza overflow. Hit test sul testo, canvas con `pointer-events: none`. |
| Query legacy e altre query | PASS | `?background=swiper&foo=bar` lascia Liquid Mesh attivo; non viene montato Swiper. Le query non sono riscritte all'accesso diretto. |
| Errori JavaScript | PASS | Nessun `pageerror` nei percorsi verificati. La console segnala ancora il 403 del kit Font Awesome esterno, già riportato in B02. |

Screenshot della SPA compilata a DPR 1 e `prefers-reduced-motion: reduce`, quindi fase shader 0: [Home 390](./screenshots/b03-b04/home-mobile390.png), [Home 768](./screenshots/b03-b04/home-tablet768.png), [Home 1440](./screenshots/b03-b04/home-desktop1440.png), [About 390](./screenshots/b03-b04/about-mobile390.png), [Contact 390](./screenshots/b03-b04/contact-mobile390.png), [Credits 390](./screenshots/b03-b04/credits-mobile390.png), [Login 390](./screenshots/b03-b04/login-mobile390.png). Nella stessa cartella sono presenti About, Contact, Credits e Login a 768 e 1440 px. Confronto visivo qualitativo con gli screenshot B02-R1 alla stessa viewport e fase: luci, centro scuro e supporti locali coincidono; il timing delle altre animazioni DOM impedisce un diff di pagina pixel per pixel.

## Regressione WebGL

| Controllo | Esito / misura |
| --- | --- |
| Canvas, renderer e rAF | PASS: un canvas, una creazione iniziale di contesto osservata e un rAF pendente. La stessa istanza canvas attraversa cinque route, Back e Forward. |
| Animazione | PASS: due catture del solo canvas a 1,5 s di distanza producono PNG diversi. |
| Reduced motion | PASS: zero rAF pendenti al caricamento; passando a `no-preference`, uno. |
| Visibilità | PASS simulato: `document.hidden=true` + evento annulla il rAF (0), il ritorno lo riattiva (1). Transizione reale di scheda NOT RUN. |
| WebGL assente | PASS simulato: `getContext` WebGL restituisce null; zero canvas, host e fallback CSS presenti. |
| Context loss / restoration | PASS simulato con `WEBGL_lose_context`: durante la perdita canvas nascosto, fallback visibile e zero rAF; al ripristino lo stesso canvas è visibile e un rAF riparte. Resize successivo 390×844→844×390 aggiorna il buffer 682×1477→1477×682 a DPR 2. Nessun `pageerror`. Reset GPU reale NOT RUN. |
| Cleanup unmount | PASS: nel bundle compilato `#app.__vue_app__.unmount()` porta canvas 1→0, rAF pendenti 1→0 e rimuove l'host. Il test isolato B01 copre anche teardown dopo context loss. |

Cap fisico: 2.600.000 pixel. Misure sul bundle compilato:

| Viewport | DPR dispositivo | Buffer | Pixel | Esito |
| --- | ---: | ---: | ---: | --- |
| 1440×900 | 1 | 1440×900 | 1.296.000 | PASS |
| 1440×900 | 2 / 3 | 2039×1274 | 2.597.686 | PASS |
| 390×844 | 1 | 390×844 | 329.160 | PASS |
| 390×844 | 2 / 3 | 682×1477 | 1.007.314 | PASS |
| 844×390 | 3 | 1477×682 | 1.007.314 | PASS |

## Build e problemi residui

- **PASS** `npm run type-check`, `npm run build-only`, `git diff --check`. Il bundle contiene preset approvato e Three; ricerca in `src`, manifest, lock e output compilato: nessun riferimento runtime a Swiper o allo switch B02.
- **FAIL baseline** `npm run lint:check`: 23 errori di parsing ES module, stesso numero e tipo di B01/B02-R1; nessuna configurazione ESLint modificata.
- Avvisi preesistenti Vite: URL legacy `hero-bg-4..8.jpg` non risolti dal CSS globale, `eval` in Lottie, chunk grande. Node locale 22/npm 11 differisce da `engines` 18.16.0/npm 9.7.1.
- Safari, telefono fisico, reset GPU reale e Dashboard autenticata **NOT RUN**. Per Dashboard serve una sessione di test autorizzata: accedere normalmente e verificare `/dashboard`, `/dashboard/tracks`, `/dashboard/authors`, tabelle, azioni, modali, scroll, overlay e canvas unico a 390 e 1440 px.

Il cutover è pronto per la verifica locale di produzione B04. Questa raccomandazione non autorizza una pubblicazione remota.
