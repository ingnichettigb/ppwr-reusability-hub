/**
 * File: Report.tsx
 * Percorso di destinazione: src/components/ppwr/Report.tsx
 * Progetto: ppwr-reusability-hub (PPWR Reusability Hub)
 * Ultima revisione: 2026-10-22
 * Descrizione: Documento del report di riutilizzabilità (anteprima, stampa e PDF).
 * Modifiche:
 *  - 2026-10-22: aggiunto il logo "PPWR Reusability Hub" (src/assets/logo-ppwr-hub.png)
 *    nell'intestazione del report, a destra; il logo aziendale a sinistra resta invariato.
 *  - 2026-10-22: nuova prima pagina (A4 intera) con intestazione, titolo, dati essenziali,
 *    esito e barra "Requisiti soddisfatti" colorata in base all'esito; introduzione, dati
 *    completi e sezioni 1-5 dalla pagina 2.
 *  - 2026-10-22: riquadro finale "Esito e conclusioni" ridisegnato (icona, caselle SÌ/NO/N/A/
 *    da compilare, barra con la dicitura "Indicatore di completezza della checklist").
 *  - 2026-10-22: margini laterali 12 mm (quelli verticali sono gestiti da PDF/stampa).
 */
import { useEffect, useRef } from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import hubLogo from "@/assets/logo-ppwr-hub.png";
import { ALL6B, ART11, SISTEMA, rotationIndex, computeOutcome, defaultConclusion, defaultIntro, fmtDate, NOTA_NORMATIVA, type Company, type Evaluation, type CheckItem, type Answer } from "@/lib/ppwr";

const CAPTION = "Indicatore di completezza della checklist";

// Stile per esito: verde = IDONEO, rosso = NON IDONEO, ambra a righe = INCOMPLETO (leggibile anche in bianco e nero)
function toneOf(outcome: string) {
  if (outcome === "IDONEO") return { border: "border-primary", fill: "bg-primary", iconBg: "bg-primary text-white", Icon: Check, striped: false };
  if (outcome === "NON IDONEO") return { border: "border-destructive", fill: "bg-destructive", iconBg: "bg-destructive text-white", Icon: X, striped: false };
  return { border: "border-[var(--warn)]", fill: "bg-[var(--warn)]", iconBg: "bg-[var(--warn)] text-[#1a1a1a]", Icon: TriangleAlert, striped: true };
}

function outcomeText(outcome: string, vuoti: number) {
  if (outcome === "IDONEO") return "Tutti i requisiti applicabili sono soddisfatti.";
  if (outcome === "NON IDONEO") return "Almeno un requisito non è soddisfatto.";
  return vuoti > 0 ? `Valutazione incompleta: ${vuoti} ${vuoti === 1 ? "voce" : "voci"} ancora da compilare.` : "Valutazione incompleta.";
}

