// ======================================================================
// Nome File: useExportQuota.tsx
// Percorso: src/moduli/accesso-controllato/esportazione/useExportQuota.tsx
// Revisione: Rev. 3 (aggiunto canExport: il credito si scala a PDF riuscito)
// Data/Ora: 2026-10-23 20:39
// Progetto: ppwr-reusability-hub (PPWR Reusability Hub)
// Modifiche Rev. 3: nuova funzione canExport() da chiamare PRIMA di generare il PDF (rilegge il residuo dal server,
// se esaurito apre il dialog); consume() va ora chiamato DOPO la generazione riuscita, così un errore non brucia il credito.
// ======================================================================

// Hook della quota export PDF per singolo PUK. canExport() va chiamato prima di generare il PDF, consume() solo a PDF riuscito.
import { useCallback, useEffect, useRef, useState } from "react";
import { PUK_ID_KEY } from "../config";
import { FN004_FormattaErrore } from "../errori";
import { FN045_LeggiQuotaPdfFn, FN046_DecrementaQuotaPdfFn } from "../accesso.functions";
import { FN008_LeggiChiave } from "../stato";
import { FN061_DialogExportEsauriti } from "./DialogExportEsauriti";

// ======================================================================
// FN058[useExportQuota]: legge la quota PDF del PUK e fornisce remaining, blocked, showLastExportWarning, consume() e il dialog di plafond esaurito.
// ======================================================================
export function useExportQuota() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dialogAperto, setDialogAperto] = useState(false);
  const inVolo = useRef(false);

  useEffect(() => {
    const pukId = FN008_LeggiChiave(PUK_ID_KEY);
    if (!pukId) return;
    let annullato = false;
    FN045_LeggiQuotaPdfFn({ data: { pukId } })
      .then((r) => {
        if (!annullato) setRemaining(r.remaining);
      })
      .catch(() => {
        /* fail-open: nessun blocco se la lettura fallisce */
      });
    return () => {
      annullato = true;
    };
  }, []);

  // ======================================================================
  // FN066[PuoEsportare]: rilegge il residuo dal server; se esaurito apre il dialog e restituisce false (fail-open su errore).
  // ======================================================================
  const canExport = useCallback(async (): Promise<boolean> => {
    const pukId = FN008_LeggiChiave(PUK_ID_KEY);
    if (!pukId) return true;
    let corrente = remaining;
    try {
      corrente = (await FN045_LeggiQuotaPdfFn({ data: { pukId } })).remaining;
      setRemaining(corrente);
    } catch {
      /* fail-open: si usa l'ultimo valore noto */
    }
    if (corrente !== null && corrente <= 0) {
      setDialogAperto(true);
      return false;
    }
    return true;
  }, [remaining]);

  // ======================================================================
  // FN059[ConsumaExport]: scala un export PDF sul server (anti doppio clic); da chiamare a PDF già generato con successo.
  // ======================================================================
  const consume = useCallback(async (): Promise<boolean> => {
    if (inVolo.current) return false;
    const pukId = FN008_LeggiChiave(PUK_ID_KEY);
    if (!pukId) return true;
    inVolo.current = true;
    try {
      const esito = await FN046_DecrementaQuotaPdfFn({ data: { pukId } });
      if (!esito.ok) {
        console.error(FN004_FormattaErrore(esito.codice));
        return true; // fail-open: un errore tecnico non blocca l'utente
      }
      setRemaining(esito.remaining);
      if (!esito.consentito) {
        setDialogAperto(true);
        return false;
      }
      return true;
    } catch (errore) {
      console.error(FN004_FormattaErrore("ERR500"), errore);
      return true;
    } finally {
      inVolo.current = false;
    }
  }, []);

  return {
    remaining,
    blocked: remaining !== null && remaining <= 0,
    showLastExportWarning: remaining === 1,
    canExport,
    consume,
    dialog: (
      <FN061_DialogExportEsauriti aperto={dialogAperto} onChiudi={() => setDialogAperto(false)} />
    ),
  };
}
