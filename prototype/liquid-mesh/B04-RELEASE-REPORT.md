# Liquid Mesh B04 — Production readiness

## A. Release summary

La build pubblica usa `LiquidMeshBackground.vue` come unico sfondo della shell Vue persistente. B03 ha rimosso lo switch B02 e Swiper (`src/components/swiping.vue`, dipendenza npm). Preset, GLSL, supporti di contrasto B02-R1, route, auth, contenuti, layout e navigazione non sono cambiati. Non sono stati creati commit né eseguite operazioni remote.

## B. Production build

| Verifica | Esito | Evidenza |
| --- | --- | --- |
| `npm run build` (`vue-tsc` + Vite) | PASS | Exit code 0, 130 moduli trasformati, output in `dist/`. |
| `git diff --check` | PASS | Nessun errore whitespace. |
| Dependency audit | PASS | `npm ls swiper three --depth=0`: solo `three@0.180.0`. |
| Output | PASS | `dist/index.html`, due JS (`index-26c6f6de.js`, `main-c48b78ae.js`), CSS `main-e24b6135.css`, favicon e asset `public/`. CSS/JS caricati con URL assoluti `/assets/...`. |
| Contenuto bundle | PASS | Bundle contiene Three, `igghysound-liquid-mesh-preset`, colori approvati `e318e7`/`ff3dcb`, host WebGL. Ricerca in `dist/assets` e `dist/index.html`: assenti Swiper, `igghysound-dev-background`, `background=liquid-mesh`, `liquid-mesh-preview`, `Export Preset`. Il pannello del playground non è importato. |
| Preset/GLSL | PASS | SHA-1 sorgente invariati: `8bc40ca0e0b8a86f51f5ab24cac4bc49d6a87bb2` e `e6de47344cd2de1712d81ce22462d2f2c1851275`. |
| Lint | FAIL baseline | `npm run lint:check`: 23 errori parser ES module già riportati in B01/B02/B02-R1; nessuna nuova configurazione. |

Vite segnala ancora URL CSS `hero-bg-4..8.jpg` mancanti, `eval` in Lottie e chunk oltre 500 kB. Il JS principale misura 1.604,14 kB minificati / 402,26 kB gzip; CSS 6.088,23 kB / 747,88 kB gzip. Non è stato introdotto uno split o refactoring fuori scope. Il test locale usa Node 22.17.1/npm 11.4.2, mentre `package.json` dichiara Node 18.16.0/npm 9.7.1: build su runtime dichiarato **NOT RUN**.

La copia automatica di `public/` porta ancora nel bundle `hero-bg-1..3.jpg` e `imgSlider.png` (circa 5 MB complessivi). `carouselz.scss` contiene riferimenti alle hero; non sono stati cancellati per il vincolo di conservazione degli asset legacy. Nessun import Swiper rimane nel JS/CSS di produzione.

## C. Regression matrix — `vite preview`, Chromium

| Area | 390×844 | 768×1024 | 1440×900 | Note |
| --- | --- | --- | --- | --- |
| Home, canvas, palette, centro scuro, logo, nav | PASS | PASS | PASS | Screenshot DPR 1 in [`screenshots/b03-b04/`](./screenshots/b03-b04/); un canvas, zero Swiper. |
| About, Contact, Credits, Login | PASS | PASS | PASS | Screenshot delle pagine reali; supporti di contrasto locali visibili. |
| Services | PASS apertura diretta | NOT RUN visuale | NOT RUN visuale | Route verificata in B03; screenshot B02-R1 resta riferimento. |
| Navigazione SPA, Back/Forward, accesso diretto e refresh | PASS | NOT RUN specifico | PASS accessi diretti | Cinque route via click hanno mantenuto lo stesso canvas; refresh esplicito su About, Services, Contact, Credits e Login ha mostrato un canvas. Query `background=swiper&foo=bar` inerte. |
| Contact modal | PASS | NOT RUN | PASS | Apertura/chiusura, textarea e canvas unico; invio form NOT RUN. |
| Scroll/touch | PASS | NOT RUN gesto | PASS viewport desktop | Tap About; scroll `.homethis` 0→500 px. |
| `/dashboard` senza login | PASS | NOT RUN | NOT RUN | Redirect a `/firstLog` rispettando la guardia. |
| Dashboard, Tracks, Authors autenticati | NOT RUN | NOT RUN | NOT RUN | Nessuna sessione di test autorizzata; nessun bypass. |
| Safari / telefono fisico | NOT RUN | NOT RUN | NOT RUN | Non disponibili nell'ambiente di verifica. |

Nessun `pageerror` nei percorsi verificati. La console mostra il 403 del kit Font Awesome esterno, già presente in B02 e B02-R1. Non è stata eseguita una nuova misurazione WCAG continua: la correzione e la matrice alle fasi 0/8/16 s sono nel report B02-R1, e qui shader/preset/CSS approvati sono invariati.

## D. Performance e WebGL

