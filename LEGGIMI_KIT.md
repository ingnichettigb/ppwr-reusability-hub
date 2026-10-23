<!--
======================================================================
Nome File: LEGGIMI_KIT.md
Percorso: LEGGIMI_KIT.md (radice del kit)
Revisione: Rev. 2.1 (kit rev02: mittente email predefinito)
Data/Ora: 2026-10-06
======================================================================
-->

# KIT ACCESSO CONTROLLATO: rev02

Pacchetto standard per installare il controllo accessi (OTP email → licenza + PUK → condizioni d'uso → quota export PDF)
nelle nuove SaaS. La struttura parte dalla radice `src/`: copia il contenuto della cartella `src/` del kit dentro il `src/` della SaaS.

```text
src/
├── moduli/accesso-controllato/      <- il modulo
│   ├── config.ts                    <- UNICO file da personalizzare (APP_CODE, APP_NAME, ROTTA_HOME; dati fornitore già inseriti)
│   ├── condizioni-uso.ts            <- testo legale completo in IT, EN, DE, ES
│   ├── dizionari.ts                 <- tutti gli altri testi in IT, EN, DE, ES (schermate, errori, email OTP)
│   ├── GUIDA_INSTALLAZIONE.md       <- procedura passo-passo
│   └── esempi-integrazione/         <- esempi (.esempio) di start.ts, Intestazione, uso quota PDF: NON copiare alla cieca
├── routes/                          <- 4 rotte di collegamento: auth, attivazione, condizioni, licenza-scaduta
│   └── _authenticated/route.tsx     <- guardia che avvolge le rotte private con FN047_PortaAccesso
└── integrations/supabase/
    ├── auth-attacher.ts             <- allega il token alle server function (da registrare in start.ts)
    └── auth-middleware.ts           <- verifica il token lato server
```

Per installare: `INSTALLAZIONE_LOVABLE_E_CLAUDE.md` (con Lovable o con Claude Code).

## Novità rev02
- Mittente email predefinito: `EMAIL_MITTENTE` in `config.ts` = `team@corporateboostservice.eu`. Il secret `RESEND_FROM_EMAIL` è ora facoltativo (se presente ha la precedenza).
- Condizioni d'uso: testo esteso in 4 lingue; la vecchia bozza di 4 righe è stata eliminata da `testi.ts`.
- Dati del fornitore in un solo punto: `FORNITORE` in `config.ts`. Nome app e versione si compilano da soli nel testo.
- Versione delle condizioni: il numero mostrato segue `TERMS_VERSION` (prima era fisso "1.0").
- `config.ts`: ripristinati i segnaposto `INSERISCI_QUI_...`; `TERMS_VERSION` parte da `v1`.
- Rotte con titolo basato su `APP_NAME` (non più fisso).
- Documenti allineati al codice reale (quota PDF, adattatore, config, condizioni).
- Tutti i testi in un solo dizionario (`dizionari.ts`, 4 lingue, 57 voci): portati dentro l'email del codice OTP, il segnaposto del PUK e i pulsanti di uscita dell'header. Titoli delle rotte neutri (il titolo tradotto lo imposta la pagina).
- Esempio header: testi dal dizionario del modulo e messaggio ERR900 mostrato all'utente, tradotto.
- Codici errore verificati: registro, dizionari nelle 4 lingue, codice e manuale coincidono; corrette 7 righe della tabella errori del manuale; allineati i messaggi ERR302 (IT, EN) ed ERR012 (DE).

## Non incluso volutamente
`.env`, `routeTree.gen.ts`, `types.ts`, `client.ts`, `client.server.ts`, `previewAuthStorage.ts`, `lib/devAuth.ts`,
`integrations/lovable` e tutto il codice specifico dei singoli programmi. I file Supabase generati esistono già in ogni progetto Lovable Cloud.
