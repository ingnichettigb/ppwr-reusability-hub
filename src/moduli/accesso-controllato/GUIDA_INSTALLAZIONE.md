<!--
======================================================================
Nome File: GUIDA_INSTALLAZIONE.md
Percorso: src/moduli/accesso-controllato/GUIDA_INSTALLAZIONE.md
Revisione: Rev. 2.1 (kit rev02: mittente email predefinito)
Data/Ora: 2026-10-06
======================================================================
-->

# GUIDA INSTALLAZIONE: Modulo accesso-controllato (kit rev02)

Verificata sul codice reale. Il manuale `ISTRUZIONI_ACCESSO_CONTROLLATO.md` descrive l'architettura; questa guida è la procedura.

## 1. Procedura (in ordine)
1. Copia `src/` del kit dentro il `src/` della nuova SaaS. Se un file esiste già NON sovrascriverlo: unisci a mano. Vale per `routes/_authenticated/route.tsx`, per `start.ts` e per i due file in `integrations/supabase/` (se identici si saltano).
2. `config.ts`: sostituisci `INSERISCI_QUI_APP_CODE` e `INSERISCI_QUI_NOME_APP`. Controlla `ROTTA_HOME` (pagina di arrivo dopo il login: deve esistere sotto `_authenticated`). `FORNITORE` e `TERMS_VERSION` restano come sono, salvo variazioni.
3. `adattatore.ts`: ricollega i 3 punti d'unione (client `supabase`, `useLingua`, `SelettoreLingua`) a quelli della SaaS. Nell'app di origine sono `@/integrations/supabase/client`, `@/lib/i18n` e `@/components/SelettoreLingua`.
4. `src/start.ts`: aggiungi `attachSupabaseAuth` ai `functionMiddleware` (esempio in `esempi-integrazione/start.ts.esempio`). Senza questo le server function rispondono "Unauthorized".
5. `src/routes/_authenticated/route.tsx`: se la SaaS ha già un layout protetto, avvolgi solo `<Outlet />` con `<FN047_PortaAccesso>`.
6. Database locale: esegui `sql/lead_emails.sql`.
7. Secret del progetto: `EXTERNAL_SUPABASE_URL`, `EXTERNAL_SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (facoltativo: default `EMAIL_MITTENTE` in `config.ts`), `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (di norma già presente). Più le variabili standard Lovable Cloud: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
8. DB centrale: registra l'`APP_CODE` nella tabella `licenses` e crea licenze e PUK per quella app.
9. Header dell'app: pulsanti Chiudi applicazione / Esci / Esci e cancella tutto (esempio in `esempi-integrazione/Intestazione.tsx.esempio`, usa `FN016_EsciECancellaTutto` di `stato.ts`). I testi dei pulsanti e il messaggio ERR900 vengono dal dizionario del modulo (`useTestiAccesso`, chiavi `usc.*`): non vanno aggiunti al dizionario dell'app ospitante.
10. Pulsante "genera PDF": esempio in `esempi-integrazione/uso-export-quota.tsx.esempio`.

## 2. Condizioni d'uso
- Il testo è in `condizioni-uso.ts`, già completo in IT, EN, DE, ES (6 sezioni). Nome app, dati del fornitore e numero di versione si compilano da soli da `config.ts`.
- Dati del fornitore: si cambiano solo in `FORNITORE` dentro `config.ts`.
- Se cambi il testo, aumenta `TERMS_VERSION` (es. `v1` → `v2`): tutti gli utenti dovranno riaccettare.
- Il testo rimanda alla pagina `/pagamenti-merchant-of-record` e alla Privacy Policy del sito: devono esistere nella SaaS o nel sito collegato.

## 3. Prerequisiti nella SaaS ospitante
- Pacchetti: `@supabase/supabase-js`, `@tanstack/react-router`, `@tanstack/react-start`, `zod`, `react`.
- shadcn `alert-dialog` (con `button` e `lib/utils`): usato da `DialogExportEsauriti`.
- `LinguaProvider` montato nella root, con lingue `it | en | de | es` (tipo `LinguaAccesso`).
- `styles.css`: token shadcn (`background, foreground, card, primary, destructive, muted-foreground, input, ring, accent`), font `font-display`/`font-mono` e l'utility `rise`. Se mancano, le pagine funzionano ma con aspetto degradato.
- Alias `@/` → `src/` (tsconfig + vite).

## 4. Uso della quota PDF
```tsx
const quota = useExportQuota();          // { remaining, blocked, showLastExportWarning, consume, dialog }
async function stampa() {
  if (!(await quota.consume())) return;  // scala la quota sul server; se esaurita apre il dialog
  generaPdf();
}
<button className="relative" onClick={stampa}>
  Stampa <FN060_ExportCountBadge count={quota.remaining} />
</button>
{quota.dialog}
```
Il pulsante deve avere `relative`. `count = null` significa export illimitati (badge nascosto).

## 5. Come funziona (sintesi)
- `PortaAccesso` controlla a ogni cambio pagina: sessione Supabase → email verificata → licenza attivata → consenso → rivalidazione licenza sul server. Errori di rete: fail-open (non blocca chi ha pagato).
- Le server function leggono l'email dal token di sessione, mai dal corpo della richiesta.
- La quota PDF non disattiva mai la licenza.

## 6. Collaudo dopo l'installazione
1. `/auth`: invio e verifica OTP (email reale). 2. `/attivazione`: chiave + PUK validi, poi PUK già usato (ERR202). 3. `/condizioni`: compaiono nome app e dati del fornitore; accetta. 4. Arrivo su `ROTTA_HOME`. 5. Esporta PDF fino a quota esaurita. 6. Licenza scaduta → `/licenza-scaduta`.

## 7. Testi
Tutti i testi del modulo nelle 4 lingue sono in `dizionari.ts` (schermate, messaggi di errore ERRxxx, email del codice OTP, pulsanti di uscita, esempio del PUK). Il testo legale è in `condizioni-uso.ts`. Nel codice non ci sono testi visibili fuori da questi due file.
