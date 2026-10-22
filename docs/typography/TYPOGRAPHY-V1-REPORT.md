# IgghySound — Typography V1

## Esito

La selezione finale richiesta è implementata nella SPA reale: **Six Caps 400** per `Mix`/`Mastering`, **Antonio 400** per le quattro etichette testuali della navigazione (`IgghySound`, `Mix & Mastering`, `Credits`, `Contattami`), **Space Grotesk 300** per `Engineer`, **Big Shoulders Display 700** per i titoli About/Services/Contact/Credits, **Space Grotesk 400** per corpo e paragrafi e **Space Grotesk 600** per gli altri CTA pubblici. Non è stato creato lo switch A/B, superato dalla selezione definitiva. Nessun commit o deploy.

## Tipografia precedente e file coinvolti

Prima dell'intervento gli SCSS dichiaravano Montserrat per Hero, navigazione e titoli, Raleway 500 per body/paragrafi e un link Google Fonts a Roboto in `index.html`. Montserrat e Raleway non erano caricati dal progetto; il loro rendering dipendeva dal fallback del browser. Il font locale `Swistblnk-Monthoers` non aveva una regola `@font-face` attiva. La scala tipografica era distribuita negli SCSS; `variables.scss` aveva token per colori e geometrie ma nessun token font.

File modificati in V1:

- `index.html`: rimosso il caricamento Roboto non usato.
- `src/main.js`: import singolo di `src/assets/scss/fonts.scss`.
- `src/assets/scss/fonts.scss` e quattro WOFF2 in `src/assets/font/`: quattro famiglie self-hosted; quattro file `OFL-*.txt` conservano le licenze.
- `src/assets/scss/variables.scss`: cinque token semantici `--font-hero`, `--font-navigation`, `--font-heading`, `--font-body`, `--font-ui`.
- `src/assets/scss/components/pages/home.scss`: dimensioni e proporzioni Hero; le animazioni e il markup restano gli stessi.
- `src/assets/scss/components/global/navigation.scss`: Antonio per le quattro etichette testuali del perimetro; icone e controlli di autenticazione mantengono i propri stili.
- `src/assets/scss/components/global/heading.scss`: Big Shoulders per About/Services/Contact/Credits; titoli secondari Services/Contact in Space Grotesk 600.
- `src/assets/scss/components/_layout.scss`: body e paragrafi Space Grotesk 400; letter-spacing dei paragrafi `.05em`→`.02em` per le nuove metriche, dimensioni e line-height invariati.
- `src/assets/scss/components/global/btnCta.scss`, `src/views/About.vue`, `src/components/modal/modalContact.vue`: Space Grotesk 600 nei CTA pubblici, nel link `Ascolta i miei lavori` e nel pulsante della modal. Lo stile CTA globale è limitato alle tre sezioni pubbliche e al CTA mobile teleportato.

Le modifiche già presenti nel working tree prima di V1 (Liquid Mesh, B02-R1, B03/B04, `dist/`, documentazione e preset) sono state preservate. V1 non ha cambiato routing, componenti di navigazione, contenuti, shader, logo o palette.

## Font, licenze e caratteri

| Famiglia | Peso usato | File WOFF2 Latin | Licenza |
| --- | --- | ---: | --- |
| Six Caps | 400 | 14.376 B | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/sixcaps/OFL.txt) |
| Antonio | 400 | 11.016 B | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/antonio/OFL.txt) |
| Big Shoulders Display | 700 | 14.340 B | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/bigshouldersdisplay/OFL.txt) |
| Space Grotesk | file variabile 300–600 | 22.288 B | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/spacegrotesk/OFL.txt) |

Totale asset font: **62.020 B**, senza dipendenze npm aggiunte. Le quattro regole `@font-face` usano `font-display: swap` e fallback `sans-serif`. I file Latin di Google Fonts coprono `U+0000–00FF` e `U+2000–206F`: comprendono vocali accentate italiane e apostrofi tipografici. `document.fonts.check()` è risultato positivo per `àèéìòù’`; le stringhe italiane delle pagine sono state controllate visivamente. Non sono stati inclusi file Latin Extended o pesi statici ridondanti.

## Resa e proporzioni

La Hero usa la proporzione naturale di Six Caps, senza `scaleX()`. `Mix`/`Mastering` hanno `clamp(5.7rem, 8vw, 6.5rem)`, line-height `.78`, letter-spacing `.035em`; `Engineer` usa Space Grotesk 300 con spaziatura leggermente stretta. Il blocco rimane centrato, il testo e i colori sono invariati. Antonio conserva orientamento, posizione, hover e link delle quattro etichette testuali; tutte usano `1.35rem` e letter-spacing `.08em`. I quattro titoli di sezione usano `2.45rem` desktop e `2.1rem` fino a 960 px, senza cambiare numero, separatore o markup semantico.

La scelta è diversa dalla precedente proposta A/B: Six Caps dà alla Hero la verticalità più marcata, mentre Antonio resta leggibile nelle etichette del perimetro. I due ruoli sono espliciti nei token; non esiste una variante runtime aggiuntiva.

## Screenshot e responsive

Screenshot della SPA reale in Chromium, DPR 1, font caricati, `prefers-reduced-motion: reduce` per rendere stabile il Liquid Mesh. La fase dello shader non è stata alterata.

