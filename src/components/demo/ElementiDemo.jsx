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
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div className="min-w-0">
        <h1 className="text-t2 lg:text-t1">{titolo}</h1>
        {sottotitolo ? (
          <p className="mt-2 max-w-2xl text-corrente leading-relaxed text-ink-600">{sottotitolo}</p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

/**
 * Riquadro numerico della dashboard.
 * Il numero è in Manrope con le cifre della stessa larghezza: incolonnati
 * uno accanto all'altro non ballano mai.
 */
export function KpiDemo({ etichetta, valore, nota, tono = "neutro", icona }) {
  const toni = {
    neutro: "text-ink-900",
    ok: "text-brand-700",
    allerta: "text-accento-600",
    critico: "text-critico",
  };
  return (
    <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
      <div className="flex items-center gap-2.5">
        {icona ? <Icona misura="sm" nome={icona} className="shrink-0 text-ink-400" /> : null}
        <p className="min-w-0 truncate text-mini font-medium text-ink-500">{etichetta}</p>
      </div>
      <p className={`cifre mt-3 text-t1 font-extrabold leading-none ${toni[tono]}`}>{valore}</p>
      {nota ? <p className="mt-2.5 text-mini text-ink-500">{nota}</p> : null}
    </div>
  );
}

/* Tre soli modi di colorare uno stato: fermo, in movimento, concluso.
   Il rosso resta per quello che è davvero fuori tempo. */
const NEUTRO = "bg-surface-alt text-ink-700 ring-line";
const CORSO = "bg-accento-50 text-accento-700 ring-accento-100";
const FATTO = "bg-brand-50 text-brand-700 ring-brand-100";
const MALE = "bg-[#f8efec] text-critico ring-[#eddcd7]";

const STATI = {
  /* attività */
  da_fare: { testo: "Da fare", classi: NEUTRO },
  in_corso: { testo: "In corso", classi: CORSO },
  in_attesa: { testo: "In attesa", classi: NEUTRO },
  completata: { testo: "Completata", classi: FATTO },
  /* preventivi */
  bozza: { testo: "Bozza", classi: NEUTRO },
  inviato: { testo: "Inviato", classi: CORSO },
  accettato: { testo: "Accettato", classi: FATTO },
  rifiutato: { testo: "Rifiutato", classi: NEUTRO },
  /* pagamenti */
  incassato: { testo: "Incassato", classi: FATTO },
  in_ritardo: { testo: "In ritardo", classi: MALE },
  /* clienti */
  attivo: { testo: "Attivo", classi: FATTO },
  prospect: { testo: "Potenziale", classi: CORSO },
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
      classi = "font-semibold text-critico";
      nota = g === -1 ? " · ieri" : ` · ${-g} gg fa`;
    } else if (g === 0) {
      classi = "font-semibold text-accento-600";
      nota = " · oggi";
    } else if (g <= 3) {
      classi = "font-medium text-accento-600";
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
        <p className="px-6 py-12 text-center text-corrente text-ink-500">{vuota}</p>
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
        className="h-10 w-full rounded-[var(--radius-controllo)] border border-line bg-white pl-9 pr-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none sm:w-72"
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
          className={`h-9 rounded-full px-3.5 text-piccolo font-medium transition-colors duration-150 ${
            v.valore === attivo
              ? "bg-brand-900 text-white"
              : "bg-white text-ink-600 ring-1 ring-inset ring-line hover:border-brand-300 hover:text-ink-900"
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
        <span className="mt-1.5 flex items-start gap-1.5 text-piccolo font-medium text-critico">
          <Icona misura="sm" nome="AlertTriangle" className="mt-0.5 size-3.5 shrink-0" />
          {errore}
        </span>
      ) : null}
    </label>
  );
}

export const classiInputDemo =
  "h-11 w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none";
