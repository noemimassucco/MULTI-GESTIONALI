"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, RicercaDemo } from "@/components/demo/ElementiDemo";
import { StatoCommessa, contiCommessa } from "@/components/demo/ElementiCommesse";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

const TIPI = {
  privato: "Privato",
  azienda: "Azienda",
  condominio: "Condominio",
};

/** I clienti visti da chi costruisce: quanto hanno pesato, e come pagano. */
export default function PaginaClienti() {
  const { dati } = useDemo();
  const [ricerca, setRicerca] = useState("");

  const testo = ricerca.trim().toLowerCase();
  const clienti = dati.clienti.filter((c) => {
    if (!testo) return true;
    return [c.nome, c.referente, c.indirizzo].some((v) => (v || "").toLowerCase().includes(testo));
  });

  const suoiCantieri = (idCliente) =>
    dati.commesse.filter((k) => k.clienteId === idCliente).sort((a, b) => b.numero.localeCompare(a.numero));

  return (
    <>
      <IntestazioneDemo
        titolo="Clienti"
        sottotitolo="Quanto lavoro è passato da ognuno, e cosa c'è aperto adesso."
      />

      <div className="mb-4">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per nome, referente o indirizzo…"
        />
      </div>

      <ul className="space-y-3">
        {clienti.map((c) => {
          const cantieri = suoiCantieri(c.id);
          const fatturatoStorico = cantieri.reduce(
            (s, k) => s + contiCommessa(k, dati).fatturato,
            0,
          );
          const aperti = cantieri.filter((k) => k.stato === "in_corso");

          return (
            <li
              key={c.id}
              className="rounded-[var(--radius-scheda)] border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-testo font-bold text-ink-900">{c.nome}</h2>
                    <span className="inline-flex h-6 items-center rounded-full bg-surface-alt px-2 text-mini font-medium text-ink-600 ring-1 ring-inset ring-line">
                      {TIPI[c.tipo] || c.tipo}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-piccolo text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Icona misura="sm" nome="Users" className="size-3.5 text-ink-400" />
                      {c.referente}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icona misura="sm" nome="Phone" className="size-3.5 text-ink-400" />
                      {c.telefono}
                    </span>
                    <span className="min-w-0 truncate">{c.indirizzo}</span>
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-t3 font-bold leading-none text-ink-900">
                    {euro(fatturatoStorico)}
                  </p>
                  <p className="mt-1 text-mini text-ink-500">
                    fatturato su {cantieri.length === 1 ? "1 lavoro" : `${cantieri.length} lavori`}
                  </p>
                </div>
              </div>

              {c.note ? (
                <p className="mt-3 rounded-[var(--radius-controllo)] bg-surface-alt px-3.5 py-2.5 text-piccolo leading-relaxed text-ink-600">
                  {c.note}
                </p>
              ) : null}

              {cantieri.length ? (
                <ul className="mt-3 divide-y divide-line-soft border-t border-line-soft">
                  {cantieri.map((k) => (
                    <li key={k.id} className="py-2.5">
                      <Link
                        href={`${BASE}/commesse/${k.id}`}
                        className="flex flex-wrap items-center gap-x-3 gap-y-1.5"
                      >
                        <span className="font-mono text-mini text-ink-500">{k.numero}</span>
                        <span className="min-w-0 flex-1 truncate text-corrente text-ink-900">
                          {k.titolo}
                        </span>
                        <StatoCommessa stato={k.stato} />
                        <span className="shrink-0 text-corrente font-medium tabular-nums text-ink-700">
                          {euro(k.importoContratto)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 border-t border-line-soft pt-3 text-corrente text-ink-500">
                  Nessun lavoro registrato con questo cliente.
                </p>
              )}

              {aperti.length ? (
                <p className="mt-2 text-mini font-medium text-amber-700">
                  {aperti.length === 1
                    ? "1 cantiere aperto in questo momento"
                    : `${aperti.length} cantieri aperti in questo momento`}
                </p>
              ) : null}
            </li>
          );
        })}

        {!clienti.length ? (
          <li className="rounded-[var(--radius-scheda)] border border-line bg-white px-5 py-10 text-center text-corrente text-ink-500">
            Nessun cliente corrisponde alla ricerca.
          </li>
        ) : null}
      </ul>
    </>
  );
}
