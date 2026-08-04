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
        <div className="flex h-[var(--barra)] items-center justify-between gap-3">
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
                    data-comando
                    className={`flex h-9 items-center gap-1 whitespace-nowrap rounded-[var(--radius-controllo)] px-2.5 text-piccolo font-medium transition-colors ${
                      attivo(voce.href)
                        ? "text-brand-700"
                        : "text-ink-600 hover:text-ink-900"
                    }`}
                  >
                    {voce.label}
                    {isCategorie ? <Icona misura="sm" nome="ChevronDown" /> : null}
                  </Link>
                  {attivo(voce.href) ? (
                    <span className="absolute inset-x-2.5 -bottom-[1px] h-[2px] rounded-full bg-brand-600" />
                  ) : null}

                  {isCategorie && menuCategorie ? (
                    <div className="absolute left-1/2 top-full z-50 w-[680px] -translate-x-1/2 pt-3">
                      <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-scheda)] border border-line bg-white p-3 shadow-[var(--shadow-lift)]">
                        {categorie.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/categorie/${c.slug}`}
                            className="flex items-start gap-3 rounded-[var(--radius-scheda)] p-2.5 transition-colors hover:bg-surface-alt"
                          >
                            <span
                              className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-controllo)]"
                              style={{
                                color: `var(--cat-${c.colore})`,
                                background: `var(--cat-${c.colore}-bg)`,
                              }}
                            >
                              <Icona misura="sm" nome={c.icona} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-piccolo font-semibold text-ink-900">
                                {c.nome}
                              </span>
                              <span className="block text-mini text-ink-500">
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

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <Bottone href="/demo" variante="secondario" misura="sm" className="hidden sm:inline-flex">
              <Icona misura="sm" nome="PlayCircle" />
              Prova una demo
            </Bottone>
            <Bottone href="/richiedi" misura="sm" className="px-3 sm:px-4">
              <span className="hidden sm:inline">Richiedi informazioni</span>
              <span className="sm:hidden">Scrivimi</span>
              <Icona misura="sm" nome="ArrowRight" />
            </Bottone>
            <button
              type="button"
              onClick={() => setApertoMobile((v) => !v)}
              data-comando
              className="flex size-11 items-center justify-center rounded-[var(--radius-controllo)] text-ink-700 hover:bg-surface-alt xl:hidden"
              aria-label={apertoMobile ? "Chiudi il menu" : "Apri il menu"}
              aria-expanded={apertoMobile}
            >
              <Icona misura="md" nome={apertoMobile ? "X" : "Menu"} />
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
                  data-comando
                  className={`flex h-11 items-center rounded-[var(--radius-controllo)] px-3 text-testo font-medium ${
                    attivo(voce.href) ? "bg-brand-50 text-brand-700" : "text-ink-700"
                  }`}
                >
                  {voce.label}
                </Link>
              ))}
              <Link
                href="/demo"
                data-comando
                className="mt-2 flex h-11 items-center rounded-[var(--radius-controllo)] px-3 text-testo font-medium text-ink-700"
              >
                Prova una demo
              </Link>
            </nav>
            <p className="mt-4 border-t border-line pt-4 text-piccolo text-ink-500">
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
