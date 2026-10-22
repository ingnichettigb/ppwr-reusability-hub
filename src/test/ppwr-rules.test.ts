import { describe, it, expect } from "vitest";
import { computeOutcome, newEvaluation, rotationIndex, SISTEMA, validateImport, APP_SIGNATURE } from "@/lib/ppwr";

const allSi = () => {
  const e = newEvaluation();
  for (const s of ["art11", "all6b", "sistema"] as const) for (const k of Object.keys(e[s])) e[s][k]!.esito = "SI";
  return e;
};

describe("regole PPWR", () => {
  it("un NO nel sistema di riutilizzo rende NON IDONEO", () => {
    const e = allSi(); e.sistema[SISTEMA[0]!.ref]!.esito = "NO";
    expect(computeOutcome(e).outcome).toBe("NON IDONEO");
  });
  it("voce del sistema vuota rende INCOMPLETO", () => {
    const e = allSi(); e.sistema["S4"]!.esito = "";
    expect(computeOutcome(e).outcome).toBe("INCOMPLETO");
  });
  it("tutto SÌ è IDONEO su 23 voci", () => {
    const r = computeOutcome(allSi());
    expect(r.outcome).toBe("IDONEO"); expect(r.total).toBe(23);
  });
  it("indice di utilizzo = effettuate / previste", () => {
    const e = newEvaluation(); e.imballo.rotazioniPreviste = "12"; e.imballo.rotazioniEffettuate = "9";
    expect(rotationIndex(e.imballo)).toBe(75);
    e.imballo.rotazioniPreviste = "";
    expect(rotationIndex(e.imballo)).toBeNull();
  });
  it("importa file vecchi senza la sezione sistema", () => {
    const e = newEvaluation() as any; delete e.sistema;
    const r = validateImport({ app: APP_SIGNATURE, schemaVersion: 1, evaluation: e });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Object.keys(r.evaluation.sistema)).toHaveLength(SISTEMA.length);
  });
});

import { buildFileName as _bfn } from "@/lib/ppwr";
import { test as _t, expect as _e } from "vitest";
_t("nome file usa RIUTILIZZO-PPWR", () => {
  _e(_bfn("IBC PLI 1000L", "pdf", new Date(2026, 9, 7, 21, 7))).toBe("202610072107-RIUTILIZZO-PPWR-IBC_PLI_1000L.pdf");
});
