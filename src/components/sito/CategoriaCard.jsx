import Link from "next/link";
import Icona from "@/components/ui/Icona";

/** Card di categoria. `compatta` è la versione usata nella fascia orizzontale della home. */
export default function CategoriaCard({ categoria, compatta = false }) {
  const { slug, nome, sottotitolo, icona, colore, totale } = categoria;

  if (compatta) {
    return (
      <Link
        href={`/categorie/${slug}`}
        className="group flex w-[168px] shrink-0 snap-start flex-col items-center gap-3 rounded-[var(--radius-scheda)] border border-line bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
      >
        <span
          className="flex size-12 items-center justify-center rounded-[var(--radius-scheda)]"
          style={{ color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }}
        >
          <Icona misura="lg" nome={icona} />
        </span>
        <span className="text-piccolo font-semibold leading-snug text-ink-900">{nome}</span>
        <span className="text-mini text-ink-500">
          {totale} {totale === 1 ? "gestionale" : "gestionali"}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/categorie/${slug}`}
      className="group flex flex-col rounded-[var(--radius-scheda)] border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
    >
      <span
        className="flex size-12 items-center justify-center rounded-[var(--radius-scheda)]"
        style={{ color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }}
      >
        <Icona misura="lg" nome={icona} />
      </span>
      <h3 className="mt-4 text-guida font-semibold">{nome}</h3>
      <p className="mt-2 flex-1 text-corrente leading-relaxed text-ink-500">{sottotitolo}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700">
        {totale} {totale === 1 ? "gestionale" : "gestionali"}
        <Icona misura="sm"
          nome="ArrowRight"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
