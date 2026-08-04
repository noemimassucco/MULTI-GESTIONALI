"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icona from "@/components/ui/Icona";

/**
 * L'involucro del gestionale demo: avviso, colonna di sinistra col marchio,
 * testata con ricerca e utente, area di lavoro. Su mobile la colonna
 * diventa una fila di schede scorrevoli.
 *
 * Vale per qualsiasi base: riceve da fuori chi è l'azienda e le sue sezioni.
 *
 * @param {{studio: object, voci: {href:string,label:string,icona:string,esatta?:boolean}[], nomeBase: string}} props
 */
export default function DemoShell({ studio, voci, nomeBase, children }) {
  const percorso = usePathname();
  const attiva = (v) => (v.esatta ? percorso === v.href : percorso.startsWith(v.href));
  const corrente = voci.find(attiva);

  return (
    <div className="app flex min-h-screen flex-col bg-surface-alt">
      {/* ------------------------------------------------- avviso demo */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-brand-900 px-5 py-2.5">
        <span className="occhiello rounded-full bg-accento-600 px-2.5 py-1 text-[10px] leading-none text-white">
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
        <aside className="hidden w-[236px] shrink-0 flex-col bg-brand-700 lg:flex">
          <Link href="/" className="flex items-center gap-3 px-6 pb-8 pt-7">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-white/10 ring-1 ring-inset ring-white/20">
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
                <path
                  d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11.5 20.5 7M12 11.5 3.5 7m8.5 4.5v10"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0 text-corrente font-extrabold uppercase leading-[1.15] tracking-[0.03em] text-white">
              Gestioni
              <br />
              SuMisura
            </span>
          </Link>

          <nav className="flex-1 space-y-0.5 px-3" aria-label="Sezioni del gestionale">
            {voci.map((v) => {
              const qui = attiva(v);
              return (
                <Link
                  key={v.href}
                  href={v.href}
                  data-comando
                  aria-current={qui ? "page" : undefined}
                  className={`group flex h-11 items-center gap-3 rounded-[var(--radius-controllo)] px-3.5 text-corrente transition-colors duration-150 ${
                    qui
                      ? "bg-white/15 font-semibold text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icona
                    misura="sm"
                    nome={v.icona}
                    className={qui ? "text-white" : "text-white/55 group-hover:text-white"}
                  />
                  {v.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3">
            <Link
              href="/personalizzazioni"
              className="flex h-11 items-center gap-3 rounded-[var(--radius-controllo)] px-3.5 text-corrente text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icona misura="sm" nome="Sparkles" className="text-accento-300" />
              Assistente AI
            </Link>
          </div>
        </aside>

        {/* --------------------------------------------- area di lavoro */}
        <div className="min-w-0 flex-1">
          {/* testata */}
          <div className="hidden h-[72px] items-center gap-4 border-b border-line bg-white px-8 lg:flex">
            <h1 className="text-t3 font-bold text-ink-900">{corrente?.label || nomeBase}</h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="flex h-10 w-[280px] items-center gap-2.5 rounded-[var(--radius-controllo)] border border-line bg-surface-alt px-3.5 text-corrente text-ink-400">
                <Icona misura="sm" nome="Search" />
                Cerca…
              </span>
              <span className="relative flex size-10 items-center justify-center rounded-[var(--radius-controllo)] text-ink-500">
                <Icona misura="sm" nome="Bell" />
                <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-accento-500" />
              </span>
              <span className="flex items-center gap-2.5 border-l border-line pl-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-piccolo font-bold text-brand-700">
                  {studio.utente.iniziali}
                </span>
                <span className="hidden xl:block">
                  <span className="block text-corrente font-semibold leading-tight text-ink-900">
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
            className="scroll-orizzontale sticky top-0 z-40 flex gap-1 overflow-x-auto bg-brand-700 px-3 py-2.5 lg:hidden"
          >
            {voci.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                data-comando
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-piccolo font-medium ${
                  attiva(v) ? "bg-white text-brand-700" : "text-white/75"
                }`}
              >
                <Icona misura="sm" nome={v.icona} className="size-3.5" />
                {v.label}
              </Link>
            ))}
          </nav>

          <main className="mx-auto max-w-[1180px] px-5 pb-32 pt-6 sm:px-8 lg:pb-20 lg:pt-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
