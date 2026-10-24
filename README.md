# PPWR Reusability Hub

Crea un programma web completo e generico per la gestione e il calcolo della riutilizzabilità degli imballaggi in conformità al nuovo Regolamento europeo PPWR (Regolamento UE 2025/40).

Funzionalità e requisiti:
1. Approccio generico e universale:
   - Non vincolato a un solo prodotto; l'utente può inserire qualsiasi tipo di imballaggio (IBC, fusti metallici o plastici, pallet in legno o plastica, cassette, big bag, taniche, ecc.).
   - Campi imballaggio: tipologia imballo, modello/serie, materiale, dimensioni/capacità, settore d'uso (es. alimentare, chimico, industriale), rotazioni previste/effettuate.

2. Checklist di conformità PPWR:
   - Basata sulla checklist del documento allegato (Regolamento UE 2025/40):
     * Articolo 11 – Imballaggi Riutilizzabili (requisiti da 'a' a 'i': concepito per riutilizzo, rotazioni massime, salute/sicurezza/igiene, svuotamento/scarico senza danni, conformità igienica per riempimento/ricarica, ricondizionabilità Allegato VI Parte B, etichettatura/tracciabilità, sicurezza operatori, riciclabilità a fine vita art. 6).
     * Allegato VI, Parte B – Fasi di Ricondizionamento (B2.a Valutazione condizioni, B2.b Rimozione componenti danneggiati, B2.c Recupero componenti rimossi, B2.d Pulizia e lavaggio, B2.e Riparazione, B2.f Ispezione e idoneità allo scopo, B2.g Ripetizione lavaggi; Requisito Finale su salute e sicurezza).
   - Per ciascuna voce: Esito (Sì, No, Non applicabile) e campo note/evidenze tecniche.
   - Calcolo automatico dell'esito finale di idoneità al riutilizzo.

3. Gestione Bozze e Valutazioni salvate:
   - Possibilità di salvare molteplici bozze, ciascuna con il proprio nome/titolo identificativo e data.
   - Tabella/elenco bozze con pulsanti e iconcine di azione per ogni elemento: Vedi, Modifica, Duplica, Cancella, Stampa/PDF, Esporta JSON.

4. Pulsanti di navigazione e comando:
   - "Salva il lavoro fatto" (salvataggio persistente della valutazione corrente).
   - "Esci" (torna all'elenco generale delle valutazioni).
   - "Impostazioni generali ditta": pannello per inserire i dati essenziali dell'azienda (Ragione sociale, P.IVA/CF, indirizzo, contatti, logo, responsabile tecnico/firmatario) che vengono ereditati automaticamente in tutti i report.

5. Anteprima Report interattiva, Modifica diretta e Stampa/PDF:
   - Pulsante "Anteprima Report" che mostra il documento impaginato per la stampa (con intestazione aziendale, dati imballo, tabelle checklist PPWR, conclusioni ed esito).
   - Possibilità di modificare direttamente i testi nel report (es. conclusioni, note generali) prima della stampa.
   - Funzione di stampa e generazione/download PDF.

6. Nomenclatura file e gestione import/export JSON:
   - Convenzione obbligatoria per il nome dei file salvati e dei PDF scaricati:
     AAAAMMGGHHmm-RIUTILIZZO-primi 20 caratteri del titolo (es. 202610072107-RIUTILIZZO-IBC_PLI_1000L.pdf / .json).
   - Esportazione e importazione in formato JSON: il sistema deve permettere il download del file JSON e il caricamento di file JSON esistenti, riconoscendo e validando solo i file consoni al programma (controllo di schema e firma dell'applicazione).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ppwr-reusability-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b89dddd4-a3c4-413a-9ec0-504711414af1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```


Test sincronizzazione GitHub e Lovable: riga aggiunta il 2026-10-24 alle 16:26 (ora italiana).
