"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  StatoDemoPill,
  TabellaDemo,
  RicercaDemo,
  FiltriDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/clienti-attivita";

const MODULO_VUOTO = {
  nome: "",
  referente: "",
  email: "",
  telefono: "",
  citta: "",
  settore: "",
  stato: "attivo",
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
      dalAnno: campi.stato === "attivo" ? new Date().getFullYear() : null,
      note: "",
    });
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <CampoDemo etichetta="Nome azienda">
        <input
          type="text"
          required
          value={campi.nome}
          onChange={cambia("nome")}
          placeholder="Es. Falegnameria Verdi Snc"
          className={classiInputDemo}
        />
      </CampoDemo>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Referente">
          <input type="text" value={campi.referente} onChange={cambia("referente")} className={classiInputDemo} />
        </CampoDemo>
        <CampoDemo etichetta="Telefono">
          <input type="tel" value={campi.telefono} onChange={cambia("telefono")} className={classiInputDemo} />
        </CampoDemo>
      </div>
      <CampoDemo etichetta="Email">
        <input type="email" value={campi.email} onChange={cambia("email")} className={classiInputDemo} />
      </CampoDemo>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Città">
          <input type="text" value={campi.citta} onChange={cambia("citta")} className={classiInputDemo} />
        </CampoDemo>
        <CampoDemo etichetta="Stato">
          <select value={campi.stato} onChange={cambia("stato")} className={classiInputDemo}>
            <option value="attivo">Attivo</option>
            <option value="prospect">Potenziale</option>
          </select>
        </CampoDemo>
      </div>
      <CampoDemo etichetta="Settore">
        <input
          type="text"
          value={campi.settore}
          onChange={cambia("settore")}
          placeholder="Es. Falegnameria su misura"
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
          className="h-10 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          Salva cliente
        </button>
      </div>
    </form>
  );
}

/** Elenco clienti: ricerca, filtro per stato e riga che porta alla scheda. */
export default function PaginaClienti() {
  const { dati, aggiungi } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [modaleAperta, setModaleAperta] = useState(false);

  const attivi = dati.clienti.filter((c) => c.stato === "attivo");
  const potenziali = dati.clienti.filter((c) => c.stato === "prospect");

  const testo = ricerca.trim().toLowerCase();
  const filtrati = dati.clienti.filter((c) => {
    if (filtro && c.stato !== filtro) return false;
    if (!testo) return true;
    return [c.nome, c.referente, c.citta, c.settore]
      .some((v) => (v || "").toLowerCase().includes(testo));
  });

  const salvaNuovo = (cliente) => {
    aggiungi("clienti", cliente);
    setModaleAperta(false);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Clienti"
        sottotitolo={`${dati.clienti.length} clienti in anagrafica, ${attivi.length} attivi`}
      >
        <button
          type="button"
          onClick={() => setModaleAperta(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-ink-900 px-4 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="Users" className="size-3.5" />
          Nuovo cliente
        </button>
      </IntestazioneDemo>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per nome, referente, città…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: dati.clienti.length },
            { valore: "attivo", testo: "Attivi", conteggio: attivi.length },
            { valore: "prospect", testo: "Potenziali", conteggio: potenziali.length },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaDemo
        intestazioni={["Cliente", "Referente", "Città", "Stato", "Cliente dal"]}
        vuota={
          filtrati.length
            ? null
            : "Nessun cliente corrisponde alla ricerca. Prova con un altro nome o togli il filtro."
        }
      >
        {filtrati.map((c) => (
          <tr key={c.id} className="transition-colors hover:bg-surface-alt">
            <td className="px-4 py-3">
              <Link href={`${BASE}/clienti/${c.id}`} className="group block">
                <span className="block text-corrente font-semibold text-ink-900 group-hover:text-brand-700">
                  {c.nome}
                </span>
                {c.settore ? (
                  <span className="block text-mini text-ink-500">{c.settore}</span>
                ) : null}
              </Link>
            </td>
            <td className="px-4 py-3 text-piccolo text-ink-700">{c.referente || "—"}</td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{c.citta || "—"}</td>
            <td className="px-4 py-3">
              <StatoDemoPill stato={c.stato} />
            </td>
            <td className="px-4 py-3 text-piccolo text-ink-600">{c.dalAnno || "—"}</td>
          </tr>
        ))}
      </TabellaDemo>

      <ModaleDemo
        aperta={modaleAperta}
        titolo="Nuovo cliente"
        onChiudi={() => setModaleAperta(false)}
      >
        <ModuloNuovoCliente onSalva={salvaNuovo} onAnnulla={() => setModaleAperta(false)} />
      </ModaleDemo>
    </>
  );
}
