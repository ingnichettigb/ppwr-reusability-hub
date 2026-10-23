// ======================================================================
// Nome File: attivazione.tsx
// Percorso: src/routes/attivazione.tsx
// Revisione: Rev. 3 (titolo neutro: il titolo tradotto lo imposta la pagina nella lingua scelta)
// Data/Ora: 2026-10-05 13:00
// ======================================================================

// Rotta /attivazione (schermata 0002): file di collegamento verso il modulo accesso-controllato.
import { createFileRoute } from "@tanstack/react-router";
import { APP_NAME } from "@/moduli/accesso-controllato/config";
import { FN052_PaginaAttivazione } from "@/moduli/accesso-controllato/pagine/PaginaAttivazione";

export const Route = createFileRoute("/attivazione")({
  head: () => ({
    meta: [
      { title: APP_NAME },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FN052_PaginaAttivazione,
});
