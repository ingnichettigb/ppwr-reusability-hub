// ======================================================================
// Nome File: auth.tsx
// Percorso: src/routes/auth.tsx
// Revisione: Rev. 3 (titolo neutro: il titolo tradotto lo imposta la pagina nella lingua scelta)
// Data/Ora: 2026-10-05 13:00
// ======================================================================

// Rotta /auth (schermata 0001): file di collegamento verso il modulo accesso-controllato.
import { createFileRoute } from "@tanstack/react-router";
import { APP_NAME } from "@/moduli/accesso-controllato/config";
import { FN048_PaginaAuth } from "@/moduli/accesso-controllato/pagine/PaginaAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: APP_NAME },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FN048_PaginaAuth,
});
