"use client";

import Link from "next/link";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, KpiDemo } from "@/components/demo/ElementiDemo";
import { Canale, Urgenza, totaleIntervento } from "@/components/demo/ElementiInterventi";
import Assistente from "@/components/demo/Assistente";
import { regoleInterventi } from "@/lib/regole-assistente";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/interventi";

const GIORNI = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

/* Le date dei dati finti nascono da toISOString(): qui si usa la stessa
   regola, altrimenti "oggi" della pagina e "oggi" dei dati non coincidono. */
const oggiIso = () => new Date().toISOString().slice(0, 10);

const PESO_URGENZA = { alta: 0, media: 1, bassa: 2 };

/** Titolo di un riquadro, con il collegamento alla sezione intera. */
function Testata({ titolo, nota, href, azione }) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line-soft px-6 py-4">
      <div className="min-w-0">
        <h3 className="text-testo font-semibold text-ink-900">{titolo}</h3>
        {nota ? <p className="mt-0.5 text-mini text-ink-500">{nota}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
        >
          {azione}
        </Link>
      ) : null}
    </header>
  );
}

function Riquadro({ children, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-[var(--radius-scheda)] border border-line bg-white ${className}`}
    >
      {children}
    </section>
  );
}

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
    interventiOggi.filter((n) => n.tecnicoId === tecnicoId).sort((a, b) => a.ora.localeCompare(b.ora));

  const valoreDaFatturare = daFatturare.reduce((s, n) => s + totaleIntervento(n).totale, 0);

  const ultimiDocumenti = [...dati.documenti]
    .sort((a, b) => b.caricatoIl.localeCompare(a.caricatoIl))
    .slice(0, 4);

  return (
    <>
      <IntestazioneDemo
        titolo="La giornata di oggi"
        sottotitolo={`${giornoSettimana} — chi è dove, cosa manca, cosa è già chiuso.`}
      >
        <Link
          href={`${BASE}/richieste`}
          data-comando
          className="flex h-11 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-5 text-piccolo font-semibold text-white transition-colors hover:bg-brand-600"
        >
          <Icona misura="sm" nome="MessageCircle" className="size-3.5" />
          Richieste in arrivo
        </Link>
      </IntestazioneDemo>

      {/* ------------------------------------------------------------ KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiDemo
          icona="MessageCircle"
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
          icona="Wrench"
          etichetta="Interventi di oggi"
          valore={interventiOggi.length}
          nota={`${interventiOggi.filter((n) => n.stato === "in_corso").length} con il tecnico sul posto`}
        />
        <KpiDemo
          icona="FileStack"
          etichetta="Da fatturare"
          valore={euro(Math.round(valoreDaFatturare))}
          nota={`${daFatturare.length} rapportini pronti`}
          tono="ok"
        />
        <KpiDemo
          icona="AlertTriangle"
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

      {/* -------------------------------------- squadra + cose in arrivo */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Riquadro>
          <Testata
            titolo="I tre tecnici, adesso"
            nota="Dove sono e cosa hanno in mano"
            href={`${BASE}/interventi`}
            azione="Tutti gli interventi"
          />
          <ul className="divide-y divide-line-soft">
            {dati.tecnici.map((t) => {
              const suoi = interventiDi(t.id);
              return (
                <li key={t.id} className="px-6 py-5">
                  <div className="flex items-center gap-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-piccolo font-semibold text-brand-700">
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
                    <ul className="mt-3.5 space-y-0.5">
                      {suoi.map((n) => (
                        <li key={n.id}>
                          <Link
                            href={`${BASE}/interventi/${n.id}`}
                            className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-x-4 rounded-[var(--radius-controllo)] px-2.5 py-2 transition-colors hover:bg-surface-alt"
                          >
                            <span className="cifre text-corrente font-bold text-brand-700">
                              {n.ora}
                            </span>
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
                    <p className="mt-3.5 px-2.5 text-piccolo text-ink-500">
                      Nessun intervento programmato.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Riquadro>

        <Riquadro>
          <Testata
            titolo="Appena arrivate"
            nota="Ancora senza una data"
            href={`${BASE}/richieste`}
            azione="Tutte le richieste"
          />
          <ul className="divide-y divide-line-soft">
            {appenaArrivate.map((r) => (
              <li key={r.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <Urgenza livello={r.urgenza} />
                  <Canale tipo={r.canale} />
                  <span className="text-mini text-ink-400">{dataBreve(r.ricevutaIl)}</span>
                </div>
                <p className="mt-2 text-corrente font-medium text-ink-900">{r.oggetto}</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
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
              <li className="px-6 py-12 text-center text-corrente text-ink-500">
                Nessuna richiesta in attesa. Tutto quello che è entrato ha già una data.
              </li>
            ) : null}
          </ul>
        </Riquadro>
      </div>

      {/* ------------------------------------------ documenti e archivio */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Riquadro className="flex flex-col">
          <Testata titolo="Porta dentro l'archivio" nota="Il passato, senza caricarlo a mano" />
          <div className="flex flex-1 flex-col p-6">
            <div className="rounded-[var(--radius-controllo)] border border-dashed border-line bg-surface-alt px-5 py-8 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-[var(--radius-controllo)] bg-white text-brand-600 ring-1 ring-inset ring-line">
                <Icona misura="md" nome="Upload" />
              </span>
              <p className="mt-4 text-corrente font-medium text-ink-900">
                Trascina qui una cartella o un archivio ZIP
              </p>
              <p className="mx-auto mt-2 max-w-xs text-piccolo leading-relaxed text-ink-500">
                Il sistema legge i documenti, capisce cosa sono e li collega alla scheda giusta.
              </p>
              <Link
                href={`${BASE}/documenti`}
                data-comando
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-5 text-piccolo font-semibold text-white transition-colors hover:bg-brand-600"
              >
                <Icona misura="sm" nome="FolderOpen" className="size-3.5" />
                Provalo adesso
              </Link>
            </div>
          </div>
        </Riquadro>

        <Riquadro>
          <Testata
            titolo="Ultimi documenti archiviati"
            nota={`${dati.documenti.length} in tutto`}
            href={`${BASE}/documenti`}
            azione="Vedi tutti"
          />
          <ul className="divide-y divide-line-soft">
            {ultimiDocumenti.map((d) => (
              <li key={d.id} className="flex items-center gap-4 px-6 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-surface-alt text-ink-500">
                  <Icona misura="sm" nome="FileStack" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-corrente font-medium text-ink-900">
                    {d.nome}
                  </span>
                  <span className="block truncate text-mini text-ink-500">
                    {d.tipo} · {nomeCliente(d.clienteId)}
                  </span>
                </span>
                <span className="shrink-0 text-mini text-ink-500">{dataBreve(d.caricatoIl)}</span>
              </li>
            ))}
            {!ultimiDocumenti.length ? (
              <li className="px-6 py-12 text-center text-corrente text-ink-500">
                Nessun documento archiviato.
              </li>
            ) : null}
          </ul>
        </Riquadro>
      </div>

      <Assistente regole={regoleInterventi} />

      {/* ------------------------------------------------- accesso rapido */}
      <section className="mt-5">
        <p className="occhiello mb-4 text-ink-500">Accesso rapido</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { href: `${BASE}/richieste`, label: "Nuova richiesta", icona: "MessageCircle" },
            { href: `${BASE}/interventi`, label: "Programma intervento", icona: "Wrench" },
            { href: `${BASE}/richiami`, label: "Richiami da fare", icona: "RefreshCw" },
            { href: `${BASE}/fatturare`, label: "Da fatturare", icona: "FileStack" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              data-comando
              className="flex items-center gap-3 rounded-[var(--radius-scheda)] border border-line bg-white px-4 py-4 transition-colors duration-150 hover:border-brand-300"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-50 text-brand-600">
                <Icona misura="sm" nome={a.icona} />
              </span>
              <span className="min-w-0 truncate text-corrente font-medium text-ink-800">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
