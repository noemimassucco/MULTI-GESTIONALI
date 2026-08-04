import Link from "next/link";
import { notFound } from "next/navigation";
import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Icona from "@/components/ui/Icona";
import GestionaleCard from "@/components/sito/GestionaleCard";
import CtaBanner from "@/components/sito/CtaBanner";
import {
  getBase,
  getCategoria,
  getCategorie,
  getCategorieConGestionali,
  getGestionaliPerCategoria,
} from "@/lib/catalogo";

export function generateStaticParams() {
  return getCategorie().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCategoria(slug);
  if (!c) return { title: "Categoria non trovata" };
  return {
    title: c.nome,
    description: c.sottotitolo,
    alternates: { canonical: `/categorie/${c.slug}` },
  };
}

export default async function PaginaCategoria({ params }) {
  const { slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) notFound();

  const gestionali = getGestionaliPerCategoria(slug);
  const altre = getCategorieConGestionali().filter((c) => c.slug !== slug);

  return (
    <>
      <section
        className="border-b border-line"
        style={{ background: `var(--cat-${categoria.colore}-bg)` }}
      >
        <Contenitore className="py-10 sm:py-14">
          <nav aria-label="Percorso" className="flex items-center gap-1.5 text-[13px]">
            <Link href="/categorie" className="text-ink-500 hover:text-ink-900">
              Categorie
            </Link>
            <Icona nome="ChevronRight" className="size-3.5 text-ink-400" />
            <span className="text-ink-700">{categoria.nome}</span>
          </nav>

          <span
            className="mt-6 flex size-14 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-soft)]"
            style={{ color: `var(--cat-${categoria.colore})` }}
          >
            <Icona nome={categoria.icona} className="size-7" />
          </span>

          <h1 className="mt-5 max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[42px]">
            {categoria.nome}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-600">
            {categoria.descrizione}
          </p>
        </Contenitore>
      </section>

      <Sezione sfondo="bianco">
        <TitoloSezione
          centrato={false}
          titolo={`${gestionali.length} ${gestionali.length === 1 ? "gestionale" : "gestionali"} in questa categoria`}
          testo="Ognuno parte da una base già funzionante e viene adattato alle procedure della tua attività."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gestionali.map((g) => (
            <GestionaleCard
              key={g.slug}
              gestionale={g}
              categoria={categoria}
              base={getBase(g.baseSlug)}
            />
          ))}
        </div>
      </Sezione>

      <Sezione sfondo="alt">
        <TitoloSezione centrato={false} titolo="Altre categorie" />
        <div className="scroll-orizzontale mt-8 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {altre.map((c) => (
            <Link
              key={c.slug}
              href={`/categorie/${c.slug}`}
              className="flex w-[168px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
            >
              <span
                className="flex size-11 items-center justify-center rounded-xl"
                style={{ color: `var(--cat-${c.colore})`, background: `var(--cat-${c.colore}-bg)` }}
              >
                <Icona nome={c.icona} className="size-5" />
              </span>
              <span className="text-[13px] font-semibold leading-snug text-ink-900">{c.nome}</span>
              <span className="text-[11.5px] text-ink-500">
                {c.totale} {c.totale === 1 ? "gestionale" : "gestionali"}
              </span>
            </Link>
          ))}
        </div>
      </Sezione>

      <CtaBanner />
    </>
  );
}
