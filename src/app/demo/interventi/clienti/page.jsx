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
import { Bollino, StatoIntervento } from "@/components/demo/ElementiInterventi";
import Icona from "@/components/ui/Icona";

const TIPI = { privato: "Privato", condominio: "Condominio", azienda: "Azienda" };

const MODULO_VUOTO = {
  nome: "",
  tipo: "privato",
  referente: "",
  telefono: "",
  indirizzo: "",
  contratto: "",
};

/** Modulo "Nuovo cliente" dentro la modale. */
function ModuloNuovoCliente({ onSalva, onAnnulla }) {
  const [campi, setCampi] = useState(MODULO_VUOTO);
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    if (!campi.nome.trim()) return;
    onSalva({
      ...campi,
      nome: campi.nome.trim(),
      referente: campi.referente.trim(),
      indirizzo: campi.indirizzo.trim(),
      contratto: campi.contratto.trim(),
    });
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <CampoDemo etichetta="Nome">
        <input
          type="text"
          required
          value={campi.nome}
          onChange={cambia("nome")}
          placeholder="Es. Condominio Le Magnolie"
          className={classiInputDemo}
        />
      </CampoDemo>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Tipo">
          <select value={campi.tipo} onChange={cambia("tipo")} className={classiInputDemo}>
            <option value="privato">Privato</option>
            <option value="condominio">Condominio</option>
            <option value="azienda">Azienda</option>
          </select>
        </CampoDemo>
        <CampoDemo etichetta="Referente">
          <input
            type="text"
            value={campi.referente}
            onChange={cambia("referente")}
            placeholder="Es. Amm. Ferrero"
            className={classiInputDemo}
          />
        </CampoDemo>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Telefono">
          <input type="tel" value={campi.telefono} onChange={cambia("telefono")} className={classiInputDemo} />
        </CampoDemo>
        <CampoDemo etichetta="Indirizzo">
          <input
            type="text"
            value={campi.indirizzo}
            onChange={cambia("indirizzo")}
            placeholder="Via, numero, città"
            className={classiInputDemo}
          />
        </CampoDemo>
      </div>
      <CampoDemo etichetta="Contratto">
        <input
          type="text"
          value={campi.contratto}
          onChange={cambia("contratto")}
          placeholder="Es. Manutenzione annuale · 12 caldaie"
          className={classiInputDemo}
        />
      </CampoDemo>
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
          Salva cliente
        </button>
      </div>
    </form>
  );
}

/** Riga di contatto con icona, mostrata solo se il dato c'è. */
function Contatto({ icona, testo }) {
  if (!testo) return null;
  return (
    <span className="flex items-center gap-1.5 text-piccolo text-ink-600">
      <Icona misura="sm" nome={icona} className="size-3.5 shrink-0 text-ink-400" />
      {testo}
    </span>
  );
}

