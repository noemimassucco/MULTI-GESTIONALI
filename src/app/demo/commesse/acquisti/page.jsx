"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, dataBreve, euro, giorniDaOggi } from "@/components/demo/StatoDemo";
import { toast } from "sonner";
import {
  IntestazioneDemo,
  KpiDemo,
  RicercaDemo,
  FiltriDemo,
} from "@/components/demo/ElementiDemo";
import TabellaOrdinabile from "@/components/ui/TabellaOrdinabile";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

const FILTRI = [
  { valore: "materiale", testo: "Materiali" },
  { valore: "subappalto", testo: "Subappalti" },
  { valore: "senza_fattura", testo: "Senza fattura" },
];

/** Materiali e subappalti: i costi che arrivano da fuori e vanno agganciati. */
export default function PaginaAcquisti() {
  const { dati, aggiorna } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");

  const commessa = (id) => dati.commesse.find((k) => k.id === id);

  const testo = ricerca.trim().toLowerCase();
  const righe = dati.acquisti
    .filter((a) => {
      if (filtro === "senza_fattura" && a.fattura) return false;
      if (filtro && filtro !== "senza_fattura" && a.tipo !== filtro) return false;
      if (!testo) return true;
      return [a.fornitore, a.descrizione, a.documento].some((v) =>
        (v || "").toLowerCase().includes(testo),
      );
    })
    .sort((a, b) => b.data.localeCompare(a.data));

  const materiali = dati.acquisti.filter((a) => a.tipo === "materiale");
  const subappalti = dati.acquisti.filter((a) => a.tipo === "subappalto");
  const senzaFattura = dati.acquisti.filter((a) => !a.fattura);

  const somma = (elenco) => elenco.reduce((s, a) => s + a.importo, 0);

  /* Quanto pesa ogni fornitore: serve a trattare i prezzi, non a curiosare. */
  const perFornitore = Object.entries(
    dati.acquisti.reduce((acc, a) => {
      acc[a.fornitore] = (acc[a.fornitore] || 0) + a.importo;
      return acc;
    }, {}),
  )
    .map(([fornitore, importo]) => ({ fornitore, importo }))
    .sort((a, b) => b.importo - a.importo)
    .slice(0, 5);

  /* Diciassette righe che si guardano quasi sempre ordinate: per importo
     quando si tratta il listino, per data quando si cerca una consegna. */
  const colonne = [
    {
      chiave: "data",
      testo: "Data",
      valore: (a) => a.data,
      cella: (a) => dataBreve(a.data),
      classiCella: "whitespace-nowrap text-piccolo text-ink-600",
    },
    {
      chiave: "fornitore",
      testo: "Fornitore",
      valore: (a) => a.fornitore,
      cella: (a) => (
        <>
          <span className="block text-corrente font-semibold text-ink-900">{a.fornitore}</span>
          <span className="block text-mini text-ink-500">{a.descrizione}</span>
        </>
      ),
    },
    {
      chiave: "cantiere",
      testo: "Cantiere",
      valore: (a) => commessa(a.commessaId)?.numero || "",
      cella: (a) => {
        const k = commessa(a.commessaId);
        return k ? (
          <Link
            href={`${BASE}/commesse/${k.id}`}
            className="font-mono text-mini text-ink-600 hover:text-brand-700"
          >
            {k.numero}
          </Link>
        ) : (
          <span className="text-piccolo text-ink-400">—</span>
        );
      },
    },
    {
      chiave: "documento",
      testo: "Documento",
      valore: (a) => a.tipo,
      cella: (a) => (
        <>
          <span className="inline-flex h-6 items-center rounded-full bg-surface-alt px-2 text-mini font-medium text-ink-600 ring-1 ring-inset ring-line">
            {a.tipo === "subappalto" ? "Subappalto" : "Materiale"}
          </span>
          <span className="mt-1 block font-mono text-mini text-ink-500">{a.documento}</span>
        </>
      ),
    },
    {
      chiave: "importo",
      testo: "Importo",
      valore: (a) => a.importo,
      cella: (a) => euro(a.importo),
      classiCella: "whitespace-nowrap text-corrente font-semibold tabular-nums text-ink-900",
    },
    {
      chiave: "fattura",
      testo: "Fattura",
      valore: (a) => (a.fattura ? 1 : 0),
      cella: (a) =>
        a.fattura ? (
          <span className="inline-flex h-6 items-center gap-1 rounded-full bg-brand-50 px-2 text-mini font-semibold text-brand-800 ring-1 ring-inset ring-brand-100">
            <Icona misura="sm" nome="Check" className="size-3" />
            Registrata
          </span>
        ) : (
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-mini font-semibold text-amber-700">
              in attesa da {-giorniDaOggi(a.data)} gg
            </span>
            <button
              type="button"
              onClick={() => {
                aggiorna("acquisti", a.id, { fattura: true });
                toast.success("Fattura registrata", {
                  description: `${a.fornitore} — ${euro(a.importo)} ora è un costo confermato.`,
                });
              }}
              data-comando
              className="flex h-8 items-center rounded-[var(--radius-controllo)] px-2.5 text-mini font-semibold text-ink-700 ring-1 ring-inset ring-line hover:bg-white"
            >
              Segna arrivata
            </button>
          </div>
        ),
    },
  ];

  return (
    <>
      <IntestazioneDemo
        titolo="Acquisti e subappalti"
        sottotitolo="Ogni DDT è agganciato a un cantiere: il costo entra nei conti il giorno in cui arriva."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiDemo
          etichetta="Materiali"
          valore={euro(somma(materiali))}
          nota={`${materiali.length} forniture`}
        />
        <KpiDemo
          etichetta="Subappalti"
          valore={euro(somma(subappalti))}
          nota={`${subappalti.length} affidamenti`}
        />
        <KpiDemo
          etichetta="Consegnato senza fattura"
          valore={euro(somma(senzaFattura))}
          nota={`${senzaFattura.length} documenti in attesa`}
          tono={senzaFattura.length ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="Fornitori"
          valore={new Set(dati.acquisti.map((a) => a.fornitore)).size}
          nota="con almeno una fornitura"
        />
      </div>

      {/* ------------------------------------------------- i fornitori */}
      <section className="mt-4 rounded-[var(--radius-scheda)] border border-line bg-white">
        <header className="border-b border-line-soft px-5 py-3.5">
          <h2 className="text-testo font-bold text-ink-900">Quanto pesa ogni fornitore</h2>
          <p className="mt-1 text-piccolo text-ink-500">
            È il numero da avere in mano quando si tratta il listino dell&apos;anno prossimo.
          </p>
        </header>
        <ul className="divide-y divide-line-soft">
          {perFornitore.map((f) => {
            const massimo = perFornitore[0].importo;
            return (
              <li key={f.fornitore} className="px-5 py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 truncate text-corrente font-medium text-ink-900">
                    {f.fornitore}
                  </p>
                  <p className="shrink-0 text-corrente font-semibold tabular-nums text-ink-900">
                    {euro(f.importo)}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${Math.round((f.importo / massimo) * 100)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------------------------------------------------- l'elenco */}
      <div className="mb-4 mt-5 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per fornitore, voce o DDT…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: dati.acquisti.length },
            { ...FILTRI[0], conteggio: materiali.length },
            { ...FILTRI[1], conteggio: subappalti.length },
            { ...FILTRI[2], conteggio: senzaFattura.length },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaOrdinabile
        righe={righe}
        chiaveIniziale="data"
        colonne={colonne}
        vuota="Nessun acquisto corrisponde alla ricerca. Prova con un'altra parola o togli il filtro."
      />
    </>
  );
}
