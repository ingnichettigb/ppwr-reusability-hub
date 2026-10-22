export const APP_SIGNATURE = "PPWR-RIUTILIZZO";
export const SCHEMA_VERSION = 1;

export type Esito = "" | "SI" | "NO" | "NA";

export interface CheckItem {
  ref: string;
  text: string;
}

export const ART11: CheckItem[] = [
  { ref: "a", text: "Concepito, progettato e immesso sul mercato con l'obiettivo di essere riutilizzato più volte." },
  { ref: "b", text: "Concepito e progettato per effettuare il maggior numero possibile di rotazioni in condizioni d'uso normalmente prevedibili." },
  { ref: "c", text: "Soddisfa i requisiti in materia di salute dei consumatori, sicurezza e igiene." },
  { ref: "d", text: "Può essere svuotato o scaricato senza subire danni che ne impedirebbero l'ulteriore funzionamento e il riutilizzo." },
  { ref: "e", text: "Può essere svuotato, scaricato, nuovamente riempito o ricaricato nel rispetto delle prescrizioni di sicurezza e di igiene applicabili, comprese quelle di sicurezza alimentare." },
  { ref: "f", text: "Può essere ricondizionato conformemente all'allegato VI, parte B, mantenendo la capacità di svolgere la funzione prevista." },
  { ref: "g", text: "Consente l'apposizione dell'etichettatura, nonché la fornitura di informazioni sulle proprietà del prodotto e sull'imballaggio stesso, comprese istruzioni e informazioni per garantire sicurezza, uso adeguato, tracciabilità e durata di conservazione del prodotto." },
  { ref: "h", text: "Può essere svuotato, scaricato, nuovamente riempito o ricaricato senza rischi per la salute e la sicurezza dei responsabili di dette operazioni." },
  { ref: "i", text: "Quando è smaltito come rifiuto soddisfa le prescrizioni specifiche per gli imballaggi riciclabili di cui all'articolo 6." },
];

export const ALL6B: CheckItem[] = [
  { ref: "B2.a", text: "Valutazione delle condizioni degli imballaggi." },
  { ref: "B2.b", text: "Rimozione dei componenti danneggiati o non riutilizzabili degli imballaggi." },
  { ref: "B2.c", text: "Trasferimento dei componenti rimossi degli imballaggi a un adeguato processo di recupero." },
  { ref: "B2.d", text: "Pulizia e lavaggio degli imballaggi nel rispetto delle condizioni igieniche richieste." },
  { ref: "B2.e", text: "Riparazione degli imballaggi." },
  { ref: "B2.f", text: "Ispezione e valutazione dell'idoneità allo scopo degli imballaggi." },
  { ref: "B2.g", text: "Se necessario, i processi di pulizia e lavaggio sono effettuati in diverse fasi del ricondizionamento e ripetuti." },
  { ref: "Finale", text: "Il prodotto ricondizionato rispetta le prescrizioni in materia di salute e di sicurezza ad esso applicabili." },
];

export const SISTEMA: CheckItem[] = [
  { ref: "S1", text: "È definito il sistema di riutilizzo in cui l'imballaggio è immesso (circuito chiuso, circuito aperto/pooling o sistema misto)." },
  { ref: "S2", text: "Esiste un sistema di raccolta/logistica inversa che consente la restituzione dell'imballaggio dopo l'uso." },
  { ref: "S3", text: "Sono previsti incentivi alla restituzione (cauzione, accordo contrattuale, noleggio o equivalente)." },
  { ref: "S4", text: "L'imballaggio è identificabile e tracciabile in modo univoco (matricola, barcode, DataMatrix, RFID)." },
  { ref: "S5", text: "Il numero di rotazioni effettuate è registrato e monitorato nel tempo." },
  { ref: "S6", text: "Sono disponibili evidenze documentali (schede tecniche, certificati di ricondizionamento, omologazioni UN/ADR, test MOCA ove applicabili)." },
];

export const TIPI_SISTEMA = ["Circuito chiuso", "Circuito aperto (pooling)", "Sistema misto"];

export function rotationIndex(i: Imballo): number | null {
  const p = Number(i.rotazioniPreviste), f = Number(i.rotazioniEffettuate);
  if (!p || p <= 0 || isNaN(f)) return null;
  return Math.round((f / p) * 100);
}

export const TIPOLOGIE = ["IBC", "Fusto metallico", "Fusto plastico", "Pallet in legno", "Pallet in plastica", "Cassetta", "Big bag (FIBC)", "Tanica", "Cisternetta", "Altro"];
export const SETTORI = ["Alimentare", "Chimico", "Farmaceutico", "Cosmetico", "Industriale", "Agricolo", "Logistica", "Altro"];

