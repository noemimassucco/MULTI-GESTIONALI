"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, dataBreve } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  FiltriDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import { Canale, Urgenza } from "@/components/demo/ElementiInterventi";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/interventi";

/* Stessa regola dei dati finti: "oggi" calcolato da toISOString(). */
const oggiIso = () => new Date().toISOString().slice(0, 10);

const PESO_URGENZA = { alta: 0, media: 1, bassa: 2 };

const BARRA_URGENZA = {
  alta: { classi: "bg-critico", testo: "Urgente" },
  media: { classi: "bg-accento-500", testo: "Normale" },
  bassa: { classi: "bg-line", testo: "Quando capita" },
};

/** Il numero del prossimo intervento: si prosegue dal più alto in elenco. */
function prossimoNumero(interventi) {
  const progressivi = interventi
    .map((n) => Number(String(n.numero).split("/")[1]))
    .filter((n) => Number.isFinite(n));
  const massimo = progressivi.length ? Math.max(...progressivi) : 0;
  return `${new Date().getFullYear()}/${massimo + 1}`;
}

const classiBottoneScuro =
  "flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600";

const classiBottoneChiaro =
  "h-10 rounded-[var(--radius-controllo)] px-4 text-piccolo font-semibold text-ink-600 hover:bg-surface-alt";

/* ------------------------------------------------------------------ */
/*  Modulo: una richiesta nuova, come arriva al telefono               */
/* ------------------------------------------------------------------ */

function ModuloNuovaRichiesta({ clienti, onSalva, onAnnulla }) {
  const [campi, setCampi] = useState({
    clienteId: clienti[0]?.id || "",
    oggetto: "",
    descrizione: "",
    canale: "telefono",
    urgenza: "media",
  });
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    if (!campi.oggetto.trim()) return;
    onSalva({
      ...campi,
      oggetto: campi.oggetto.trim(),
      descrizione: campi.descrizione.trim(),
    });
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <CampoDemo etichetta="Cliente">
        <select value={campi.clienteId} onChange={cambia("clienteId")} className={classiInputDemo}>
          {clienti.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </CampoDemo>

      <CampoDemo etichetta="Oggetto">
        <input
          type="text"
          required
          value={campi.oggetto}
          onChange={cambia("oggetto")}
          placeholder="Es. Non esce acqua calda"
          className={classiInputDemo}
        />
      </CampoDemo>

      <CampoDemo etichetta="Cosa ha detto il cliente">
        <textarea
          rows={3}
          value={campi.descrizione}
          onChange={cambia("descrizione")}
          placeholder="Due righe bastano: servono al tecnico che ci va."
          className="w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3 py-2 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
      </CampoDemo>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Arrivata da">
          <select value={campi.canale} onChange={cambia("canale")} className={classiInputDemo}>
            <option value="telefono">Telefono</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </CampoDemo>
        <CampoDemo etichetta="Urgenza">
          <select value={campi.urgenza} onChange={cambia("urgenza")} className={classiInputDemo}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="bassa">Bassa</option>
          </select>
        </CampoDemo>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onAnnulla} className={classiBottoneChiaro}>
          Annulla
        </button>
        <button type="submit" className={classiBottoneScuro}>
          Salva richiesta
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Modulo: da richiesta a intervento vero, con tecnico e ora          */
/* ------------------------------------------------------------------ */

function ModuloProgramma({ richiesta, cliente, tecnici, onConferma, onAnnulla }) {
  const [campi, setCampi] = useState({
    tecnicoId: tecnici[0]?.id || "",
    data: oggiIso(),
    ora: "09:00",
    tipo: "riparazione",
  });
  const cambia = (nome) => (e) => setCampi((c) => ({ ...c, [nome]: e.target.value }));

  const invia = (e) => {
    e.preventDefault();
    onConferma(campi);
  };

  return (
    <form onSubmit={invia} className="space-y-4">
      <div className="rounded-[var(--radius-controllo)] bg-surface-alt p-4">
        <p className="text-mini font-medium text-ink-500">{cliente?.nome || "Cliente"}</p>
        <p className="mt-0.5 text-corrente font-semibold text-ink-900">{richiesta.oggetto}</p>
        {cliente?.indirizzo ? (
          <p className="mt-1 flex items-center gap-1.5 text-mini text-ink-500">
            <Icona misura="sm" nome="MapPin" className="size-3.5" />
            {cliente.indirizzo}
          </p>
        ) : null}
      </div>

      <CampoDemo etichetta="Chi ci va">
        <select value={campi.tecnicoId} onChange={cambia("tecnicoId")} className={classiInputDemo}>
          {tecnici.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome} — {t.specialita}
            </option>
          ))}
        </select>
      </CampoDemo>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoDemo etichetta="Giorno">
          <input
            type="date"
            required
            value={campi.data}
            onChange={cambia("data")}
            className={classiInputDemo}
          />
        </CampoDemo>
        <CampoDemo etichetta="Ora">
          <input
            type="time"
            required
            value={campi.ora}
            onChange={cambia("ora")}
            className={classiInputDemo}
          />
        </CampoDemo>
      </div>

      <CampoDemo etichetta="Tipo di intervento">
        <select value={campi.tipo} onChange={cambia("tipo")} className={classiInputDemo}>
          <option value="riparazione">Riparazione</option>
          <option value="manutenzione">Manutenzione</option>
          <option value="sopralluogo">Sopralluogo</option>
        </select>
      </CampoDemo>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onAnnulla} className={classiBottoneChiaro}>
          Annulla
        </button>
        <button type="submit" className={classiBottoneScuro}>
          <Icona misura="sm" nome="Wrench" className="size-3.5" />
          Crea intervento
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagina: il lavoro che entra                                        */
/* ------------------------------------------------------------------ */

