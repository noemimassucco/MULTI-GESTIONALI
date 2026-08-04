import Link from "next/link";
import Icona from "@/components/ui/Icona";

/** Card di categoria. `compatta` è la versione usata nella fascia orizzontale della home. */
export default function CategoriaCard({ categoria, compatta = false }) {
  const { slug, nome, sottotitolo, icona, colore, totale } = categoria;

  if (compatta) {
    return (
      <Link
        href={`/categorie/${slug}`}
        className="group flex w-[212px] shrink-0 snap-start flex-col gap-5 rounded-[var(--radius-scheda)] border border-line bg-white p-6 transition-colors duration-200 hover:border-brand-300"
      >
        <span
          className="flex size-11 items-center justify-center rounded-[var(--radius-controllo)]"
          style={{ color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }}
        >
          <Icona misura="md" nome={icona} />
        </span>
        <span className="flex-1">
          <span className="block text-corrente font-semibold leading-snug text-ink-900">
            {nome}
          </span>
          <span className="mt-2 block text-mini text-ink-500">
            {totale} {totale === 1 ? "gestionale" : "gestionali"}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/categorie/${slug}`}
      className="group flex flex-col rounded-[var(--radius-scheda)] border border-line bg-white p-7 transition-colors duration-200 hover:border-brand-300"
    >
      <span
        className="flex size-12 items-center justify-center rounded-[var(--radius-controllo)]"
        style={{ color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }}
      >
        <Icona misura="md" nome={icona} />
      </span>
      <h3 className="mt-6 text-guida">{nome}</h3>
      <p className="mt-3 flex-1 text-corrente leading-relaxed text-ink-600">{sottotitolo}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700">
        {totale} {totale === 1 ? "gestionale" : "gestionali"}
        <Icona misura="sm"
          nome="ArrowRight"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
