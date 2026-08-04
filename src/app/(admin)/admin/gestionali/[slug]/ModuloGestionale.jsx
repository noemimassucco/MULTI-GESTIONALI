"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { annullaModifiche, salvaGestionale } from "@/app/actions/amministrazione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import { cn } from "@/lib/cn";

const CLASSI_CAMPO =
  "h-12 w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3.5 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none";

const CLASSI_AREA =
  "w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3.5 py-2.5 text-corrente leading-relaxed text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none";

/** Etichetta + campo: la stessa impaginazione per tutti i campi del modulo. */
function Campo({ nome, etichetta, aiuto, children }) {
  return (
    <div>
      <label htmlFor={nome} className="mb-1.5 block text-piccolo font-semibold text-ink-900">
        {etichetta}
      </label>
      {children}
      {aiuto ? <p className="mt-1.5 text-piccolo text-ink-400">{aiuto}</p> : null}
    </div>
  );
}

/** Elenco scritto una voce per riga: è il modo più semplice per chi non programma. */
function AreaElenco({ nome, etichetta, valore, righe = 6 }) {
  return (
    <Campo nome={nome} etichetta={etichetta} aiuto="Una voce per riga.">
      <textarea
        id={nome}
        name={nome}
        rows={righe}
        defaultValue={(valore || []).join("\n")}
        className={CLASSI_AREA}
      />
    </Campo>
  );
}

/** Contatore dei caratteri per i campi che finiscono su Google. */
function Contatore({ quanti, massimo }) {
  return (
    <span
      className={cn(
        "font-mono text-mini",
        quanti > massimo ? "text-red-600" : "text-ink-400",
      )}
    >
      {quanti}/{massimo}
    </span>
  );
}