function ConformityBar({ score, outcome, big }: { score: number; outcome: string; big?: boolean }) {
  const t = toneOf(outcome);
  return (
    <div className="font-sans">
      <div className="flex items-end justify-between">
        <span className={`font-bold ${big ? "text-[18px]" : "text-[15px]"}`}>Requisiti soddisfatti</span>
        <span className={`font-extrabold leading-none ${big ? "text-[46px]" : "text-[30px]"}`}>{score}%</span>
      </div>
      <div
        role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="Requisiti soddisfatti"
        className={`mt-2 overflow-hidden rounded-full border-2 border-[#1a1a1a] bg-white ${big ? "h-9" : "h-6"}`}
      >
        <div
          className={`h-full ${t.fill}`}
          style={{ width: `${score}%`, ...(t.striped ? { backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0 6px, transparent 6px 12px)" } : {}) }}
        />
      </div>
      <div className={`mt-1.5 text-[#333] ${big ? "text-[13px]" : "text-[12px]"}`}>{CAPTION}</div>
    </div>
  );
}

const label = (e: string) => (e === "SI" ? "SÌ" : e === "NO" ? "NO" : e === "NA" ? "N/A" : "—");

function Editable({ value, onChange, editable, className }: { value: string; onChange: (v: string) => void; editable: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) ref.current.innerText = value;
  }, [value]);
  return (
    <div
      ref={ref}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={(ev) => onChange(ev.currentTarget.innerText)}
      className={`whitespace-pre-wrap ${editable ? "rounded outline-dashed outline-1 outline-primary/40 hover:bg-accent/40 focus:bg-accent/60 focus:outline-primary p-1 -m-1" : ""} ${className ?? ""}`}
    />
  );
}

function Table({ items, answers, refLabel }: { items: CheckItem[]; answers: Record<string, Answer>; refLabel: string }) {
  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr className="bg-[var(--report-head)]">
          <th className="border border-[var(--report-line)] p-1.5 w-16 text-left">{refLabel}</th>
          <th className="border border-[var(--report-line)] p-1.5 text-left">Requisito</th>
          <th className="border border-[var(--report-line)] p-1.5 w-14">Esito</th>
          <th className="border border-[var(--report-line)] p-1.5 w-[32%] text-left">Note / evidenze</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => {
          const a = answers[it.ref];
          return (
            <tr key={it.ref} style={{ breakInside: "avoid" }}>
              <td className="border border-[var(--report-line)] p-1.5 font-bold align-top">{it.ref}</td>
              <td className="border border-[var(--report-line)] p-1.5 align-top">{it.text}</td>
              <td className={`border border-[var(--report-line)] p-1.5 text-center font-bold align-top ${a?.esito === "NO" ? "text-destructive" : ""}`}>{label(a?.esito ?? "")}</td>
              <td className="border border-[var(--report-line)] p-1.5 align-top whitespace-pre-wrap">{a?.note}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function Report({ ev, company, editable, onChange }: { ev: Evaluation; company: Company; editable: boolean; onChange: (e: Evaluation) => void }) {
  const res = computeOutcome(ev);
  const i = ev.imballo;
  const setRep = (k: keyof Evaluation["report"], v: string) => onChange({ ...ev, report: { ...ev.report, [k]: v } });
  const rows: [string, string][] = [
    ["Tipologia imballo", i.tipologia], ["Modello / serie", i.modello], ["Materiale", i.materiale],
    ["Dimensioni", i.dimensioni], ["Capacità", i.capacita], ["Settore d'uso", i.settore],
    ["Rotazioni previste", i.rotazioniPreviste], ["Rotazioni effettuate", i.rotazioniEffettuate],
  ];
  const tone = toneOf(res.outcome);
  const Icon = tone.Icon;
  const essenziali: [string, string][] = [["Tipologia imballo", i.tipologia], ["Modello / serie", i.modello], ["Settore d'uso", i.settore], ["Capacità", i.capacita]];

  return (
    <div id="report-doc" className="report-paper mx-auto bg-white text-[#1a1a1a] px-[12mm] py-[12mm] w-[210mm] max-w-full text-[13px] leading-relaxed font-serif-report">
      <section className="report-cover page-end flex flex-col">
        <header className="flex items-start justify-between gap-6 border-b-2 border-[#1a1a1a] pb-3">
          <div className="flex items-start gap-3">
            {company.logo && <img src={company.logo} alt="Logo" className="h-14 w-auto object-contain" />}
            <div className="text-[11px] leading-snug">
              <div className="text-[15px] font-bold">{company.ragioneSociale || "Ragione sociale non impostata"}</div>
              {company.indirizzo && <div>{company.indirizzo}</div>}
              {company.piva && <div>P.IVA/CF: {company.piva}</div>}
              <div>{[company.telefono, company.email, company.sito].filter(Boolean).join(" · ")}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-right text-[11px] font-mono">
              <div className="font-sans text-[12px] font-extrabold leading-tight text-[#064a25]">PPWR<br />Reusability Hub</div>
              <div className="mt-1">Rif. Reg. UE 2025/40</div>
              <div>Data: {fmtDate(ev.updatedAt)}</div>
            </div>
            <img src={hubLogo} alt="Logo PPWR Reusability Hub" className="h-14 w-auto object-contain" />
          </div>
        </header>

        <div className="mt-12">
          <div className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-[#064a25]">Relazione di valutazione</div>
          <h1 className="mt-2 text-[30px] font-bold leading-tight">Valutazione della riutilizzabilità dell'imballaggio</h1>
          <div className="mt-3 line-clamp-2 break-words text-[22px] font-semibold leading-snug">{ev.title}</div>
          <div className="mt-2 font-sans text-[13px] text-[#333]">Regolamento (UE) 2025/40 · Art. 11 e Allegato VI, Parte B</div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 border-t-2 border-[#1a1a1a] pt-6">
          {essenziali.map(([k, v]) => (
            <div key={k}>
              <dt className="font-sans text-[12px] font-bold uppercase tracking-[0.15em] text-[#333]">{k}</dt>
              <dd className="mt-1 line-clamp-2 break-words text-[19px] font-semibold leading-snug">{v || "—"}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto">
          <div className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-[#064a25]">Risultato della valutazione</div>
          <div className={`mt-2 flex items-center gap-5 rounded-md border-2 ${tone.border} p-4`}>
            <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${tone.iconBg}`}><Icon className="h-10 w-10" strokeWidth={3.5} aria-hidden /></div>
            <div>
              <div className="font-sans text-[30px] font-extrabold leading-none">ESITO: {res.outcome}</div>
              <div className="mt-2 font-sans text-[14px]">{outcomeText(res.outcome, res.vuoti)}</div>
            </div>
          </div>
          <div className="mt-6"><ConformityBar score={res.score} outcome={res.outcome} big /></div>
        </div>
      </section>

      <div className="report-body">
        <div className="mb-4 border-b border-[#999] pb-1 font-sans text-[11px] text-[#333]">Valutazione della riutilizzabilità · <span className="font-semibold">{ev.title}</span></div>

      <h2 className="mb-1 text-[14px] font-bold uppercase tracking-wide">Introduzione e inquadramento normativo</h2>
      <Editable editable={editable} value={ev.report.introduzione || defaultIntro(ev)} onChange={(v) => setRep("introduzione", v)} />

      <h2 className="mt-5 mb-2 text-[14px] font-bold uppercase tracking-wide">Dati dell'imballaggio</h2>
      <table className="w-full border-collapse text-[12px]">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}><td className="border border-[var(--report-line)] p-1.5 w-1/3 bg-[var(--report-head)] font-semibold">{k}</td><td className="border border-[var(--report-line)] p-1.5">{v || "—"}</td></tr>
          ))}
          {i.descrizione && <tr><td className="border border-[var(--report-line)] p-1.5 bg-[var(--report-head)] font-semibold">Descrizione</td><td className="border border-[var(--report-line)] p-1.5 whitespace-pre-wrap">{i.descrizione}</td></tr>}
        </tbody>
      </table>

      <h2 className="mt-6 mb-2 text-[14px] font-bold uppercase tracking-wide">1. Verifica requisiti Articolo 11 – Imballaggi riutilizzabili</h2>
      <Table items={ART11} answers={ev.art11} refLabel="Rif." />

      <h2 className="mt-6 mb-2 text-[14px] font-bold uppercase tracking-wide">2. Processi di ricondizionamento – Allegato VI, Parte B</h2>
      <Table items={ALL6B} answers={ev.all6b} refLabel="Punto" />

      <h2 className="mt-6 mb-2 text-[14px] font-bold uppercase tracking-wide">3. Sistema di riutilizzo e tracciabilità</h2>
      <table className="mb-3 w-full border-collapse text-[12px]">
        <tbody>
          {([["Tipo di sistema", i.tipoSistema], ["Identificazione / tracciabilità", i.tracciabilita], ["Indice di utilizzo", rotationIndex(i) === null ? "" : `${rotationIndex(i)}% (${i.rotazioniEffettuate} su ${i.rotazioniPreviste} rotazioni previste)`], ["Evidenze documentali", i.evidenze]] as const).map(([k, v]) => (
            <tr key={k}><td className="border border-[var(--report-line)] p-1.5 w-1/3 bg-[var(--report-head)] font-semibold">{k}</td><td className="border border-[var(--report-line)] p-1.5 whitespace-pre-wrap">{v || "—"}</td></tr>
          ))}
        </tbody>
      </table>
      <Table items={SISTEMA} answers={ev.sistema ?? {}} refLabel="Rif." />

      <h2 className="mt-6 mb-1 text-[14px] font-bold uppercase tracking-wide">4. Nota normativa</h2>
      <p className="italic text-[12px]">{NOTA_NORMATIVA}</p>

      <div style={{ breakInside: "avoid" }}>
        <h2 className="mt-6 mb-2 text-[14px] font-bold uppercase tracking-wide">5. Esito e conclusioni</h2>
        <div className={`mb-4 rounded-md border-2 ${tone.border} p-5`}>
          <div className="flex items-center gap-4">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${tone.iconBg}`}><Icon className="h-9 w-9" strokeWidth={3.5} aria-hidden /></div>
            <div className="font-sans text-[26px] font-extrabold leading-tight">ESITO: {res.outcome}</div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 font-sans">
            {([["SÌ", res.si], ["NO", res.no], ["N/A", res.na], ["Da compilare", res.vuoti]] as [string, number][]).map(([k, v]) => (
              <div key={k} className="rounded border-2 border-[#1a1a1a] px-2 py-2 text-center">
                <div className={`text-[26px] font-extrabold leading-none ${k === "NO" && v > 0 ? "text-destructive" : ""}`}>{v}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider">{k}</div>
              </div>
            ))}
          </div>
          <div className="mt-5"><ConformityBar score={res.score} outcome={res.outcome} /></div>
        </div>
        <Editable editable={editable} value={ev.report.conclusioni || defaultConclusion(ev)} onChange={(v) => setRep("conclusioni", v)} />
      </div>

      {(editable || ev.report.noteGenerali) && (
        <>
          <h2 className="mt-5 mb-1 text-[14px] font-bold uppercase tracking-wide">Note generali</h2>
          <Editable editable={editable} value={ev.report.noteGenerali || (editable ? "" : "")} onChange={(v) => setRep("noteGenerali", v)} className="min-h-6" />
        </>
      )}

      <div className="mt-12 flex justify-end" style={{ breakInside: "avoid" }}>
        <div className="w-64 text-center text-[12px]">
          <div>{company.ruolo || "Responsabile Tecnico"}</div>
          <div className="mt-10 border-t border-[#1a1a1a] pt-1 font-semibold">{company.responsabile || "\u00a0"}</div>
        </div>
      </div>
      </div>
    </div>
  );
}
