// ======================================================================
// Nome File: condizioni.tsx
// Percorso: src/routes/condizioni.tsx
// Revisione: Rev. 3 (titolo neutro: il titolo tradotto lo imposta la pagina nella lingua scelta)
// Data/Ora: 2026-10-05 13:00
// ======================================================================

// Rotta /condizioni (schermata 0003): file di collegamento verso il modulo accesso-controllato.
import { createFileRoute } from "@tanstack/react-router";
import { APP_NAME } from "@/moduli/accesso-controllato/config";
import { FN054_PaginaCondizioni } from "@/moduli/accesso-controllato/pagine/PaginaCondizioni";

export const Route = createFileRoute("/condizioni")({
  head: () => ({
    meta: [
      { title: APP_NAME },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FN054_PaginaCondizioni,
});
