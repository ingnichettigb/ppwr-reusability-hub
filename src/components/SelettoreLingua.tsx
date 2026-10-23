// ======================================================================
// Nome File: SelettoreLingua.tsx
// Percorso: src/components/SelettoreLingua.tsx
// Revisione: Rev. 1
// Data/Ora: 2026-10-23 15:42
// ======================================================================

// Selettore della lingua dell'applicazione (it, en, de, es).
// La scelta guida anche i testi del modulo accesso-controllato (via useLinguaApp).
import { useLingua } from "@/lib/i18n";
import type { Lingua } from "@/lib/i18n";

const LINGUE: Lingua[] = ["it", "en", "de", "es"];
const SIGLE: Record<Lingua, string> = { it: "IT", en: "EN", de: "DE", es: "ES" };
const NOMI: Record<Lingua, string> = { it: "Italiano", en: "English", de: "Deutsch", es: "Español" };

export function SelettoreLingua() {
  const { lingua, setLingua } = useLingua();
  return (
    <select
      value={lingua}
      onChange={(e) => setLingua(e.target.value as Lingua)}
      aria-label="Selezione lingua"
      title={NOMI[lingua]}
      className="rounded-lg border-[1.5px] border-signal bg-white px-2 py-1.5 text-[13px] font-semibold text-ink"
    >
      {LINGUE.map((l) => (
        <option key={l} value={l}>
          {SIGLE[l]}
        </option>
      ))}
    </select>
  );
}
