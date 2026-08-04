"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { statoIniziale } from "@/data/demo/clienti-attivita";

/**
 * Stato della demo, tutto in memoria: si può toccare qualsiasi cosa,
 * al ricaricamento della pagina torna com'era. Nessun dato viene salvato.
 */
const Contesto = createContext(null);

let progressivo = 100;

export function FornitoreStatoDemo({ children }) {
  const [dati, setDati] = useState(statoIniziale);

  // Le date dei dati finti sono relative a "oggi": quello del server e quello
  // del browser possono differire, e React segnalerebbe la discordanza.
  // La demo quindi compare solo nel browser, dopo il montaggio.
  const [montato, setMontato] = useState(false);
  useEffect(() => setMontato(true), []);

  /** Aggiorna un elemento: aggiorna("attivita", "a1", { stato: "completata" }) */
  const aggiorna = useCallback((collezione, id, patch) => {
    setDati((prec) => ({
      ...prec,
      [collezione]: prec[collezione].map((el) => (el.id === id ? { ...el, ...patch } : el)),
    }));
  }, []);

  /** Aggiunge un elemento e ne restituisce l'id: aggiungi("clienti", {...}) */
  const aggiungi = useCallback((collezione, elemento) => {
    const id = `nuovo-${progressivo++}`;
    setDati((prec) => ({
      ...prec,
      [collezione]: [{ id, ...elemento }, ...prec[collezione]],
    }));
    return id;
  }, []);

  /** Rimuove un elemento: rimuovi("attivita", "a1") */
  const rimuovi = useCallback((collezione, id) => {
    setDati((prec) => ({
      ...prec,
      [collezione]: prec[collezione].filter((el) => el.id !== id),
    }));
  }, []);

  const valore = useMemo(() => ({ dati, aggiorna, aggiungi, rimuovi }), [dati, aggiorna, aggiungi, rimuovi]);

  if (!montato) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-corrente text-ink-500">Preparo i dati di esempio…</p>
      </div>
    );
  }

  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>;
}

/** Accesso allo stato della demo: const { dati, aggiorna, aggiungi, rimuovi } = useDemo(); */
export function useDemo() {
  const valore = useContext(Contesto);
  if (!valore) throw new Error("useDemo va usato dentro FornitoreStatoDemo");
  return valore;
}

/* ------------------------------------------------------------------ */
/*  Aiuti condivisi da tutte le pagine della demo                      */
/* ------------------------------------------------------------------ */

/** "2026-08-12" → "12 ago" (o "12 ago 2025" se l'anno è diverso) */
export function dataBreve(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  const mesi = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  const base = `${d.getDate()} ${mesi[d.getMonth()]}`;
  return d.getFullYear() === new Date().getFullYear() ? base : `${base} ${d.getFullYear()}`;
}

/** Giorni da oggi: negativo = passato. */
export function giorniDaOggi(iso) {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const d = new Date(`${iso}T00:00:00`);
  return Math.round((d - oggi) / 86400000);
}

/** 6800 → "€ 6.800" */
export function euro(n) {
  return `€ ${Number(n).toLocaleString("it-IT")}`;
}
