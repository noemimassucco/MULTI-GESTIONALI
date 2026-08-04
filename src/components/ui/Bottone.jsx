import Link from "next/link";
import { cn } from "@/lib/cn";

const varianti = {
  /* L'azione principale è verde petrolio pieno: una sola per schermata. */
  primario: "bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800",
  secondario:
    "bg-white text-ink-800 ring-1 ring-inset ring-line hover:bg-surface-alt hover:ring-ink-400",
  /* Terracotta: si usa quando l'azione è la promessa del sito, non un comando. */
  accento: "bg-accento-500 text-white hover:bg-accento-600 active:bg-accento-700",
  scuro: "bg-ink-900 text-white hover:bg-ink-800",
  tenue: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  fantasma: "text-ink-700 hover:text-brand-700 hover:bg-brand-50",
  /* Per i fondi scuri (sezioni verde petrolio). */
  chiaro: "bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/16",
};

/* Tre altezze, non una di più. Corrispondono a --h-sm / --h-md / --h-lg. */
const misure = {
  sm: "h-10 px-4 text-piccolo gap-1.5",
  md: "h-12 px-5 text-corrente gap-2",
  lg: "h-14 px-7 text-testo gap-2.5",
};

/**
 * Bottone o collegamento con lo stesso aspetto.
 * Con `href` produce un <Link>, altrimenti un <button>.
 * Le classi passate da fuori vincono sempre su quelle interne (vedi cn).
 */
export default function Bottone({
  href,
  variante = "primario",
  misura = "md",
  className,
  children,
  ...props
}) {
  const classi = cn(
    "inline-flex items-center justify-center rounded-[var(--radius-controllo)] font-semibold",
    "whitespace-nowrap transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    varianti[variante] || varianti.primario,
    misure[misura] || misure.md,
    className,
  );

  if (href) {
    return (
      <Link href={href} data-comando className={classi} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button data-comando className={classi} {...props}>
      {children}
    </button>
  );
}