export default function PaginaRichieste() {
  const { dati, aggiorna, aggiungi } = useDemo();
  const [filtro, setFiltro] = useState("da_programmare");
  const [modaleNuova, setModaleNuova] = useState(false);
  const [daProgrammare, setDaProgrammare] = useState(null);
  /* Gli interventi nati qui: richiestaId → interventoId. */
  const [creati, setCreati] = useState({});

  const cliente = (id) => dati.clienti.find((c) => c.id === id);
  const conteggio = (stato) => dati.richieste.filter((r) => r.stato === stato).length;

  const elenco = dati.richieste
    .filter((r) => !filtro || r.stato === filtro)
    .sort((a, b) => {
      const peso = (PESO_URGENZA[a.urgenza] ?? 1) - (PESO_URGENZA[b.urgenza] ?? 1);
      return peso !== 0 ? peso : b.ricevutaIl.localeCompare(a.ricevutaIl);
    });

  /** L'intervento nato da una richiesta: prima quello appena creato, poi lo storico. */
  const interventoDi = (r) => {
    if (creati[r.id]) return dati.interventi.find((n) => n.id === creati[r.id]) || null;
    return (
      dati.interventi.find((n) => n.clienteId === r.clienteId && n.titolo === r.oggetto) ||
      (r.impiantoId
        ? dati.interventi.find((n) => n.clienteId === r.clienteId && n.impiantoId === r.impiantoId)
        : null) ||
      null
    );
  };

  const salvaNuova = (campi) => {
    aggiungi("richieste", {
      ...campi,
      impiantoId: null,
      ricevutaIl: oggiIso(),
      stato: "da_programmare",
    });
    setModaleNuova(false);
    setFiltro("da_programmare");
  };

  const confermaProgramma = (campi) => {
    const r = daProgrammare;
    if (!r) return;
    const idIntervento = aggiungi("interventi", {
      numero: prossimoNumero(dati.interventi),
      clienteId: r.clienteId,
      impiantoId: r.impiantoId,
      tecnicoId: campi.tecnicoId,
      tipo: campi.tipo,
      titolo: r.oggetto,
      data: campi.data,
      ora: campi.ora,
      stato: "programmato",
      durataOre: null,
      materiali: [],
      note: "",
      foto: 0,
      firmato: false,
      fatturato: false,
    });
    aggiorna("richieste", r.id, { stato: "programmata" });
    setCreati((prec) => ({ ...prec, [r.id]: idIntervento }));
    setDaProgrammare(null);
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Richieste"
        sottotitolo="Quello che entra dal telefono, da WhatsApp e dalla posta. Prima che diventi un foglietto."
      >
        <button
          type="button"
          onClick={() => setModaleNuova(true)}
          data-comando
          className={classiBottoneScuro}
        >
          <Icona misura="sm" nome="MessageCircle" className="size-3.5" />
          Nuova richiesta
        </button>
      </IntestazioneDemo>

      <div className="mb-4">
        <FiltriDemo
          voci={[
            {
              valore: "da_programmare",
              testo: "Da programmare",
              conteggio: conteggio("da_programmare"),
            },
            { valore: "programmata", testo: "Programmate", conteggio: conteggio("programmata") },
            { valore: "", testo: "Tutte", conteggio: dati.richieste.length },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <div className="rounded-[var(--radius-scheda)] border border-line bg-white">
        <ul className="divide-y divide-line-soft">
          {elenco.map((r) => {
            const c = cliente(r.clienteId);
            const barra = BARRA_URGENZA[r.urgenza] || BARRA_URGENZA.media;
            const programmata = r.stato === "programmata";
            const intervento = programmata ? interventoDi(r) : null;
            return (
              <li key={r.id} className="flex items-stretch gap-3 px-4 py-4 sm:px-5">
                <span
                  title={barra.testo}
                  className={`w-1 shrink-0 rounded-full ${barra.classi}`}
                  aria-hidden="true"
                />

                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,auto)] sm:items-start">
                  <div className="min-w-0">
                    <p className="text-corrente font-semibold text-ink-900">{r.oggetto}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-mini text-ink-500">
                      <span className="font-medium text-ink-700">{c?.nome || "—"}</span>
                      {c?.indirizzo ? <span className="truncate">{c.indirizzo}</span> : null}
                      <Canale tipo={r.canale} />
                      <span>ricevuta il {dataBreve(r.ricevutaIl)}</span>
                    </div>
                    {r.descrizione ? (
                      <p className="mt-1.5 line-clamp-2 text-piccolo text-ink-600">
                        {r.descrizione}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Urgenza livello={r.urgenza} />
                    {programmata ? (
                      intervento ? (
                        <Link
                          href={`${BASE}/interventi/${intervento.id}`}
                          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-controllo)] px-3 text-piccolo font-semibold text-brand-700 ring-1 ring-inset ring-brand-100 hover:bg-brand-50"
                        >
                          Vedi l&apos;intervento
                          <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
                        </Link>
                      ) : (
                        <span className="inline-flex h-9 shrink-0 items-center gap-1.5 px-1 text-piccolo font-medium text-ink-500">
                          <Icona misura="sm" nome="Check" className="size-3.5" />
                          Già programmata
                        </span>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDaProgrammare(r)}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-ink-900 px-3 text-piccolo font-semibold text-white hover:bg-ink-800"
                      >
                        <Icona misura="sm" nome="Wrench" className="size-3.5" />
                        Programma intervento
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}

          {!elenco.length ? (
            <li className="px-6 py-12 text-center text-corrente text-ink-500">
              {filtro === "da_programmare"
                ? "Niente in attesa: ogni richiesta ha già un tecnico e un orario."
                : filtro === "programmata"
                  ? "Nessuna richiesta programmata, per ora."
                  : "Nessuna richiesta in elenco. Il bottone qui sopra è il posto giusto per cominciare."}
            </li>
          ) : null}
        </ul>
      </div>

      <ModaleDemo
        aperta={modaleNuova}
        titolo="Nuova richiesta"
        onChiudi={() => setModaleNuova(false)}
      >
        <ModuloNuovaRichiesta
          clienti={dati.clienti}
          onSalva={salvaNuova}
          onAnnulla={() => setModaleNuova(false)}
        />
      </ModaleDemo>

      <ModaleDemo
        aperta={Boolean(daProgrammare)}
        titolo="Programma l'intervento"
        onChiudi={() => setDaProgrammare(null)}
      >
        {daProgrammare ? (
          <ModuloProgramma
            richiesta={daProgrammare}
            cliente={cliente(daProgrammare.clienteId)}
            tecnici={dati.tecnici}
            onConferma={confermaProgramma}
            onAnnulla={() => setDaProgrammare(null)}
          />
        ) : null}
      </ModaleDemo>
    </>
  );
}
