import { useEffect, useRef } from "react";
import { ALL6B, ART11, SISTEMA, rotationIndex, computeOutcome, defaultConclusion, defaultIntro, fmtDate, NOTA_NORMATIVA, type Company, type Evaluation, type CheckItem, type Answer } from "@/lib/ppwr";

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
  const tone = res.outcome === "IDONEO" ? "border-primary text-primary" : res.outcome === "NON IDONEO" ? "border-destructive text-destructive" : "border-[var(--warn)] text-[var(--warn)]";

  return (
    <div id="report-doc" className="report-paper mx-auto bg-white text-[#1a1a1a] p-[14mm] w-[210mm] max-w-full text-[13px] leading-relaxed font-serif-report">
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
        <div className="text-right text-[11px] font-mono">
          <div>Rif. Reg. UE 2025/40</div>
          <div>Data: {fmtDate(ev.updatedAt)}</div>
        </div>
      </header>

      <h1 className="mt-6 text-[20px] font-bold leading-tight">Valutazione della riutilizzabilità dell'imballaggio</h1>
      <div className="text-[15px] font-semibold">{ev.title}</div>

      <h2 className="mt-5 mb-1 text-[14px] font-bold uppercase tracking-wide">Introduzione e inquadramento normativo</h2>
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
        <div className={`mb-3 flex items-center justify-between border-2 ${tone} px-4 py-2`}>
          <span className="text-[16px] font-bold">ESITO: {res.outcome}</span>
          <span className="font-mono text-[11px] text-[#1a1a1a]">SÌ {res.si} · NO {res.no} · N/A {res.na} · da compilare {res.vuoti} · conformità {res.score}%</span>
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
  );
}
