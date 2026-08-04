"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icona from "@/components/ui/Icona";

/**
 * L'involucro del gestionale demo: banner di avviso, barra laterale scura,
 * area di lavoro. Su mobile la barra diventa una fila di schede scorrevoli.
 * Vale per qualsiasi base: riceve da fuori chi è l'azienda e le sue sezioni.
 *
 * @param {{studio: object, voci: {href:string,label:string,icona:string,esatta?:boolean}[], nomeBase: string}} props
 */
export default function DemoShell({ studio, voci, nomeBase, children }) {
  const percorso = usePathname();
  const attiva = (v) => (v.esatta ? percorso === v.href : percorso.startsWith(v.href));

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      {/* ------------------------------------------------- banner demo */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-sole-500 px-4 py-2.5 sm:px-5">
        <span className="rounded-[var(--radius-controllo)] bg-ink-900 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-sole-300">
          Demo
        </span>
        <p className="order-3 min-w-0 basis-full text-piccolo font-medium leading-snug text-ink-900 sm:order-none sm:basis-auto sm:flex-1">
          Stai usando la base &ldquo;{nomeBase}&rdquo; con dati inventati. Tocca tutto:
          al ricaricamento si azzera.
        </p>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/demo"
            data-comando
            className="flex h-9 items-center rounded-[var(--radius-controllo)] px-3 text-piccolo font-semibold text-ink-900/70 hover:bg-ink-900/10"
          >
            Torna al sito
          </Link>
          <Link
            href="/richiedi"
            data-comando
            className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-ink-900 px-3.5 text-piccolo font-semibold text-white hover:bg-ink-800"
          >
            Lo voglio così
            <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ------------------------------------------- barra laterale */}
        <aside className="hidden w-[224px] shrink-0 flex-col bg-ink-900 lg:flex">
          <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
            <span className="flex size-9 items-center justify-center rounded-[var(--radius-controllo)] bg-sole-500 text-[13px] font-extrabold text-ink-900">
              {studio.utente.iniziali}
            </span>
            <div className="min-w-0">
              <p className="truncate text-corrente font-bold text-white">{studio.nome}</p>
              <p className="truncate text-mini text-white/50">{studio.sottotitolo}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 px-3" aria-label="Sezioni del gestionale">
            {voci.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                data-comando
                className={`flex h-10 items-center gap-3 rounded-[var(--radius-controllo)] px-3 text-corrente font-medium transition-colors ${
                  attiva(v)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icona
                  misura="sm"
                  nome={v.icona}
                  className={attiva(v) ? "text-sole-400" : "text-white/40"}
                />
                {v.label}
                {attiva(v) ? (
                  <span className="ml-auto size-1.5 rounded-full bg-sole-400" aria-hidden="true" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <p className="text-mini leading-relaxed text-white/40">
              Nomi di sezioni, campi e stati sono tutti personalizzabili sul tuo modo di lavorare.
            </p>
            <Link
              href="/personalizzazioni"
              className="mt-2 inline-block text-mini font-semibold text-sole-300 hover:text-sole-200"
            >
              Cosa si può cambiare →
            </Link>
          </div>
        </aside>

        {/* --------------------------------------------- area di lavoro */}
        <div className="min-w-0 flex-1">
          {/* nav mobile: schede scorrevoli */}
          <nav
            aria-label="Sezioni del gestionale"
            className="scroll-orizzontale sticky top-0 z-40 flex gap-1 overflow-x-auto border-b border-line bg-ink-900 px-3 py-2 lg:hidden"
          >
            {voci.map((v) => (
              <Link
                key={v.href}
                href={v.href}
                data-comando
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-piccolo font-medium ${
                  attiva(v) ? "bg-sole-500 text-ink-900" : "text-white/70"
                }`}
              >
                <Icona misura="sm" nome={v.icona} className="size-3.5" />
                {v.label}
              </Link>
            ))}
          </nav>

          <main className="mx-auto max-w-[1060px] px-4 pb-32 pt-6 sm:px-6 lg:pb-28 lg:pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
