"use client";

import Link from "next/link";
import { useDemo, dataBreve } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, KpiDemo } from "@/components/demo/ElementiDemo";
import { Canale, Urgenza } from "@/components/demo/ElementiInterventi";
import Assistente from "@/components/demo/Assistente";
import { regoleInterventi } from "@/lib/regole-assistente";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/interventi";

const GIORNI = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

/* Le date dei dati finti nascono da toISOString(): qui si usa la stessa
   regola, altrimenti "oggi" della pagina e "oggi" dei dati non coincidono. */
const oggiIso = () => new Date().toISOString().slice(0, 10);

const PESO_URGENZA = { alta: 0, media: 1, bassa: 2 };

/** La giornata: chi è dove, cosa è appena entrato, cosa resta da chiudere. */
export default function GiornataInterventi() {
  const { dati } = useDemo();

  const oggi = oggiIso();
  const giornoSettimana = GIORNI[new Date().getDay()];

  const daProgrammare = dati.richieste.filter((r) => r.stato === "da_programmare");
  const interventiOggi = dati.interventi.filter((n) => n.data === oggi);
  const daFatturare = dati.interventi.filter((n) => n.stato === "chiuso" && !n.fatturato);
  const bollinoScaduto = dati.impianti.filter((im) => im.bollino !== "in regola");

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const appenaArrivate = [...daProgrammare].sort((a, b) => {
    const peso = (PESO_URGENZA[a.urgenza] ?? 1) - (PESO_URGENZA[b.urgenza] ?? 1);
    return peso !== 0 ? peso : b.ricevutaIl.localeCompare(a.ricevutaIl);
  });

  const interventiDi = (tecnicoId) =>
    interventiOggi
      .filter((n) => n.tecnicoId === tecnicoId)
      .sort((a, b) => a.ora.localeCompare(b.ora));

  return (
    <>
      <IntestazioneDemo
        titolo="La giornata di oggi"
        sottotitolo={`${giornoSettimana} — chi è dove, cosa manca, cosa è già chiuso.`}
      >
        <Link
          href={`${BASE}/richieste`}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="MessageCircle" className="size-3.5" />
          Richieste in arrivo
        </Link>
      </IntestazioneDemo>

      {/* ------------------------------------------------------------ KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiDemo
          etichetta="Da programmare"
          valore={daProgrammare.length}
          nota={
            daProgrammare.length
              ? `${daProgrammare.filter((r) => r.urgenza === "alta").length} urgenti`
              : "nessuna richiesta in attesa"
          }
          tono={daProgrammare.length ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="Interventi di oggi"
          valore={interventiOggi.length}
          nota={`${interventiOggi.filter((n) => n.stato === "in_corso").length} con il tecnico sul posto`}
        />
        <KpiDemo
          etichetta="Chiusi da fatturare"
          valore={daFatturare.length}
          nota="rapportini pronti in ufficio"
          tono="ok"
        />
        <KpiDemo
          etichetta="Bollini scaduti"
          valore={bollinoScaduto.length}
          nota={
            bollinoScaduto.length
              ? `su ${dati.impianti.length} impianti seguiti`
              : "tutti gli impianti in regola"
          }
          tono={bollinoScaduto.length ? "critico" : "ok"}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* --------------------------------------------- i tre tecnici */}
        <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
            <h2 className="text-testo font-bold text-ink-900">I tre tecnici, adesso</h2>
            <Link
              href={`${BASE}/interventi`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Tutti gli interventi
            </Link>
          </header>
          <ul className="divide-y divide-line-soft">
            {dati.tecnici.map((t) => {
              const suoi = interventiDi(t.id);
              return (
                <li key={t.id} className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-piccolo font-bold text-sole-400">
                      {t.iniziali}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-corrente font-semibold text-ink-900">{t.nome}</p>
                      <p className="truncate text-mini text-ink-500">{t.specialita}</p>
                    </div>
                    <span className="shrink-0 text-mini text-ink-500">
                      {suoi.length === 1 ? "1 intervento" : `${suoi.length} interventi`}
                    </span>
                  </div>

                  {suoi.length ? (
                    <ul className="mt-3 space-y-1">
                      {suoi.map((n) => (
                        <li key={n.id}>
                          <Link
                            href={`${BASE}/interventi/${n.id}`}
                            className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-x-3 rounded-[var(--radius-controllo)] px-2 py-1.5 hover:bg-surface-alt"
                          >
                            <span className="text-corrente font-bold text-ink-900">{n.ora}</span>
                            <span className="min-w-0">
                              <span className="block truncate text-corrente text-ink-800">
                                {n.titolo}
                              </span>
                              <span className="block truncate text-mini text-ink-500">
                                {nomeCliente(n.clienteId)}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 px-2 text-piccolo text-ink-500">
                      Nessun intervento programmato.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ------------------------------------------- appena arrivate */}
        <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
            <h2 className="text-testo font-bold text-ink-900">Appena arrivate</h2>
            <Link
              href={`${BASE}/richieste`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Tutte le richieste
            </Link>
          </header>
          <ul className="divide-y divide-line-soft">
            {appenaArrivate.map((r) => (
              <li key={r.id} className="px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <Urgenza livello={r.urgenza} />
                  <Canale tipo={r.canale} />
                  <span className="text-mini text-ink-400">{dataBreve(r.ricevutaIl)}</span>
                </div>
                <p className="mt-1.5 text-corrente font-medium text-ink-900">{r.oggetto}</p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="min-w-0 truncate text-mini text-ink-500">
                    {nomeCliente(r.clienteId)}
                  </p>
                  <Link
                    href={`${BASE}/richieste`}
                    className="inline-flex shrink-0 items-center gap-1 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Programma
                    <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
                  </Link>
                </div>
              </li>
            ))}
            {!appenaArrivate.length ? (
              <li className="px-5 py-10 text-center text-corrente text-ink-500">
                Nessuna richiesta in attesa. Tutto quello che è entrato ha già una data.
              </li>
            ) : null}
          </ul>
        </section>
      </div>

      <Assistente regole={regoleInterventi} />
    </>
  );
}
