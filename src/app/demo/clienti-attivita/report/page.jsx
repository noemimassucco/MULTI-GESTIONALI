"use client";

import Link from "next/link";
import { useDemo, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, StatoDemoPill } from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";

/** Percentuale sicura: se il totale è 0 la barra resta a 0. */
function pct(parte, totale) {
  return totale > 0 ? Math.round((parte / totale) * 100) : 0;
}

/** Contenitore dei riquadri del report, tutti con la stessa pelle. */
function Riquadro({ titolo, nota, children }) {
  return (
    <section className="rounded-[var(--radius-scheda)] border border-line bg-white p-5">
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-testo font-bold text-ink-900">{titolo}</h2>
        {nota ? <span className="text-mini text-ink-500">{nota}</span> : null}
      </header>
      {children}
    </section>
  );
}

/** Riga con etichetta, barra orizzontale proporzionale e valore. */
function Barra({ etichetta, valore, percento, colore }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-piccolo text-ink-700">{etichetta}</span>
      <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
        <div
          className={`h-full rounded-full ${colore}`}
          style={{ width: `${percento}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="w-20 shrink-0 whitespace-nowrap text-right text-piccolo font-semibold text-ink-900">
        {valore}
      </span>
    </div>
  );
}

/** Report: nessun numero inventato, tutto calcolato adesso dai dati della demo. */
export default function PaginaReport() {
  const { dati } = useDemo();

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "Studio";

  /* --------------------------------------------- attività per stato */
  const statiAttivita = [
    { stato: "completata", testo: "Completate", colore: "bg-brand-500" },
    { stato: "in_corso", testo: "In corso", colore: "bg-sole-500" },
    { stato: "in_attesa", testo: "In attesa", colore: "bg-line" },
    { stato: "da_fare", testo: "Da fare", colore: "bg-line" },
  ].map((v) => ({
    ...v,
    conteggio: dati.attivita.filter((a) => a.stato === v.stato).length,
  }));
  const totaleAttivita = dati.attivita.length;

  /* ------------------------------------- incassato vs da incassare */
  const incassato = dati.pagamenti
    .filter((g) => g.stato === "incassato")
    .reduce((s, g) => s + g.importo, 0);
  const daIncassare = dati.pagamenti
    .filter((g) => g.stato !== "incassato")
    .reduce((s, g) => s + g.importo, 0);
  const maxIncassi = Math.max(incassato, daIncassare);

  /* ------------------------------------------- clienti per volume */
  const perCliente = dati.pagamenti.reduce((acc, g) => {
    const chiave = g.clienteId || "studio";
    acc[chiave] = (acc[chiave] || 0) + g.importo;
    return acc;
  }, {});
  const migliori = Object.entries(perCliente)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxCliente = migliori.length ? migliori[0][1] : 0;

  /* ------------------------------------------- preventivi per stato */
  const statiPreventivi = ["bozza", "inviato", "accettato", "rifiutato"].map((stato) => ({
    stato,
    conteggio: dati.preventivi.filter((p) => p.stato === stato).length,
  }));

  return (
    <>
      <IntestazioneDemo
        titolo="Report"
        sottotitolo="Numeri veri, calcolati adesso dai dati della demo."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Riquadro titolo="Attività per stato" nota={`${totaleAttivita} in totale`}>
          <div className="space-y-3">
            {statiAttivita.map((v) => (
              <Barra
                key={v.stato}
                etichetta={v.testo}
                valore={v.conteggio}
                percento={pct(v.conteggio, totaleAttivita)}
                colore={v.colore}
              />
            ))}
          </div>
        </Riquadro>

        <Riquadro
          titolo="Incassato vs da incassare"
          nota={`${dati.pagamenti.length} movimenti`}
        >
          <div className="space-y-3">
            <Barra
              etichetta="Incassato"
              valore={euro(incassato)}
              percento={pct(incassato, maxIncassi)}
              colore="bg-brand-500"
            />
            <Barra
              etichetta="Da incassare"
              valore={euro(daIncassare)}
              percento={pct(daIncassare, maxIncassi)}
              colore="bg-sole-500"
            />
          </div>
          <p className="mt-4 text-mini text-ink-500">
            Nel &quot;da incassare&quot; rientrano le fatture in attesa e quelle in ritardo.
          </p>
        </Riquadro>

        <Riquadro titolo="I clienti che pesano di più" nota="per somma dei movimenti">
          {migliori.length ? (
            <div className="space-y-3">
              {migliori.map(([clienteId, importo]) => (
                <Barra
                  key={clienteId}
                  etichetta={nomeCliente(clienteId)}
                  valore={euro(importo)}
                  percento={pct(importo, maxCliente)}
                  colore="bg-brand-500"
                />
              ))}
            </div>
          ) : (
            <p className="text-corrente text-ink-500">Nessun movimento registrato.</p>
          )}
        </Riquadro>

        <Riquadro titolo="Preventivi" nota={`${dati.preventivi.length} in totale`}>
          <ul className="divide-y divide-line-soft">
            {statiPreventivi.map((v) => (
              <li key={v.stato} className="flex items-center justify-between gap-3 py-2.5">
                <StatoDemoPill stato={v.stato} />
                <span className="text-corrente font-semibold text-ink-900">{v.conteggio}</span>
              </li>
            ))}
          </ul>
        </Riquadro>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-scheda)] bg-surface-alt px-5 py-4">
        <p className="text-piccolo text-ink-600">
          Nel gestionale vero i report si costruiscono sulle TUE domande: questi sono esempi.
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