export interface Answer { esito: Esito; note: string }

export interface Imballo {
  tipologia: string;
  modello: string;
  materiale: string;
  dimensioni: string;
  capacita: string;
  settore: string;
  rotazioniPreviste: string;
  rotazioniEffettuate: string;
  descrizione: string;
  tipoSistema: string;
  tracciabilita: string;
  evidenze: string;
}

export interface Evaluation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  imballo: Imballo;
  art11: Record<string, Answer>;
  all6b: Record<string, Answer>;
  sistema: Record<string, Answer>;
  report: { introduzione: string; conclusioni: string; noteGenerali: string };
}

export interface Company {
  ragioneSociale: string;
  piva: string;
  indirizzo: string;
  telefono: string;
  email: string;
  sito: string;
  logo: string; // data URL
  responsabile: string;
  ruolo: string;
}

export const emptyCompany = (): Company => ({ ragioneSociale: "", piva: "", indirizzo: "", telefono: "", email: "", sito: "", logo: "", responsabile: "", ruolo: "Responsabile Tecnico" });

const blankAnswers = (items: CheckItem[]) => Object.fromEntries(items.map((i) => [i.ref, { esito: "" as Esito, note: "" }]));

export function newEvaluation(): Evaluation {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "Nuova valutazione",
    createdAt: now,
    updatedAt: now,
    imballo: { tipologia: "IBC", modello: "", materiale: "", dimensioni: "", capacita: "", settore: "Industriale", rotazioniPreviste: "", rotazioniEffettuate: "", descrizione: "", tipoSistema: "", tracciabilita: "", evidenze: "" },
    art11: blankAnswers(ART11),
    all6b: blankAnswers(ALL6B),
    sistema: blankAnswers(SISTEMA),
    report: { introduzione: "", conclusioni: "", noteGenerali: "" },
  };
}

export type Outcome = "IDONEO" | "NON IDONEO" | "INCOMPLETO";

export function computeOutcome(e: Evaluation) {
  const all = [...ART11.map((i) => e.art11[i.ref]), ...ALL6B.map((i) => e.all6b[i.ref]), ...SISTEMA.map((i) => e.sistema?.[i.ref])];
  const si = all.filter((a) => a?.esito === "SI").length;
  const no = all.filter((a) => a?.esito === "NO").length;
  const na = all.filter((a) => a?.esito === "NA").length;
  const vuoti = all.length - si - no - na;
  const outcome: Outcome = no > 0 ? "NON IDONEO" : vuoti > 0 || si === 0 ? "INCOMPLETO" : "IDONEO";
  const applicabili = si + no;
  const score = applicabili ? Math.round((si / applicabili) * 100) : 0;
  return { outcome, si, no, na, vuoti, total: all.length, score };
}

export function defaultIntro(e: Evaluation) {
  const i = e.imballo;
  return `Il presente documento fornisce una valutazione della conformità dell'imballaggio ${i.tipologia}${i.modello ? ` – ${i.modello}` : ""} ai requisiti previsti dal Regolamento UE 2025/40 (PPWR), con particolare riferimento all'Articolo 11 (Imballaggi riutilizzabili) e all'Allegato VI, Parte B (Operazioni di ricondizionamento), oltre ai requisiti del sistema di riutilizzo. L'obiettivo è verificare l'idoneità dell'imballaggio al riutilizzo mediante la verifica puntuale dei criteri progettuali, igienico-sanitari e manutentivi stabiliti dalla normativa europea.`;
}

export function defaultConclusion(e: Evaluation) {
  const { outcome } = computeOutcome(e);
  const nome = `${e.imballo.tipologia}${e.imballo.modello ? ` (${e.imballo.modello})` : ""}`;
  if (outcome === "IDONEO")
    return `L'analisi condotta conferma che l'imballaggio ${nome} soddisfa tutti i requisiti di riutilizzabilità applicabili stabiliti dall'Articolo 11 del Regolamento UE 2025/40 e rispetta gli standard previsti dall'Allegato VI, Parte B per i processi di ricondizionamento. L'imballaggio risulta pertanto idoneo al regime di riutilizzo, fermo restando l'obbligo di monitorare i futuri atti delegati della Commissione Europea relativi al numero minimo di rotazioni (art. 11, par. 2).`;
  if (outcome === "NON IDONEO")
    return `L'analisi condotta evidenzia che l'imballaggio ${nome} non soddisfa uno o più requisiti dell'Articolo 11 e/o dell'Allegato VI, Parte B del Regolamento UE 2025/40. L'imballaggio non può essere qualificato come riutilizzabile fino alla risoluzione delle non conformità riportate nella checklist.`;
  return `La valutazione dell'imballaggio ${nome} risulta incompleta: alcune voci della checklist non sono state ancora compilate. Completare la verifica prima di emettere un giudizio di idoneità.`;
}

