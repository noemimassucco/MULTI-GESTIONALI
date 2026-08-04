import Link from "next/link";
import { modificheAbilitate } from "@/lib/contenuti-store";
import Icona from "@/components/ui/Icona";
import NavAdmin from "./NavAdmin";

/** L'amministrazione non deve finire sui motori di ricerca. */
export const metadata = {
  title: "Amministrazione",
  robots: { index: false, follow: false },
};

/**
 * Cornice dell'area amministrativa: sta fuori dal gruppo (sito) perché non ha
 * nulla in comune con le pagine pubbliche — niente barra, niente piè di pagina,
 * solo la colonna scura con le sezioni e l'area di lavoro.
 */
export default async function LayoutAmministrazione({ children }) {
  const scrivibile = modificheAbilitate();

  return (
    <div className="app flex min-h-screen flex-col bg-surface-alt">
      {/* --------------------------------------------- avviso in cima */}
      {scrivibile ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line bg-white px-4 py-2.5 sm:px-5">
          <Icona misura="sm" nome="Database" className="shrink-0 text-ink-400" />
          <p className="text-piccolo leading-snug text-ink-600">
            Le modifiche vengono scritte in{" "}
            <span className="font-mono text-mini text-ink-800">src/data/contenuti.json</span>: per
            vederle online vanno committate e portate su GitHub.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-[#f2d9d6] bg-[#fbeceb] px-4 py-2.5 sm:px-5">
          <Icona misura="sm" nome="AlertTriangle" className="shrink-0 text-critico" />
          <p className="text-piccolo font-medium leading-snug text-critico">
            Sola lettura: le modifiche si possono fare solo quando il sito gira sul tuo computer
            (npm run dev)
          </p>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* ------------------------------------------- colonna a sinistra */}
        <aside className="hidden w-[220px] shrink-0 flex-col bg-brand-700 lg:flex">
          <div className="px-5 pb-5 pt-6">
            <p className="text-corrente font-bold text-white">Amministrazione</p>
            <p className="text-mini text-white/70">Contenuti del sito</p>
          </div>

          <NavAdmin variante="laterale" />

          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              data-comando
              className="inline-flex items-center gap-1.5 text-mini font-semibold text-white/70 hover:text-white"
            >
              <Icona misura="sm" nome="ArrowLeft" />
              Torna al sito
            </Link>
          </div>
        </aside>

        {/* --------------------------------------------- area di lavoro */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 bg-brand-700 px-4 pt-3 lg:hidden">
            <p className="text-corrente font-bold text-white">Amministrazione</p>
            <Link
              href="/"
              data-comando
              className="inline-flex items-center gap-1.5 text-mini font-semibold text-white/70 hover:text-white"
            >
              <Icona misura="sm" nome="ArrowLeft" />
              Torna al sito
            </Link>
          </div>

          <NavAdmin variante="schede" />

          <main className="mx-auto min-w-0 max-w-[1060px] px-4 pb-20 pt-6 sm:px-6 lg:pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
