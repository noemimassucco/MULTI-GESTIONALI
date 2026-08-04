"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icona from "@/components/ui/Icona";

/**
 * L'involucro del gestionale demo: avviso, colonna di sinistra, testata,
 * area di lavoro. Su mobile la colonna diventa una fila di schede scorrevoli.
 * Vale per qualsiasi base: riceve da fuori chi è l'azienda e le sue sezioni.
 *
 * @param {{studio: object, voci: {href:string,label:string,icona:string,esatta?:boolean}[], nomeBase: string}} props
 */
export default function DemoShell({ studio, voci, nomeBase, children }) {
  const percorso = usePathname();
  const attiva = (v) => (v.esatta ? percorso === v.href : percorso.startsWith(v.href));
  const corrente = voci.find(attiva);

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      {/* ------------------------------------------------- avviso demo */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-brand-800 bg-brand-900 px-5 py-2.5">
        <span className="occhiello rounded-full bg-accento-500 px-2.5 py-1 text-[10px] leading-none text-white">
          Demo
        </span>
        <p className="order-3 min-w-0 basis-full text-piccolo leading-snug text-brand-100 sm:order-none sm:basis-auto sm:flex-1">
          Stai usando la base &ldquo;{nomeBase}&rdquo; con dati inventati. Tocca tutto: al
          ricaricamento si azzera.
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/demo"
            data-comando
            className="flex h-9 items-center rounded-[var(--radius-controllo)] px-3 text-piccolo font-medium text-brand-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            Torna al sito
          </Link>
          <Link
            href="/richiedi"
            data-comando
            className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-white px-3.5 text-piccolo font-semibold text-brand-900 transition-colors hover:bg-brand-50"
          >
            Lo voglio così
            <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* --------------------------------------- colonna di sinistra */}
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-brand-800 bg-brand-900 lg:flex">
          <div className="flex items-center gap-3 px-6 pb-7 pt-7">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-white/10 text-corrente font-semibold text-white ring-1 ring-inset ring-white/15">
              {studio.utente.iniziali}
            </span>
            <div className="min-w-0">
              <p className="truncate text-corrente font-semibold text-white">{studio.nome}</p>
              <p className="truncate text-mini text-brand-300">{studio.sottotitolo}</p>
            </div>
          </div>

          <p className="occhiello px-6 pb-3 text-brand-300">Pannello di controllo</p>

          <nav className="flex-1 space-y-px px-3" aria-label="Sezioni del gestionale">
            {voci.map((v) => {
              const qui = attiva(v);
              return (
                <Link
                  key={v.href}
                  href={v.href}
                  data-comando
                  aria-current={qui ? "page" : undefined}
                  className={`group flex h-11 items-center gap-3 rounded-[var(--radius-controllo)] px-3 text-corrente transition-colors duration-150 ${
                    qui
                      ? "bg-white/10 font-semibold text-white"
                      : "text-brand-200 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icona
                    misura="sm"
                    nome={v.icona}
                    className={qui ? "text-accento-300" : "text-brand-300 group-hover:text-white"}
                  />
                  {v.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-6">
            <p className="text-mini leading-relaxed text-brand-300">
              Nomi di sezioni, campi e stati sono tutti personalizzabili sul tuo modo di lavorare.
            </p>
            <Link
              href="/personalizzazioni"
              className="mt-3 inline-flex items-center gap-1.5 text-mini font-semibold text-accento-300 hover:text-accento-200"
            >
              Cosa si può cambiare
              <Icona misura="sm" nome="ArrowRight" className="size-3" />
            </Link>
          </div>
        </aside>

        {/* --------------------------------------------- area di lavoro */}
        <div className="min-w-0 flex-1">
          {/* testata: solo su schermi larghi, dove la colonna c'è già */}
          <div className="hidden h-[68px] items-center gap-4 border-b border-line bg-white px-8 lg:flex">
            <p className="text-corrente font-semibold text-ink-900">
              {corrente?.label || nomeBase}
            </p>
            <div className="ml-auto flex items-center gap-3">
              <span className="flex h-10 w-[260px] items-center gap-2.5 rounded-[var(--radius-controllo)] border border-line bg-surface-alt px-3 text-corrente text-ink-400">
                <Icona misura="sm" nome="Search" />
                Cerca…
              </span>
              <span className="flex items-center gap-2.5 border-l border-line pl-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-piccolo font-semibold text-brand-700">
                  {studio.utente.iniziali}
                </span>
                <span className="hidden xl:block">
                  <span className="block text-corrente font-medium leading-tight text-ink-900">
                    {studio.utente.nome}
                  </span>
                  <span className="block text-mini leading-tight text-ink-500">
                    {studio.utente.ruolo}
                  </span>
                </span>
              </span>
            </div>
          </div>

          {/* nav mobile: schede scorrevoli */}
          <nav
            aria-label="Sezioni del gestionale"
            className="scroll-orizzontale sticky top-0 z-40 flex gap-1 overflow-x-auto border-b border-brand-800 bg-brand-900 px-3 py-2.5 lg:hidden"
          >
            {voci.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                data-comando
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-piccolo font-medium ${
                  attiva(v) ? "bg-white text-brand-900" : "text-brand-200"
                }`}
              >
                <Icona misura="sm" nome={v.icona} className="size-3.5" />
                {v.label}
              </Link>
            ))}
          </nav>

          <main className="mx-auto max-w-[1120px] px-5 pb-32 pt-8 sm:px-8 lg:pb-24 lg:pt-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
