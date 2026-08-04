import Link from "next/link";
import Icona from "@/components/ui/Icona";

/** Card di categoria. `compatta` è la versione usata nella fascia orizzontale della home. */
export default function CategoriaCard({ categoria, compatta = false }) {
  const { slug, nome, sottotitolo, icona, colore, totale } = categoria;

  if (compatta) {
    return (
      <Link
        href={`/categorie/${slug}`}
        className="group flex w-[168px] shrink-0 snap-start flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
      >
        <span
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }}
        >
          <Icona nome={icona} className="size-6" />
        </span>
        <span className="text-[13.5px] font-semibold leading-snug text-ink-900">{nome}</span>
        <span className="text-[12px] text-ink-500">
          {totale} {totale === 1 ? "gestionale" : "gestionali"}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/categorie/${slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
    >
      <span
        className="flex size-12 items-center justify-center rounded-xl"
        style={{ color: `var(--cat-${colore})`, background: `var(--cat-${colore}-bg)` }}
      >
        <Icona nome={icona} className="size-6" />
      </span>
      <h3 className="mt-4 text-[17px] font-semibold">{nome}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-500">{sottotitolo}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700">
        {totale} {totale === 1 ? "gestionale" : "gestionali"}
        <Icona
          nome="ArrowRight"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
