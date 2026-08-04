"use client";

import { useState } from "react";
import { useDemo, giorniDaOggi } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  StatoDemoPill,
  DataScadenza,
  RicercaDemo,
  FiltriDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";
import { team } from "@/data/demo/clienti-attivita";

/** Al click sulla pastiglia lo stato gira: da fare → in corso → in attesa → da fare. */
const STATO_SUCCESSIVO = {
  da_fare: "in_corso",
  in_corso: "in_attesa",
  in_attesa: "da_fare",
  completata: "da_fare",
};

const PRIORITA = {
  alta: { classi: "bg-red-500", testo: "Priorità alta" },
  media: { classi: "bg-amber-500", testo: "Priorità media" },
  bassa: { classi: "bg-line", testo: "Priorità bassa" },
};

const oggiIso = () => new Date().toISOString().slice(0, 10);

/** Modulo "Nuova attività" dentro la modale. */
function ModuloNuovaAttivita({ clienti, onSalva, onAnnulla }) {
  const [campi, setCampi] = useState({
    titolo: "",
    clienteId: clienti[0]?.id || "",
    responsabile: team[0],
    scadenza: oggiIso(),
    priorita: "media",
  });
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    if (!campi.titolo.trim()) return;
    onSalva({ ...campi, titolo: campi.titolo.trim() });
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <CampoDemo etichetta="Titolo">
        <input
          type="text"
          required
          value={campi.titolo}
          onChange={cambia("titolo")}
          placeholder="Es. Preparare il cruscotto mensile"
          className={classiInputDemo}
        />
      </CampoDemo>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Cliente">
          <select value={campi.clienteId} onChange={cambia("clienteId")} className={classiInputDemo}>
            {clienti.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </CampoDemo>
        <CampoDemo etichetta="Responsabile">
          <select value={campi.responsabile} onChange={cambia("responsabile")} className={classiInputDemo}>
            {team.map((persona) => (
              <option key={persona} value={persona}>
                {persona}
              </option>
            ))}
          </select>
        </CampoDemo>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Scadenza">
          <input
            type="date"
            required
            value={campi.scadenza}
            onChange={cambia("scadenza")}
            className={classiInputDemo}
          />
        </CampoDemo>
        <CampoDemo etichetta="Priorità">
          <select value={campi.priorita} onChange={cambia("priorita")} className={classiInputDemo}>
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
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
          className="h-10 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          Salva attività
        </button>
      </div>
    </form>
  );
}

/** Elenco attività: ricerca, filtro per stato e righe su cui si lavora davvero. */
export default function PaginaAttivita() {
  const { dati, aggiorna, aggiungi } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";
  const conteggio = (stato) => dati.attivita.filter((a) => a.stato === stato).length;

  const testo = ricerca.trim().toLowerCase();
  const filtrate = dati.attivita.filter((a) => {
    if (filtro && a.stato !== filtro) return false;
    if (!testo) return true;
    return (
      a.titolo.toLowerCase().includes(testo) ||
      nomeCliente(a.clienteId).toLowerCase().includes(testo)
    );
  });

  /* Le aperte per scadenza crescente (i ritardi salgono da soli), le completate in fondo. */
  const ordinate = [...filtrate].sort((a, b) => {
    const aFatta = a.stato === "completata";
    const bFatta = b.stato === "completata";
    if (aFatta !== bFatta) return aFatta ? 1 : -1;
    return a.scadenza.localeCompare(b.scadenza);
  });

  const aperte = dati.attivita.filter((a) => a.stato !== "completata");
  const inRitardo = aperte.filter((a) => giorniDaOggi(a.scadenza) < 0);

  const salvaNuova = (campi) => {
    aggiungi("attivita", { ...campi, stato: "da_fare", descrizione: "" });
    setModaleAperta(false);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Attività"
        sottotitolo={`${aperte.length} aperte${inRitardo.length ? `, ${inRitardo.length} in ritardo` : ""}`}
      >
        <button
          type="button"
          onClick={() => setModaleAperta(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="CheckCircle2" className="size-3.5" />
          Nuova attività
        </button>
      </IntestazioneDemo>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per titolo o cliente…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutte", conteggio: dati.attivita.length },
            { valore: "da_fare", testo: "Da fare", conteggio: conteggio("da_fare") },
            { valore: "in_corso", testo: "In corso", conteggio: conteggio("in_corso") },
            { valore: "in_attesa", testo: "In attesa", conteggio: conteggio("in_attesa") },
            { valore: "completata", testo: "Completate", conteggio: conteggio("completata") },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <div className="rounded-[var(--radius-scheda)] border border-line bg-white">
        <ul className="divide-y divide-line-soft">
          {ordinate.map((a) => {
            const completata = a.stato === "completata";
            const priorita = PRIORITA[a.priorita] || PRIORITA.bassa;
            return (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <span
                  title={priorita.testo}
                  className={`h-8 w-1 shrink-0 rounded-full ${priorita.classi}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    aggiorna("attivita", a.id, { stato: completata ? "da_fare" : "completata" })
                  }
                  title={completata ? "Riporta tra le cose da fare" : "Segna come completata"}
                  aria-label={
                    completata
                      ? `Riporta da fare: ${a.titolo}`
                      : `Segna completata: ${a.titolo}`
                  }
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    completata
                      ? "border-brand-600 bg-brand-600 text-white hover:border-ink-400 hover:bg-white hover:text-transparent"
                      : "border-line text-transparent hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  <Icona misura="sm" nome="Check" className="size-3.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-corrente font-medium ${
                      completata ? "text-ink-400 line-through" : "text-ink-900"
                    }`}
                  >
                    {a.titolo}
                  </p>
                  <p className="truncate text-mini text-ink-500">
                    {nomeCliente(a.clienteId)} · {a.responsabile}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => aggiorna("attivita", a.id, { stato: STATO_SUCCESSIVO[a.stato] })}
                  title="Cambia stato"
                  aria-label={`Cambia stato: ${a.titolo}`}
                  className="shrink-0 rounded-full transition-opacity hover:opacity-75"
                >
                  <StatoDemoPill stato={a.stato} />
                </button>
                <DataScadenza iso={a.scadenza} fatta={completata} />
              </li>
            );
          })}
          {!ordinate.length ? (
            <li className="px-5 py-10 text-center text-corrente text-ink-500">
              {testo || filtro
                ? "Nessuna attività corrisponde alla ricerca. Prova a cambiare filtro o parola."
                : "Nessuna attività in elenco. Il bottone qui sopra è il posto giusto per cominciare."}
            </li>
          ) : null}
        </ul>
      </div>

      <ModaleDemo
        aperta={modaleAperta}
        titolo="Nuova attività"
        onChiudi={() => setModaleAperta(false)}
      >
        <ModuloNuovaAttivita
          clienti={dati.clienti}
          onSalva={salvaNuova}
          onAnnulla={() => setModaleAperta(false)}
        />
      </ModaleDemo>
    </>
  );
}
