// ======================================================================
// Nome File: testi.ts
// Percorso: src/moduli/accesso-controllato/testi.ts
// Revisione: Rev. 3 (i dizionari sono in dizionari.ts; qui resta solo l'hook per i componenti React)
// Data/Ora: 2026-10-05 13:00
// ======================================================================

// Hook dei testi per le schermate del modulo. I testi veri e propri (IT, EN, DE, ES) sono in dizionari.ts.
import { useLinguaApp } from "./adattatore";
import type { CodiceErrore } from "./errori";
import { FN005_OttieniTesto, FN006_OttieniTestoErrore, type ChiaveTesto } from "./dizionari";

export { FN005_OttieniTesto, FN006_OttieniTestoErrore };
export type { ChiaveTesto };

export function useTestiAccesso() {
  const lingua = useLinguaApp();
  return {
    lingua,
    t: (chiave: ChiaveTesto, parametri?: Record<string, string | number>) =>
      FN005_OttieniTesto(lingua, chiave, parametri),
    te: (codice: CodiceErrore) => FN006_OttieniTestoErrore(lingua, codice),
  };
}
