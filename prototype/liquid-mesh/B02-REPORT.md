# Liquid Mesh B02 · Shell Preview

## A. Implementazione

La SPA reale monta lo sfondo nello slot persistente di `src/App.vue`, prima di `NewNav`, `Borders` e `router-view`. Un `v-if` esclusivo monta **LiquidMeshBackground oppure Swiping**, mai entrambi. Il componente WebGL viene caricato con un import asincrono condizionato da `import.meta.env.DEV`; preset, shader, renderer, palette e parametri B01 non sono stati modificati.

File di codice modificati: `src/App.vue` (switch della shell) e `src/main.js` (cattura della query prima che una guardia possa reindirizzare). Questo report, `INTEGRATION-PLAN.md` e gli screenshot B02 sono documentazione/evidenze. Nessuna route, view, navigazione, cornice, contenuto o stile globale è stato modificato.

Le modifiche già presenti a `package.json` e `package-lock.json` appartengono alla fase precedente e non sono state toccate in B02.

## B. Selettore di sviluppo

Con `npm run dev`, aprire `/?background=liquid-mesh` per WebGL o `/?background=swiper` per lo sfondo originale. Funziona anche su URL di sezione, per esempio `/contact?foo=bar&background=liquid-mesh`. I parametri già presenti non vengono riscritti. Un valore assente o sconosciuto lascia la scelta corrente; in una nuova sessione il default è Swiper.

La scelta esplicita viene conservata in `sessionStorage` **per la sola scheda di sviluppo**. Così i `router-link` esistenti, che non propagano le query, possono cambiare route senza smontare il background. `src/main.js` registra l'eventuale scelta nell'URL prima dell'avvio del router: un accesso diretto a `/dashboard?background=liquid-mesh` mantiene la preview anche se la guardia reindirizza a `/firstLog`. Lo switch può essere invertito con `?background=swiper`, anche durante la stessa sessione. Nessun controllo UI o nuovo state manager è stato aggiunto.

Il build di produzione non contiene le stringhe `igghysound-dev-background`, `liquid-mesh-background`, `igghysound-liquid-mesh-preset` o il codice del renderer. La query non ha quindi effetto nel bundle pubblico; Swiper resta il default e l'unico background pubblico.

## C. Matrice di regressione route

Test su Chromium con la SPA Vite, usando click desktop, tap mobile e accesso diretto. Il canvas Liquid Mesh è rimasto **lo stesso nodo** attraversando Home, About, Services, Contact, Credits, Login e Back/Forward. Ogni route mostrava un canvas e zero Swiper; la modalità Swiper mostrava zero canvas e uno Swiper.

| Route | Apertura, navigazione e interazione | Esito |
| --- | --- | --- |
| `/` Home | Accesso diretto, logo, link per le sezioni, Back/Forward; scelta default e rollback | PASS |
| `/about` | Click/tap nav, `toBack`, refresh diretto; gesto touch scroll 0→552 px a 390×844 | PASS |
| `/services` | Click/tap nav, `toBack`, refresh diretto; contenuto mobile scrollabile | PASS |
| `/contact` | Click/tap nav, `toBack`, refresh diretto; modal Bootstrap aperto/chiuso su desktop e mobile con entrambi gli sfondi | PASS |
| `/selections` Credits | Click/tap nav, `toBack`, refresh diretto; gallery e scroll; `#app.style.overflow` passa a `auto` e torna a `hidden` all'uscita | PASS |
| `/firstLog` Login | Click/tap nav, `toBack`, refresh diretto; input email toccabile e focalizzabile | PASS; invio credenziali NOT RUN |
| `/dashboard` | Accesso diretto senza autenticazione reindirizza a `/firstLog`; query Liquid Mesh preservata nella sessione | PASS per guardia; Dashboard autenticato NOT RUN |

I link esterni delle card Credits, email/Instagram e l'invio del form Contact non sono stati attivati per evitare azioni esterne. Non si sono verificati errori JavaScript di pagina nel percorso di test. La console mostra il `403` del kit Font Awesome esterno sia con Swiper sia con Liquid Mesh.

## D. Evidenza visiva e stacking

Screenshot della **SPA reale** a DPR 1 e reduced motion, per mantenere il frame WebGL a `uTime=0`. Home è stata acquisita con entrambi gli sfondi a 390×844, 768×1024, 960×900 e 1440×900:

| Viewport | Liquid Mesh | Swiper |
| --- | --- | --- |
| 390×844 | [mobile](./screenshots/b02-home-mobile390-liquid-mesh.png) | [mobile](./screenshots/b02-home-mobile390-swiper.png) |
| 768×1024 | [tablet](./screenshots/b02-home-tablet768-liquid-mesh.png) | [tablet](./screenshots/b02-home-tablet768-swiper.png) |
| 960×900 | [soglia](./screenshots/b02-home-boundary960-liquid-mesh.png) | [soglia](./screenshots/b02-home-boundary960-swiper.png) |
| 1440×900 | [desktop](./screenshots/b02-home-desktop1440-liquid-mesh.png) | [desktop](./screenshots/b02-home-desktop1440-swiper.png) |

Le altre sezioni sono state acquisite con entrambi gli sfondi su mobile e desktop. Esempi Liquid Mesh: [About mobile](./screenshots/b02-about-mobile390-liquid-mesh.png), [Services mobile](./screenshots/b02-services-mobile390-liquid-mesh.png), [Contact mobile](./screenshots/b02-contact-mobile390-liquid-mesh.png), [Credits mobile](./screenshots/b02-credits-mobile390-liquid-mesh.png), [Login mobile](./screenshots/b02-login-mobile390-liquid-mesh.png), [Contact desktop](./screenshots/b02-contact-desktop1440-liquid-mesh.png), [modal mobile](./screenshots/b02-contact-modal-mobile390-liquid-mesh.png), [redirect Dashboard desktop](./screenshots/b02-dashboard-guard-desktop1440-liquid-mesh.png). I corrispondenti file `b02-<sezione>-<viewport>-swiper.png` sono nella stessa directory.

