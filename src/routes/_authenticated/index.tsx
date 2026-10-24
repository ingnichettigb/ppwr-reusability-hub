/* ==============================================================================
 *  TITOLO FILE      : index.tsx - Pagina principale dell'applicazione
 *  PERCORSO         : src/routes/_authenticated/index.tsx
 *  PROGETTO         : ppwr-reusability-hub (PPWR Reusability Hub)
 *  REVISIONE        : 06
 *  DATA E ORA REV.  : 2026-10-24 20:49 (ora italiana)
 * ------------------------------------------------------------------------------
 *  DESCRIZIONE
 *    Pagina principale: elenco valutazioni, editor, impostazioni ditta, anteprima report,
 *    stampa e generazione del PDF (funzione downloadPdf).
 *    Quota export PDF per PUK (badge, avviso ultima esportazione, dialog "Generazioni esaurite"):
 *    controllo prima della generazione, credito scalato solo a PDF riuscito.
 * ------------------------------------------------------------------------------
 *  STORICO REVISIONI (dalla più recente)
 *    Rev. 06 | 2026-10-24 20:49 | Intestazione su una riga e menu «Account» (ControlliSessione); eliminato «Chiudi applicazione»; nel report «Indietro» diventa «Torna alla scheda» (solo se si arriva dalla scheda; dall'elenco c'è già «Torna all'elenco» in alto).
 *    Rev. 05 | 2026-10-24 15:43 | Logo dell'app al posto dell'icona del riciclo; pulsante «Torna all'elenco» sempre visibile
 *                                  fuori dall'elenco (con avviso se ci sono modifiche non salvate); il «Esci» di editor e
 *                                  impostazioni diventa «Torna all'elenco» (non è più confondibile con il logout).
 *    Rev. 04 | 2026-10-23 20:49 | TopBar: aggiunto il pulsante «i» con la guida in-app in 4 lingue (GuidaApp).
 *    Rev. 03 | 2026-10-23 20:39 | Percorso aggiornato (pagina spostata sotto _authenticated). Quota export PDF:
 *                                  downloadPdf restituisce true/false; wrapper exportPdf (canExport prima,
 *                                  consume a PDF riuscito) usato da "Scarica PDF" e dall'icona "Stampa / PDF"
 *                                  dell'elenco; "Stampa" bloccata a quota esaurita senza scalare crediti;
 *                                  badge FN060 nel pulsante e avviso giallo ultima esportazione.
 *                                  TopBar: email utente, lingua e pulsanti Chiudi/Esci/Esci e cancella tutto.
 *    Rev. 02 | 2026-10-22 21:02 | Intestazione del file riscritta in formato standard (nessuna modifica al codice).
 *    Rev. 01 | 2026-10-22 20:38 | downloadPdf: margini di 12 mm su tutte le pagine e salto pagina forzato
 *                                  dopo la prima pagina del report (elementi con classe "page-end").
 * ============================================================================== */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Building2, Copy, Eye, FileDown, FileJson, Pencil, Plus, Printer, Save, Trash2, Upload, FileText, ArrowLeft, TriangleAlert,
} from "lucide-react";
import {
  ALL6B, ART11, SISTEMA, TIPI_SISTEMA, rotationIndex, SETTORI, TIPOLOGIE, buildFileName, computeOutcome, exportJson, fmtDate, loadCompany, loadEvaluations,
  newEvaluation, saveCompany, saveEvaluations, validateImport, type CheckItem, type Company, type Esito, type Evaluation, type Outcome,
} from "@/lib/ppwr";
import { Report } from "@/components/ppwr/Report";
import { ControlliSessione } from "@/components/ControlliSessione";
import { GuidaApp } from "@/components/GuidaApp";
import logoApp from "@/assets/logo-ppwr-app.png";
import { useTornaElenco, useTornaScheda } from "@/lib/conferme-testi";
import { FN060_ExportCountBadge } from "@/moduli/accesso-controllato/esportazione/ExportCountBadge";
import { useExportQuota } from "@/moduli/accesso-controllato/esportazione/useExportQuota";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "PPWR Riutilizzo — Valutazione riutilizzabilità imballaggi (Reg. UE 2025/40)" },
      { name: "description", content: "Checklist Art. 11 e Allegato VI Parte B del Regolamento UE 2025/40: valuta, salva e stampa report di riutilizzabilità per qualsiasi imballaggio." },
      { property: "og:title", content: "PPWR Riutilizzo — Valutazione imballaggi riutilizzabili" },
      { property: "og:description", content: "Valutazioni di riutilizzabilità conformi al Regolamento UE 2025/40 con report PDF e import/export JSON." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

type View = { kind: "list" } | { kind: "edit"; ev: Evaluation } | { kind: "report"; ev: Evaluation; from: "list" | "edit" } | { kind: "settings" };

const btn = "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-primary/90`;
const btnGhost = `${btn} border border-border bg-card text-foreground hover:bg-accent`;
const input = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function OutcomeBadge({ o }: { o: Outcome }) {
  const cls = o === "IDONEO" ? "bg-primary text-primary-foreground" : o === "NON IDONEO" ? "bg-destructive text-destructive-foreground" : "bg-[var(--warn)] text-foreground";
  return <span className={`inline-block rounded px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider ${cls}`}>{o}</span>;
}

// Restituisce true solo se il PDF è stato generato e salvato (serve a scalare il credito a PDF riuscito).
async function downloadPdf(ev: Evaluation): Promise<boolean> {
  const el = document.getElementById("report-doc");
  if (!el) return false;
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
  el.classList.add("pdf-mode");
  try {
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = 210, pageH = 297, margin = 12; // mm
    // pixel height of the printable area of one A4 page (margin top/bottom) at the canvas width
    const pagePx = Math.floor((canvas.width * (pageH - 2 * margin)) / pageW);
    // collect safe break points (bottom of table rows / blocks) so pages don't cut a row in half
    const scale = canvas.width / el.getBoundingClientRect().width;
    const top0 = el.getBoundingClientRect().top;
    const breaks = Array.from(el.querySelectorAll("tr, h2, p, header, section, div.avoid-break"))
      .map((n) => Math.round((n.getBoundingClientRect().bottom - top0) * scale)).sort((a, b) => a - b);
    // forced page breaks (e.g. end of the cover page)
    const pageEnds = Array.from(el.querySelectorAll(".page-end"))
      .map((n) => Math.round((n.getBoundingClientRect().bottom - top0) * scale)).sort((a, b) => a - b);
    let y = 0, first = true;
    while (y < canvas.height - 2) {
      let end = Math.min(y + pagePx, canvas.height);
      const forced = pageEnds.find((b) => b > y + 2 && b <= y + pagePx + 2);
      if (forced !== undefined) {
        end = Math.min(forced, canvas.height);
      } else if (end < canvas.height) {
        const cand = breaks.filter((b) => b > y + pagePx * 0.5 && b <= end);
        if (cand.length) end = cand[cand.length - 1]!;
      }
      const slice = document.createElement("canvas");
      slice.width = canvas.width; slice.height = end - y;
      const ctx = slice.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, y, canvas.width, end - y, 0, 0, canvas.width, end - y);
      if (!first) pdf.addPage();
      pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", 0, margin, pageW, ((end - y) * pageW) / canvas.width);
      first = false; y = end;
    }
    pdf.save(buildFileName(ev.title, "pdf"));
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Impossibile generare il PDF. Riprova.");
    return false;
  } finally { el.classList.remove("pdf-mode"); }
}