- **PASS** animazione: due PNG del canvas acquisiti a 1,5 s di distanza sono diversi.
- **PASS** una creazione iniziale di contesto WebGL, un canvas e un rAF pendente durante la navigazione SPA. `prefers-reduced-motion: reduce` lascia zero rAF; il cambio live riparte con uno.
- **PASS simulato** visibility change: `document.hidden=true` cancella il rAF; al ritorno ne riparte uno. **NOT RUN** transizione reale di tab in background.
- **PASS simulato** WebGL non disponibile: zero canvas, host/fallback statico presenti. Context loss via `WEBGL_lose_context`: canvas nascosto e zero rAF; restore usa lo stesso canvas, riprende il rendering e aggiorna il buffer dopo resize. **NOT RUN** reset GPU reale.
- **PASS** cap 2.600.000 pixel fisici: 1440×900 DPR 1 = 1440×900 / 1.296.000; DPR 2/3 = 2039×1274 / 2.597.686. 390×844 DPR 1 = 390×844 / 329.160; DPR 2/3 = 682×1477 / 1.007.314. 844×390 DPR 3 = 1477×682 / 1.007.314.
- **PASS** teardown dell'intera app compilata: `#app.__vue_app__.unmount()` porta canvas 1→0, rAF pendenti 1→0 e rimuove l'host. Il test B01 copre anche teardown dopo context loss nel wrapper isolato.

## E. Deployment configuration

Repository su `main`, `HEAD=407a72c`, con remote GitHub e branch remoto `origin/release/stage`. **Non c'è prova che uno di questi branch sia il branch di deploy.** Non sono presenti `firebase.json`, `.firebaserc`, config Vercel/Netlify, workflow CI/CD, Dockerfile o script npm `deploy`. `readme.md` non documenta la pubblicazione. Il provider, la pipeline, cache policy e dominio effettivi non sono ricavabili da questa repository. Nessuna operazione remota eseguita.

Build locale: `npm ci` con l'ambiente previsto, poi `npm run build`; output `dist/`. Variabili richieste dal codice: `VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_PROJECT_ID`, `VITE_STORAGE_BUCKET`, `VITE_MESSAGING_SENDER_ID`, `VITE_APP_ID`. `.env.local` è ignorato; non copiare valori nel report. L'hosting deve servire `index.html` per deep link Vue Router (`createWebHistory`) e asset assoluti da `/`; preview Vite gestisce questo fallback localmente, la configurazione remota è **non verificata**. Route e auth non sono state modificate. Prima del deploy identificare provider, branch/pipeline e variabili effettive, configurare fallback SPA e verificare cache per HTML e asset hashati. Senza tali dati non esiste un comando remoto esatto sicuro da proporre.

## F. Rollback

La revisione Git precedente al cutover è `407a72c` (`main`/`origin/main` al momento dell'audit). Contiene lo Swiper originale. È un **candidato di rollback**, non una versione online verificata: B01, B02 e B02-R1 erano modifiche non committate. Non affidarsi alla presenza di Swiper nel codice nuovo.

1. Prima della pubblicazione, registrare commit/artifact **effettivamente attivo in produzione** e conservarne una copia immutabile. Solo questo può essere indicato come versione stabile verificata.
2. In caso di incidente, creare una directory separata dal commit/artifact stabile (`git worktree add --detach /private/tmp/igghysound-rollback 407a72c` solo se quel commit è stato confermato stabile). In quella directory usare il runtime Node/npm dichiarato, `npm ci`, `npm run build` e verificare le route su preview/staging.
3. Ripubblicare l'artifact stabile tramite la **procedura reale del provider**, da definire prima della release; ripristinare eventuali variabili e regole SPA fallback/cache associate. Verificare Home, deep link, login, assets e la presenza dello Swiper sul sito online.
4. Nessun `git reset --hard`, push, merge, pipeline o deploy è stato eseguito.

## G. Known issues e gate residui

- **Incidente locale introdotto in B03:** la pulizia di `dist/` fatta da Vite ha eliminato il file non tracciato `dist/images/reference-voucher.png` presente prima del lavoro. Non è stata trovata una copia nella repository o in `/private/tmp`; serve una copia esterna se va conservato. Non era un asset referenziato dalla SPA, ma la perdita va risolta con il proprietario.
- **Preesistenti:** 23 errori ESLint parser, kit Font Awesome 403, avvisi immagini legacy 4–8, Lottie `eval`, chunk grande.
- **Non verificati:** Dashboard autenticata, Safari, telefono fisico, reset GPU reale, browser lifecycle reale e provider di hosting/SPA fallback/cache. Il codice `:has()` dei supporti B02-R1 è stato verificato in Chromium, non in altri engine.
- **Protocollo Dashboard:** con sessione di test autorizzata aprire `/dashboard`, `/dashboard/tracks`, `/dashboard/authors`; controllare tabelle, azioni, modali, scroll e layering a 390 e 1440 px, Back/Forward e canvas unico. Non modificare login o guardie.

## H. Final release status

**BLOCKED per la pubblicazione remota.** Build e verifiche pubbliche locali sono positive, ma mancano una procedura di deploy identificata, la verifica dell'ambiente remoto/SPA fallback, una sessione Dashboard autorizzata e l'autorizzazione specifica al deploy. Prima di procedere va anche chiarito il recupero del file voucher locale eliminato. Nessun commit, push o deploy.
