# Liquid Mesh B02-R1 · Mobile visual acceptance

## Esito

**La leggibilità delle sei sezioni pubbliche esaminate è adeguata nei viewport e nelle fasi campionate dopo una correzione CSS locale.** Il preset, il GLSL, il renderer e lo switch B02 non sono stati alterati. Swiper rimane il background di produzione. Il Dashboard autenticato non è stato aperto, quindi il **cutover B03 resta NO-GO** finché non sono completate la sua verifica con una sessione autorizzata e l'approvazione visiva del trattamento locale.

## Metodo e soglie

- Audit sulla SPA reale in Chromium, DPR 1, a **360×800, 390×844, 430×932, 768×1024 e 1440×900**. Il browser era in `reducedMotion: reduce`; `renderAtTime(0/8/16)` ha fissato la fase dello shader. Contact a 390 px è stato campionato anche a 4, 12 e 20 s prima della correzione. Dopo circa 2 s di assestamento delle animazioni CSS sono stati acquisiti screenshot dei frame. Gli istanti sono secondi di `uTime`, non tempo di orologio.
- Prima della correzione, i pixel effettivi del canvas sono stati letti con `gl.readPixels`, quindi confrontati con il colore CSS del testo. Dopo la correzione, per includere sfondi CSS, trasparenza, blur e grana nella composizione, il testo è stato nascosto **solo durante uno screenshot di misura**; i pixel sottostanti sono stati campionati nelle linee di testo e confrontati con il colore CSS. I punti coperti dal CTA fisso, dal pulsante Back o da altri elementi sono stati esclusi tramite hit test. Gli screenshot di evidenza mantengono il testo visibile.
- Rapporto di contrasto WCAG 2.2: **4.5:1** per testo normale, **3:1** per testo grande (almeno 24 px regolare o circa 18.66 px grassetto). Per icone e componenti UI si considera **3:1** quando il segno è necessario a comprenderli. Il logo è esente dal requisito per testo. Font effettivi, dimensioni e pesi sono stati letti dal DOM. Criteri: [WCAG Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [WCAG Non-text Contrast](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html).
- Sono state verificate anche le porzioni scorse di About e Services. Il campionamento a griglia di 3–7 px nei rettangoli del testo è conservativo e non equivale a una certificazione WCAG completa. Non sono stati profilati telefoni fisici né ogni istante possibile dell'animazione.

## Diagnosi prima delle modifiche

Il bloom rosa/viola **sinistro** passa dietro i numeri `00./01./02./03.` e i titoli iniziali; quello **destro** può illuminare i paragrafi e i link di About/Services. Lo spostamento delle luci cambia il punto peggiore: a 390 px Contact `Contattami` variava circa **2.1–7.0:1** fra 0 e 20 s; `Vuoi lavorare con me...` scendeva a **1.2–1.4:1**. Il numero `03.` restava fra **1.2 e 1.6:1**. Il titolo bianco/avorio è grande e richiede 3:1; il sottotitolo grigio da 19.24 px, peso 500, richiede 4.5:1. È un problema reale di leggibilità, visibile in [Contact 390 t0](./screenshots/b02-r1/contact-390-t0.png) e [About 390 t8](./screenshots/b02-r1/about-390-t8.png).

| Testo prima della correzione | Viewport/fasi rappresentative | Causa |
| --- | --- | --- |
| Numeri `00.–03.` dei titoli | 360–768 px a 0/8/16 s; anche About e Credits a 1440 px a 0/8/16 s | Nucleo rosa/viola sinistro sotto il testo grigio |
| `IgghySound: Igor Ambrosino`, `Mix & Mastering online`, `Contattami` (titolo) | 360–430 px a 0 e 16 s | Bordo del bloom rosa sinistro; il centro della parola può tornare scuro a 8 s |
| `Mi occupo di Mix & Mastering...`, `Come funziona?`, `Vuoi lavorare con me...` | 360–768 px a 0/8/16 s; About, Services e Contact 1440 px a 8 s | Luce rosa sinistra sotto il grigio normale |
| Paragrafi e link di About/Services, email Contact | 360–768 px soprattutto a 8/16 s; About/Services 1440 px a 8 s | Campi rosa/viola laterali, soprattutto a destra e durante lo scroll |
| CTA mobile `Contattami` e pulsante About | CTA 360–430 px a 0/8/16 s; About 1440 px a 0/8/16 s | Superficie trasparente e linee decorative animate sotto le lettere |

Home mantiene il testo bianco nel centro scuro; le parole rosse `Mix` e `Mastering` sono grandi e restano sopra 3:1 nei cinque viewport. Login usa già un form con sfondo traslucido e blur: titolo/label a 390 e 1440 px misurano almeno **5.95:1**, mentre il pulsante scuro su superficie chiara opaca misura **8.83:1** dai colori computati. Le schermate a 360, 430 e 768 px sono state ispezionate visivamente.

### Matrice di contrasto

I valori indicano il **minimo rappresentativo prima → minimo visibile dopo** nelle fasi 0, 8 e 16 s. Prima si riporta la peggiore linea rilevante sopra il bloom, dopo il minimo dei testi visibili della sezione. La misura del CTA è separata. I valori sono arrotondati e descrivono questo ambiente Chromium/DPR 1.

| Sezione | 360×800 | 390×844 | 430×932 | 768×1024 | 1440×900 | Esito |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Home | ≥4.15 | ≥4.10 | ≥4.28 | ≥4.92 | ≥4.96 | PASS, nessuna correzione |
| About | 1.23 → 5.28 | 1.22 → 5.30 | 1.22 → 5.35 | 1.04 → 5.07 | 1.18 → 5.36 | PASS |
| Services | 1.23 → 5.10 | 1.22 → 5.12 | 1.22 → 5.07 | 1.00 → 4.91 | 1.35 → 5.17 | PASS |
| Contact | 1.23 → 5.15 | 1.22 → 5.16 | 1.22 → 5.23 | 1.18 → 5.30 | 1.82 → 5.29 | PASS |
| Credits, titolo | 1.23 → 7.12 | 1.22 → 7.42 | 1.22 → 7.34 | 1.19 → 6.75 | 1.32 → 8.02 | PASS |
| Login | Visivo PASS | Label ≥5.95 | Visivo PASS | Visivo PASS | Label ≥6.59 | PASS; form invariato |

Il CTA `Contattami` era trasparente su mobile: il bloom e le linee rosse animate attraversavano il testo, con misure fino a circa **1.1:1**. Dopo aver protetto la sola etichetta, il rapporto è **5.42:1** in tutti i cinque viewport alle tre fasi campionate. La decorazione animata del CTA continua a muoversi. Il pulsante `Ascolta i miei lavori` di About aveva una striscia chiara animata sopra il testo: prima della protezione locale misurava **2.76–3.55:1** a 1440 px; dopo il minimo della sezione è 5.36:1. Le label Login e il pulsante sono stati misurati sullo sfondo realmente composto o opaco, non contro il colore base del preset.

## Correzione applicata

Scelta dopo la diagnosi: **supporto scuro sfumato dietro i soli blocchi di testo** di About, Services e Contact e dietro il titolo Credits. Il colore è quello base già approvato (`#090412`), con alfa .92 e blur 14 px. Non copre l'intera viewport e non intercetta input. Il testo e i pulsanti rossi mantengono colore, font, posizione e route. Le etichette dei CTA e del pulsante About hanno un piccolo fondo opaco per impedire alle strisce decorative di passare sotto le lettere.

File interessati in B02-R1:

- `src/components/LiquidMeshBackground.vue`: regole CSS condizionate alla presenza dell'host Liquid Mesh. Il CSS è nel componente asincrono di sviluppo e non compare nel bundle pubblico.
- `src/components/modal/btnModal.vue`: la stringa del CTA è racchiusa in `span.cta-label`, senza modificare testo, target della modal o dimensioni del contenitore.
- `src/views/About.vue`: `span.btn-label` interno al link già esistente, per tenere la decorazione dietro l'etichetta.
- Questo report e gli screenshot in `screenshots/b02-r1/`.

Nessuna modifica a `src/App.vue` oltre alla B02 già presente. Gli SHA-1 del preset e dello shader sono ancora, rispettivamente, `8bc40ca0e0b8a86f51f5ab24cac4bc49d6a87bb2` e `e6de47344cd2de1712d81ce22462d2f2c1851275`, uguali al B01. Lo shader, la distribuzione delle luci, la velocità, la grana e il center dimming non sono stati toccati.

## Evidenze visive

Tutti i file seguenti sono screenshot della SPA reale. Coppie **prima / dopo**: [Contact 390 t0](./screenshots/b02-r1/contact-390-t0.png) / [dopo](./screenshots/b02-r1/contact-390-after-t0.png), [About 390 t8](./screenshots/b02-r1/about-390-t8.png) / [dopo](./screenshots/b02-r1/about-390-after-t8.png), [Services 390 t16](./screenshots/b02-r1/services-390-t16.png) / [dopo](./screenshots/b02-r1/services-390-after-t16.png), [About 1440 t0](./screenshots/b02-r1/about-1440-t0.png) / [dopo](./screenshots/b02-r1/about-1440-after-t0.png).

Sequenza mobile riproducibile a 390×844: [Contact t0](./screenshots/b02-r1/contact-390-after-t0.png), [t8](./screenshots/b02-r1/contact-390-after-t8.png), [t16](./screenshots/b02-r1/contact-390-after-t16.png). Sequenza desktop a 1440×900: [About t0](./screenshots/b02-r1/about-1440-after-t0.png), [t8](./screenshots/b02-r1/about-1440-after-t8.png), [t16](./screenshots/b02-r1/about-1440-after-t16.png). Sono presenti anche screenshot `*-after-*` per le sei sezioni a tutti i cinque viewport; [About scorsa a 390](./screenshots/b02-r1/about-390-scroll-after-t0.png) documenta il testo sotto la piega. [Home mobile](./screenshots/b02-r1/home-390-after-t0.png), [Credits mobile](./screenshots/b02-r1/credits-390-after-t16.png), [Login mobile](./screenshots/b02-r1/login-390-after-t8.png), [Login desktop](./screenshots/b02-r1/login-1440-after-t0.png) e [Contact con Swiper](./screenshots/b02-r1/contact-1440-swiper.png) completano il confronto. Nelle schermate Login l'email precompilata è stata svuotata solo nella pagina di test.

## Regressione funzionale

| Percorso | Verifica | Esito |
| --- | --- | --- |
| `/` Home | Accesso diretto, navigazione dal perimetro, Back/Forward, canvas persistente | PASS |
| `/about` | Tap nav e Back, scroll 0→500 px a 390×844, pulsante verso Credits | PASS |
| `/services` | Tap nav e Back, scroll 0→98 px a 390×844 | PASS |
| `/contact` | Accesso diretto, refresh, tap/click CTA, modal aperta/chiusa su mobile e desktop | PASS |
| `/selections` Credits | Tap nav e Back, scroll 0→135 px, canvas persistente | PASS |
| `/firstLog` Login | Tap nav e Back, input email focalizzabile e modificabile | PASS; login effettivo NOT RUN |
| `/dashboard` | Senza sessione, guardia reindirizza a `/firstLog` mantenendo Liquid Mesh | PASS guardia; contenuto autenticato NOT RUN |

Durante la navigazione mobile il nodo canvas è rimasto identico, con **1 canvas Liquid Mesh e 0 Swiper**. Back/Forward hanno mantenuto lo stesso nodo. Il cambio URL a `?background=swiper` mostra **0 canvas e 1 Swiper**; tornando a `?background=liquid-mesh` riappare **1 canvas e 0 Swiper**. `?foo=bar` sopravvive agli accessi diretti/refresh; i router-link continuano a usare il comportamento B02. Il CTA Swiper apre ancora la modal e la sua label resta trasparente. Nessun `pageerror`; la console mostra il **403 del kit Font Awesome esterno**, già documentato in B02, a ogni caricamento.

## Build e limiti

- **PASS** `npm run type-check`, `npm run build-only -- --outDir /tmp/igghysound-b02-r1-build-final`, `git diff --check`.
- **PASS** controllo degli asset di produzione: nessuna occorrenza di `liquid-mesh-background`, `igghysound-dev-background`, `igghysound-liquid-mesh-preset` o `liquid-mesh-preview`. La preview resta esclusiva di sviluppo.
- **FAIL baseline** `npm run lint:check`: 23 errori di parser ES module, stesso numero e tipo del B01/B02; nessun nuovo refactoring/config ESLint. Il build conserva gli avvisi preesistenti per immagini hero 4–8 mancanti, `eval` in Lottie e chunk grande.
- **NOT RUN** Dashboard autenticato, invio Login/Contact verso servizi esterni, test su telefono fisico, audit continuo di tutti i frame, confronto font su altri sistemi e browser diversi da Chromium. Il CSS locale usa `:has()`; in B02-R1 è stato verificato nel Chromium usato per gli screenshot, non su altri engine. A 1440 px il CTA desktop passa visivamente sopra l'ultima riga di About: era presente nella geometria B02; non è stato spostato perché fuori scope.

### Protocollo Dashboard autorizzato

Con un account di test autorizzato, aprire `/dashboard?background=liquid-mesh`, poi `/dashboard/tracks` e `/dashboard/authors`. Verificare tabella, pulsanti, eventuali modali, scroll, contrasto a 390 e 1440 px, canvas unico e persistenza durante Back/Forward. Ripetere con `?background=swiper`, poi tornare a Liquid Mesh. Non usare bypass della guardia né credenziali nel report. Nessuna sessione autorizzata era disponibile in B02-R1.

## Raccomandazione

**NO-GO per il cutover B03 adesso.** Le sezioni pubbliche e lo switch sono pronti per la revisione visiva del supporto locale; servono l'approvazione di questa resa e il protocollo Dashboard autenticato prima di sostituire Swiper. Nessun cutover o commit è stato eseguito.