function printReport(ev: Evaluation) {
  const prev = document.title;
  document.title = buildFileName(ev.title, "pdf").replace(/\.pdf$/, "");
  window.print();
  setTimeout(() => (document.title = prev), 500);
}

function App() {
  const [list, setList] = useState<Evaluation[]>([]);
  const [company, setCompany] = useState<Company>(loadCompanySafe);
  const [view, setView] = useState<View>({ kind: "list" });
  const [pendingPrint, setPendingPrint] = useState<null | "print" | "pdf">(null);
  const { remaining, showLastExportWarning, canExport, consume, dialog } = useExportQuota();

  // Controllo quota PRIMA, consumo del credito SOLO a PDF riuscito.
  const exportPdf = async (ev: Evaluation) => {
    if (!(await canExport())) return false;
    const ok = await downloadPdf(ev);
    if (ok) await consume();
    return ok;
  };
  // "Stampa" è bloccata a quota esaurita ma non scala crediti.
  const guardedPrint = async (ev: Evaluation) => {
    if (!(await canExport())) return;
    printReport(ev);
  };
  // Avviso se si lascia l'editor con modifiche non salvate (il flag arriva dall'Editor).
  const dirtyRef = useRef(false);
  const setDirtyFlag = useRef((d: boolean) => { dirtyRef.current = d; }).current;
  const goList = () => {
    if (view.kind === "edit" && dirtyRef.current && !confirm("Ci sono modifiche non salvate. Uscire comunque?")) return;
    dirtyRef.current = false;
    setView({ kind: "list" });
  };
  const actions = useRef({ exportPdf, guardedPrint });
  actions.current = { exportPdf, guardedPrint };

  useEffect(() => { setList(loadEvaluations()); setCompany(loadCompany()); }, []);

  const persist = (ev: Evaluation) => {
    const saved = { ...ev, updatedAt: new Date().toISOString() };
    const next = list.some((x) => x.id === ev.id) ? list.map((x) => (x.id === ev.id ? saved : x)) : [saved, ...list];
    setList(next); saveEvaluations(next);
    return saved;
  };

  // print/pdf from list: open report then trigger
  useEffect(() => {
    if (!pendingPrint || view.kind !== "report") return;
    const t = setTimeout(() => {
      if (pendingPrint === "print") void actions.current.guardedPrint(view.ev);
      else void actions.current.exportPdf(view.ev);
      setPendingPrint(null);
    }, 300);
    return () => clearTimeout(t);
  }, [pendingPrint, view]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onHome={goList} onBack={goList} inList={view.kind === "list"} onSettings={() => setView({ kind: "settings" })} company={company} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {view.kind === "list" && (
          <ListView
            list={list}
            onNew={() => setView({ kind: "edit", ev: newEvaluation() })}
            onOpen={(ev, mode) => setView(mode === "edit" ? { kind: "edit", ev } : { kind: "report", ev, from: "list" })}
            onDuplicate={(ev) => { const d = { ...structuredClone(ev), id: crypto.randomUUID(), title: `${ev.title} (copia)`, createdAt: new Date().toISOString() }; persist(d); toast.success("Valutazione duplicata"); }}
            onDelete={(ev) => { if (!confirm(`Eliminare "${ev.title}"?`)) return; const n = list.filter((x) => x.id !== ev.id); setList(n); saveEvaluations(n); toast.success("Valutazione eliminata"); }}
            onPrint={(ev) => { setView({ kind: "report", ev, from: "list" }); setPendingPrint("pdf"); }}
            onImport={(ev) => { persist(ev); toast.success(`Importata: ${ev.title}`); }}
          />
        )}
        {view.kind === "edit" && (
          <Editor
            key={view.ev.id}
            initial={view.ev}
            onSave={(ev) => { const s = persist(ev); setView({ kind: "edit", ev: s }); toast.success("Lavoro salvato"); }}
            onExit={() => { dirtyRef.current = false; setView({ kind: "list" }); }}
            onDirtyChange={setDirtyFlag}
            onPreview={(ev) => setView({ kind: "report", ev, from: "edit" })}
          />
        )}
        {view.kind === "report" && (
          <ReportView
            ev={view.ev} company={company}
            from={view.from} remaining={remaining} showLastExportWarning={showLastExportWarning}
            onPrint={guardedPrint} onExportPdf={exportPdf}
            onChange={(ev) => setView({ ...view, ev })}
            onBack={() => setView(view.from === "edit" ? { kind: "edit", ev: view.ev } : { kind: "list" })}
            onSave={() => { const s = persist(view.ev); setView({ ...view, ev: s }); toast.success("Report salvato"); }}
          />
        )}
        {view.kind === "settings" && (
          <Settings initial={company} onSave={(c) => { setCompany(c); saveCompany(c); toast.success("Impostazioni ditta salvate"); setView({ kind: "list" }); }} onExit={() => setView({ kind: "list" })} />
        )}
      </main>
      {dialog}
    </div>
  );
}

