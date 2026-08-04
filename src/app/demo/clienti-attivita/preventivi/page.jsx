"use client";

import { useState } from "react";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  KpiDemo,
  StatoDemoPill,
  TabellaDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";

/** "2026-014" → 14; da qui il progressivo del prossimo numero. */
function prossimoNumero(preventivi) {
  const max = preventivi.reduce((m, p) => {
    const n = parseInt(String(p.numero).split("-")[1], 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return `2026-${String(max + 1).padStart(3, "0")}`;
}

/** Modulo "Nuovo preventivo" dentro la modale. */
function ModuloNuovoPreventivo({ clienti, onSalva, onAnnulla }) {
  const [campi, setCampi] = useState({ oggetto: "", clienteId: "", importo: "" });
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    if (!campi.oggetto.trim()) return;
    onSalva({
      oggetto: campi.oggetto.trim(),
      clienteId: campi.clienteId || null,
      importo: Number(campi.importo) || 0,
    });
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <CampoDemo etichetta="Oggetto">
        <input
          type="text"
          required
          value={campi.oggetto}
          onChange={cambia("oggetto")}
          placeholder="Es. Controllo di gestione — primo anno"
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
        <CampoDemo etichetta="Importo (€)">
          <input
            type="number"
            min="0"
            step="50"
            value={campi.importo}
            onChange={cambia("importo")}
            placeholder="Es. 2500"
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
          Salva bozza
        </button>
      </div>
    </form>
  );
}

/** Azioni contestuali allo stato del preventivo. */
function AzioniPreventivo({ preventivo, aggiorna }) {
  if (preventivo.stato === "bozza") {
    return (
      <button
        type="button"
        onClick={() => aggiorna("preventivi", preventivo.id, { stato: "inviato" })}
        className="h-8 whitespace-nowrap rounded-[var(--radius-controllo)] px-2.5 text-mini font-semibold text-ink-700 ring-1 ring-inset ring-line transition-colors hover:bg-surface-alt"
      >
        Segna inviato
      </button>
    );
  }
  if (preventivo.stato === "inviato") {
    return (
      <span className="flex gap-1.5">
        <button
          type="button"
          onClick={() => aggiorna("preventivi", preventivo.id, { stato: "accettato" })}
          className="h-8 rounded-[var(--radius-controllo)] bg-brand-50 px-2.5 text-mini font-semibold text-brand-800 ring-1 ring-inset ring-brand-100 transition-colors hover:bg-brand-100"
        >
          Accettato
        </button>
        <button
          type="button"
          onClick={() => aggiorna("preventivi", preventivo.id, { stato: "rifiutato" })}
          className="h-8 rounded-[var(--radius-controllo)] bg-white px-2.5 text-mini font-semibold text-red-800 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-50"
        >
          Rifiutato
        </button>
      </span>
    );
  }
  return <span className="text-mini text-ink-400">—</span>;
}

/** Preventivi: quanto vale il lavoro accettato, cosa aspetta una risposta. */
export default function PaginaPreventivi() {
  const { dati, aggiorna, aggiungi } = useDemo();
  const [modaleAperta, setModaleAperta] = useState(false);

  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const accettati = dati.preventivi.filter((p) => p.stato === "accettato");
  const rifiutati = dati.preventivi.filter((p) => p.stato === "rifiutato");
  const inviati = dati.preventivi.filter((p) => p.stato === "inviato");

  const totaleAccettati = accettati.reduce((s, p) => s + p.importo, 0);
  const totaleInviati = inviati.reduce((s, p) => s + p.importo, 0);
  const denominatore = accettati.length + rifiutati.length;
  const tasso = denominatore
    ? `${Math.round((accettati.length / denominatore) * 100)}%`
    : "—";

  const salvaNuovo = (preventivo) => {
    aggiungi("preventivi", {
      ...preventivo,
      numero: prossimoNumero(dati.preventivi),
      stato: "bozza",
      data: new Date().toISOString().slice(0, 10),
    });
    setModaleAperta(false);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Preventivi"
        sottotitolo={`${dati.preventivi.length} preventivi, ${inviati.length} in attesa di risposta`}
      >
        <button
          type="button"
          onClick={() => setModaleAperta(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="FileSpreadsheet" className="size-3.5" />
          Nuovo preventivo
        </button>
      </IntestazioneDemo>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiDemo
          etichetta="Totale accettati"
          valore={euro(totaleAccettati)}
          nota={`${accettati.length} preventivi`}
          tono="ok"
        />
        <KpiDemo
          etichetta="In attesa di risposta"
          valore={euro(totaleInviati)}
          nota={`${inviati.length} inviati`}
          tono={inviati.length ? "allerta" : "neutro"}
        />
        <KpiDemo
          etichetta="Tasso di accettazione"
          valore={tasso}
          nota={denominatore ? `su ${denominatore} con esito` : "nessun esito ancora"}
        />
      </div>

      <TabellaDemo
        intestazioni={["Numero", "Oggetto", "Cliente", "Data", "Importo", "Stato", "Azioni"]}
        vuota={dati.preventivi.length ? null : "Nessun preventivo in elenco."}
      >
        {dati.preventivi.map((p) => (
          <tr key={p.id} className="transition-colors hover:bg-surface-alt">
            <td className="whitespace-nowrap px-4 py-3 font-mono text-piccolo font-medium text-ink-600">
              {p.numero}
            </td>
            <td className="px-4 py-3 text-corrente font-semibold text-ink-900">{p.oggetto}</td>
            <td className="px-4 py-3 text-piccolo text-ink-700">{nomeCliente(p.clienteId)}</td>
            <td className="whitespace-nowrap px-4 py-3 text-piccolo text-ink-600">
              {dataBreve(p.data)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right text-corrente font-semibold text-ink-900">
              {euro(p.importo)}
            </td>
            <td className="px-4 py-3">
              <StatoDemoPill stato={p.stato} />
            </td>
            <td className="px-4 py-3">
              <AzioniPreventivo preventivo={p} aggiorna={aggiorna} />
            </td>
          </tr>
        ))}
      </TabellaDemo>

      <ModaleDemo
        aperta={modaleAperta}
        titolo="Nuovo preventivo"
        onChiudi={() => setModaleAperta(false)}
      >
        <ModuloNuovoPreventivo
          clienti={dati.clienti}
          onSalva={salvaNuovo}
          onAnnulla={() => setModaleAperta(false)}
        />
      </ModaleDemo>
    </>
  );
}
