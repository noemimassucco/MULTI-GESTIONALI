"use client";

import Link from "next/link";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, KpiDemo, TabellaDemo } from "@/components/demo/ElementiDemo";
import { totaleIntervento } from "@/components/demo/ElementiInterventi";
import Icona from "@/components/ui/Icona";

const INTESTAZIONI = [
  "Numero",
  "Cliente",
  "Intervento",
  "Data",
  "Ore",
  "Materiali",
  "Totale",
];

/** Somma dei totali di una lista di interventi. */
function sommaTotali(lista) {
  return lista.reduce((s, n) => s + totaleIntervento(n).totale, 0);
}

/** Da fatturare: quello che è stato chiuso e non è ancora diventato una fattura. */
export default function PaginaDaFatturare() {
  const { dati, aggiorna } = useDemo();

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const perData = (a, b) => b.data.localeCompare(a.data);
  const chiusi = dati.interventi.filter((n) => n.stato === "chiuso");
  const daFatturare = chiusi.filter((n) => !n.fatturato).sort(perData);
  const fatturati = chiusi.filter((n) => n.fatturato).sort(perData);

  const importoDaFatturare = sommaTotali(daFatturare);
  const importoFatturato = sommaTotali(fatturati);

  return (
    <>
      <IntestazioneDemo
        titolo="Da fatturare"
        sottotitolo="Interventi chiusi che non sono ancora diventati una fattura."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiDemo
          etichetta="Interventi da fatturare"
          valore={daFatturare.length}
          nota="Chiusi col rapportino"
          tono={daFatturare.length ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="Importo da fatturare"
          valore={euro(importoDaFatturare)}
          nota="Ore e materiali già sommati"
        />
        <KpiDemo
          etichetta="Già fatturato questo mese"
          valore={euro(importoFatturato)}
          nota={`${fatturati.length} interventi chiusi e fatturati`}
          tono="ok"
        />
      </div>

      <div className="mt-5">
        <TabellaDemo
          intestazioni={[...INTESTAZIONI, ""]}
          vuota={daFatturare.length ? null : "Tutto fatturato. Nella realtà capita di rado."}
        >
          {daFatturare.map((n) => {
            const conto = totaleIntervento(n);
            return (
              <tr key={n.id} className="transition-colors hover:bg-surface-alt">
                <td className="px-4 py-3 font-mono text-piccolo text-ink-600">{n.numero}</td>
                <td className="px-4 py-3 text-piccolo text-ink-700">{nomeCliente(n.clienteId)}</td>
                <td className="px-4 py-3 text-corrente font-medium text-ink-900">{n.titolo}</td>
                <td className="px-4 py-3 text-piccolo text-ink-600">{dataBreve(n.data)}</td>
                <td className="px-4 py-3 text-piccolo text-ink-600">
                  {n.durataOre ? `${n.durataOre} h` : "—"}
                </td>
                <td className="px-4 py-3 text-piccolo text-ink-600">{euro(conto.materiali)}</td>
                <td className="px-4 py-3 text-right text-corrente font-bold text-ink-900">
                  {euro(conto.totale)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => aggiorna("interventi", n.id, { fatturato: true })}
                    className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-controllo)] bg-ink-900 px-3 text-piccolo font-semibold text-white hover:bg-ink-800"
                  >
                    <Icona misura="sm" nome="FileStack" className="size-3.5" />
                    Segna fatturato
                  </button>
                </td>
              </tr>
            );
          })}
        </TabellaDemo>
      </div>

      <h2 className="mt-6 mb-3 text-testo font-bold text-ink-900">
        Già fatturati
        {fatturati.length ? (
          <span className="ml-2 text-piccolo font-medium text-ink-400">{fatturati.length}</span>
        ) : null}
      </h2>
      <TabellaDemo
        intestazioni={INTESTAZIONI}
        vuota={fatturati.length ? null : "Ancora nessuna fattura emessa in questo periodo."}
      >
        {fatturati.map((n) => {
          const conto = totaleIntervento(n);
          return (
            <tr key={n.id} className="text-ink-500">
              <td className="px-4 py-3 font-mono text-piccolo text-ink-500">{n.numero}</td>
              <td className="px-4 py-3 text-piccolo text-ink-500">{nomeCliente(n.clienteId)}</td>
              <td className="px-4 py-3 text-corrente text-ink-500">{n.titolo}</td>
              <td className="px-4 py-3 text-piccolo text-ink-500">{dataBreve(n.data)}</td>
              <td className="px-4 py-3 text-piccolo text-ink-500">
                {n.durataOre ? `${n.durataOre} h` : "—"}
              </td>
              <td className="px-4 py-3 text-piccolo text-ink-500">{euro(conto.materiali)}</td>
              <td className="px-4 py-3 text-right text-corrente font-bold text-ink-500">
                {euro(conto.totale)}
              </td>
            </tr>
          );
        })}
      </TabellaDemo>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-scheda)] bg-surface-alt px-5 py-4">
        <p className="text-piccolo text-ink-600">
          Nel gestionale vero da qui esce il documento pronto per il commercialista o per il tuo
          programma di fatturazione.
        </p>
        <Link
          href="/personalizzazioni"
          className="flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
        >
          Scopri le personalizzazioni
          <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
        </Link>
      </div>
    </>
  );
}