function loadCompanySafe(): Company {
  return { ragioneSociale: "", piva: "", indirizzo: "", telefono: "", email: "", sito: "", logo: "", responsabile: "", ruolo: "Responsabile Tecnico" };
}

function TopBar({ onHome, onBack, inList, onSettings, company }: { onHome: () => void; onBack: () => void; inList: boolean; onSettings: () => void; company: Company }) {
  const tornaElenco = useTornaElenco();
  return (
    <header className="no-print border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button onClick={onHome} className="flex items-center gap-3 text-left">
          <img src={logoApp} alt="PPWR Riutilizzo" className="h-10 w-10 object-contain" />
          <span>
            <span className="block text-base font-semibold leading-tight">PPWR Riutilizzo</span>
            <span className="block font-mono text-[11px] text-muted-foreground">Reg. UE 2025/40 · Art. 11 · All. VI-B</span>
          </span>
        </button>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {company.ragioneSociale && <span className="hidden text-sm text-muted-foreground sm:block">{company.ragioneSociale}</span>}
          {!inList && <button className={btnGhost} onClick={onBack}><ArrowLeft className="h-4 w-4" /> {tornaElenco}</button>}
          <button className={btnGhost} onClick={onSettings}><Building2 className="h-4 w-4" /> Impostazioni generali ditta</button>
          <GuidaApp />
          <ControlliSessione />
        </div>
      </div>
    </header>
  );
}

