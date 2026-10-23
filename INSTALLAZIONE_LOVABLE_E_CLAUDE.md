<!--
======================================================================
Nome File: INSTALLAZIONE_LOVABLE_E_CLAUDE.md
Percorso: INSTALLAZIONE_LOVABLE_E_CLAUDE.md (radice del kit)
Revisione: Rev. 2.1 (kit rev02: mittente email predefinito)
Data/Ora: 2026-10-06
======================================================================
-->

# INSTALLARE IL KIT ACCESSO CONTROLLATO (rev02)
## Metodo A: con Lovable — Metodo B: con Claude (Claude Code)

Questo documento spiega come installare il kit in una nuova SaaS. Per i dettagli tecnici di ogni passo
vedi `src/moduli/accesso-controllato/GUIDA_INSTALLAZIONE.md`.

---

## 0. Preparazione (uguale per entrambi i metodi)

Prima di iniziare tieni pronti questi dati. Senza, l'accesso non funziona.

| Dato | Dove si ottiene | Note |
| :--- | :--- | :--- |
| **APP_CODE** della nuova app | Lo scegli tu (es. `061NuovaApp`) | Va registrato nella tabella `licenses` del database centrale |
| **Nome app** (`APP_NAME`) | Lo scegli tu | Compare a video e nelle email |
| **Pagina iniziale** (`ROTTA_HOME`) | Pagina della nuova app dopo il login | Deve stare sotto `_authenticated` |
| `EXTERNAL_SUPABASE_URL` | Database centrale delle licenze | Secret |
| `EXTERNAL_SUPABASE_SERVICE_ROLE_KEY` | Database centrale delle licenze | Secret, riservata |
| `RESEND_API_KEY` | Account Resend | Secret |
| `RESEND_FROM_EMAIL` | Mittente verificato su Resend | Secret facoltativo: se assente si usa `EMAIL_MITTENTE` di `config.ts` (`team@corporateboostservice.eu`) |
| `LOVABLE_API_KEY` | Progetto Lovable | Richiesta dal modulo |

I dati del fornitore (nome, P.IVA, sede, brand) e le condizioni d'uso complete in 4 lingue sono già nel kit: `FORNITORE` in `config.ts` e `condizioni-uso.ts`. Non servono dati aggiuntivi.

**Regola d'oro:** i secret si inseriscono solo nelle impostazioni del progetto. Non vanno mai scritti in un file,
né incollati in una chat.

Il kit funziona su progetti **TanStack Start + Supabase (Lovable Cloud)**. In un altro tipo di progetto
`adattatore.ts` e `start.ts` vanno adattati.

---

## METODO A — Installazione con Lovable

