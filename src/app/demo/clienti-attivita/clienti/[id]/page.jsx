"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import {
  KpiDemo,
  StatoDemoPill,
  DataScadenza,
  TabellaDemo,
} from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/clienti-attivita";

/** Riga di contatto con icona, mostrata solo se il dato c'è. */
function Contatto({ icona, testo }) {
  if (!testo) return null;
  return (
    <span className="flex items-center gap-1.5 text-piccolo text-ink-600">
      <Icona misura="sm" nome={icona} className="shrink-0 text-ink-400" />
      {testo}
    </span>
  );
}

/** Cerchietto per segnare un'attività completata (o già completata). */
function CerchioCompleta({ attivita, onCompleta }) {
  if (attivita.stato === "completata") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Icona misura="sm" nome="Check" className="size-3.5" />
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onCompleta}
      title="Segna come completata"
      aria-label={`Segna completata: ${attivita.titolo}`}
      className="flex size-6 items-center justify-center rounded-full border border-line text-transparent transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
    >
      <Icona misura="sm" nome="Check" className="size-3.5" />
    </button>
  );
}

/** Scheda del singolo cliente: contatti, note, numeri e tutto ciò che lo riguarda. */
export default function SchedaCliente() {
  const { id } = useParams();
  const { dati, aggiorna } = useDemo();
  const [scheda, setScheda] = useState("attivita");

  const cliente = dati.clienti.find((c) => c.id === id);

  if (!cliente) {
    return (
      <div className="rounded-[var(--radius-scheda)] border border-line bg-white px-6 py-12 text-center">
        <p className="text-corrente text-ink-700">Cliente non trovato: forse è stato rimosso.</p>
        <Link
          href={`${BASE}/clienti`}
          className="mt-3 inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
        >
          <Icona misura="sm" nome="ArrowLeft" className="size-3.5" />
          Torna all&apos;elenco clienti
        </Link>
      </div>
    );
  }

  const attivitaCliente = dati.attivita.filter((a) => a.clienteId === cliente.id);
  const aperte = attivitaCliente.filter((a) => a.stato !== "completata");
  const documentiCliente = dati.documenti.filter((d) => d.clienteId === cliente.id);
  const preventiviCliente = dati.preventivi.filter((p) => p.clienteId === cliente.id);
  const pagamentiCliente = dati.pagamenti.filter((g) => g.clienteId === cliente.id);

  const schede = [
    { valore: "attivita", testo: "Attività", conteggio: attivitaCliente.length },
    { valore: "documenti", testo: "Documenti", conteggio: documentiCliente.length },
    { valore: "preventivi", testo: "Preventivi", conteggio: preventiviCliente.length },
    { valore: "pagamenti", testo: "Pagamenti", conteggio: pagamentiCliente.length },
  ];

  return (
    <>
      {/* ------------------------------------------------ intestazione */}
      <Link
        href={`${BASE}/clienti`}
        className="mb-3 inline-flex items-center gap-1.5 text-piccolo font-semibold text-ink-500 hover:text-ink-800"
      >
        <Icona misura="sm" nome="ArrowLeft" className="size-3.5" />
        Tutti i clienti
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-t2 font-bold text-ink-900">{cliente.nome}</h1>
            <StatoDemoPill stato={cliente.stato} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
            <Contatto icona="UserCog" testo={cliente.referente} />
            <Contatto icona="Mail" testo={cliente.email} />
            <Contatto icona="Phone" testo={cliente.telefono} />
            <Contatto icona="MapPin" testo={cliente.citta} />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- KPI */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiDemo etichetta="Attività aperte" valore={aperte.length} tono={aperte.length ? "allerta" : "ok"} />
        <KpiDemo etichetta="Documenti" valore={documentiCliente.length} />
        <KpiDemo etichetta="Preventivi" valore={preventiviCliente.length} />
      </div>

      {/* -------------------------------------------------------- note */}
      <div className="mt-4 rounded-[var(--radius-scheda)] border border-line bg-white p-5">
        <h2 className="mb-2 text-testo font-bold text-ink-900">Note</h2>
        <textarea
          key={cliente.id}
          rows={3}
          defaultValue={cliente.note}
          onBlur={(e) => aggiorna("clienti", cliente.id, { note: e.target.value })}
          placeholder="Appunti sul cliente: si salvano da soli quando esci dal campo."
          className="w-full rounded-[var(--radius-controllo)] border border-line bg-white p-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
      </div>

      {/* ------------------------------------------------------ schede */}
      <div className="mt-6 mb-4 flex flex-wrap gap-1.5">
        {schede.map((s) => (
          <button
            key={s.valore}
            type="button"
            onClick={() => setScheda(s.valore)}
            aria-pressed={s.valore === scheda}
            className={`h-9 rounded-full px-3 text-piccolo font-medium transition-colors ${
              s.valore === scheda
                ? "bg-ink-900 text-white"
                : "bg-white text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
            }`}
          >
            {s.testo}
            <span className={s.valore === scheda ? "ml-1.5 text-white/60" : "ml-1.5 text-ink-400"}>
              {s.conteggio}
            </span>
          </button>
        ))}
      </div>

      {scheda === "attivita" ? (
        <TabellaDemo
          intestazioni={["", "Attività", "Responsabile", "Stato", "Scadenza"]}
          vuota={attivitaCliente.length ? null : "Nessuna attività di questo cliente."}
        >
          {attivitaCliente.map((a) => (
            <tr key={a.id}>
              <td className="w-10 py-3 pl-4">
                <CerchioCompleta
                  attivita={a}
                  onCompleta={() => aggiorna("attivita", a.id, { stato: "completata" })}
                />
              </td>
              <td className="px-4 py-3">
                <span className="block text-corrente font-medium text-ink-900">{a.titolo}</span>
                {a.descrizione ? (
                  <span className="block text-mini text-ink-500">{a.descrizione}</span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-piccolo text-ink-600">{a.responsabile}</td>
              <td className="px-4 py-3"><StatoDemoPill stato={a.stato} /></td>
              <td className="px-4 py-3">
                <DataScadenza iso={a.scadenza} fatta={a.stato === "completata"} />
              </td>
            </tr>
          ))}
        </TabellaDemo>
      ) : null}

      {scheda === "documenti" ? (
        <TabellaDemo
          intestazioni={["Documento", "Tipo", "Caricato il", "Dimensione"]}
          vuota={documentiCliente.length ? null : "Nessun documento di questo cliente."}
        >
          {documentiCliente.map((d) => (
            <tr key={d.id}>
              <td className="px-4 py-3 text-corrente font-medium text-ink-900">{d.nome}</td>
              <td className="px-4 py-3 text-piccolo text-ink-600">{d.tipo}</td>
              <td className="px-4 py-3 text-piccolo text-ink-600">{dataBreve(d.caricatoIl)}</td>
              <td className="px-4 py-3 text-piccolo text-ink-600">{d.dimensione}</td>
            </tr>
          ))}
        </TabellaDemo>
      ) : null}

      {scheda === "preventivi" ? (
        <TabellaDemo
          intestazioni={["Numero", "Oggetto", "Importo", "Stato", "Data"]}
          vuota={preventiviCliente.length ? null : "Nessun preventivo per questo cliente."}
        >
          {preventiviCliente.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 text-piccolo text-ink-600">{p.numero}</td>
              <td className="px-4 py-3 text-corrente font-medium text-ink-900">{p.oggetto}</td>
              <td className="px-4 py-3 text-corrente font-semibold text-ink-900">{euro(p.importo)}</td>
              <td className="px-4 py-3"><StatoDemoPill stato={p.stato} /></td>
              <td className="px-4 py-3 text-piccolo text-ink-600">{dataBreve(p.data)}</td>
            </tr>
          ))}
        </TabellaDemo>
      ) : null}

      {scheda === "pagamenti" ? (
        <TabellaDemo
          intestazioni={["Descrizione", "Importo", "Stato", "Data"]}
          vuota={pagamentiCliente.length ? null : "Nessun pagamento registrato per questo cliente."}
        >
          {pagamentiCliente.map((g) => (
            <tr key={g.id}>
              <td className="px-4 py-3 text-corrente font-medium text-ink-900">{g.descrizione}</td>
              <td className="px-4 py-3 text-corrente font-semibold text-ink-900">{euro(g.importo)}</td>
              <td className="px-4 py-3"><StatoDemoPill stato={g.stato} /></td>
              <td className="px-4 py-3"><DataScadenza iso={g.data} fatta={g.stato === "incassato"} /></td>
            </tr>
          ))}
        </TabellaDemo>
      ) : null}

      {/* --------------------------------------------- rimando discreto */}
      <div className="mt-6 rounded-[var(--radius-scheda)] bg-surface-alt px-5 py-4">
        <p className="text-piccolo text-ink-600">
          Nel gestionale vero questa scheda si adatta al tuo settore: campi, schede e stati si
          personalizzano.{" "}
          <Link href="/personalizzazioni" className="font-semibold text-brand-700 hover:text-brand-800">
            Scopri le personalizzazioni
          </Link>
        </p>
      </div>
    </>
  );
}