function IconBtn({ title, onClick, children, danger }: { title: string; onClick: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <button title={title} aria-label={title} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-md border border-border bg-card hover:bg-accent ${danger ? "text-destructive" : "text-foreground"}`}>
      {children}
    </button>
  );
}

function ListView({ list, onNew, onOpen, onDuplicate, onDelete, onPrint, onImport }: {
  list: Evaluation[]; onNew: () => void; onOpen: (e: Evaluation, m: "view" | "edit") => void; onDuplicate: (e: Evaluation) => void;
  onDelete: (e: Evaluation) => void; onPrint: (e: Evaluation) => void; onImport: (e: Evaluation) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => list.filter((e) => `${e.title} ${e.imballo.tipologia} ${e.imballo.modello}`.toLowerCase().includes(q.toLowerCase())), [list, q]);

  const handleFile = async (f?: File) => {
    if (!f) return;
    if (!/^\d{12}-RIUTILIZZO-PPWR-.+\.json$/i.test(f.name)) {
      toast.error("File non ammesso: il nome deve essere nel formato AAAAMMGGHHmm-RIUTILIZZO-PPWR-titolo.json");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    try {
      const res = validateImport(JSON.parse(await f.text()));
      if (!res.ok) { toast.error(res.error); return; }
      onImport(res.evaluation);
    } catch { toast.error("File non leggibile: JSON non valido."); }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Archivio</p>
          <h1 className="text-3xl font-semibold tracking-tight">Valutazioni di riutilizzabilità</h1>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".json" title="Solo file *-RIUTILIZZO-PPWR-*.json" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          <button className={btnGhost} onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Importa JSON</button>
          <button className={btnPrimary} onClick={onNew}><Plus className="h-4 w-4" /> Nuova valutazione</button>
        </div>
      </div>

      <input className={`${input} mt-6 max-w-sm`} placeholder="Cerca per titolo, tipologia, modello…" value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-8 w-8" />
            {list.length === 0 ? "Nessuna valutazione salvata. Crea la prima o importa un file JSON." : "Nessun risultato."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Titolo</th><th className="p-3">Imballo</th><th className="p-3">Settore</th><th className="p-3">Aggiornata</th><th className="p-3">Esito</th><th className="p-3 text-right">Azioni</th></tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const r = computeOutcome(e);
                return (
                  <tr key={e.id} className="border-t border-border hover:bg-accent/30">
                    <td className="p-3 font-medium">{e.title}</td>
                    <td className="p-3">{e.imballo.tipologia}{e.imballo.modello && <span className="text-muted-foreground"> · {e.imballo.modello}</span>}</td>
                    <td className="p-3">{e.imballo.settore}</td>
                    <td className="p-3 font-mono text-xs">{fmtDate(e.updatedAt)}</td>
                    <td className="p-3"><OutcomeBadge o={r.outcome} /></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn title="Vedi" onClick={() => onOpen(e, "view")}><Eye className="h-4 w-4" /></IconBtn>
                        <IconBtn title="Modifica" onClick={() => onOpen(e, "edit")}><Pencil className="h-4 w-4" /></IconBtn>
                        <IconBtn title="Duplica" onClick={() => onDuplicate(e)}><Copy className="h-4 w-4" /></IconBtn>
                        <IconBtn title="Stampa / PDF" onClick={() => onPrint(e)}><Printer className="h-4 w-4" /></IconBtn>
                        <IconBtn title="Esporta JSON" onClick={() => exportJson(e)}><FileJson className="h-4 w-4" /></IconBtn>
                        <IconBtn title="Cancella" danger onClick={() => onDelete(e)}><Trash2 className="h-4 w-4" /></IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`block ${className ?? ""}`}><span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}

function Checklist({ title, subtitle, items, answers, onChange }: { title: string; subtitle: string; items: CheckItem[]; answers: Evaluation["art11"]; onChange: (ref: string, k: "esito" | "note", v: string) => void }) {
  const opts: { v: Esito; l: string; cls: string }[] = [
    { v: "SI", l: "Sì", cls: "bg-primary text-primary-foreground border-primary" },
    { v: "NO", l: "No", cls: "bg-destructive text-destructive-foreground border-destructive" },
    { v: "NA", l: "N/A", cls: "bg-muted-foreground text-background border-muted-foreground" },
  ];
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="divide-y divide-border">
        {items.map((it) => {
          const a = answers[it.ref] ?? { esito: "" as Esito, note: "" };
          return (
            <div key={it.ref} className="grid gap-3 p-4 md:grid-cols-[4rem_1fr_auto]">
              <span className="font-mono text-sm font-bold text-primary">{it.ref}</span>
              <div>
                <p className="text-sm">{it.text}</p>
                <textarea className={`${input} mt-2 min-h-[2.5rem] text-xs`} rows={1} placeholder="Note / evidenze tecniche…" value={a.note} onChange={(e) => onChange(it.ref, "note", e.target.value)} />
              </div>
              <div className="flex gap-1 self-start">
                {opts.map((o) => (
                  <button key={o.v} onClick={() => onChange(it.ref, "esito", a.esito === o.v ? "" : o.v)}
                    className={`w-12 rounded-md border px-2 py-1.5 text-xs font-bold ${a.esito === o.v ? o.cls : "border-border bg-card hover:bg-accent"}`}>{o.l}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Editor({ initial, onSave, onExit, onPreview, onDirtyChange }: { initial: Evaluation; onSave: (e: Evaluation) => void; onExit: () => void; onPreview: (e: Evaluation) => void; onDirtyChange?: (d: boolean) => void }) {
  const [ev, setEv] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const tornaElenco = useTornaElenco();
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  const r = computeOutcome(ev);
  const upd = (fn: (e: Evaluation) => Evaluation) => { setEv(fn); setDirty(true); };
  const setI = (k: keyof Evaluation["imballo"], v: string) => upd((e) => ({ ...e, imballo: { ...e.imballo, [k]: v } }));
  const setA = (sec: "art11" | "all6b" | "sistema") => (ref: string, k: "esito" | "note", v: string) => upd((e) => ({ ...e, [sec]: { ...e[sec], [ref]: { ...e[sec][ref], [k]: v } } }));
  const setAll = (v: Esito) => upd((e) => ({ ...e, art11: Object.fromEntries(Object.entries(e.art11).map(([k, a]) => [k, { ...a, esito: v }])), all6b: Object.fromEntries(Object.entries(e.all6b).map(([k, a]) => [k, { ...a, esito: v }])), sistema: Object.fromEntries(Object.entries(e.sistema).map(([k, a]) => [k, { ...a, esito: v }])) }));
  const exit = () => { if (dirty && !confirm("Ci sono modifiche non salvate. Uscire comunque?")) return; onExit(); };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
      <div className="space-y-6">
        <section className="rounded-lg border border-border bg-card p-4">
          <Field label="Titolo identificativo della valutazione">
            <input className={`${input} text-lg font-semibold`} value={ev.title} onChange={(e) => upd((x) => ({ ...x, title: e.target.value }))} />
          </Field>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">File: {buildFileName(ev.title, "pdf").replace(".pdf", ".pdf / .json")}</p>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-lg font-semibold">Dati dell'imballaggio</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipologia imballo">
              <input list="tipologie" className={input} value={ev.imballo.tipologia} onChange={(e) => setI("tipologia", e.target.value)} />
              <datalist id="tipologie">{TIPOLOGIE.map((t) => <option key={t} value={t} />)}</datalist>
            </Field>
            <Field label="Modello / serie"><input className={input} value={ev.imballo.modello} onChange={(e) => setI("modello", e.target.value)} placeholder="es. PLI 1000L" /></Field>
            <Field label="Materiale"><input className={input} value={ev.imballo.materiale} onChange={(e) => setI("materiale", e.target.value)} placeholder="es. HDPE + gabbia acciaio zincato" /></Field>
            <Field label="Settore d'uso">
              <input list="settori" className={input} value={ev.imballo.settore} onChange={(e) => setI("settore", e.target.value)} />
              <datalist id="settori">{SETTORI.map((t) => <option key={t} value={t} />)}</datalist>
            </Field>
            <Field label="Dimensioni"><input className={input} value={ev.imballo.dimensioni} onChange={(e) => setI("dimensioni", e.target.value)} placeholder="es. 1200×1000×1160 mm" /></Field>
            <Field label="Capacità"><input className={input} value={ev.imballo.capacita} onChange={(e) => setI("capacita", e.target.value)} placeholder="es. 1000 L" /></Field>
            <Field label="Rotazioni previste"><input type="number" min={0} className={input} value={ev.imballo.rotazioniPreviste} onChange={(e) => setI("rotazioniPreviste", e.target.value)} /></Field>
            <Field label="Rotazioni effettuate"><input type="number" min={0} className={input} value={ev.imballo.rotazioniEffettuate} onChange={(e) => setI("rotazioniEffettuate", e.target.value)} /></Field>
            <Field label="Descrizione / note imballo" className="sm:col-span-2"><textarea className={input} rows={2} value={ev.imballo.descrizione} onChange={(e) => setI("descrizione", e.target.value)} /></Field>
          </div>
        </section>

        <Checklist title="1. Articolo 11 – Imballaggi riutilizzabili" subtitle="Requisiti da (a) a (i) del Regolamento UE 2025/40" items={ART11} answers={ev.art11} onChange={setA("art11")} />
        <Checklist title="2. Allegato VI, Parte B – Ricondizionamento" subtitle="Fasi B2.a – B2.g e requisito finale di salute e sicurezza" items={ALL6B} answers={ev.all6b} onChange={setA("all6b")} />

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">3. Sistema di riutilizzo e tracciabilità</h2>
          <p className="mb-4 text-sm text-muted-foreground">Come l'imballaggio torna indietro, come viene identificato e quante rotazioni ha già fatto.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo di sistema">
              <select className={input} value={ev.imballo.tipoSistema} onChange={(e) => setI("tipoSistema", e.target.value)}>
                <option value="">— seleziona —</option>
                {TIPI_SISTEMA.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Identificazione / tracciabilità"><input className={input} value={ev.imballo.tracciabilita} onChange={(e) => setI("tracciabilita", e.target.value)} placeholder="es. matricola + DataMatrix" /></Field>
            <Field label="Evidenze documentali (schede, certificati, omologazioni)" className="sm:col-span-2"><textarea className={input} rows={2} value={ev.imballo.evidenze} onChange={(e) => setI("evidenze", e.target.value)} placeholder="es. Certificato UN 31HA1/Y n. …, scheda tecnica rev. 3" /></Field>
          </div>
          {(() => { const ri = rotationIndex(ev.imballo); return ri === null ? <p className="mt-3 text-xs text-muted-foreground">Inserisci rotazioni previste ed effettuate per calcolare l'indice di utilizzo.</p> : (
            <div className="mt-4">
              <div className="flex justify-between text-xs"><span>Indice di utilizzo (rotazioni effettuate / previste)</span><span className="font-mono font-bold">{ri}%</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded bg-muted"><div className={`h-full ${ri >= 100 ? "bg-[var(--warn)]" : "bg-primary"}`} style={{ width: `${Math.min(ri, 100)}%` }} /></div>
              {ri >= 100 && <p className="mt-1 text-xs text-[var(--warn)]">Rotazioni previste raggiunte: verificare lo stato d'usura prima di un nuovo ciclo.</p>}
            </div>); })()}
        </section>
        <Checklist title="4. Requisiti del sistema di riutilizzo" subtitle="Raccolta, incentivi alla restituzione, tracciabilità ed evidenze" items={SISTEMA} answers={ev.sistema} onChange={setA("sistema")} />
      </div>

      <aside className="no-print lg:sticky lg:top-4 lg:self-start space-y-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Esito calcolato</p>
          <div className="mt-2"><OutcomeBadge o={r.outcome} /></div>
          <div className="mt-3 h-2 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${((r.total - r.vuoti) / r.total) * 100}%` }} /></div>
          <p className="mt-1 text-xs text-muted-foreground">{r.total - r.vuoti}/{r.total} voci compilate</p>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="rounded bg-muted p-2"><dt className="text-muted-foreground">SÌ</dt><dd className="text-base font-bold">{r.si}</dd></div>
            <div className="rounded bg-muted p-2"><dt className="text-muted-foreground">NO</dt><dd className="text-base font-bold text-destructive">{r.no}</dd></div>
            <div className="rounded bg-muted p-2"><dt className="text-muted-foreground">N/A</dt><dd className="text-base font-bold">{r.na}</dd></div>
          </dl>
          <button className="mt-3 w-full text-xs text-primary underline" onClick={() => setAll("SI")}>Imposta tutte le voci a "Sì"</button>
        </div>
        <div className="flex flex-col gap-2">
          <button className={`${btnPrimary} justify-center`} onClick={() => { onSave(ev); setDirty(false); }}><Save className="h-4 w-4" /> Salva il lavoro fatto</button>
          <button className={`${btnGhost} justify-center`} onClick={() => onPreview(ev)}><Eye className="h-4 w-4" /> Anteprima Report</button>
          <button className={`${btnGhost} justify-center`} onClick={() => exportJson(ev)}><FileJson className="h-4 w-4" /> Esporta JSON</button>
          <button className={`${btnGhost} justify-center`} onClick={exit}><ArrowLeft className="h-4 w-4" /> {tornaElenco}</button>
          {dirty && <p className="text-center text-xs text-[var(--warn)]">Modifiche non salvate</p>}
        </div>
      </aside>
    </div>
  );
}