/** Il modulo completo di una scheda gestionale. */
export default function ModuloGestionale({ gestionale, nomeCategoria, nomeBase }) {
  const [esito, azione, inCorso] = useActionState(salvaGestionale, null);
  const [esitoRipristino, azioneRipristino, ripristinoInCorso] = useActionState(
    annullaModifiche,
    null,
  );
  const [metaTitle, setMetaTitle] = useState(gestionale.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(gestionale.metaDescription || "");

  return (
    <>
      <header className="mb-6">
        <Link
          href="/admin/gestionali"
          className="inline-flex items-center gap-1.5 text-piccolo font-semibold text-ink-500 hover:text-ink-800"
        >
          <Icona misura="sm" nome="ArrowLeft" />
          Tutti i gestionali
        </Link>

        <h1 className="mt-3 text-t1 font-bold text-ink-900">{gestionale.nome}</h1>
        <p className="mt-1 text-corrente text-ink-500">
          Categoria: {nomeCategoria} · Base: {nomeBase} ·{" "}
          <span className="font-mono text-mini">{gestionale.slug}</span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/gestionali/${gestionale.slug}`}
            className="inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
          >
            Vedi la pagina pubblica
            <Icona misura="sm" nome="ArrowRight" />
          </Link>

          <form action={azioneRipristino}>
            <input type="hidden" name="collezione" value="gestionali" />
            <input type="hidden" name="slug" value={gestionale.slug} />
            <Bottone
              type="submit"
              variante="secondario"
              misura="sm"
              disabled={ripristinoInCorso}
            >
              <Icona misura="sm" nome="RefreshCw" />
              Annulla le mie modifiche
            </Bottone>
          </form>

          {esitoRipristino?.messaggio ? (
            <p
              className={cn(
                "text-piccolo font-medium",
                esitoRipristino.ok ? "text-brand-700" : "text-red-600",
              )}
            >
              {esitoRipristino.messaggio}
            </p>
          ) : null}
        </div>
      </header>

      <form action={azione} className="space-y-6">
        <input type="hidden" name="slug" value={gestionale.slug} />

        {/* ------------------------------------------------ scheda */}
        <section className="space-y-5 rounded-[var(--radius-scheda)] border border-line bg-white p-4 sm:p-5">
          <h2 className="text-testo font-bold text-ink-900">La scheda</h2>

          <Campo nome="nome" etichetta="Nome">
            <input
              id="nome"
              name="nome"
              type="text"
              defaultValue={gestionale.nome}
              className={CLASSI_CAMPO}
            />
          </Campo>

          <Campo
            nome="sottotitolo"
            etichetta="Sottotitolo"
            aiuto="Una riga sola: è la frase che compare sotto il titolo e nelle schede del catalogo."
          >
            <textarea
              id="sottotitolo"
              name="sottotitolo"
              rows={2}
              defaultValue={gestionale.sottotitolo}
              className={CLASSI_AREA}
            />
          </Campo>

          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,160px)]">
            <Campo nome="stato" etichetta="Stato">
              <select
                id="stato"
                name="stato"
                defaultValue={gestionale.stato}
                className={CLASSI_CAMPO}
              >
                <option value="bozza">Bozza</option>
                <option value="pubblicato">Pubblicato</option>
              </select>
            </Campo>

            <Campo
              nome="ordine"
              etichetta="Ordine"
              aiuto="Più basso, più in alto nella categoria."
            >
              <input
                id="ordine"
                name="ordine"
                type="number"
                min="0"
                max="999"
                defaultValue={gestionale.ordine}
                className={CLASSI_CAMPO}
              />
            </Campo>
          </div>

          <Campo
            nome="descrizione"
            etichetta="Descrizione"
            aiuto="Lascia una riga vuota fra un paragrafo e l'altro."
          >
            <textarea
              id="descrizione"
              name="descrizione"
              rows={14}
              defaultValue={gestionale.descrizione}
              className={CLASSI_AREA}
            />
          </Campo>
        </section>

        {/* ------------------------------------------------ elenchi */}
        <section className="space-y-5 rounded-[var(--radius-scheda)] border border-line bg-white p-4 sm:p-5">
          <h2 className="text-testo font-bold text-ink-900">Gli elenchi</h2>

          <AreaElenco nome="problemi" etichetta="Problemi" valore={gestionale.problemi} />
          <AreaElenco nome="funzioni" etichetta="Funzioni" valore={gestionale.funzioni} righe={8} />
          <AreaElenco nome="moduli" etichetta="Moduli" valore={gestionale.moduli} />
          <AreaElenco
            nome="moduliAggiuntivi"
            etichetta="Moduli aggiuntivi"
            valore={gestionale.moduliAggiuntivi}
            righe={4}
          />
          <AreaElenco
            nome="personalizzazioni"
            etichetta="Personalizzazioni"
            valore={gestionale.personalizzazioni}
            righe={10}
          />
          <AreaElenco nome="utenti" etichetta="Utenti" valore={gestionale.utenti} righe={4} />
        </section>

        {/* ------------------------------------------------ motori di ricerca */}
        <section className="space-y-5 rounded-[var(--radius-scheda)] border border-line bg-white p-4 sm:p-5">
          <h2 className="text-testo font-bold text-ink-900">Motori di ricerca</h2>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label htmlFor="metaTitle" className="text-piccolo font-semibold text-ink-900">
                Titolo per Google
              </label>
              <Contatore quanti={metaTitle.length} massimo={60} />
            </div>
            <input
              id="metaTitle"
              name="metaTitle"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className={CLASSI_CAMPO}
            />
            <p className="mt-1.5 text-piccolo text-ink-400">
              Oltre i 60 caratteri Google taglia la parte finale.
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label htmlFor="metaDescription" className="text-piccolo font-semibold text-ink-900">
                Descrizione per Google
              </label>
              <Contatore quanti={metaDescription.length} massimo={155} />
            </div>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={CLASSI_AREA}
            />
            <p className="mt-1.5 text-piccolo text-ink-400">
              Due righe che dicono a chi serve questo gestionale: max 155 caratteri consigliati.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ barra di salvataggio */}
        <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-line bg-white px-4 py-3 sm:-mx-6 sm:px-6">
          {esito?.messaggio ? (
            <p
              className={cn(
                "mr-auto text-piccolo font-medium",
                esito.ok ? "text-brand-700" : "text-red-600",
              )}
            >
              {esito.messaggio}
            </p>
          ) : null}
          <Bottone type="submit" disabled={inCorso}>
            {inCorso ? "Salvataggio…" : "Salva"}
          </Bottone>
        </div>
      </form>
    </>
  );
}
