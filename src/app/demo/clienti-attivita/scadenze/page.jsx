"use client";

import { useState } from "react";
import { useDemo, giorniDaOggi } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  DataScadenza,
  FiltriDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";

const TIPI = {
  adempimento: { testo: "Adempimento", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
  pagamento: { testo: "Pagamento", classi: "bg-accento-50 text-accento-700 ring-accento-100" },
  rinnovo: { testo: "Rinnovo", classi: "bg-brand-50 text-brand-700 ring-brand-100" },
};

const oggiIso = () => new Date().toISOString().slice(0, 10);

/** Pastiglia del tipo di scadenza, sulla falsariga di quelle di stato. */
function PastigliaTipo({ tipo }) {
  const t = TIPI[tipo] || { testo: tipo, classi: "bg-surface-alt text-ink-700 ring-line" };
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${t.classi}`}
    >
      {t.testo}
    </span>
  );
}

/** Modulo "Nuova scadenza" dentro la modale. */
function ModuloNuovaScadenza({ clienti, onSalva, onAnnulla }) {
  const [campi, setCampi] = useState({
    titolo: "",
    clienteId: "",
    data: oggiIso(),
    tipo: "adempimento",
  });
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    if (!campi.titolo.trim()) return;
    onSalva({
      titolo: campi.titolo.trim(),
      clienteId: campi.clienteId || null,
      data: campi.data,
      tipo: campi.tipo,
    });
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <CampoDemo etichetta="Titolo">
        <input
          type="text"
          required
          value={campi.titolo}
          onChange={cambia("titolo")}
          placeholder="Es. Rinnovo contratto di consulenza"
          className={classiInputDemo}
        />
      </CampoDemo>
      <CampoDemo etichetta="Cliente">
        <select value={campi.clienteId} onChange={cambia("clienteId")} className={classiInputDemo}>
          <option value="">Studio (interna)</option>
          {clienti.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </CampoDemo>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Data">
          <input
            type="date"
            required
            value={campi.data}
            onChange={cambia("data")}
            className={classiInputDemo}
          />
        </CampoDemo>
        <CampoDemo etichetta="Tipo">
          <select value={campi.tipo} onChange={cambia("tipo")} className={classiInputDemo}>
            <option value="adempimento">Adempimento</option>
            <option value="pagamento">Pagamento</option>
            <option value="rinnovo">Rinnovo</option>
          </select>
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
          className="h-10 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
        >
          Salva scadenza
        </button>
      </div>
    </form>
  );
}

/** Una riga dello scadenzario, con la spunta che chiude (o riapre) la voce. */
function RigaScadenza({ scadenza, nomeCliente, onAlterna }) {
  const s = scadenza;
  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <button
        type="button"
        onClick={onAlterna}
        title={s.fatta ? "Riporta tra le cose da fare" : "Segna come fatta"}
        aria-label={s.fatta ? `Riporta da fare: ${s.titolo}` : `Segna fatta: ${s.titolo}`}
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          s.fatta
            ? "border-brand-600 bg-brand-600 text-white hover:border-ink-400 hover:bg-white hover:text-transparent"
            : "border-line text-transparent hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
        }`}
      >
        <Icona misura="sm" nome="Check" className="size-3.5" />
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-corrente font-medium ${
            s.fatta ? "text-ink-400 line-through" : "text-ink-900"
          }`}
        >
          {s.titolo}
        </p>
        <p className={`truncate text-mini ${s.fatta ? "text-ink-400" : "text-ink-500"}`}>
          {s.clienteId ? nomeCliente(s.clienteId) : "Studio"}
        </p>
      </div>
      <PastigliaTipo tipo={s.tipo} />
      <DataScadenza iso={s.data} fatta={s.fatta} />
    </li>
  );
}

/** Un gruppo dello scadenzario, con titoletto e riga discreta se è vuoto. */
function GruppoScadenze({ titolo, voci, vuoto, nomeCliente, aggiorna }) {
  return (
    <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
      <header className="border-b border-line-soft px-6 py-4">
        <h2 className="text-testo font-bold text-ink-900">
          {titolo}
          {voci.length ? (
            <span className="ml-2 text-piccolo font-medium text-ink-400">{voci.length}</span>
          ) : null}
        </h2>
      </header>
      <ul className="divide-y divide-line-soft">
        {voci.map((s) => (
          <RigaScadenza
            key={s.id}
            scadenza={s}
            nomeCliente={nomeCliente}
            onAlterna={() => aggiorna("scadenze", s.id, { fatta: !s.fatta })}
          />
        ))}
        {!voci.length ? (
          <li className="px-5 py-4 text-piccolo text-ink-400">{vuoto}</li>
        ) : null}
      </ul>
    </section>
  );
}

/** Scadenzario: in ritardo, prossime e fatte, con filtro per tipo. */
export default function PaginaScadenze() {
  const { dati, aggiorna, aggiungi } = useDemo();
  const [filtro, setFiltro] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const nonFatte = dati.scadenze.filter((s) => !s.fatta);
  const conteggio = (tipo) => nonFatte.filter((s) => s.tipo === tipo).length;

  const filtrate = dati.scadenze.filter((s) => !filtro || s.tipo === filtro);
  const perData = (a, b) => a.data.localeCompare(b.data);

  const inRitardo = filtrate.filter((s) => !s.fatta && giorniDaOggi(s.data) < 0).sort(perData);
  const prossime = filtrate.filter((s) => !s.fatta && giorniDaOggi(s.data) >= 0).sort(perData);
  const fatte = filtrate.filter((s) => s.fatta).sort(perData);

  const salvaNuova = (campi) => {
    aggiungi("scadenze", { ...campi, fatta: false });
    setModaleAperta(false);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Scadenze"
        sottotitolo={`${nonFatte.length} aperte${inRitardo.length && !filtro ? `, ${inRitardo.length} in ritardo` : ""}`}
      >
        <button
          type="button"
          onClick={() => setModaleAperta(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
        >
          <Icona misura="sm" nome="Clock" className="size-3.5" />
          Nuova scadenza
        </button>
      </IntestazioneDemo>

      <div className="mb-4">
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutte", conteggio: nonFatte.length },
            { valore: "adempimento", testo: "Adempimenti", conteggio: conteggio("adempimento") },
            { valore: "pagamento", testo: "Pagamenti", conteggio: conteggio("pagamento") },
            { valore: "rinnovo", testo: "Rinnovi", conteggio: conteggio("rinnovo") },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <div className="space-y-4">
        <GruppoScadenze
          titolo="In ritardo"
          voci={inRitardo}
          vuoto="Niente in ritardo — buon segno."
          nomeCliente={nomeCliente}
          aggiorna={aggiorna}
        />
        <GruppoScadenze
          titolo="Prossime"
          voci={prossime}
          vuoto="Nessuna scadenza in arrivo."
          nomeCliente={nomeCliente}
          aggiorna={aggiorna}
        />
        <GruppoScadenze
          titolo="Fatte"
          voci={fatte}
          vuoto="Le voci chiuse finiranno qui."
          nomeCliente={nomeCliente}
          aggiorna={aggiorna}
        />
      </div>

      <ModaleDemo
        aperta={modaleAperta}
        titolo="Nuova scadenza"
        onChiudi={() => setModaleAperta(false)}
      >
        <ModuloNuovaScadenza
          clienti={dati.clienti}
          onSalva={salvaNuova}
          onAnnulla={() => setModaleAperta(false)}
        />
      </ModaleDemo>
    </>
  );
}