function ReportView({ ev, company, from, remaining, showLastExportWarning, onPrint, onExportPdf, onChange, onBack, onSave }: { ev: Evaluation; company: Company; from: "list" | "edit"; remaining: number | null; showLastExportWarning: boolean; onPrint: (e: Evaluation) => Promise<void>; onExportPdf: (e: Evaluation) => Promise<boolean>; onChange: (e: Evaluation) => void; onBack: () => void; onSave: () => void }) {
  const [busy, setBusy] = useState(false);
  const tornaScheda = useTornaScheda();
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        {from === "edit" ? <button className={btnGhost} onClick={onBack}><ArrowLeft className="h-4 w-4" /> {tornaScheda}</button> : <span />}
        <p className="text-xs text-muted-foreground">I testi tratteggiati sono modificabili direttamente.</p>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={onSave}><Save className="h-4 w-4" /> Salva</button>
          <button className={btnGhost} onClick={() => void onPrint(ev)}><Printer className="h-4 w-4" /> Stampa</button>
          <button className={`${btnPrimary} relative`} disabled={busy} onClick={async () => { setBusy(true); try { await onExportPdf(ev); } finally { setBusy(false); } }}>
            <FileDown className="h-4 w-4" /> {busy ? "Generazione…" : "Scarica PDF"}
            <FN060_ExportCountBadge count={remaining} />
          </button>
        </div>
      </div>
      {showLastExportWarning && (
        <div role="alert" className="no-print mb-4 flex items-center gap-2 rounded-md border border-yellow-400 bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" /> Attenzione: questa è l'ultima esportazione PDF disponibile per il tuo codice PUK.
        </div>
      )}
      <div className="report-wrap overflow-x-auto rounded-lg bg-muted p-6">
        <Report ev={ev} company={company} editable onChange={onChange} />
      </div>
    </div>
  );
}

