"use client";

import Link from "next/link";
import { useDemo, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, KpiDemo } from "@/components/demo/ElementiDemo";
import {
  BarraAvanzamento,
  Salute,
  contiCommessa,
  salute,
} from "@/components/demo/ElementiCommesse";
import Assistente from "@/components/demo/Assistente";
import { regoleCommesse } from "@/lib/regole-assistente";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

const ORDINE_SALUTE = { perdita: 0, critico: 1, attenzione: 2, buono: 3 };

/** La prima schermata: come stanno andando i cantieri, in soldi. */
export default function CantieriAperti() {
  const { dati } = useDemo();

  const aperti = dati.commesse.filter((k) => k.stato === "in_corso");
  const conConti = aperti
    .map((k) => ({ k, c: contiCommessa(k, dati) }))
    .sort((a, b) => ORDINE_SALUTE[salute(a.c)] - ORDINE_SALUTE[salute(b.c)]);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const contrattiAperti = conConti.reduce((s, { c }) => s + c.ricavo, 0);
  const costiSostenuti = conConti.reduce((s, { c }) => s + c.costo, 0);
  const daFatturare = conConti.reduce((s, { c }) => s + c.daFatturare, 0);
  const scoperto = dati.varianti
    .filter((v) => v.stato === "eseguita")
    .reduce((s, v) => s + v.importo, 0);

  /* La media pesata delle proiezioni: quanto resterà davvero, non quanto
     sembra restare adesso. */
  const costiAFinire = conConti.reduce((s, { c }) => s + c.costoAFinire, 0);
  const margineMedio = contrattiAperti
    ? Math.round(((contrattiAperti - costiAFinire) / contrattiAperti) * 100)
    : 0;

  return (
    <>
      <IntestazioneDemo
        titolo="I cantieri aperti"
        sottotitolo="Non quanti sono: quanto stanno rendendo, oggi."
      >
        <Link
          href={`${BASE}/avanzamento`}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="FileStack" className="size-3.5" />
          Cosa c&apos;è da fatturare
        </Link>
      </IntestazioneDemo>

      {/* ------------------------------------------------------------ KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiDemo
          etichetta="Contratti aperti"
          valore={euro(contrattiAperti)}
          nota={`${aperti.length} cantieri in corso`}
        />
        <KpiDemo
          etichetta="Costi già sostenuti"
          valore={euro(costiSostenuti)}
          nota="ore, materiali e subappalti"
        />
        <KpiDemo
          etichetta="Margine previsto"
          valore={`${margineMedio}%`}
          nota="se si va avanti a questo ritmo"
          tono={margineMedio < 8 ? "critico" : margineMedio < 15 ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="Prodotto non fatturato"
          valore={euro(daFatturare)}
          nota="lavoro fatto e non ancora chiesto"
          tono={daFatturare > 0 ? "allerta" : "ok"}
        />
      </div>

      {scoperto > 0 ? (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[var(--radius-scheda)] border border-red-200 bg-red-50 px-4 py-3 text-piccolo leading-relaxed text-red-800">
          <Icona misura="sm" nome="AlertTriangle" className="shrink-0" />
          <span className="min-w-0 flex-1">
            Fuori da questi numeri ci sono {euro(scoperto)} di lavori già eseguiti e mai approvati
            per iscritto.
          </span>
          <Link
            href={`${BASE}/varianti`}
            className="shrink-0 font-semibold underline underline-offset-2"
          >
            Sistemali
          </Link>
        </p>
      ) : null}

      {/* -------------------------------------------------- i cantieri */}
      <section className="mt-4 rounded-[var(--radius-scheda)] border border-line bg-white">
        <header className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
          <h2 className="text-testo font-bold text-ink-900">In ordine di quanto preoccupano</h2>
          <Link
            href={`${BASE}/commesse`}
            className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
          >
            Tutte le commesse
          </Link>
        </header>

        <ul className="divide-y divide-line-soft">
          {conConti.map(({ k, c }) => (
            <li key={k.id}>
              <Link
                href={`${BASE}/commesse/${k.id}`}
                className="block px-5 py-4 transition-colors hover:bg-surface-alt"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <span className="font-mono text-mini font-semibold text-ink-500">
                        {k.numero}
                      </span>
                      <Salute conti={c} />
                    </div>
                    <p className="mt-1 text-corrente font-semibold text-ink-900">{k.titolo}</p>
                    <p className="mt-0.5 text-mini text-ink-500">
                      {nomeCliente(k.clienteId)} · {k.indirizzo}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-t3 font-bold leading-none ${
                        c.marginePrevistoPct < 8
                          ? "text-red-700"
                          : c.marginePrevistoPct < 15
                            ? "text-amber-700"
                            : "text-brand-700"
                      }`}
                    >
                      {c.marginePrevistoPct}%
                    </p>
                    <p className="mt-1 text-mini text-ink-500">
                      {euro(c.marginePrevisto)} previsti
                    </p>
                    {c.marginePrevistoPct < c.marginePct - 3 ? (
                      <p className="mt-0.5 text-mini text-ink-400">
                        oggi sembrano {c.marginePct}%
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div>
                    <p className="mb-1 text-mini text-ink-500">Avanzamento lavori</p>
                    <BarraAvanzamento valore={c.avanzamento} />
                  </div>
                  <div>
                    <p className="mb-1 text-mini text-ink-500">
                      Costo su prodotto — {euro(c.costo)} di {euro(c.prodotto)}
                    </p>
                    <BarraAvanzamento
                      valore={Math.min(100, Math.round(c.consumo * 100))}
                      tono={c.consumo > 0.92 ? "rosso" : c.consumo > 0.85 ? "sole" : "brand"}
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}

          {!conConti.length ? (
            <li className="px-5 py-10 text-center text-corrente text-ink-500">
              Nessun cantiere aperto in questo momento.
            </li>
          ) : null}
        </ul>
      </section>

      <Assistente regole={regoleCommesse} />
    </>
  );
}
