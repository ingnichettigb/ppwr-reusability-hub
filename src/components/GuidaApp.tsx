/* ==============================================================================
 *  TITOLO FILE      : GuidaApp.tsx - Pulsante «i» e finestra della guida in-app
 *  PERCORSO         : src/components/GuidaApp.tsx
 *  PROGETTO         : ppwr-reusability-hub (PPWR Reusability Hub)
 *  REVISIONE        : 01
 *  DATA E ORA REV.  : 2026-10-23 20:49 (ora italiana)
 * ------------------------------------------------------------------------------
 *  DESCRIZIONE
 *    Pulsante tondo «i» nell'intestazione che apre la guida all'uso nella lingua
 *    scelta (IT, EN, DE, ES). Sezioni a comparsa; testi in src/lib/guida-testi.ts.
 * ------------------------------------------------------------------------------
 *  STORICO REVISIONI (dalla più recente)
 *    Rev. 01 | 2026-10-23 20:49 | Creazione del file.
 * ============================================================================== */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLingua } from "@/lib/i18n";
import { GUIDA } from "@/lib/guida-testi";

export function GuidaApp() {
  const { lingua } = useLingua();
  const g = GUIDA[lingua] ?? GUIDA.it;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          title={g.bottone}
          aria-label={g.bottone}
          className="grid h-8 w-8 place-items-center rounded-full border border-primary bg-card text-[14px] font-bold italic text-foreground transition-colors hover:bg-accent"
        >
          i
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{g.titolo}</DialogTitle>
          <DialogDescription>{g.intro}</DialogDescription>
        </DialogHeader>
        <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{g.notaLingua}</p>
        <div className="space-y-2">
          {g.sezioni.map((s, i) => (
            <details key={s.titolo} open={i === 0} className="rounded-md border border-border">
              <summary className="cursor-pointer px-3 py-2 text-sm font-semibold">{s.titolo}</summary>
              <ul className="list-disc space-y-1.5 px-8 pb-3 pt-1 text-sm text-muted-foreground">
                {s.righe.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
