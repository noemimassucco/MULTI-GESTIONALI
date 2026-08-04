"use client";

import { useState } from "react";
import { useDemo, dataBreve } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  TabellaDemo,
  RicercaDemo,
  FiltriDemo,
  ModaleDemo,
  DataScadenza,
} from "@/components/demo/ElementiDemo";
import { Bollino, StatoIntervento } from "@/components/demo/ElementiInterventi";
import Icona from "@/components/ui/Icona";

/** Riga della scheda impianto: etichetta a sinistra, dato a destra. */
function Voce({ etichetta, children }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="shrink-0 text-piccolo text-ink-500">{etichetta}</dt>
      <dd className="text-right text-piccolo font-medium text-ink-900">{children}</dd>
    </div>
  );
}

/** Scheda dell'impianto dentro la modale: dati, note e storico degli interventi. */
function SchedaImpianto({ impianto, cliente, interventi, tecnici }) {
  const nomeTecnico = (id) => tecnici.find((t) => t.id === id)?.nome || "—";

  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-scheda)] border border-line bg-surface-alt p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-testo font-bold text-ink-900">
              {impianto.marca} {impianto.modello}
            </p>
            <p className="font-mono text-mini text-ink-500">{impianto.matricola}</p>
          </div>
          <Bollino stato={impianto.bollino} />
        </div>
      </div>

      <dl className="divide-y divide-line-soft">
        <Voce etichetta="Tipo">{impianto.tipo}</Voce>
        <Voce etichetta="Cliente">{cliente?.nome || "—"}</Voce>
        <Voce etichetta="Ubicazione">{impianto.ubicazione || "—"}</Voce>
        <Voce etichetta="Indirizzo">{cliente?.indirizzo || "—"}</Voce>
        <Voce etichetta="Installato">{dataBreve(impianto.installato)}</Voce>
        <Voce etichetta="Ultimo controllo">{dataBreve(impianto.ultimoControllo)}</Voce>
        <Voce etichetta="Prossimo controllo">
          <DataScadenza iso={impianto.prossimoControllo} />
        </Voce>
      </dl>

      <div>
        <h3 className="mb-1.5 text-piccolo font-semibold text-ink-900">Note</h3>
        <p className="text-corrente text-ink-600">
          {impianto.note || "Nessuna nota su questo impianto."}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-piccolo font-semibold text-ink-900">
          Storico interventi
          {interventi.length ? (
            <span className="ml-2 font-medium text-ink-400">{interventi.length}</span>
          ) : null}
        </h3>
        {interventi.length ? (
          <ul className="divide-y divide-line-soft rounded-[var(--radius-scheda)] border border-line">
            {interventi.map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-corrente font-medium text-ink-900">{n.titolo}</p>
                  <p className="text-mini text-ink-500">
                    {dataBreve(n.data)} · {nomeTecnico(n.tecnicoId)}
                  </p>
                </div>
                <StatoIntervento intervento={n} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-corrente text-ink-500">
            Su questo impianto non risulta ancora nessun intervento.
          </p>
        )}
      </div>
    </div>
  );
}

/** Il parco impianti: ogni caldaia con il suo bollino e il suo storico. */
export default function PaginaImpianti() {
  const { dati } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [apertoId, setApertoId] = useState(null);

  const cliente = (id) => dati.clienti.find((c) => c.id === id);
  const nomeCliente = (id) => cliente(id)?.nome || "—";

  const scaduti = dati.impianti.filter((i) => i.bollino !== "in regola");

  const tipi = [...new Set(dati.impianti.map((i) => i.tipo))].sort((a, b) => a.localeCompare(b));

  const testo = ricerca.trim().toLowerCase();
  const filtrati = dati.impianti.filter((i) => {
    if (filtro && i.tipo !== filtro) return false;
    if (!testo) return true;
    return [i.marca, i.modello, i.matricola, nomeCliente(i.clienteId)].some((v) =>
      (v || "").toLowerCase().includes(testo),
    );
  });

  const impiantoAperto = dati.impianti.find((i) => i.id === apertoId) || null;
  const storico = impiantoAperto
    ? dati.interventi
        .filter((n) => n.impiantoId === impiantoAperto.id)
        .sort((a, b) => b.data.localeCompare(a.data))
    : [];

  return (
    <>
      <IntestazioneDemo
        titolo="Impianti"
        sottotitolo={`${dati.impianti.length} impianti censiti${
          scaduti.length ? `, ${scaduti.length} con il bollino scaduto` : ", tutti col bollino in regola"
        }`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per marca, modello, matricola, cliente…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: dati.impianti.length },
            ...tipi.map((t) => ({
              valore: t,
              testo: t,
              conteggio: dati.impianti.filter((i) => i.tipo === t).length,
            })),
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaDemo
        intestazioni={[
          "Impianto",
          "Cliente",
          "Installato",
          "Ultimo controllo",
          "Prossimo controllo",
          "Bollino",
        ]}
        vuota={
          filtrati.length
            ? null
            : "Nessun impianto corrisponde alla ricerca. Prova con la matricola o togli il filtro."
        }
      >
        {filtrati.map((i) => (
          <tr
            key={i.id}
            onClick={() => setApertoId(i.id)}
            className="cursor-pointer transition-colors hover:bg-surface-alt"
          >
            <td className="px-4 py-3">
              <button
                type="button"
                onClick={() => setApertoId(i.id)}
                className="block text-left"
              >
                <span className="block text-corrente font-semibold text-ink-900">
                  {i.marca} {i.modello}
                </span>
                <span className="block font-mono text-mini text-ink-500">{i.matricola}</span>
              </button>
            </td>
            <td className="px-4 py-3">
              <span className="block text-piccolo text-ink-700">{nomeCliente(i.clienteId)}</span>
              {i.ubicazione ? (
                <span className="block text-mini text-ink-500">{i.ubicazione}</span>
              ) : null}
            </td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{dataBreve(i.installato)}</td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{dataBreve(i.ultimoControllo)}</td>
            <td className="px-4 py-3">
              <DataScadenza iso={i.prossimoControllo} />
            </td>
            <td className="px-4 py-3">
              <Bollino stato={i.bollino} />
            </td>
          </tr>
        ))}
      </TabellaDemo>

      <p className="mt-3 flex items-center gap-1.5 text-mini text-ink-500">
        <Icona misura="sm" nome="Blocks" className="size-3.5 text-ink-400" />
        Tocca una riga per aprire la scheda dell&apos;impianto e vedere tutti gli interventi fatti.
      </p>

      <ModaleDemo
        aperta={Boolean(impiantoAperto)}
        titolo={impiantoAperto ? `${impiantoAperto.marca} ${impiantoAperto.modello}` : ""}
        onChiudi={() => setApertoId(null)}
      >
        {impiantoAperto ? (
          <SchedaImpianto
            impianto={impiantoAperto}
            cliente={cliente(impiantoAperto.clienteId)}
            interventi={storico}
            tecnici={dati.tecnici}
          />
        ) : null}
      </ModaleDemo>
    </>
  );
}
