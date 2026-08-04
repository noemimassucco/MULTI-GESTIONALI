"use client";

import Icona from "@/components/ui/Icona";
import { euro } from "@/components/demo/StatoDemo";
import { COSTO_ORARIO } from "@/data/demo/interventi";

/* ------------------------------------------------------------------ */
/*  Pezzi specifici del mestiere: stati dell'intervento, urgenze,      */
/*  bollini, e il conteggio del rapportino.                            */
/* ------------------------------------------------------------------ */

/** I passaggi di un intervento, nell'ordine in cui succedono davvero. */
export const PASSAGGI = [
  { stato: "programmato", testo: "Programmato", icona: "Clock" },
  { stato: "in_corso", testo: "Tecnico sul posto", icona: "Wrench" },
  { stato: "chiuso", testo: "Chiuso con rapportino", icona: "CheckCircle2" },
  { stato: "fatturato", testo: "Fatturato", icona: "FileStack" },
];

/** In che passaggio si trova un intervento (0-3). */
export function passaggioDi(intervento) {
  if (intervento.fatturato) return 3;
  return PASSAGGI.findIndex((p) => p.stato === intervento.stato);
}

const STATI = {
  programmato: "bg-surface-alt text-ink-700 ring-line",
  in_corso: "bg-accento-50 text-accento-700 ring-accento-100",
  chiuso: "bg-brand-50 text-brand-700 ring-brand-100",
  fatturato: "bg-brand-100 text-brand-800 ring-brand-200",
};

/** Pastiglia di stato dell'intervento. */
export function StatoIntervento({ intervento }) {
  const chiave = intervento.fatturato ? "fatturato" : intervento.stato;
  const testo = PASSAGGI.find((p) => p.stato === chiave)?.testo || chiave;
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${
        STATI[chiave] || STATI.programmato
      }`}
    >
      {testo}
    </span>
  );
}

/** Barra dei passaggi: fa vedere a colpo d'occhio dove siamo. */
export function BarraPassaggi({ intervento }) {
  const corrente = passaggioDi(intervento);
  return (
    <ol className="flex flex-wrap gap-x-1 gap-y-2">
      {PASSAGGI.map((p, i) => {
        const fatto = i <= corrente;
        return (
          <li key={p.stato} className="flex items-center gap-1">
            <span
              className={`flex h-8 items-center gap-2 rounded-full px-3 text-mini font-semibold ${
                fatto ? "bg-brand-700 text-white" : "bg-surface-alt text-ink-500 ring-1 ring-inset ring-line"
              }`}
            >
              <Icona misura="sm" nome={p.icona} className="size-3.5" />
              {p.testo}
            </span>
            {i < PASSAGGI.length - 1 ? (
              <span
                className={`h-px w-4 ${fatto ? "bg-brand-700" : "bg-line"}`}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

const URGENZE = {
  alta: { testo: "Urgente", classi: "bg-[#f8efec] text-critico ring-[#eddcd7]" },
  media: { testo: "Normale", classi: "bg-accento-50 text-accento-700 ring-accento-100" },
  bassa: { testo: "Quando capita", classi: "bg-surface-alt text-ink-600 ring-line" },
};

export function Urgenza({ livello }) {
  const u = URGENZE[livello] || URGENZE.media;
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${u.classi}`}
    >
      {u.testo}
    </span>
  );
}

const CANALI = { telefono: "Phone", whatsapp: "MessageSquare", email: "Mail" };

/** Da dove è arrivata la richiesta. */
export function Canale({ tipo }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-mini text-ink-500">
      <Icona misura="sm" nome={CANALI[tipo] || "MessageCircle"} className="size-3.5" />
      {tipo === "whatsapp" ? "WhatsApp" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
    </span>
  );
}

/** Stato del bollino di un impianto. */
export function Bollino({ stato }) {
  const ok = stato === "in regola";
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${
        ok ? "bg-brand-50 text-brand-700 ring-brand-100" : "bg-[#f8efec] text-critico ring-[#eddcd7]"
      }`}
    >
      <Icona misura="sm" nome={ok ? "Check" : "AlertTriangle"} className="size-3" />
      {ok ? "Bollino in regola" : "Bollino scaduto"}
    </span>
  );
}

/** Totale di un intervento: manodopera + materiali. Il conto vero. */
export function totaleIntervento(intervento) {
  const manodopera = (intervento.durataOre || 0) * COSTO_ORARIO;
  const materiali = (intervento.materiali || []).reduce(
    (somma, m) => somma + m.prezzo * m.quantita,
    0,
  );
  return { manodopera, materiali, totale: manodopera + materiali };
}

/** Riepilogo economico dell'intervento, come lo vede l'ufficio. */
export function RiepilogoCosti({ intervento }) {
  const { manodopera, materiali, totale } = totaleIntervento(intervento);
  return (
    <dl className="space-y-2">
      <div className="flex justify-between text-corrente">
        <dt className="text-ink-500">
          Manodopera {intervento.durataOre ? `(${intervento.durataOre} h × ${euro(COSTO_ORARIO)})` : ""}
        </dt>
        <dd className="cifre font-medium text-ink-900">{euro(manodopera)}</dd>
      </div>
      <div className="flex justify-between text-corrente">
        <dt className="text-ink-500">Materiali</dt>
        <dd className="cifre font-medium text-ink-900">{euro(materiali)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2 text-testo">
        <dt className="font-bold text-ink-900">Totale</dt>
        <dd className="cifre font-bold text-brand-700">{euro(totale)}</dd>
      </div>
    </dl>
  );
}
