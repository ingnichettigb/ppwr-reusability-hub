/* ==============================================================================
 *  TITOLO FILE      : ControlliSessione.tsx - Email utente, lingua e pulsanti di uscita
 *  PERCORSO         : src/components/ControlliSessione.tsx
 *  PROGETTO         : ppwr-reusability-hub (PPWR Reusability Hub)
 *  REVISIONE        : 01
 *  DATA E ORA REV.  : 2026-10-23 20:39 (ora italiana)
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
 *    Rev. 01 | 2026-10-23 20:39 | Creazione del file, ricavato dall'esempio Intestazione.tsx del kit.
 * ============================================================================== */
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { SelettoreLingua } from "@/components/SelettoreLingua";
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
      <button type="button" onClick={chiudiApplicazione} className={btn}>{ta("usc.chiudiApp")}</button>
      <button type="button" onClick={esci} className={btn}>{ta("usc.esci")}</button>
      <button type="button" onClick={esciECancella} className={btnDanger}>{ta("usc.esciCancella")}</button>
      {erroreUscita && <p role="alert" className="w-full text-right text-[12px] text-destructive">{erroreUscita}</p>}
    </div>
  );
}
