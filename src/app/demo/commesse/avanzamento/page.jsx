"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, KpiDemo, ModaleDemo } from "@/components/demo/ElementiDemo";
import { BarraAvanzamento, contiCommessa } from "@/components/demo/ElementiCommesse";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

/** L'avanzamento: quanto lavoro è stato prodotto e quanto se ne può chiedere. */
export default function PaginaAvanzamento() {
  const { dati, aggiorna, aggiungi } = useDemo();
  const [daEmettere, setDaEmettere] = useState(null);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const aperti = dati.commesse
    .filter((k) => k.stato === "in_corso" || k.stato === "consegnata")
    .map((k) => ({ k, c: contiCommessa(k, dati) }))
    .sort((a, b) => b.c.daFatturare - a.c.daFatturare);

  const salPronti = dati.sal
    .filter((q) => !q.fatturato)
    .sort((a, b) => a.data.localeCompare(b.data));

  const daFatturare = aperti.reduce((s, { c }) => s + c.daFatturare, 0);
  const salFermi = salPronti.reduce((s, q) => s + q.importo, 0);
  const ritenute = dati.commesse
    .filter((k) => k.stato === "consegnata" || k.stato === "chiusa")
    .reduce((s, k) => s + contiCommessa(k, dati).ritenuta, 0);

  /** Emette lo stato di avanzamento con quello che risulta prodotto oggi. */
  const emetti = () => {
    const { k, c } = daEmettere;
    const quanti = dati.sal.filter((q) => q.commessaId === k.id).length;
    aggiungi("sal", {
      commessaId: k.id,
      numero: `SAL ${quanti + 1}`,
      percentuale: c.avanzamento,
      importo: c.daFatturare,
      data: new Date().toISOString().slice(0, 10),
      fatturato: false,
    });
    setDaEmettere(null);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Avanzamento e fatturazione"
        sottotitolo="Quello che è stato eseguito vale già dei soldi: qui si vede quanti, e quanti ne sono stati chiesti."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiDemo
          etichetta="Prodotto non ancora richiesto"
          valore={euro(daFatturare)}
          nota="lavoro fatto, SAL da emettere"
          tono={daFatturare > 0 ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="SAL emessi e non fatturati"
          valore={euro(salFermi)}
          nota={`${salPronti.length} documenti`}
          tono={salPronti.length ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="Ritenute a garanzia"
          valore={euro(ritenute)}
          nota="trattenute sui cantieri consegnati"
        />
      </div>

      {/* -------------------------------------- SAL già pronti da fatturare */}
      {salPronti.length ? (
        <section className="mt-5 rounded-[var(--radius-scheda)] border border-accento-200 bg-white">
          <header className="border-b border-line-soft bg-accento-50 px-6 py-4">
            <h2 className="text-testo font-bold text-ink-900">
              Approvati e non ancora fatturati
            </h2>
            <p className="mt-1 text-piccolo text-ink-600">
              I lavori sono consegnati: manca solo il documento perché diventino soldi.
            </p>
          </header>
          <ul className="divide-y divide-line-soft">
            {salPronti.map((q) => {
              const k = dati.commesse.find((x) => x.id === q.commessaId);
              return (
                <li
                  key={q.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-corrente font-semibold text-ink-900">
                      {q.numero} · {k?.numero}
                    </p>
                    <p className="mt-0.5 text-mini text-ink-500">
                      {k?.titolo} — {nomeCliente(k?.clienteId)} · chiuso il {dataBreve(q.data)}
                    </p>
                  </div>
                  <p className="shrink-0 text-testo font-bold tabular-nums text-ink-900">
                    {euro(q.importo)}
                  </p>
                  <button
                    type="button"
                    onClick={() => aggiorna("sal", q.id, { fatturato: true })}
                    data-comando
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-brand-600 px-4 text-piccolo font-semibold text-white hover:bg-brand-700"
                  >
                    <Icona misura="sm" nome="Check" className="size-3.5" />
                    Segna fatturato
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* ----------------------------------------- cantiere per cantiere */}
      <section className="mt-5 rounded-[var(--radius-scheda)] border border-line bg-white">
        <header className="border-b border-line-soft px-6 py-4">
          <h2 className="text-testo font-bold text-ink-900">Cantiere per cantiere</h2>
          <p className="mt-1 text-piccolo text-ink-500">
            La differenza fra quanto è stato prodotto e quanto è già stato chiesto al cliente.
          </p>
        </header>

        <ul className="divide-y divide-line-soft">
          {aperti.map(({ k, c }) => (
            <li key={k.id} className="px-6 py-4">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <Link
                    href={`${BASE}/commesse/${k.id}`}
                    className="text-corrente font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {k.numero} — {k.titolo}
                  </Link>
                  <p className="mt-0.5 text-mini text-ink-500">{nomeCliente(k.clienteId)}</p>
                </div>
                {c.daFatturare > 0 ? (
                  <button
                    type="button"
                    onClick={() => setDaEmettere({ k, c })}
                    data-comando
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
                  >
                    <Icona misura="sm" nome="FileStack" className="size-3.5" />
                    Emetti SAL
                  </button>
                ) : (
                  <span className="shrink-0 text-piccolo font-medium text-brand-700">
                    tutto già richiesto
                  </span>
                )}
              </div>

              <div className="mt-3">
                <BarraAvanzamento valore={c.avanzamento} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                <div>
                  <dt className="text-mini text-ink-500">Contratto</dt>
                  <dd className="text-corrente font-medium tabular-nums text-ink-900">
                    {euro(c.ricavo)}
                  </dd>
                </div>
                <div>
                  <dt className="text-mini text-ink-500">Prodotto</dt>
                  <dd className="text-corrente font-medium tabular-nums text-ink-900">
                    {euro(c.prodotto)}
                  </dd>
                </div>
                <div>
                  <dt className="text-mini text-ink-500">Fatturato</dt>
                  <dd className="text-corrente font-medium tabular-nums text-ink-900">
                    {euro(c.fatturato)}
                  </dd>
                </div>
                <div>
                  <dt className="text-mini text-ink-500">Da chiedere</dt>
                  <dd
                    className={`text-corrente font-bold tabular-nums ${
                      c.daFatturare > 0 ? "text-accento-600" : "text-brand-700"
                    }`}
                  >
                    {euro(c.daFatturare)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}

          {!aperti.length ? (
            <li className="px-6 py-12 text-center text-corrente text-ink-500">
              Nessun cantiere in corso o consegnato.
            </li>
          ) : null}
        </ul>
      </section>

      {/* ------------------------------------------- modale emissione SAL */}
      <ModaleDemo
        aperta={Boolean(daEmettere)}
        titolo="Emetti lo stato di avanzamento"
        onChiudi={() => setDaEmettere(null)}
      >
        {daEmettere ? (
          <>
            <p className="text-corrente leading-relaxed text-ink-600">
              {daEmettere.k.numero} — {daEmettere.k.titolo}, per{" "}
              {nomeCliente(daEmettere.k.clienteId)}.
            </p>

            <dl className="mt-4 space-y-2.5 rounded-[var(--radius-controllo)] bg-surface-alt px-4 py-3.5">
              <div className="flex justify-between gap-4">
                <dt className="text-corrente text-ink-500">Avanzamento rilevato</dt>
                <dd className="text-corrente font-semibold text-ink-900">
                  {daEmettere.c.avanzamento}%
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-corrente text-ink-500">Valore prodotto</dt>
                <dd className="text-corrente font-semibold tabular-nums text-ink-900">
                  {euro(daEmettere.c.prodotto)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-corrente text-ink-500">Già fatturato</dt>
                <dd className="text-corrente font-semibold tabular-nums text-ink-900">
                  −{euro(daEmettere.c.fatturato)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-2.5">
                <dt className="text-testo font-bold text-ink-900">Importo del SAL</dt>
                <dd className="text-testo font-bold tabular-nums text-brand-700">
                  {euro(daEmettere.c.daFatturare)}
                </dd>
              </div>
            </dl>

            <p className="mt-3 text-piccolo leading-relaxed text-ink-500">
              L&apos;importo non è stato scritto da nessuno: esce dall&apos;avanzamento delle fasi e
              dalle varianti approvate. È il motivo per cui il capocantiere aggiorna le percentuali.
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDaEmettere(null)}
                data-comando
                className="flex h-11 items-center rounded-[var(--radius-controllo)] px-4 text-corrente font-medium text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={emetti}
                data-comando
                className="flex h-11 items-center rounded-[var(--radius-controllo)] bg-brand-600 px-5 text-corrente font-semibold text-white hover:bg-brand-700"
              >
                Emetti il SAL
              </button>
            </div>
          </>
        ) : null}
      </ModaleDemo>
    </>
  );
}