/** Scheda del cliente: contatti, contratto, impianti e ultimi interventi. */
function SchedaCliente({ cliente, impianti, interventi }) {
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-scheda)] border border-line bg-surface-alt p-4">
        <p className="text-mini font-medium text-ink-500">{TIPI[cliente.tipo] || cliente.tipo}</p>
        <div className="mt-2 flex flex-col gap-1.5">
          <Contatto icona="UserCog" testo={cliente.referente} />
          <Contatto icona="Phone" testo={cliente.telefono} />
          <Contatto icona="MapPin" testo={cliente.indirizzo} />
        </div>
      </div>

      <div>
        <h3 className="mb-1.5 text-piccolo font-semibold text-ink-900">Contratto</h3>
        <p className="text-corrente text-ink-600">
          {cliente.contratto || "Nessun contratto di manutenzione: lavora a chiamata."}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-piccolo font-semibold text-ink-900">
          Impianti
          {impianti.length ? (
            <span className="ml-2 font-medium text-ink-400">{impianti.length}</span>
          ) : null}
        </h3>
        {impianti.length ? (
          <ul className="divide-y divide-line-soft rounded-[var(--radius-scheda)] border border-line">
            {impianti.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-corrente font-medium text-ink-900">
                    {i.marca} {i.modello}
                  </p>
                  <p className="text-mini text-ink-500">{i.ubicazione || "—"}</p>
                </div>
                <Bollino stato={i.bollino} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-corrente text-ink-500">Nessun impianto censito per questo cliente.</p>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-piccolo font-semibold text-ink-900">Ultimi interventi</h3>
        {interventi.length ? (
          <ul className="divide-y divide-line-soft rounded-[var(--radius-scheda)] border border-line">
            {interventi.map((n) => (
              <li key={n.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-corrente font-medium text-ink-900">{n.titolo}</p>
                  <p className="text-mini text-ink-500">{dataBreve(n.data)}</p>
                </div>
                <StatoIntervento intervento={n} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-corrente text-ink-500">Nessun intervento registrato per ora.</p>
        )}
      </div>
    </div>
  );
}

/** Anagrafica clienti: privati, condomini e aziende, con quello che hanno in casa. */
export default function PaginaClienti() {
  const { dati, aggiungi } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);
  const [apertoId, setApertoId] = useState(null);

  const impiantiDi = (id) => dati.impianti.filter((i) => i.clienteId === id);
  const interventiDi = (id) => dati.interventi.filter((n) => n.clienteId === id);
  const conteggioTipo = (tipo) => dati.clienti.filter((c) => c.tipo === tipo).length;

  const testo = ricerca.trim().toLowerCase();
  const filtrati = dati.clienti.filter((c) => {
    if (filtro && c.tipo !== filtro) return false;
    if (!testo) return true;
    return [c.nome, c.referente, c.indirizzo].some((v) => (v || "").toLowerCase().includes(testo));
  });

  const clienteAperto = dati.clienti.find((c) => c.id === apertoId) || null;
  const ultimiInterventi = clienteAperto
    ? interventiDi(clienteAperto.id)
        .slice()
        .sort((a, b) => b.data.localeCompare(a.data))
        .slice(0, 5)
    : [];

  const salvaNuovo = (cliente) => {
    aggiungi("clienti", cliente);
    setModaleAperta(false);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Clienti"
        sottotitolo={`${dati.clienti.length} clienti in anagrafica, ${dati.impianti.length} impianti seguiti`}
      >
        <button
          type="button"
          onClick={() => setModaleAperta(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
        >
          <Icona misura="sm" nome="Users" className="size-3.5" />
          Nuovo cliente
        </button>
      </IntestazioneDemo>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per nome, referente, indirizzo…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: dati.clienti.length },
            { valore: "privato", testo: "Privati", conteggio: conteggioTipo("privato") },
            { valore: "condominio", testo: "Condomini", conteggio: conteggioTipo("condominio") },
            { valore: "azienda", testo: "Aziende", conteggio: conteggioTipo("azienda") },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaDemo
        intestazioni={["Cliente", "Referente", "Indirizzo", "Impianti", "Interventi", "Contratto"]}
        vuota={
          filtrati.length
            ? null
            : "Nessun cliente corrisponde alla ricerca. Prova con un altro nome o togli il filtro."
        }
      >
        {filtrati.map((c) => (
          <tr
            key={c.id}
            onClick={() => setApertoId(c.id)}
            className="cursor-pointer transition-colors hover:bg-surface-alt"
          >
            <td className="px-4 py-3">
              <button type="button" onClick={() => setApertoId(c.id)} className="block text-left">
                <span className="block text-corrente font-semibold text-ink-900">{c.nome}</span>
                <span className="block text-mini text-ink-500">{TIPI[c.tipo] || c.tipo}</span>
              </button>
            </td>
            <td className="px-4 py-3">
              <span className="block text-piccolo text-ink-700">{c.referente || "—"}</span>
              {c.telefono ? <span className="block text-mini text-ink-500">{c.telefono}</span> : null}
            </td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{c.indirizzo || "—"}</td>
            <td className="px-4 py-3 text-piccolo text-ink-700">{impiantiDi(c.id).length}</td>
            <td className="px-4 py-3 text-piccolo text-ink-700">{interventiDi(c.id).length}</td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{c.contratto || "—"}</td>
          </tr>
        ))}
      </TabellaDemo>

      <p className="mt-3 flex items-center gap-1.5 text-mini text-ink-500">
        <Icona misura="sm" nome="Users" className="size-3.5 text-ink-400" />
        Tocca una riga per aprire la scheda con impianti e ultimi interventi.
      </p>

      <ModaleDemo
        aperta={modaleAperta}
        titolo="Nuovo cliente"
        onChiudi={() => setModaleAperta(false)}
      >
        <ModuloNuovoCliente onSalva={salvaNuovo} onAnnulla={() => setModaleAperta(false)} />
      </ModaleDemo>

      <ModaleDemo
        aperta={Boolean(clienteAperto)}
        titolo={clienteAperto ? clienteAperto.nome : ""}
        onChiudi={() => setApertoId(null)}
      >
        {clienteAperto ? (
          <SchedaCliente
            cliente={clienteAperto}
            impianti={impiantiDi(clienteAperto.id)}
            interventi={ultimiInterventi}
          />
        ) : null}
      </ModaleDemo>
    </>
  );
}
