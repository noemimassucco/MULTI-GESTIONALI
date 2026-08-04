"use client";

import { useState } from "react";
import { useDemo, dataBreve } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  TabellaDemo,
  RicercaDemo,
  FiltriDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";

/** Modulo "Carica documenti": niente finto upload, solo una voce d'archivio. */
function ModuloNuovoDocumento({ clienti, onSalva, onAnnulla }) {
  const [campi, setCampi] = useState({ nome: "", clienteId: "", tipo: "" });
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    if (!campi.nome.trim()) return;
    onSalva({
      nome: campi.nome.trim(),
      clienteId: campi.clienteId || null,
      tipo: campi.tipo.trim() || "Altro",
      caricatoIl: new Date().toISOString().slice(0, 10),
      dimensione: "—",
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-corrente text-ink-600">
        Nel gestionale vero trascini file, cartelle o interi ZIP e l&apos;assistente riconosce
        i documenti, li rinomina e li collega da solo alla scheda del cliente giusto. In questa
        demo il caricamento vero non c&apos;è, e preferiamo dirtelo. Qui puoi però aggiungere una
        voce all&apos;archivio, per vedere che l&apos;elenco è vivo davvero.
      </p>
      <form onSubmit={invia} className="space-y-4">
        <CampoDemo etichetta="Nome documento">
          <input
            type="text"
            required
            value={campi.nome}
            onChange={cambia("nome")}
            placeholder="Es. Bilancio 2025 definitivo.pdf"
            className={classiInputDemo}
          />
        </CampoDemo>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoDemo etichetta="Cliente">
            <select value={campi.clienteId} onChange={cambia("clienteId")} className={classiInputDemo}>
              <option value="">— Nessuno —</option>
              {clienti.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </CampoDemo>
          <CampoDemo etichetta="Tipo">
            <input
              type="text"
              value={campi.tipo}
              onChange={cambia("tipo")}
              placeholder="Es. Contratto"
              className={classiInputDemo}
            />
          </CampoDemo>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onAnnulla}
            className="h-10 rounded-[var(--radius-controllo)] px-4 text-piccolo font-semibold text-ink-600 hover:bg-surface-alt"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="h-10 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
          >
            Aggiungi all&apos;archivio
          </button>
        </div>
      </form>
    </div>
  );
}

/** Archivio documenti: ricerca su nome e tipo, filtro per tipo. */
export default function PaginaDocumenti() {
  const { dati, aggiungi } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  /* Tipi distinti presenti nei dati, con conteggio. */
  const conteggiTipi = dati.documenti.reduce((acc, d) => {
    acc[d.tipo] = (acc[d.tipo] || 0) + 1;
    return acc;
  }, {});
  const tipi = Object.keys(conteggiTipi).sort((a, b) => a.localeCompare(b, "it"));

  const testo = ricerca.trim().toLowerCase();
  const filtrati = dati.documenti.filter((d) => {
    if (filtro && d.tipo !== filtro) return false;
    if (!testo) return true;
    return [d.nome, d.tipo].some((v) => (v || "").toLowerCase().includes(testo));
  });

  const salvaNuovo = (documento) => {
    aggiungi("documenti", documento);
    setModaleAperta(false);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Documenti"
        sottotitolo={`${dati.documenti.length} documenti in archivio, collegati ai clienti`}
      >
        <button
          type="button"
          onClick={() => setModaleAperta(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="Upload" className="size-3.5" />
          Carica documenti
        </button>
      </IntestazioneDemo>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per nome o tipo…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: dati.documenti.length },
            ...tipi.map((t) => ({ valore: t, testo: t, conteggio: conteggiTipi[t] })),
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaDemo
        intestazioni={["Documento", "Cliente", "Tipo", "Caricato il", "Dimensione"]}
        vuota={
          filtrati.length
            ? null
            : "Nessun documento corrisponde alla ricerca. Prova con un altro nome o togli il filtro."
        }
      >
        {filtrati.map((d) => (
          <tr key={d.id} className="transition-colors hover:bg-surface-alt">
            <td className="px-4 py-3">
              <span className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-surface-alt text-ink-500">
                  <Icona misura="sm" nome="FileStack" />
                </span>
                <span className="text-corrente font-semibold text-ink-900">{d.nome}</span>
              </span>
            </td>
            <td className="px-4 py-3 text-piccolo text-ink-700">{nomeCliente(d.clienteId)}</td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{d.tipo}</td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{dataBreve(d.caricatoIl)}</td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{d.dimensione}</td>
          </tr>
        ))}
      </TabellaDemo>

      <ModaleDemo
        aperta={modaleAperta}
        titolo="Carica documenti"
        onChiudi={() => setModaleAperta(false)}
      >
        <ModuloNuovoDocumento
          clienti={dati.clienti}
          onSalva={salvaNuovo}
          onAnnulla={() => setModaleAperta(false)}
        />
      </ModaleDemo>
    </>
  );
}
