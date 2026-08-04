import Link from "next/link";
import { cn } from "@/lib/cn";

const varianti = {
  primario: "bg-brand-600 text-white shadow-[var(--shadow-brand)] hover:bg-brand-700 active:bg-brand-800",
  secondario: "bg-white text-ink-800 ring-1 ring-inset ring-line hover:bg-surface-alt hover:ring-ink-400",
  tenue: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  fantasma: "text-ink-600 hover:text-brand-700 hover:bg-brand-50",
  chiaro: "bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15",
};

/* Tre altezze, non una di più. Corrispondono a --h-sm / --h-md / --h-lg. */
const misure = {
  sm: "h-10 px-4 text-piccolo gap-1.5",
  md: "h-12 px-5 text-corrente gap-2",
  lg: "h-14 px-6 text-testo gap-2",
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
