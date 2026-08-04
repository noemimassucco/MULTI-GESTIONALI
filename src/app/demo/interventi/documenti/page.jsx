"use client";

import { useState } from "react";
import { useDemo, dataBreve } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, RicercaDemo, FiltriDemo } from "@/components/demo/ElementiDemo";
import TabellaOrdinabile from "@/components/ui/TabellaOrdinabile";
import CaricamentoAssistito from "@/components/demo/CaricamentoAssistito";
import { documentiArchivio } from "@/data/demo/archivio-esempio";
import Icona from "@/components/ui/Icona";

/** L'archivio dei documenti: quello che di solito resta fuori dal gestionale. */
export default function PaginaDocumenti() {
  const { dati } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [caricamentoAperto, setCaricamentoAperto] = useState(false);

  const documenti = dati.documenti;

  const cliente = (id) => dati.clienti.find((c) => c.id === id);
  const impianto = (id) => dati.impianti.find((i) => i.id === id);
  const nomeCliente = (id) => cliente(id)?.nome || "—";
  const nomeImpianto = (id) => {
    const i = impianto(id);
    return i ? `${i.marca} ${i.modello}` : "—";
  };

  const tipi = [...new Set(documenti.map((d) => d.tipo))].sort((a, b) => a.localeCompare(b));

  const testo = ricerca.trim().toLowerCase();
  const filtrati = documenti.filter((d) => {
    if (filtro && d.tipo !== filtro) return false;
    if (!testo) return true;
    return [d.nome, d.tipo].some((v) => (v || "").toLowerCase().includes(testo));
  });

  /* L'archivio cresce a ogni importazione: si ordina per data, per tipo,
     per impianto. Senza ordinamento diventa presto illeggibile. */
  const colonne = [
    {
      chiave: "nome",
      testo: "Documento",
      valore: (d) => d.nome,
      cella: (d) => (
        <div className="flex items-start gap-2.5">
          <Icona misura="sm" nome="FileStack" className="mt-0.5 shrink-0 text-ink-400" />
          <span className="min-w-0">
            <span className="block text-corrente font-semibold text-ink-900">{d.nome}</span>
            <span className="block font-mono text-mini text-ink-500">{d.dimensione}</span>
          </span>
        </div>
      ),
    },
    {
      chiave: "cliente",
      testo: "Cliente",
      valore: (d) => nomeCliente(d.clienteId),
      classiCella: "text-piccolo text-ink-700",
    },
    {
      chiave: "impianto",
      testo: "Impianto",
      valore: (d) => nomeImpianto(d.impiantoId),
      classiCella: "text-piccolo text-ink-600",
    },
    { chiave: "tipo", testo: "Tipo", valore: (d) => d.tipo, classiCella: "text-piccolo text-ink-600" },
    {
      chiave: "caricato",
      testo: "Caricato il",
      valore: (d) => d.caricatoIl,
      cella: (d) => dataBreve(d.caricatoIl),
      classiCella: "text-piccolo text-ink-600",
    },
  ];

  return (
    <>
      <IntestazioneDemo
        titolo="Documenti"
        sottotitolo={
          documenti.length === 1
            ? "1 documento archiviato"
            : `${documenti.length} documenti archiviati`
        }
      >
        <button
          type="button"
          onClick={() => setCaricamentoAperto(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-accento-500 px-4 text-piccolo font-semibold text-ink-900 hover:bg-accento-400"
        >
          <Icona misura="sm" nome="Upload" className="size-3.5" />
          Carica archivio
        </button>
      </IntestazioneDemo>

      <div className="mb-5 rounded-[var(--radius-scheda)] border border-accento-200 bg-accento-50 p-5">
        <h2 className="text-corrente font-bold text-ink-900">
          L&apos;archivio di prima resta quasi sempre fuori
        </h2>
        <p className="mt-1.5 max-w-2xl text-corrente leading-relaxed text-ink-600">
          Quando si cambia gestionale, i documenti degli anni passati restano nella cartella
          condivisa: sono migliaia di file, e caricarli a mano uno per uno non li carica nessuno.
          Qui si trascina la cartella così com&apos;è: il sistema legge ogni file, capisce di che
          documento si tratta e a quale cliente o impianto appartiene, e lo archivia. Dove non è
          sicuro si ferma e chiede.
        </p>
        <button
          type="button"
          onClick={() => setCaricamentoAperto(true)}
          data-comando
          className="mt-4 flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
        >
          <Icona misura="sm" nome="FolderOpen" className="size-3.5" />
          Provalo adesso
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per nome file o tipo…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: documenti.length },
            ...tipi.map((t) => ({
              valore: t,
              testo: t,
              conteggio: documenti.filter((d) => d.tipo === t).length,
            })),
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaOrdinabile
        righe={filtrati}
        chiaveIniziale="caricato"
        colonne={colonne}
        vuota="Nessun documento corrisponde alla ricerca. Prova con un'altra parola o togli il filtro."
      />

      <CaricamentoAssistito
        apri={caricamentoAperto}
        onChiudi={() => setCaricamentoAperto(false)}
        archivio={documentiArchivio}
        collegamento={(d, doc) => {
          const i = d.impianti?.find((x) => x.id === doc.impiantoId);
          return i ? `Impianto proposto: ${i.marca} ${i.modello} · ${i.ubicazione}` : null;
        }}
      />
    </>
  );
}