export const NOTA_NORMATIVA = `Ai sensi dell'Articolo 11, Paragrafo 2 del Regolamento UE 2025/40: "Entro il 12 febbraio 2027, la Commissione adotta un atto delegato conformemente all'articolo 64 per integrare il presente regolamento stabilendo un numero minimo di rotazioni per gli imballaggi riutilizzabili ai fini del paragrafo 1, lettera b), del presente articolo, per i formati di imballaggio più frequentemente destinati al riutilizzo, tenendo conto di requisiti igienici e di altro tipo, quali la logistica."`;

// ---------- File naming ----------
export function buildFileName(title: string, ext: "pdf" | "json", d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}`;
  const clean = (title || "SENZA_TITOLO")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .slice(0, 20).replace(/^_+|_+$/g, "") || "SENZA_TITOLO";
  return `${stamp}-RIUTILIZZO-PPWR-${clean}.${ext}`;
}

// ---------- Storage ----------
const K_EVALS = "ppwr.evaluations.v1";
const K_COMPANY = "ppwr.company.v1";

export function normalizeEvaluation(e: Evaluation): Evaluation {
  const base = newEvaluation();
  return { ...e, imballo: { ...base.imballo, ...e.imballo }, sistema: { ...base.sistema, ...(e.sistema || {}) }, report: { ...base.report, ...(e.report || {}) } };
}

export function loadEvaluations(): Evaluation[] {
  try { return (JSON.parse(localStorage.getItem(K_EVALS) || "[]") as Evaluation[]).map(normalizeEvaluation); } catch { return []; }
}
export function saveEvaluations(list: Evaluation[]) { localStorage.setItem(K_EVALS, JSON.stringify(list)); }
export function loadCompany(): Company {
  try { return { ...emptyCompany(), ...JSON.parse(localStorage.getItem(K_COMPANY) || "{}") }; } catch { return emptyCompany(); }
}
export function saveCompany(c: Company) { localStorage.setItem(K_COMPANY, JSON.stringify(c)); }

// ---------- JSON export / import ----------
export function exportPayload(e: Evaluation) {
  return { app: APP_SIGNATURE, schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), evaluation: e };
}

export function downloadBlob(content: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportJson(e: Evaluation) {
  downloadBlob(JSON.stringify(exportPayload(e), null, 2), buildFileName(e.title, "json"), "application/json");
}

const isStr = (v: unknown) => typeof v === "string";
const ESITI = ["", "SI", "NO", "NA"];

export function validateImport(raw: unknown): { ok: true; evaluation: Evaluation } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Il file non contiene un oggetto JSON valido." };
  const r = raw as Record<string, unknown>;
  if (r["app"] !== APP_SIGNATURE) return { ok: false, error: "Firma applicazione mancante o errata: il file non è stato generato da questo programma." };
  if (typeof r["schemaVersion"] !== "number" || r["schemaVersion"] > SCHEMA_VERSION) return { ok: false, error: "Versione dello schema non supportata." };
  const e = r["evaluation"] as Partial<Evaluation> & Record<string, unknown> | undefined;
  if (!e || typeof e !== "object") return { ok: false, error: "Sezione 'evaluation' assente." };
  if (!isStr(e.title) || !e.imballo || typeof e.imballo !== "object") return { ok: false, error: "Titolo o dati imballo non validi." };
  for (const [key, items] of [["art11", ART11], ["all6b", ALL6B]] as const) {
    const sec = e[key] as Record<string, Answer> | undefined;
    if (!sec || typeof sec !== "object") return { ok: false, error: `Sezione checklist '${key}' assente.` };
    for (const it of items) {
      const a = sec[it.ref];
      if (!a || !ESITI.includes(a.esito) || !isStr(a.note)) return { ok: false, error: `Voce '${it.ref}' della checklist non valida.` };
    }
  }
  const base = newEvaluation();
  const ev: Evaluation = {
    ...base,
    ...(e as unknown as Evaluation),
    imballo: { ...base.imballo, ...(e.imballo as Imballo) },
    sistema: { ...base.sistema, ...((e.sistema as Evaluation["sistema"]) || {}) },
    report: { ...base.report, ...((e.report as Evaluation["report"]) || {}) },
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  };
  return { ok: true, evaluation: ev };
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
