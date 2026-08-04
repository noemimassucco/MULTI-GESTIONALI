import { cn } from "@/lib/cn";

const varianti = {
  neutra: "bg-surface-alt text-ink-600 ring-1 ring-inset ring-line",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
  contorno: "bg-white text-ink-600 ring-1 ring-inset ring-line",
  successo: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  attesa: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  chiara: "bg-white/10 text-sole-300 ring-1 ring-inset ring-white/20",
};

/**
 * Etichetta piccola: categoria, stato, tag.
 * Altezza fissa a 26px perché in fila con altre pastiglie non balli.
 */
export default function Pastiglia({ variante = "neutra", colore, className, children }) {
  const stile = colore
    ? { color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }
    : undefined;

  return (
    <span
      style={stile}
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-mini font-semibold leading-none",
        colore ? "ring-1 ring-inset ring-current/15" : varianti[variante] || varianti.neutra,
        className,
      )}
    >
      {children}
    </span>
  );
}
