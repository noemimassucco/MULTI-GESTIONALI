"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, euro, dataBreve } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  TabellaDemo,
  RicercaDemo,
  FiltriDemo,
} from "@/components/demo/ElementiDemo";
import {
  BarraAvanzamento,
  StatoCommessa,
  Salute,
  contiCommessa,
} from "@/components/demo/ElementiCommesse";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

const FILTRI = [
  { valore: "in_corso", testo: "Aperti" },
  { valore: "in_preventivo", testo: "In preventivo" },
  { valore: "consegnata", testo: "Consegnati" },
  { valore: "chiusa", testo: "Chiusi" },
];

/** L'elenco completo: dai preventivi da vincere ai cantieri già chiusi. */
export default function ElencoCommesse() {
  const { dati, aggiorna } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const testo = ricerca.trim().toLowerCase();
  const filtrate = dati.commesse
    .filter((k) => {
      if (filtro && k.stato !== filtro) return false;
      if (!testo) return true;
      return [k.numero, k.titolo, k.indirizzo, nomeCliente(k.clienteId)].some((v) =>
        (v || "").toLowerCase().includes(testo),
      );
    })
    .sort((a, b) => b.numero.localeCompare(a.numero));

  /** Il preventivo accettato diventa cantiere: stessa scheda, stato diverso. */
  const apriCantiere = (k) =>
    aggiorna("commesse", k.id, {
      stato: "in_corso",
      inizio: new Date().toISOString().slice(0, 10),
    });

  return (
    <>
      <IntestazioneDemo
        titolo="Commesse"
        sottotitolo="Un preventivo accettato non si ricopia: diventa il cantiere, con le sue fasi."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per numero, cliente o indirizzo…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutte", conteggio: dati.commesse.length },
            ...FILTRI.map((f) => ({
              ...f,
              conteggio: dati.commesse.filter((k) => k.stato === f.valore).length,
            })),
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaDemo
        intestazioni={["Commessa", "Cliente", "Importo", "Avanzamento", "Margine", "Stato"]}
        vuota={
          filtrate.length
            ? null
            : "Nessuna commessa corrisponde alla ricerca. Prova con un'altra parola o togli il filtro."
        }
      >
        {filtrate.map((k) => {
          const c = contiCommessa(k, dati);
          const preventivo = k.stato === "in_preventivo";
          return (
            <tr key={k.id} className="transition-colors hover:bg-surface-alt">
              <td className="px-4 py-3">
                <Link href={`${BASE}/commesse/${k.id}`} className="block min-w-0">
                  <span className="block font-mono text-mini font-semibold text-ink-500">
                    {k.numero}
                  </span>
                  <span className="block text-corrente font-semibold text-ink-900">{k.titolo}</span>
                  <span className="block text-mini text-ink-500">{k.indirizzo}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-piccolo text-ink-700">{nomeCliente(k.clienteId)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-piccolo tabular-nums text-ink-700">
                {euro(c.ricavo)}
                {k.finePrevista ? (
                  <span className="block text-mini text-ink-500">
                    consegna {dataBreve(k.finePrevista)}
                  </span>
                ) : null}
              </td>
              <td className="w-[168px] px-4 py-3">
                {preventivo ? (
                  <span className="text-piccolo text-ink-400">non iniziato</span>
                ) : (
                  <BarraAvanzamento valore={c.avanzamento} />
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {preventivo ? (
                  <span className="text-piccolo text-ink-400">—</span>
                ) : (
                  <Salute conti={c} />
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col items-start gap-1.5">
                  <StatoCommessa stato={k.stato} />
                  {preventivo ? (
                    <button
                      type="button"
                      onClick={() => apriCantiere(k)}
                      data-comando
                      className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-brand-600 px-2.5 text-mini font-semibold text-white hover:bg-brand-700"
                    >
                      <Icona misura="sm" nome="Check" className="size-3" />
                      Apri il cantiere
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          );
        })}
      </TabellaDemo>
    </>
  );
}
