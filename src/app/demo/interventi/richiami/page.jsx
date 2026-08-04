"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, euro, giorniDaOggi } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, KpiDemo, DataScadenza } from "@/components/demo/ElementiDemo";
import { Bollino } from "@/components/demo/ElementiInterventi";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/interventi";

/** Quanto vale un richiamo: la manutenzione ordinaria a listino. */
const VALORE_RICHIAMO = 70;

const oggiIso = () => new Date().toISOString().slice(0, 10);

/** Da quanto manca al controllo dipende tutto: gruppo, urgenza, colore. */
function fasciaDi(iso) {
  const g = giorniDaOggi(iso);
  if (g < 0) return "scaduto";
  if (g <= 60) return "vicino";
  return "avanti";
}

const URGENZA_PER_FASCIA = { scaduto: "alta", vicino: "media", avanti: "bassa" };

/** Una riga del richiamo: chi chiamare, per cosa, e il bottone che apre la richiesta. */
function RigaRichiamo({ impianto, cliente, creata, onCrea }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
      <div className="min-w-0 flex-1">
        <p className="text-corrente font-semibold text-ink-900">
          {impianto.marca} {impianto.modello}
        </p>
        <p className="text-mini text-ink-500">
          {cliente?.nome || "—"}
          {impianto.ubicazione ? ` · ${impianto.ubicazione}` : ""}
        </p>
      </div>
      <DataScadenza iso={impianto.prossimoControllo} />
      <Bollino stato={impianto.bollino} />
      {creata ? (
        <span className="flex items-center gap-1.5 text-piccolo font-semibold text-brand-700">
          <Icona misura="sm" nome="Check" className="size-3.5" />
          Richiesta creata
          <Link
            href={`${BASE}/richieste`}
            className="font-semibold text-brand-700 underline hover:text-brand-800"
          >
            Vedi le richieste
          </Link>
        </span>
      ) : (
        <button
          type="button"
          onClick={onCrea}
          className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-ink-900 px-3 text-piccolo font-semibold text-white hover:bg-ink-800"
        >
          <Icona misura="sm" nome="Phone" className="size-3.5" />
          Crea richiesta di richiamo
        </button>
      )}
    </li>
  );
}

/** Un gruppo di richiami, con titoletto e conteggio. */
function GruppoRichiami({ titolo, nota, voci, vuoto, cliente, creati, onCrea }) {
  return (
    <section className="rounded-[var(--radius-scheda)] border border-line bg-white">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-soft px-4 py-3.5 sm:px-5">
        <h2 className="text-testo font-bold text-ink-900">
          {titolo}
          {voci.length ? (
            <span className="ml-2 text-piccolo font-medium text-ink-400">{voci.length}</span>
          ) : null}
        </h2>
        {nota ? <span className="text-mini text-ink-500">{nota}</span> : null}
      </header>
      <ul className="divide-y divide-line-soft">
        {voci.map((i) => (
          <RigaRichiamo
            key={i.id}
            impianto={i}
            cliente={cliente(i.clienteId)}
            creata={creati.includes(i.id)}
            onCrea={() => onCrea(i)}
          />
        ))}
        {!voci.length ? <li className="px-4 py-4 text-piccolo text-ink-400 sm:px-5">{vuoto}</li> : null}
      </ul>
    </section>
  );
}

/** I richiami periodici: il lavoro che si perde quando nessuno lo ricorda. */
export default function PaginaRichiami() {
  const { dati, aggiungi } = useDemo();
  const [creati, setCreati] = useState([]);

  const cliente = (id) => dati.clienti.find((c) => c.id === id);

  const perData = (a, b) => a.prossimoControllo.localeCompare(b.prossimoControllo);
  const dellaFascia = (nome) =>
    dati.impianti.filter((i) => fasciaDi(i.prossimoControllo) === nome).sort(perData);

  const scaduti = dellaFascia("scaduto");
  const vicini = dellaFascia("vicino");
  const avanti = dellaFascia("avanti");

  const daRichiamare = scaduti.length + vicini.length;
  const potenziale = daRichiamare * VALORE_RICHIAMO;

  const creaRichiesta = (impianto) => {
    const c = cliente(impianto.clienteId);
    aggiungi("richieste", {
      clienteId: impianto.clienteId,
      impiantoId: impianto.id,
      canale: "telefono",
      ricevutaIl: oggiIso(),
      oggetto: `Richiamo controllo periodico — ${impianto.marca} ${impianto.modello}`,
      descrizione: `Controllo periodico in scadenza. Ubicazione: ${
        impianto.ubicazione || c?.indirizzo || "da confermare"
      }.`,
      urgenza: URGENZA_PER_FASCIA[fasciaDi(impianto.prossimoControllo)] || "bassa",
      stato: "da_programmare",
    });
    setCreati((prec) => (prec.includes(impianto.id) ? prec : [...prec, impianto.id]));
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Richiami periodici"
        sottotitolo="Le caldaie da ricontrollare. È il lavoro che si perde quando nessuno lo ricorda."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiDemo
          etichetta="Già scaduti"
          valore={scaduti.length}
          nota="Bollino non più valido"
          tono="critico"
        />
        <KpiDemo
          etichetta="In scadenza entro 60 giorni"
          valore={vicini.length}
          nota="Il momento buono per chiamare"
          tono="allerta"
        />
        <KpiDemo
          etichetta="Valore potenziale"
          valore={euro(potenziale)}
          nota={`${daRichiamare} impianti da richiamare, a ${euro(VALORE_RICHIAMO)} di manutenzione ordinaria`}
        />
      </div>

      <div className="mt-4 space-y-4">
        <GruppoRichiami
          titolo="Bollino già scaduto"
          nota="Da chiamare oggi"
          voci={scaduti}
          vuoto="Nessun bollino scaduto: raro, ma succede."
          cliente={cliente}
          creati={creati}
          onCrea={creaRichiesta}
        />
        <GruppoRichiami
          titolo="Da fare entro 60 giorni"
          nota="Si organizzano con calma"
          voci={vicini}
          vuoto="Niente in scadenza nei prossimi due mesi."
          cliente={cliente}
          creati={creati}
          onCrea={creaRichiesta}
        />
        <GruppoRichiami
          titolo="Più avanti"
          nota="Per sapere cosa arriva"
          voci={avanti}
          vuoto="Nessun altro controllo in programma."
          cliente={cliente}
          creati={creati}
          onCrea={creaRichiesta}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-scheda)] bg-surface-alt px-5 py-4">
        <p className="text-piccolo text-ink-600">
          Nel gestionale vero il richiamo parte da solo: email o messaggio al cliente il mese prima,
          senza che nessuno guardi la lista.
        </p>
        <Link
          href="/personalizzazioni"
          className="flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
        >
          Scopri le personalizzazioni
          <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
        </Link>
      </div>
    </>
  );
}
