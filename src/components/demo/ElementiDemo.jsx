"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Icona from "@/components/ui/Icona";
import { dataBreve, giorniDaOggi } from "@/components/demo/StatoDemo";

/* ------------------------------------------------------------------ */
/*  Mattoni condivisi da tutte le pagine della demo.                   */
/*  Le pagine compongono questi pezzi: così le schermate si somigliano */
/*  senza doversi somigliare a mano.                                   */
/* ------------------------------------------------------------------ */

/** Intestazione di pagina: titolo, sottotitolo e azioni a destra. */
export function IntestazioneDemo({ titolo, sottotitolo, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-t2 font-bold text-ink-900">{titolo}</h1>
        {sottotitolo ? <p className="mt-1 text-corrente text-ink-500">{sottotitolo}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

/** Riquadro numerico della dashboard. */
export function KpiDemo({ etichetta, valore, nota, tono = "neutro" }) {
  const toni = {
    neutro: "text-ink-900",
    ok: "text-brand-700",
    allerta: "text-amber-700",
    critico: "text-red-700",
  };
  return (
    <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-4">
      <p className="text-mini font-medium text-ink-500">{etichetta}</p>
      <p className={`mt-1 text-t2 font-bold leading-none ${toni[tono]}`}>{valore}</p>
      {nota ? <p className="mt-1.5 text-mini text-ink-500">{nota}</p> : null}
    </div>
  );
}

const STATI = {
  /* attività */
  da_fare: { testo: "Da fare", classi: "bg-surface-alt text-ink-700 ring-line" },
  in_corso: { testo: "In corso", classi: "bg-sole-100 text-[#7a5c05] ring-sole-200" },
  in_attesa: { testo: "In attesa", classi: "bg-violet-50 text-violet-800 ring-violet-200" },
  completata: { testo: "Completata", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
  /* preventivi */
  bozza: { testo: "Bozza", classi: "bg-surface-alt text-ink-700 ring-line" },
  inviato: { testo: "Inviato", classi: "bg-sole-100 text-[#7a5c05] ring-sole-200" },
  accettato: { testo: "Accettato", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
  rifiutato: { testo: "Rifiutato", classi: "bg-red-50 text-red-800 ring-red-200" },
  /* pagamenti */
  incassato: { testo: "Incassato", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
  in_ritardo: { testo: "In ritardo", classi: "bg-red-50 text-red-800 ring-red-200" },
  /* clienti */
  attivo: { testo: "Attivo", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
  prospect: { testo: "Potenziale", classi: "bg-sole-100 text-[#7a5c05] ring-sole-200" },
};

/** Pastiglia di stato coerente in tutta la demo. */
export function StatoDemoPill({ stato }) {
  const s = STATI[stato] || { testo: stato, classi: "bg-surface-alt text-ink-700 ring-line" };
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${s.classi}`}
    >
      {s.testo}
    </span>
  );
}

/** Data con il colore che dice da solo se è in ritardo, vicina o lontana. */
export function DataScadenza({ iso, fatta = false }) {
  const g = giorniDaOggi(iso);
  let classi = "text-ink-600";
  let nota = "";
  if (!fatta) {
    if (g < 0) {
      classi = "font-semibold text-red-700";
      nota = g === -1 ? " · ieri" : ` · ${-g} gg fa`;
    } else if (g === 0) {
      classi = "font-semibold text-amber-700";
      nota = " · oggi";
    } else if (g <= 3) {
      classi = "font-medium text-amber-700";
      nota = g === 1 ? " · domani" : ` · fra ${g} gg`;
    }
  }
  return (
    <span className={`whitespace-nowrap text-piccolo ${classi}`}>
      {dataBreve(iso)}
      {nota}
    </span>
  );
}

/** Contenitore-tabella con la stessa pelle ovunque. */
export function TabellaDemo({ intestazioni, children, vuota }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-scheda)] border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-alt">
              {intestazioni.map((t) => (
                <th
                  key={t}
                  className="whitespace-nowrap px-4 py-2.5 text-mini font-semibold uppercase tracking-wide text-ink-500"
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">{children}</tbody>
        </table>
      </div>
      {vuota ? (
        <p className="px-4 py-10 text-center text-corrente text-ink-500">{vuota}</p>
      ) : null}
    </div>
  );
}

/** Campo di ricerca con la lente, uguale in tutte le liste. */
export function RicercaDemo({ valore, onCambia, placeholder = "Cerca…" }) {
  return (
    <div className="relative">
      <Icona
        misura="sm"
        nome="Search"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={valore}
        onChange={(e) => onCambia(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[var(--radius-controllo)] border border-line bg-white pl-9 pr-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none sm:w-64"
      />
    </div>
  );
}

/** Fila di filtri a pastiglia (stato, tipo…). `voci`: [{valore, testo, conteggio?}] */
export function FiltriDemo({ voci, attivo, onScegli }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {voci.map((v) => (
        <button
          key={v.valore}
          type="button"
          onClick={() => onScegli(v.valore === attivo ? "" : v.valore)}
          aria-pressed={v.valore === attivo}
          className={`h-9 rounded-full px-3 text-piccolo font-medium transition-colors ${
            v.valore === attivo
              ? "bg-ink-900 text-white"
              : "bg-white text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
          }`}
        >
          {v.testo}
          {v.conteggio !== undefined ? (
            <span className={v.valore === attivo ? "ml-1.5 text-white/60" : "ml-1.5 text-ink-400"}>
              {v.conteggio}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/**
 * Finestra modale semplice per i moduli "nuovo…".
 * L'apertura è animata appena quel tanto che basta a far capire da dove
 * arriva il pannello. Chi ha chiesto meno movimento al sistema operativo
 * non ne vede nessuno.
 */
export function ModaleDemo({ aperta, titolo, onChiudi, children }) {
  const fermo = useReducedMotion();
  const durata = fermo ? 0 : 0.18;

  return (
    <AnimatePresence>
      {aperta ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Chiudi"
            onClick={onChiudi}
            className="absolute inset-0 bg-ink-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durata }}
          />
          <motion.div
            className="relative max-h-[88vh] w-full overflow-y-auto rounded-t-[var(--radius-scheda)] bg-white p-6 shadow-[var(--shadow-lift)] sm:max-w-lg sm:rounded-[var(--radius-scheda)]"
            initial={fermo ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={fermo ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: durata, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-t3 font-bold text-ink-900">{titolo}</h2>
              <button
                type="button"
                onClick={onChiudi}
                aria-label="Chiudi la finestra"
                className="flex size-9 items-center justify-center rounded-[var(--radius-controllo)] text-ink-500 hover:bg-surface-alt"
              >
                <Icona misura="sm" nome="X" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Campo del modulo, con etichetta sopra ed eventuale errore sotto.
 * L'errore arriva da Zod attraverso react-hook-form: è scritto una volta
 * sola, nello schema, e compare qui.
 */
export function CampoDemo({ etichetta, errore, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-piccolo font-semibold text-ink-900">{etichetta}</span>
      {children}
      {errore ? (
        <span className="mt-1.5 flex items-start gap-1.5 text-piccolo font-medium text-red-700">
          <Icona misura="sm" nome="AlertTriangle" className="mt-0.5 size-3.5 shrink-0" />
          {errore}
        </span>
      ) : null}
    </label>
  );
}

export const classiInputDemo =
  "h-11 w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none";