function Settings({ initial, onSave, onExit }: { initial: Company; onSave: (c: Company) => void; onExit: () => void }) {
  const tornaElenco = useTornaElenco();
  const [c, setC] = useState(initial);
  const set = (k: keyof Company, v: string) => setC((x) => ({ ...x, [k]: v }));
  const onLogo = (f?: File) => {
    if (!f) return;
    if (f.size > 1_500_000) { toast.error("Logo troppo grande (max 1,5 MB)."); return; }
    const r = new FileReader(); r.onload = () => set("logo", String(r.result)); r.readAsDataURL(f);
  };
  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Configurazione</p>
      <h1 className="text-3xl font-semibold tracking-tight">Impostazioni generali ditta</h1>
      <p className="mt-1 text-sm text-muted-foreground">Questi dati vengono riportati automaticamente nell'intestazione e nella firma di tutti i report.</p>
      <div className="mt-6 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        <Field label="Ragione sociale" className="sm:col-span-2"><input className={input} value={c.ragioneSociale} onChange={(e) => set("ragioneSociale", e.target.value)} /></Field>
        <Field label="P.IVA / Codice fiscale"><input className={input} value={c.piva} onChange={(e) => set("piva", e.target.value)} /></Field>
        <Field label="Indirizzo"><input className={input} value={c.indirizzo} onChange={(e) => set("indirizzo", e.target.value)} /></Field>
        <Field label="Telefono"><input className={input} value={c.telefono} onChange={(e) => set("telefono", e.target.value)} /></Field>
        <Field label="Email"><input className={input} value={c.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Sito web" className="sm:col-span-2"><input className={input} value={c.sito} onChange={(e) => set("sito", e.target.value)} /></Field>
        <Field label="Responsabile tecnico / firmatario"><input className={input} value={c.responsabile} onChange={(e) => set("responsabile", e.target.value)} /></Field>
        <Field label="Ruolo"><input className={input} value={c.ruolo} onChange={(e) => set("ruolo", e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Logo aziendale</span>
          <div className="flex items-center gap-4">
            {c.logo ? <img src={c.logo} alt="Logo" className="h-16 rounded border border-border bg-card object-contain p-1" /> : <div className="grid h-16 w-24 place-items-center rounded border border-dashed border-border text-xs text-muted-foreground">Nessun logo</div>}
            <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} className="text-sm" />
            {c.logo && <button className="text-xs text-destructive underline" onClick={() => set("logo", "")}>Rimuovi</button>}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className={btnGhost} onClick={onExit}><ArrowLeft className="h-4 w-4" /> {tornaElenco}</button>
        <button className={btnPrimary} onClick={() => onSave(c)}><Save className="h-4 w-4" /> Salva impostazioni</button>
      </div>
    </div>
  );
}