### A1. Carica il kit nel progetto
Il modo più sicuro è passare da GitHub:
1. Nel progetto Lovable collega il repository GitHub (impostazioni del progetto → GitHub).
2. Scarica il repository sul tuo computer (o aprilo nell'editor web di GitHub).
3. Decomprimi `KIT_ACCESSO_CONTROLLATO.zip`.
4. Copia il contenuto della cartella `src/` del kit dentro il `src/` del repository.
5. **Non sostituire** i file già esistenti. Se il sistema te lo chiede per `start.ts`, `route.tsx` o per i due file in
   `integrations/supabase/`, scegli di tenere quello esistente (lo unisci al passo A3).
6. Salva (commit e push). Lovable sincronizza il progetto da solo.

### A2. Dai a Lovable l'istruzione
Apri la chat di Lovable e incolla questo testo, sostituendo i valori tra `[ ]`:

```text
Nel progetto è stata aggiunta la cartella src/moduli/accesso-controllato (modulo di accesso controllato:
OTP email, licenza con PUK, condizioni d'uso, quota export PDF). Leggi prima
src/moduli/accesso-controllato/GUIDA_INSTALLAZIONE.md e seguila alla lettera.

Fai queste cose, in quest'ordine:
1. In src/moduli/accesso-controllato/config.ts imposta APP_CODE = "[APP_CODE]", APP_NAME = "[NOME APP]"
   e ROTTA_HOME = "[/pagina-iniziale]". Non cambiare altro in quel file (FORNITORE e TERMS_VERSION restano così).
2. Controlla adattatore.ts: deve usare il client supabase, useLingua e SelettoreLingua di questo progetto.
   Correggi solo gli import se non coincidono.
3. In src/start.ts aggiungi attachSupabaseAuth (da "@/integrations/supabase/auth-attacher") all'array
   functionMiddleware, SENZA togliere i middleware già presenti.
4. In src/routes/_authenticated/route.tsx avvolgi <Outlet /> con <FN047_PortaAccesso>
   (da "@/moduli/accesso-controllato/PortaAccesso"), mantenendo il controllo sessione già esistente.
   Se il layout _authenticated non esiste, crealo come nel file del kit.
5. Verifica che esistano le rotte /auth, /attivazione, /condizioni, /licenza-scaduta in src/routes.
6. Applica sul database locale lo script src/moduli/accesso-controllato/sql/lead_emails.sql.
7. Nell'header dell'app aggiungi i pulsanti "Chiudi applicazione", "Esci" e "Esci e cancella tutto", prendendo come modello
   src/moduli/accesso-controllato/esempi-integrazione/Intestazione.tsx.esempio. I testi dei pulsanti si leggono dal
   dizionario del modulo (useTestiAccesso, chiavi usc.*): non vanno aggiunti al dizionario dell'app.
8. Sul pulsante che genera il PDF usa useExportQuota come nel file
   esempi-integrazione/uso-export-quota.tsx.esempio.
9. Chiedimi di inserire questi secret (non scriverli nel codice): EXTERNAL_SUPABASE_URL,
   EXTERNAL_SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, LOVABLE_API_KEY (RESEND_FROM_EMAIL è facoltativo: il mittente predefinito è in config.ts).

Regole: non modificare altri file del modulo (in particolare condizioni-uso.ts, dizionari.ts e testi.ts), non cancellare codice esistente, non toccare le cartelle
esempi-integrazione e sql. Alla fine elencami i file modificati e gli eventuali errori di build.
```

### A3. Cosa controllare quando Lovable ha finito
- `start.ts` contiene ancora i middleware di prima **e** `attachSupabaseAuth`.
- `_authenticated/route.tsx` ha ancora il controllo sessione **e** la `FN047_PortaAccesso`.
- `config.ts` non contiene più la scritta `INSERISCI_QUI`.
- Il build non segnala errori sugli import `@/...`.

### A4. Secret
In Lovable: impostazioni del progetto → Secrets (o la voce equivalente della versione che usi).
Inserisci i secret della tabella iniziale **uno per uno**.

---

## METODO B — Installazione con Claude

Qui Claude lavora direttamente sulla cartella del progetto del tuo computer, quindi serve **Claude Code**
(da terminale oppure dall'app desktop).
La chat web di Claude (claude.ai) non può modificare il tuo progetto Lovable: può solo prepararti i file
che poi copi tu.

### B1. Prepara la cartella
1. Scarica il repository della nuova SaaS (dal collegamento GitHub di Lovable) in una cartella del computer.
2. Decomprimi `KIT_ACCESSO_CONTROLLATO.zip` in una cartella separata, per esempio
   `Download/KIT_ACCESSO_CONTROLLATO`.
3. Apri Claude Code **dentro la cartella del progetto** (non dentro quella del kit).

### B2. Incolla questa istruzione
Sostituisci i percorsi e i valori tra `[ ]`:

```text
Devi installare in questo progetto il modulo di accesso controllato contenuto in
[PERCORSO/KIT_ACCESSO_CONTROLLATO].

Procedura:
1. Leggi [PERCORSO/KIT_ACCESSO_CONTROLLATO]/src/moduli/accesso-controllato/GUIDA_INSTALLAZIONE.md.
2. Mostrami, prima di scrivere qualsiasi cosa, un piano: quali file del kit copierai, quali file esistenti
   del progetto andranno modificati e quali sono a rischio sovrascrittura. Aspetta la mia conferma.
3. Dopo la conferma copia src/moduli/accesso-controllato e le 4 rotte (auth, attivazione, condizioni,
   licenza-scaduta). NON sovrascrivere src/start.ts, src/routes/_authenticated/route.tsx e i file in
   src/integrations/supabase/: confrontali con quelli del kit e unisci solo le parti mancanti.
4. In config.ts imposta APP_CODE = "[APP_CODE]", APP_NAME = "[NOME APP]", ROTTA_HOME = "[/pagina-iniziale]".
5. Controlla adattatore.ts e correggi gli import in base a client Supabase, hook lingua e selettore lingua
   di questo progetto.
6. In src/start.ts aggiungi attachSupabaseAuth ai functionMiddleware senza togliere nulla.
7. In src/routes/_authenticated/route.tsx avvolgi <Outlet /> con FN047_PortaAccesso.
8. Aggiungi i pulsanti Chiudi applicazione / Esci / Esci e cancella tutto nell'header (testi dal dizionario del modulo)
   e collega useExportQuota al pulsante PDF,
   usando i file .esempio in esempi-integrazione come modello.
9. Esegui il type-check e il build del progetto e correggi gli errori che dipendono dall'installazione.
10. Non leggere, non stampare e non scrivere file .env o chiavi segrete. Dimmi tu quali secret devo
    impostare a mano.

Alla fine dammi: elenco dei file creati, dei file modificati, e cosa devo fare io a mano
(secret, script SQL, registrazione dell'APP_CODE nel database centrale).
```

### B3. Cosa resta a te
Claude Code non deve toccare i secret e non può registrare l'APP_CODE nel database centrale.
Dopo l'installazione:
1. Inserisci i secret nelle impostazioni del progetto.
2. Applica `sql/lead_emails.sql` sul database locale (da Lovable, o dall'editor SQL di Supabase).
3. Registra l'APP_CODE nella tabella `licenses` e crea le licenze e i PUK.
4. Fai il push su GitHub: Lovable aggiorna il progetto.

---

## Collaudo finale (uguale per i due metodi)

Fallo sull'app pubblicata o in anteprima, con un'email vera:

1. `/auth`: ricevi l'email e inserisci il codice a 6 cifre.
2. `/attivazione`: chiave licenza e PUK validi, poi riprova con un PUK già usato (deve dare ERR202).
3. `/condizioni`: compaiono il nome dell'app e i dati del fornitore, senza segnaposto tipo `{{...}}`; accetta.
4. Arrivi sulla pagina iniziale.
5. Esporta un PDF: il badge della quota scende. A quota esaurita compare il dialog.
6. Prova "Esci e cancella tutto" e rientra: deve ripartire da `/auth`.

## Se qualcosa non va

| Sintomo | Causa probabile |
| :--- | :--- |
| "Unauthorized" nelle server function | `attachSupabaseAuth` non registrato in `start.ts` |
| Chiave licenza sempre non trovata (ERR101) | APP_CODE non registrato in `licenses`, o diverso da `config.ts` |
| Nessuna email OTP | Secret Resend mancanti o mittente non verificato (ERR013) |
| Pagine senza stile | Mancano i token CSS shadcn o l'utility `rise` in `styles.css` |
| Errore di build su `@/lib/i18n` | `adattatore.ts` non adattato alla nuova app |
| Rimbalzo continuo su `/auth` | Layout `_authenticated` non allineato, o `ROTTA_HOME` inesistente |