| Sezione | 360×800 | 390×844 | 768×1024 | 960×900 | 1440×900 |
| --- | --- | --- | --- | --- | --- |
| Home | [360](./screenshots/home-360.png) | [390](./screenshots/home-390.png) | [768](./screenshots/home-768.png) | [960](./screenshots/home-960.png) | [1440](./screenshots/home-1440.png) |
| About | [360](./screenshots/about-360.png) | [390](./screenshots/about-390.png) | [768](./screenshots/about-768.png) | [960](./screenshots/about-960.png) | [1440](./screenshots/about-1440.png) |
| Services | [360](./screenshots/services-360.png) | [390](./screenshots/services-390.png) | [768](./screenshots/services-768.png) | [960](./screenshots/services-960.png) | [1440](./screenshots/services-1440.png) |
| Contact | [360](./screenshots/contact-360.png) | [390](./screenshots/contact-390.png) | [768](./screenshots/contact-768.png) | [960](./screenshots/contact-960.png) | [1440](./screenshots/contact-1440.png) |
| Credits | [360](./screenshots/credits-360.png) | [390](./screenshots/credits-390.png) | [768](./screenshots/credits-768.png) | [960](./screenshots/credits-960.png) | [1440](./screenshots/credits-1440.png) |

Ulteriori verifiche: [Login mobile](./screenshots/login-390.png), [Login desktop](./screenshots/login-1440.png), [modal Contact mobile](./screenshots/contact-modal-390.png), [modal Contact desktop](./screenshots/contact-modal-1440.png). Gli input Login sono stati svuotati nella pagina di test prima di acquisire gli screenshot; nessun login è stato eseguito.

| Viewport | Six Caps `Mastering` | Overflow orizzontale documento / `#app` | Esito visivo |
| --- | ---: | ---: | --- |
| 360×800 | 74,1 px | 0 / 0 px | PASS: titolo su due righe in About, senza clipping; Hero separata da Credits. |
| 390×844 | 74,1 px | 0 / 0 px | PASS: titoli, CTA mobile e scroll leggibili. |
| 768×1024 | 68,4 px | 0 / 0 px | PASS: markup Hero desktop, frame e testi allineati. |
| 960×900 | 76,8 px | 0 / 0 px | PASS alla soglia dello scroll/frame. |
| 1440×900 | 110,5 px | 0 / 0 px | PASS: Hero incisiva, nessuna collisione visibile tra `Engineer` e `Credits`. |

Il controllo DOM e visivo non ha trovato `Mastering` fuori viewport, testo tagliato, sovrapposizioni di titoli o perdita di interattività alle dimensioni campionate. I supporti di contrasto B02-R1 restano attivi. Dopo la correzione richiesta, le quattro etichette della navigazione hanno identici font, peso, dimensione e letter-spacing computati in tutte e cinque le viewport. Il titolo Credits usa Big Shoulders Display 700 con le stesse regole di About, Services e Contact. Gli screenshot Home/Credits nella tabella sono stati aggiornati dopo la correzione; overflow orizzontale documento e `#app` rimane 0 px in tutti i campioni.

## Funzioni, performance e build

- **PASS**: tap Home→About a 390 px, apertura/chiusura modal Contact, input Login visibili, canvas Liquid Mesh unico, redirect della guardia `/dashboard`→`/firstLog` senza sessione. Nessun `pageerror` nei percorsi testati. Dashboard autenticata **NOT RUN**: nessuna sessione autorizzata.
- **PASS**: build di produzione avviata con `vite preview`; Home e About usano i font attesi e i quattro WOFF2 rispondono 200 al primo caricamento. Dopo un nuovo caricamento alcune risposte sono 304; nessuna richiesta a Google Fonts. Quattro `@font-face` nel CSS compilato.
- **PASS**: `npm run type-check`, `npm run build-only -- --outDir /private/tmp/igghysound-typography-v1-build`, `git diff --check`, ripetuti dopo la correzione Credits/Contattami. Output: quattro WOFF2, CSS 6.130,51 kB minificati / 756,40 kB gzip, JS principale 1.604,15 kB / 402,27 kB gzip. La grandezza CSS deriva soprattutto dal `additionalData` Sass preesistente; nessun refactoring eseguito. `dist/` tracciato non è stato aggiornato da questa build in `/private/tmp`.
- **PASS campione Chromium**: un caricamento freddo a 390 px ha registrato un layout shift cumulativo di circa `0,0015` prima di interazioni; la misura non isola il contributo dei font dalle animazioni/UI esistenti. `font-display: swap` può mostrare temporaneamente il fallback.
- **FAIL baseline** `npm run lint:check`: 23 errori di parsing ES module già documentati nei report Liquid Mesh. Console: 403 del kit Font Awesome esterno preesistente. Avvisi Vite per immagini hero 4–8, Lottie `eval` e chunk grande già presenti.

## Limiti e raccomandazione

Safari, dispositivo mobile fisico e Dashboard autenticata **NOT RUN**. Il preset Liquid Mesh corrente ha SHA-1 `e1b91d9c04983aac89483db022f2864e53873c08`, diverso dalla baseline B03 per modifiche locali esterne a V1; lo shader resta `e6de47344cd2de1712d81ce22462d2f2c1851275`. V1 non ha modificato nessuno dei due. Per questo un confronto pixel per pixel con screenshot Liquid Mesh delle fasi precedenti non sarebbe attendibile.

**Raccomandazione: mantenere la selezione finale Six Caps/Antonio e sottoporre queste proporzioni al controllo visivo del proprietario.** Le verifiche desktop/mobile Chromium e la build sono positive. Nessun deploy o commit è stato eseguito.
