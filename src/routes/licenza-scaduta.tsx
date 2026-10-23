// ======================================================================
// Nome File: licenza-scaduta.tsx
// Percorso: src/routes/licenza-scaduta.tsx
// Revisione: Rev. 3 (titolo neutro: il titolo tradotto lo imposta la pagina nella lingua scelta)
// Data/Ora: 2026-10-05 13:00
// ======================================================================

// Rotta /licenza-scaduta (schermata 0004): file di collegamento verso il modulo accesso-controllato.
import { createFileRoute } from "@tanstack/react-router";
import { APP_NAME } from "@/moduli/accesso-controllato/config";
import { FN056_PaginaLicenzaScaduta } from "@/moduli/accesso-controllato/pagine/PaginaLicenzaScaduta";

export const Route = createFileRoute("/licenza-scaduta")({
  head: () => ({
    meta: [
      { title: APP_NAME },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FN056_PaginaLicenzaScaduta,
});
