/* ==============================================================================
 *  TITOLO FILE      : ControlliSessione.tsx - Email utente, lingua e pulsanti di uscita
 *  PERCORSO         : src/components/ControlliSessione.tsx
 *  PROGETTO         : ppwr-reusability-hub (PPWR Reusability Hub)
 *  REVISIONE        : 02
 *  DATA E ORA REV.  : 2026-10-24 15:43 (ora italiana)
 * ------------------------------------------------------------------------------
 *  DESCRIZIONE
 *    Blocco dell'intestazione: email dell'utente connesso (icona profilo), selettore
 *    lingua (IT, EN, DE, ES) e pulsanti "Chiudi applicazione", "Esci" ed
 *    "Esci e cancella tutto". I testi vengono dal dizionario del modulo
 *    accesso-controllato (chiavi usc.*), come da kit; non vanno aggiunti altrove.
 *    - Chiudi applicazione: logout + window.close(), con ritorno a /auth se la scheda resta aperta.
 *    - Esci: logout mantenendo licenza e PUK sul dispositivo.
 *    - Esci e cancella tutto: logout e cancellazione di email, licenza, PUK e consenso locali
 *      (FN016_EsciECancellaTutto). Gli archivi dati dell'app (ppwr.*) non vengono toccati.
 * ------------------------------------------------------------------------------
 *  STORICO REVISIONI (dalla più recente)
 *    Rev. 02 | 2026-10-24 15:43 | Conferma molto chiara prima di «Chiudi applicazione», «Esci» ed «Esci e cancella tutto»
 *                                  (cosa succede, cosa resta salvato, suggerimento «Torna all'elenco»), in 4 lingue.
 *    Rev. 01 | 2026-10-23 20:39 | Creazione del file, ricavato dall'esempio Intestazione.tsx del kit.
 * ============================================================================== */
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlert, User } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { SelettoreLingua } from "@/components/SelettoreLingua";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConferme, type TipoConferma } from "@/lib/conferme-testi";
import { VERIFIED_EMAIL_KEY } from "@/moduli/accesso-controllato/config";
import { useTestiAccesso } from "@/moduli/accesso-controllato/testi";
import { FN008_LeggiChiave, FN016_EsciECancellaTutto } from "@/moduli/accesso-controllato/stato";

const btn = "inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent";
const btnDanger = "inline-flex items-center rounded-md border border-destructive bg-card px-3 py-1.5 text-[13px] font-medium text-destructive transition-colors hover:bg-destructive/10";

export function ControlliSessione() {
  const { t: ta, te } = useTestiAccesso();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [emailUtente, setEmailUtente] = useState<string | null>(null);
  const [erroreUscita, setErroreUscita] = useState<string | null>(null);
  const [conferma, setConferma] = useState<TipoConferma | null>(null);
  const cf = useConferme();

  useEffect(() => {
    setEmailUtente(FN008_LeggiChiave(VERIFIED_EMAIL_KEY));
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setEmailUtente(data.user.email);
    });
  }, []);

  async function esci() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function esciECancella() {
    await qc.cancelQueries();
    qc.clear();
    await FN016_EsciECancellaTutto();
    navigate({ to: "/auth", replace: true });
  }

  async function chiudiApplicazione() {
    await qc.cancelQueries();
    qc.clear();
    try {
      await supabase.auth.signOut();
    } catch (errore) {
      console.error("ERR900: Logout non riuscito durante la chiusura dell'applicazione", errore);
      setErroreUscita(te("ERR900"));
      return;
    }
    window.close(); // i browser la consentono solo se la scheda è stata aperta da script
    navigate({ to: "/auth", replace: true }); // fallback: la scheda resta aperta
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {emailUtente && (
        <div title={emailUtente} className="flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-[12px] text-muted-foreground">
          <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span className="max-w-[160px] truncate sm:max-w-[260px]">{emailUtente}</span>
        </div>
      )}
      <SelettoreLingua />
      <button type="button" onClick={() => setConferma("chiudi")} className={btn}>{ta("usc.chiudiApp")}</button>
      <button type="button" onClick={() => setConferma("esci")} className={btn}>{ta("usc.esci")}</button>
      <button type="button" onClick={() => setConferma("cancella")} className={btnDanger}>{ta("usc.esciCancella")}</button>
      {erroreUscita && <p role="alert" className="w-full text-right text-[12px] text-destructive">{erroreUscita}</p>}

      <AlertDialog open={conferma !== null} onOpenChange={(aperto) => { if (!aperto) setConferma(null); }}>
        {conferma && (
          <AlertDialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <TriangleAlert className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                {cf.voci[conferma].titolo}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm text-foreground">
                  <p className="font-semibold">{cf.voci[conferma].intro}</p>
                  <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
                    <p className="mb-1 font-semibold text-destructive">{cf.etichettaSuccede}</p>
                    <ul className="list-disc space-y-1 pl-5">
                      {cf.voci[conferma].succede.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                    <p className="mb-1 font-semibold text-primary">{cf.etichettaResta}</p>
                    <ul className="list-disc space-y-1 pl-5">
                      {cf.voci[conferma].resta.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                  <p className="rounded-md border border-yellow-400 bg-yellow-50 p-3 text-yellow-900">{cf.voci[conferma].suggerimento}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:justify-between">
              <AlertDialogCancel autoFocus>{cf.voci[conferma].annulla}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  const tipo = conferma;
                  setConferma(null);
                  if (tipo === "chiudi") void chiudiApplicazione();
                  else if (tipo === "esci") void esci();
                  else void esciECancella();
                }}
              >
                {cf.voci[conferma].conferma}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}
