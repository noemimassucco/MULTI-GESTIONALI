"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigazione, sito } from "@/lib/sito";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import { Contenitore } from "@/components/ui/Sezione";
import Marchio from "@/components/sito/Marchio";

export default function Navbar({ categorie }) {
  const [apertoMobile, setApertoMobile] = useState(false);
  const [menuCategorie, setMenuCategorie] = useState(false);
  const percorso = usePathname();
  const [percorsoPrecedente, setPercorsoPrecedente] = useState(percorso);

  // Cambio pagina: chiudo i menu aperti. Aggiustamento durante il render,
  // che è il modo consigliato da React per reagire a un valore cambiato.
  if (percorso !== percorsoPrecedente) {
    setPercorsoPrecedente(percorso);
    setApertoMobile(false);
    setMenuCategorie(false);
  }

  useEffect(() => {
    document.body.style.overflow = apertoMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [apertoMobile]);

  const attivo = (href) =>
    href === "/" ? percorso === "/" : percorso.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <Contenitore>
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Marchio />

          <nav className="hidden shrink-0 items-center gap-0 xl:flex" aria-label="Navigazione principale">
            {navigazione.map((voce) => {
              const isCategorie = voce.href === "/categorie";
              return (
                <div
                  key={voce.href}
                  className="relative"
                  onMouseEnter={() => isCategorie && setMenuCategorie(true)}
                  onMouseLeave={() => isCategorie && setMenuCategorie(false)}
                >
                  <Link
                    href={voce.href}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors ${
                      attivo(voce.href)
                        ? "text-brand-700"
                        : "text-ink-600 hover:text-ink-900"
                    }`}
                  >
                    {voce.label}
                    {isCategorie ? <Icona nome="ChevronDown" className="size-3.5" /> : null}
                  </Link>
                  {attivo(voce.href) ? (
                    <span className="absolute inset-x-2.5 -bottom-[1px] h-[2px] rounded-full bg-brand-600" />
                  ) : null}

                  {isCategorie && menuCategorie ? (
                    <div className="absolute left-1/2 top-full z-50 w-[680px] -translate-x-1/2 pt-3">
                      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-3 shadow-[var(--shadow-lift)]">
                        {categorie.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/categorie/${c.slug}`}
                            className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-surface-alt"
                          >
                            <span
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                              style={{
                                color: `var(--cat-${c.colore})`,
                                background: `var(--cat-${c.colore}-bg)`,
                              }}
                            >
                              <Icona nome={c.icona} className="size-[18px]" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[13.5px] font-semibold text-ink-900">
                                {c.nome}
                              </span>
                              <span className="block text-[12px] text-ink-500">
                                {c.totale} {c.totale === 1 ? "gestionale" : "gestionali"}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Bottone href="/demo" variante="secondario" misura="sm" className="hidden sm:inline-flex">
              <Icona nome="PlayCircle" className="size-4" />
              Prova una demo
            </Bottone>
            <Bottone href="/richiedi" misura="sm">
              Richiedi informazioni
              <Icona nome="ArrowRight" className="size-4" />
            </Bottone>
            <button
              type="button"
              onClick={() => setApertoMobile((v) => !v)}
              className="flex size-10 items-center justify-center rounded-lg text-ink-700 hover:bg-surface-alt xl:hidden"
              aria-label={apertoMobile ? "Chiudi il menu" : "Apri il menu"}
              aria-expanded={apertoMobile}
            >
              <Icona nome={apertoMobile ? "X" : "Menu"} className="size-5" />
            </button>
          </div>
        </div>
      </Contenitore>

      {apertoMobile ? (
        <div className="border-t border-line bg-white xl:hidden">
          <Contenitore className="py-4">
            <nav className="flex flex-col gap-0.5" aria-label="Navigazione mobile">
              {navigazione.map((voce) => (
                <Link
                  key={voce.href}
                  href={voce.href}
                  className={`rounded-lg px-3 py-2.5 text-[15px] font-medium ${
                    attivo(voce.href) ? "bg-brand-50 text-brand-700" : "text-ink-700"
                  }`}
                >
                  {voce.label}
                </Link>
              ))}
              <Link
                href="/demo"
                className="mt-2 rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-700"
              >
                Prova una demo
              </Link>
            </nav>
            <p className="mt-4 border-t border-line pt-4 text-[13px] text-ink-500">
              Scrivi a{" "}
              <a href={`mailto:${sito.email}`} className="font-medium text-brand-700">
                {sito.email}
              </a>
            </p>
          </Contenitore>
        </div>
      ) : null}
    </header>
  );
}