Audit DOM/CSS misurato su Contact desktop: host WebGL `fixed`, `z-index: 0`, `pointer-events: none`; canvas `pointer-events: none`; nav `fixed`, `z-index: 1`; Borders `fixed`, `z-index: 2`, `pointer-events: none`; vista `.homethis` `relative`, `z-index: 9`; modal `z-index: 1055` e backdrop `1050`. Un hit test all'interno del modal ha raggiunto il textarea, e click/tap su nav, back, CTA e login hanno funzionato. Nessun nuovo livello globale è stato introdotto.

La composizione mantiene logo, frame, luci periferiche e centro scuro. **Rischio visivo da approvare:** a 390 px i titoli/testi bianchi all'inizio di About, Services e Contact passano sul bloom rosa in alto a sinistra, riducendo localmente il contrasto rispetto ad alcune immagini Swiper. Non ho cambiato shader, preset o overlay. Gli screenshot Swiper non sono confrontabili pixel per pixel perché l'autoplay mostra slide diverse.

## E. Verifica WebGL nella SPA

| Verifica | Esito |
| --- | --- |
| Un renderer/canvas e un loop rAF | PASS: una creazione WebGL e un rAF pendente con Liquid Mesh attivo; nessun secondo canvas/renderer durante le route. |
| Switch a Swiper e ritorno | PASS: zero canvas e controller distrutto con zero rAF programmati; nuovo mount crea un solo canvas. Listener WebGL del canvas e listener `MediaQueryList.change` tornano a zero allo switch. |
| Reduced motion | PASS: cambio live ferma il loop, rende il frame statico a `uTime=0`; riattivazione riprende un solo loop. |
| Visibilità | PASS con evento sintetico: `document.hidden=true` ferma il loop; `false` lo riavvia. Il browser headless non ha fornito una transizione reale di tab nascosta. |
| WebGL non disponibile | PASS con `getContext` bloccato: zero canvas, fallback CSS, hero e logo visibili, nessun errore JavaScript. |
| Context loss/restoration | PASS con `WEBGL_lose_context`: fallback visibile, rAF fermo; restore sullo stesso canvas, rAF ripreso, resize e route successivi funzionanti, screenshot post-restore riuscito. |
| Switch durante context loss | PASS: il passaggio a Swiper distrugge il controller perso, lascia zero canvas e zero frame; il ritorno a Liquid Mesh crea un solo canvas. |
| Scroll e touch | PASS: tap su route, CTA e input; gesto touch su About ha portato `.homethis.scrollTop` da 0 a 552 px senza ricreare il canvas. |

Dimensioni fisiche misurate nel contesto SPA (cap 2.600.000 pixel):

| Viewport / DPR | Drawing buffer | Pixel | Esito |
| --- | ---: | ---: | --- |
| 390×844 / 2 e 3 | 682×1477 | 1.007.314 | PASS |
| 768×1024 / 2 | 1344×1792 | 2.408.448 | PASS |
| 960×900 / 2 | 1665×1561 | 2.599.065 | PASS |
| 1440×900 / 2 e 3 | 2039×1274 | 2.597.686 | PASS |

Resize dinamico a 959, 960 e 961 px ha mantenuto lo stesso canvas; il normale `#app` overflow mobile è `auto` fino a 960 px e torna `hidden` a 961 px. La composizione WebGL si aggiorna senza remount.

## F. Build

- **PASS** `npm run type-check`.
- **PASS** `npm run build-only -- --outDir /tmp/igghysound-b02-build`. Restano gli avvisi esistenti sulle immagini hero legacy mancanti, `eval` in Lottie e dimensione del bundle.
- **FAIL baseline** `npm run lint:check`: 23 errori di parsing `import`/`export` in file esistenti e output `dist`, lo stesso numero e problema documentati in B01; nessuna configurazione ESLint globale è stata cambiata.
- **PASS** `git diff --check`; preset e shader mantengono gli hash B01.

## G. Problemi aperti

**Della preview:** contrasto dei titoli mobile sui bloom luminosi da approvare visivamente nel contesto della SPA. Il comportamento è una conseguenza della composizione già approvata, non una modifica di parametri B02.

**Preesistenti o esterni:** il kit Font Awesome risponde `403` anche con Swiper; la guardia di `/dashboard` reindirizza i non autenticati al login; i dati Credits arrivano in modo asincrono da Firebase e l'altezza della gallery varia durante il caricamento; lint globale non configurato per ES modules. Nessuno di questi è stato alterato.

**Non verificati:** Dashboard autenticato e relative tabelle, reset GPU reale, profiling su telefono fisico e runtime del bundle di produzione. Il tentativo di avviare una seconda Vite preview sulla porta 8084 è stato respinto dall'ambiente con `listen EPERM`; l'assenza del codice di sviluppo nel bundle è stata verificata sugli asset compilati.

## H. Raccomandazione

**NO-GO per il cutover definitivo in questa fase.** La shell preview è funzionale e reversibile; prima di sostituire Swiper serve la revisione visiva dei titoli mobile sul bloom e una verifica del Dashboard con una sessione autorizzata. Il cutover rimane una fase separata e Swiper resta disponibile.
