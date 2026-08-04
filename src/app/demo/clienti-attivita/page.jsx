"use client";

import Link from "next/link";
import { useDemo, giorniDaOggi, euro, dataBreve } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  KpiDemo,
  StatoDemoPill,
  DataScadenza,
} from "@/components/demo/ElementiDemo";
import Assistente from "@/components/demo/Assistente";
import { regoleClientiAttivita } from "@/lib/regole-assistente";
import Icona from "@/components/ui/Icona";
import { studio } from "@/data/demo/clienti-attivita";

const BASE = "/demo/clienti-attivita";

/** La prima schermata del mattino: cosa scade, cosa è fermo, cosa entra. */
export default function Dashboard() {
  const { dati, aggiorna } = useDemo();

  const aperte = dati.attivita.filter((a) => a.stato !== "completata");
  const inRitardo = aperte.filter((a) => giorniDaOggi(a.scadenza) < 0);
  const scadenzeAperte = dati.scadenze.filter((s) => !s.fatta);
  const scadenzeVicine = scadenzeAperte
    .filter((s) => giorniDaOggi(s.data) <= 7)
    .sort((a, b) => a.data.localeCompare(b.data));
  const daIncassare = dati.pagamenti
    .filter((g) => g.stato !== "incassato")
    .reduce((somma, g) => somma + g.importo, 0);
  const pagamentiInRitardo = dati.pagamenti.filter((g) => g.stato === "in_ritardo");

  const prossimeAttivita = [...aperte]
    .sort((a, b) => a.scadenza.localeCompare(b.scadenza))
    .slice(0, 6);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  return (
    <>
      <IntestazioneDemo
        titolo={`Buongiorno, ${studio.utente.nome.split(" ")[0]}`}
        sottotitolo="Il quadro di oggi, prima del primo caffè."
      >
        <Link
          href={`${BASE}/attivita`}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
        >
          <Icona misura="sm" nome="CheckCircle2" className="size-3.5" />
          Tutte le attività
        </Link>
      </IntestazioneDemo>

      {/* ------------------------------------------------------- KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiDemo
          etichetta="Attività aperte"
          valore={aperte.length}
          nota={inRitardo.length ? `${inRitardo.length} in ritardo` : "nessuna in ritardo"}
          tono={inRitardo.length ? "critico" : "ok"}
        />
        <KpiDemo
          etichetta="Scadenze entro 7 giorni"
          valore={scadenzeVicine.length}
          nota={`${scadenzeAperte.length} aperte in totale`}
          tono={scadenzeVicine.some((s) => giorniDaOggi(s.data) < 0) ? "critico" : "allerta"}
        />
        <KpiDemo
          etichetta="Da incassare"
          valore={euro(daIncassare)}
          nota={
            pagamentiInRitardo.length
              ? `${pagamentiInRitardo.length} fatture oltre la data`
              : "tutto nei termini"
          }
          tono={pagamentiInRitardo.length ? "critico" : "neutro"}
        />
        <KpiDemo
          etichetta="Clienti attivi"
          valore={dati.clienti.filter((c) => c.stato === "attivo").length}
          nota={`${dati.clienti.filter((c) => c.stato === "prospect").length} potenziali in trattativa`}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* --------------------------------------- prossime attività */}
        <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line-soft px-6 py-4">
            <h2 className="text-testo font-bold text-ink-900">Prossime attività</h2>
            <Link
              href={`${BASE}/attivita`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Vedi tutte
            </Link>
          </header>
          <ul className="divide-y divide-line-soft">
            {prossimeAttivita.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                <button
                  type="button"
                  onClick={() => aggiorna("attivita", a.id, { stato: "completata" })}
                  title="Segna come completata"
                  aria-label={`Segna completata: ${a.titolo}`}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-transparent transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icona misura="sm" nome="Check" className="size-3.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-corrente font-medium text-ink-900">{a.titolo}</p>
                  <p className="truncate text-mini text-ink-500">
                    {nomeCliente(a.clienteId)} · {a.responsabile}
                  </p>
                </div>
                <span className="hidden sm:inline-flex"><StatoDemoPill stato={a.stato} /></span>
                <DataScadenza iso={a.scadenza} />
              </li>
            ))}
            {!prossimeAttivita.length ? (
              <li className="px-5 py-8 text-center text-corrente text-ink-500">
                Tutto completato. Succede solo nelle demo.
              </li>
            ) : null}
          </ul>
        </section>

        <div className="space-y-4">
          {/* ------------------------------------------- scadenze */}
          <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
            <header className="flex items-center justify-between border-b border-line-soft px-6 py-4">
              <h2 className="text-testo font-bold text-ink-900">Scadenze della settimana</h2>
              <Link
                href={`${BASE}/scadenze`}
                className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
              >
                Scadenzario
              </Link>
            </header>
            <ul className="divide-y divide-line-soft">
              {scadenzeVicine.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      giorniDaOggi(s.data) < 0
                        ? "bg-critico"
                        : giorniDaOggi(s.data) <= 1
                          ? "bg-accento-400"
                          : "bg-brand-500"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-corrente font-medium text-ink-900">{s.titolo}</p>
                    <p className="truncate text-mini text-ink-500">
                      {s.clienteId ? nomeCliente(s.clienteId) : "Studio"}
                    </p>
                  </div>
                  <DataScadenza iso={s.data} />
                </li>
              ))}
              {!scadenzeVicine.length ? (
                <li className="px-5 py-8 text-center text-corrente text-ink-500">
                  Nessuna scadenza nei prossimi 7 giorni.
                </li>
              ) : null}
            </ul>
          </section>

          {/* ------------------------------------------- incassi */}
          <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
            <header className="border-b border-line-soft px-6 py-4">
              <h2 className="text-testo font-bold text-ink-900">Da tenere d&apos;occhio</h2>
            </header>
            <ul className="divide-y divide-line-soft">
              {pagamentiInRitardo.map((g) => (
                <li key={g.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-[#fbeceb] text-critico">
                    <Icona misura="sm" nome="AlertTriangle" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-corrente font-medium text-ink-900">
                      {g.descrizione}
                    </p>
                    <p className="truncate text-mini text-ink-500">
                      {nomeCliente(g.clienteId)} · attesa dal {dataBreve(g.data)}
                    </p>
                  </div>
                  <span className="text-corrente font-bold text-critico">{euro(g.importo)}</span>
                </li>
              ))}
              {!pagamentiInRitardo.length ? (
                <li className="px-5 py-8 text-center text-corrente text-ink-500">
                  Nessun pagamento in ritardo.
                </li>
              ) : null}
            </ul>
          </section>
        </div>
      </div>

      <Assistente regole={regoleClientiAttivita} />
    </>
  );
}
