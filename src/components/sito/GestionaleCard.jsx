import Link from "next/link";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";

/**
 * Card di un gestionale nel catalogo.
 * Mostra il pulsante demo solo se la demo esiste davvero.
 */
export default function GestionaleCard({ gestionale, categoria, base }) {
  const { slug, nome, sottotitolo, funzioni, demoDisponibile } = gestionale;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-scheda)] border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]">
      {/* Anteprima grafica: schema astratto di una schermata, non uno screenshot finto */}
      <div
        className="relative h-[104px] overflow-hidden border-b border-line"
        style={{ background: categoria ? `var(--cat-${categoria.colore}-bg)` : "var(--cat-blu-bg)" }}
      >
        <div className="absolute inset-0 flex items-center gap-2 p-4 opacity-70">
          <div className="flex h-full w-9 flex-col gap-1.5 rounded-[var(--radius-controllo)] bg-white/80 p-1.5">
            <span className="h-1.5 rounded-full bg-ink-400/40" />
            <span className="h-1.5 rounded-full bg-ink-400/25" />
            <span className="h-1.5 rounded-full bg-ink-400/25" />
          </div>
          <div className="flex h-full flex-1 flex-col gap-1.5">
            <div className="flex gap-1.5">
              <span className="h-6 flex-1 rounded-[var(--radius-controllo)] bg-white/85" />
              <span className="h-6 flex-1 rounded-[var(--radius-controllo)] bg-white/85" />
              <span className="h-6 flex-1 rounded-[var(--radius-controllo)] bg-white/85" />
            </div>
            <div className="flex-1 rounded-[var(--radius-controllo)] bg-white/85" />
          </div>
        </div>
        {categoria ? (
          <span
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-[var(--radius-controllo)] bg-white shadow-[var(--shadow-soft)]"
            style={{ color: `var(--cat-${categoria.colore})` }}
          >
            <Icona misura="sm" nome={categoria.icona} />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {categoria ? (
            <Pastiglia colore={categoria.colore}>{categoria.nome}</Pastiglia>
          ) : null}
          <Pastiglia variante="contorno">
            <Icona misura="sm" nome="Settings2" />
            Personalizzabile
          </Pastiglia>
        </div>

        <h3 className="mt-3 text-guida font-semibold leading-snug">
          <Link href={`/gestionali/${slug}`} className="after:absolute after:inset-0">
            {nome}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-corrente leading-relaxed text-ink-500">{sottotitolo}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {funzioni.slice(0, 5).map((f) => (
            <li
              key={f}
              className="rounded-[var(--radius-controllo)] bg-surface-alt px-2 py-1 text-mini font-medium text-ink-600"
            >
              {f}
            </li>
          ))}
          {funzioni.length > 5 ? (
            <li className="px-1 py-1 text-mini font-medium text-ink-400">
              +{funzioni.length - 5}
            </li>
          ) : null}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-line-soft pt-4">
          <span className="inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700">
            Scopri
            <Icona misura="sm"
              nome="ArrowRight"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
          {demoDisponibile ? (
            <span className="inline-flex items-center gap-1.5 text-piccolo font-medium text-emerald-700">
              <Icona misura="sm" nome="PlayCircle" />
              Demo disponibile
            </span>
          ) : base ? (
            <span className="truncate pl-3 text-mini text-ink-400">Base {base.nome}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
