/** Etichetta piccola: categoria, stato, tag funzionalità. */
export default function Pastiglia({ variante = "neutra", colore, className = "", children }) {
  const varianti = {
    neutra: "bg-surface-alt text-ink-600 ring-1 ring-inset ring-line",
    brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
    contorno: "bg-white text-ink-600 ring-1 ring-inset ring-line",
    successo: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
    attesa: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
  };

  const stile = colore
    ? { color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }
    : undefined;

  return (
    <span
      style={stile}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${
        colore ? "" : varianti[variante] || varianti.neutra
      } ${className}`}
    >
      {children}
    </span>
  );
}
