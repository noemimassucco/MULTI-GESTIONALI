"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { cambiaDemo, cambiaStato } from "@/app/actions/amministrazione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
import TabellaOrdinabile from "@/components/ui/TabellaOrdinabile";
import { cn } from "@/lib/cn";

/**
 * I due comandi rapidi di una riga: pubblica/ritira e demo sì/no.
 * Ogni riga ha il suo stato perché ogni riga ha il suo esito da mostrare.
 */
function ComandiRiga({ gestionale }) {
  const [esitoStato, azioneStato, inCorsoStato] = useActionState(cambiaStato, null);
  const [esitoDemo, azioneDemo, inCorsoDemo] = useActionState(cambiaDemo, null);

  const pubblicato = gestionale.stato === "pubblicato";
  const esito = esitoStato || esitoDemo;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <form action={azioneStato}>
        <input type="hidden" name="slug" value={gestionale.slug} />
        <input type="hidden" name="stato" value={pubblicato ? "bozza" : "pubblicato"} />
        <Bottone type="submit" variante="secondario" misura="sm" disabled={inCorsoStato}>
          {pubblicato ? "Ritira" : "Pubblica"}
        </Bottone>
      </form>

      <form action={azioneDemo}>
        <input type="hidden" name="slug" value={gestionale.slug} />
        <input type="hidden" name="demo" value={gestionale.demoDisponibile ? "0" : "1"} />
        <Bottone type="submit" variante="secondario" misura="sm" disabled={inCorsoDemo}>
          {gestionale.demoDisponibile ? "Togli demo" : "Attiva demo"}
        </Bottone>
      </form>

      {esito?.messaggio ? (
        <p
          className={cn(
            "basis-full text-right text-mini font-medium",
            esito.ok ? "text-brand-700" : "text-red-600",
          )}
        >
          {esito.messaggio}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Tabella delle schede con ricerca e filtri.
 * I dati arrivano già pronti dal server: qui si fa solo il setaccio.
 */
export default function ElencoGestionali({ gestionali, categorie, basi = [] }) {
  const [ricerca, setRicerca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stato, setStato] = useState("tutti");

  const nomeCategoria = (slug) => categorie.find((c) => c.slug === slug)?.nome || slug;
  const nomeBase = (slug) => basi.find((b) => b.slug === slug)?.nome || slug;

  const testo = ricerca.trim().toLowerCase();
  const filtrati = gestionali.filter((g) => {
    if (categoria && g.categoriaSlug !== categoria) return false;
    if (stato === "pubblicati" && g.stato !== "pubblicato") return false;
    if (stato === "bozze" && g.stato === "pubblicato") return false;
    if (!testo) return true;
    return `${g.nome} ${g.slug}`.toLowerCase().includes(testo);
  });

  /* Con 54 schede l'ordinamento non è un vezzo: si cerca "cosa è ancora
     in bozza" o "cosa ha la demo" e si vuole vederlo tutto insieme. */
  const colonne = [
    {
      chiave: "nome",
      testo: "Nome",
      valore: (g) => g.nome,
      cella: (g) => (
        <>
          <Link
            href={`/admin/gestionali/${g.slug}`}
            className="text-corrente font-semibold text-ink-900 hover:text-brand-700"
          >
            {g.nome}
          </Link>
          <span className="block font-mono text-mini text-ink-500">{g.slug}</span>
        </>
      ),
    },
    {
      chiave: "categoria",
      testo: "Categoria",
      valore: (g) => nomeCategoria(g.categoriaSlug),
      classiCella: "text-piccolo text-ink-600",
    },
    {
      chiave: "base",
      testo: "Base",
      valore: (g) => nomeBase(g.baseSlug),
      classiCella: "text-piccolo text-ink-600",
    },
    {
      chiave: "stato",
      testo: "Stato",
      valore: (g) => g.stato,
      cella: (g) => (
        <Pastiglia variante={g.stato === "pubblicato" ? "successo" : "attesa"}>
          {g.stato === "pubblicato" ? "Pubblicato" : "Bozza"}
        </Pastiglia>
      ),
    },
    {
      chiave: "demo",
      testo: "Demo",
      valore: (g) => (g.demoDisponibile ? 1 : 0),
      cella: (g) => (g.demoDisponibile ? "sì" : "no"),
      classiCella: "text-piccolo text-ink-600",
    },
    {
      chiave: "azioni",
      testo: "Azioni",
      ordinabile: false,
      nascondiTesto: true,
      cella: (g) => <ComandiRiga gestionale={g} />,
    },
  ];

  const filtriStato = [
    { valore: "tutti", testo: "Tutti", conteggio: gestionali.length },
    {
      valore: "pubblicati",
      testo: "Pubblicati",
      conteggio: gestionali.filter((g) => g.stato === "pubblicato").length,
    },
    {
      valore: "bozze",
      testo: "Bozze",
      conteggio: gestionali.filter((g) => g.stato !== "pubblicato").length,
    },
  ];

  return (
    <>
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex w-full min-w-0 basis-full flex-wrap items-center gap-3 sm:w-auto sm:flex-1 sm:basis-0">
          <div className="relative w-full min-w-0 sm:w-auto sm:flex-none">
            <Icona
              misura="sm"
              nome="Search"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <label htmlFor="ricerca-gestionali" className="sr-only">
              Cerca fra i gestionali
            </label>
            <input
              id="ricerca-gestionali"
              type="search"
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              placeholder="Cerca per nome…"
              className="h-12 w-full rounded-[var(--radius-controllo)] border border-line bg-white pl-9 pr-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none sm:w-72"
            />
          </div>

          <label htmlFor="filtro-categoria" className="sr-only">
            Filtra per categoria
          </label>
          <select
            id="filtro-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="h-12 w-full min-w-0 basis-full rounded-[var(--radius-controllo)] border border-line bg-white px-3 text-corrente text-ink-800 focus:border-brand-400 focus:outline-none sm:w-auto sm:basis-auto"
          >
            <option value="">Tutte le categorie</option>
            {categorie.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filtriStato.map((f) => (
            <button
              key={f.valore}
              type="button"
              onClick={() => setStato(f.valore)}
              aria-pressed={f.valore === stato}
              className={cn(
                "h-9 rounded-full px-3 text-piccolo font-medium transition-colors",
                f.valore === stato
                  ? "bg-ink-900 text-white"
                  : "bg-white text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt",
              )}
            >
              {f.testo}
              <span className={f.valore === stato ? "ml-1.5 text-white/60" : "ml-1.5 text-ink-400"}>
                {f.conteggio}
              </span>
            </button>
          ))}
        </div>
      </div>

      <TabellaOrdinabile
        righe={filtrati}
        chiaveIniziale="nome"
        decrescente={false}
        colonne={colonne}
        vuota="Nessuna scheda corrisponde alla ricerca. Prova con un altro nome o togli i filtri."
      />
    </>
  );
}
