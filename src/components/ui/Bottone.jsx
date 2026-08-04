import Link from "next/link";

const varianti = {
  primario:
    "bg-brand-600 text-white shadow-[var(--shadow-brand)] hover:bg-brand-700 active:bg-brand-800",
  secondario:
    "bg-white text-ink-800 ring-1 ring-inset ring-line hover:bg-surface-alt hover:ring-ink-400",
  tenue: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  fantasma: "text-ink-600 hover:text-brand-700 hover:bg-brand-50",
  scuro: "bg-ink-900 text-white hover:bg-ink-800",
};

const misure = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-6 text-[15px] gap-2",
};

/**
 * Bottone o link con lo stesso aspetto.
 * Se riceve `href` produce un <Link>, altrimenti un <button>.
 */
export default function Bottone({
  href,
  variante = "primario",
  misura = "md",
  className = "",
  children,
  ...props
}) {
  const classi = [
    "inline-flex items-center justify-center rounded-[10px] font-semibold",
    "transition-colors duration-150 whitespace-nowrap",
    "disabled:opacity-50 disabled:pointer-events-none",
    varianti[variante] || varianti.primario,
    misure[misura] || misure.md,
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classi} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classi} {...props}>
      {children}
    </button>
  );
}
