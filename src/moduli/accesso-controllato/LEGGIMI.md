<!--
======================================================================
Nome File: LEGGIMI.md
Percorso: src/moduli/accesso-controllato/LEGGIMI.md
Revisione: Rev. 3 (mittente email predefinito)
Data/Ora: 2026-10-06
======================================================================
-->

# Modulo accesso-controllato

Accesso a 3 fasi (OTP email, licenza multi-seat con PUK, condizioni d'uso) e quota export PDF per singola PUK.
Schermate: 0001 `/auth`, 0002 `/attivazione`, 0003 `/condizioni`, 0004 `/licenza-scaduta`, frame 0005 dialog export esauriti.

## 1. Come portarlo su un'altra SaaS

La procedura completa e ordinata è in `GUIDA_INSTALLAZIONE.md`. In sintesi:

1. Copia `src/` del kit dentro il `src/` della nuova SaaS (senza sovrascrivere i file già esistenti).
2. In `config.ts` sostituisci `INSERISCI_QUI_APP_CODE` e `INSERISCI_QUI_NOME_APP`; controlla `ROTTA_HOME`.
3. Controlla `adattatore.ts`: è l'unico punto che usa l'app ospitante (lingua, selettore lingua, client Supabase).
4. Registra `attachSupabaseAuth` in `src/start.ts` e avvolgi `<Outlet />` in `_authenticated/route.tsx` con `FN047_PortaAccesso`.
5. Esegui `sql/lead_emails.sql` sul database locale.
6. Imposta i secret (sezione 2) e registra l'APP_CODE nella tabella `licenses` del DB centrale.

## 2. Secret richiesti (si impostano nel progetto, non vanno scritti nel codice)

1. `EXTERNAL_SUPABASE_URL`
2. `EXTERNAL_SUPABASE_SERVICE_ROLE_KEY`
3. `RESEND_API_KEY`
4. `RESEND_FROM_EMAIL` (facoltativo: se assente si usa `EMAIL_MITTENTE` di `config.ts`, già impostato su `team@corporateboostservice.eu`, che deve essere verificato su Resend)
5. `LOVABLE_API_KEY`
6. `SUPABASE_SERVICE_ROLE_KEY` (di solito già presente nel progetto Lovable Cloud)

## 3. Codici errore

1. Da `ERR001` a `ERR500`: standard del portfolio (ex `E-001` ... `E-500`).
2. `ERR010`-`ERR017`: aggiunte di questo modulo (email non valida, troppe richieste, OTP errato, invio email, sessione, campi mancanti, email rimbalzata).
3. `ERR900`: logout non riuscito (pulsante di uscita dell'app).

## 4. Dove si modifica cosa

1. Identità della SaaS e dati del fornitore: solo `config.ts`.
2. Testo legale delle condizioni (4 lingue): `condizioni-uso.ts`. Dopo ogni modifica aumentare `TERMS_VERSION`.
3. Tutti gli altri testi (schermate, messaggi di errore, email OTP, pulsanti di uscita) nelle 4 lingue: solo `dizionari.ts`. Il titolo della scheda del browser è tradotto dalla pagina stessa.
4. Le server function protette leggono l'email dal token di sessione, mai dal corpo della richiesta.
5. Il decremento della quota PDF non disattiva mai la licenza.
