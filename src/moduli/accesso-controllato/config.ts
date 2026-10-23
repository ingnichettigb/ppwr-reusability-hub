// ======================================================================
// Nome File: config.ts
// Percorso: src/moduli/accesso-controllato/config.ts
// Revisione: Rev. 3 (mittente email valorizzato)
// Data/Ora: 2026-10-06
// ======================================================================

// Configurazione centrale del modulo. Unico file da personalizzare per ogni nuova SaaS.

export const APP_CODE = "INSERISCI_QUI_APP_CODE"; // codice registrato nella tabella licenses del DB centrale (es. "061MiaApp")
export const APP_NAME = "INSERISCI_QUI_NOME_APP"; // nome mostrato a video, nelle email e nelle condizioni d'uso
// Aumentare la versione ogni volta che cambia il testo delle condizioni: obbliga tutti a riaccettarle.
export const TERMS_VERSION = "v1";

// Dati del fornitore: compaiono nelle condizioni d'uso (condizioni-uso.ts). Unico punto in cui vanno modificati.
export const FORNITORE = {
  nome: "Dott. Ing. Nichetti Gian Battista",
  partitaIva: "IT01235350194",
  sede: "Soresina (CR)",
  brand: "CorporateBoostService",
} as const;

// Mittente predefinito delle email OTP. Il secret RESEND_FROM_EMAIL, se presente sul server, ha la precedenza (vedi otp.server.ts).
export const EMAIL_MITTENTE = "team@corporateboostservice.eu";

export const OTP_SCADENZA_MINUTI = 10;
export const OTP_MAX_RICHIESTE = 3;
export const OTP_FINESTRA_ORE = 24;
export const OTP_MAX_ERRORI = 5;

export const ROTTA_HOME = "/" as const;

export const VERIFIED_EMAIL_KEY = `${APP_CODE}:verifiedEmail`;
export const ACTIVATED_KEY = `${APP_CODE}:activated`;
export const LICENSE_ID_KEY = `${APP_CODE}:licenseId`;
export const PUK_ID_KEY = `${APP_CODE}:pukId`;
export const CONSENT_KEY = `${APP_CODE}:consent`;
export const LAST_LICENSE_CHECK_KEY = `${APP_CODE}:lastLicenseCheck`;
export const LICENSE_INVALID_REASON_KEY = `${APP_CODE}:licenseInvalidReason`;

export const GATE_KEYS = [
  VERIFIED_EMAIL_KEY,
  ACTIVATED_KEY,
  LICENSE_ID_KEY,
  PUK_ID_KEY,
  CONSENT_KEY,
  LAST_LICENSE_CHECK_KEY,
] as const;

export const LICENSE_KEYS = [
  ACTIVATED_KEY,
  LICENSE_ID_KEY,
  PUK_ID_KEY,
  CONSENT_KEY,
  LAST_LICENSE_CHECK_KEY,
] as const;

// ======================================================================
// FN002[PulisciChiaviGate]: rimuove dal browser tutte le chiavi di accesso (email, licenza, PUK, consenso).
// ======================================================================
export function FN002_PulisciChiaviGate() {
  if (typeof window === "undefined") return;
  for (const k of GATE_KEYS) window.localStorage.removeItem(k);
}

// ======================================================================
// FN003[PulisciChiaviLicenza]: rimuove le chiavi di licenza lasciando l'email verificata.
// ======================================================================
export function FN003_PulisciChiaviLicenza() {
  if (typeof window === "undefined") return;
  for (const k of LICENSE_KEYS) window.localStorage.removeItem(k);
}
