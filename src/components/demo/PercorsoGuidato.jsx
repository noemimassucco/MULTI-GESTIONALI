"use client";

import { useState } from "react";
import Link from "next/link";
import Icona from "@/components/ui/Icona";

/**
 * Percorso guidato: una striscia in fondo allo schermo che accompagna il
 * visitatore lungo il flusso di lavoro del mestiere, un passo alla volta.
 *
 * È volutamente NON invadente: non copre la schermata, non blocca i clic,
 * e si chiude quando si vuole. Chi vuole solo curiosare la ignora.
 *
 * @param {{chiave: string, titolo: string, passi: {titolo:string,testo:string,dove:string}[]}} props
 */
export default function PercorsoGuidato({ chiave, titolo, passi }) {
  const [aperto, setAperto] = useState(true);
  const [indice, setIndice] = useState(0);
  const [ridotto, setRidotto] = useState(false);

  if (!aperto || !passi?.length) {
    return (
      <button
        type="button"
        onClick={() => {
          setAperto(true);
          setRidotto(false);
        }}
        data-comando
        className="fixed bottom-4 right-4 z-[60] flex h-11 items-center gap-2 rounded-full bg-brand-900 px-4 text-piccolo font-semibold text-white shadow-[var(--shadow-lift)] hover:bg-brand-800"
      >
        <Icona misura="sm" nome="Compass" className="text-accento-300" />
        Percorso guidato
      </button>
    );
  }

  const passo = passi[indice];
  const ultimo = indice === passi.length - 1;

  if (ridotto) {
    return (
      <button
        type="button"
        onClick={() => setRidotto(false)}
        data-comando
        className="fixed bottom-4 right-4 z-[60] flex h-11 items-center gap-2 rounded-full bg-brand-900 px-4 text-piccolo font-semibold text-white shadow-[var(--shadow-lift)] hover:bg-brand-800"
      >
        <Icona misura="sm" nome="Compass" className="text-accento-300" />
        Passo {indice + 1} di {passi.length}
      </button>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 sm:inset-x-auto sm:right-4 sm:justify-end sm:p-4">
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[var(--radius-scheda)] bg-brand-900 shadow-[var(--shadow-lift)]">
        {/* avanzamento */}
        <div className="flex gap-1 px-4 pt-3">
          {passi.map((p, i) => (
            <button
              key={p.titolo}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Vai al passo ${i + 1}: ${p.titolo}`}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= indice ? "bg-accento-400" : "bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

        <div className="flex items-start gap-3 p-4">
          <span className="cifre flex size-9 shrink-0 items-center justify-center rounded-full bg-accento-500 text-corrente font-extrabold text-white">
            {indice + 1}
          </span>

          <div className="min-w-0 flex-1">
            <p className="occhiello text-accento-300">
              {titolo}
            </p>
            <h2 className="mt-1.5 text-testo font-semibold text-white">{passo.titolo}</h2>
            <p className="mt-1.5 text-piccolo leading-relaxed text-brand-100">{passo.testo}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href={passo.dove}
                data-comando
                className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-white px-3.5 text-piccolo font-semibold text-brand-900 hover:bg-brand-50"
              >
                Portami qui
                <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
              </Link>

              {indice > 0 ? (
                <button
                  type="button"
                  onClick={() => setIndice(indice - 1)}
                  data-comando
                  className="flex h-9 items-center rounded-[var(--radius-controllo)] px-3 text-piccolo font-medium text-brand-200 hover:bg-white/10 hover:text-white"
                >
                  Indietro
                </button>
              ) : null}

              {!ultimo ? (
                <button
                  type="button"
                  onClick={() => setIndice(indice + 1)}
                  data-comando
                  className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] px-3 text-piccolo font-semibold text-white hover:bg-white/10"
                >
                  Passo successivo
                  <Icona misura="sm" nome="ChevronRight" className="size-3.5" />
                </button>
              ) : (
                <Link
                  href="/richiedi"
                  data-comando
                  className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] px-3 text-piccolo font-semibold text-white hover:bg-white/10"
                >
                  Lo voglio per la mia attività
                  <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
                </Link>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => setRidotto(true)}
              aria-label="Riduci il percorso guidato"
              className="flex size-8 items-center justify-center rounded-[var(--radius-controllo)] text-brand-300 hover:bg-white/10 hover:text-white"
            >
              <Icona misura="sm" nome="ChevronDown" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setAperto(false)}
              aria-label="Chiudi il percorso guidato"
              className="flex size-8 items-center justify-center rounded-[var(--radius-controllo)] text-brand-300 hover:bg-white/10 hover:text-white"
            >
              <Icona misura="sm" nome="X" className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
