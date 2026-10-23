// ======================================================================
// Nome File: i18n.ts
// Percorso: src/lib/i18n.ts
// Revisione: Rev. 1
// Data/Ora: 2026-10-23 15:42
// ======================================================================

// Lingua globale dell'applicazione (it, en, de, es), persistita nel browser.
// Il modulo accesso-controllato la legge tramite il suo adattatore (useLinguaApp).
import { useCallback, useSyncExternalStore } from "react";
import type { LinguaAccesso } from "@/moduli/accesso-controllato/tipi";

export type Lingua = LinguaAccesso;

const LINGUA_KEY = "ppwr:lingua";
const LINGUE: Lingua[] = ["it", "en", "de", "es"];
const PREDEFINITA: Lingua = "it";

// Dizionario dell'app ospitante. Ogni nuova chiave va aggiunta qui in tutte e 4 le lingue.
const DIZIONARIO: Record<string, Record<Lingua, string>> = {
  "app.nome": { it: "PPWR Riutilizzo", en: "PPWR Reuse", de: "PPWR Wiederverwendung", es: "PPWR Reutilización" },
  "app.sottotitolo": {
    it: "Riutilizzabilità imballaggi",
    en: "Packaging reusability",
    de: "Verpackungs-Wiederverwendbarkeit",
    es: "Reutilización de envases",
  },
  "nav.valutazioni": { it: "Valutazioni", en: "Assessments", de: "Bewertungen", es: "Evaluaciones" },
  "nav.impostazioni": { it: "Impostazioni", en: "Settings", de: "Einstellungen", es: "Ajustes" },
  "nav.guida": { it: "Guida", en: "Guide", de: "Hilfe", es: "Guía" },
};

function FN001_LeggeLingua(): Lingua {
  try {
    const valore = window.localStorage.getItem(LINGUA_KEY);
    return valore && LINGUE.includes(valore as Lingua) ? (valore as Lingua) : PREDEFINITA;
  } catch {
    return PREDEFINITA;
  }
}

let corrente: Lingua = typeof window === "undefined" ? PREDEFINITA : FN001_LeggeLingua();
const ascoltatori = new Set<() => void>();

// ======================================================================
// FN002[ScriviLingua]: cambia la lingua corrente, la salva nel browser e notifica i componenti.
// ======================================================================
export function FN002_ScriviLingua(lingua: Lingua) {
  corrente = lingua;
  try {
    window.localStorage.setItem(LINGUA_KEY, lingua);
  } catch {
    /* storage non disponibile */
  }
  for (const ascolta of ascoltatori) ascolta();
}

const sottoscrivi = (cb: () => void) => {
  ascoltatori.add(cb);
  return () => {
    ascoltatori.delete(cb);
  };
};
const leggiSnapshot = () => corrente;
const leggiSnapshotServer = () => PREDEFINITA;

// ======================================================================
// FN003[useLingua]: lingua corrente + funzione per cambiarla.
// ======================================================================
export function useLingua(): { lingua: Lingua; setLingua: (lingua: Lingua) => void } {
  const lingua = useSyncExternalStore(sottoscrivi, leggiSnapshot, leggiSnapshotServer);
  const setLingua = useCallback((nuova: Lingua) => FN002_ScriviLingua(nuova), []);
  return { lingua, setLingua };
}

// ======================================================================
// FN004[useT]: traduce una chiave del dizionario dell'app; chiave sconosciuta → la chiave stessa.
// ======================================================================
export function useT(): (chiave: string) => string {
  const { lingua } = useLingua();
  return (chiave: string) => DIZIONARIO[chiave]?.[lingua] ?? chiave;
}
