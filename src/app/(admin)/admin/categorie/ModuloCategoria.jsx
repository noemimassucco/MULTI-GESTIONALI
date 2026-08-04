"use client";

import { useActionState } from "react";
import { salvaCategoria } from "@/app/actions/amministrazione";
import Bottone from "@/components/ui/Bottone";
import { cn } from "@/lib/cn";

const CLASSI_CAMPO =
  "h-12 w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3.5 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none";

/**
 * Modulo compatto di una categoria: quel poco che si cambia davvero.
 * La descrizione viaggia com'è, così salvare da qui non la cancella:
 * si modifica nei testi di partenza.
 */
export default function ModuloCategoria({ categoria }) {
  const [esito, azione, inCorso] = useActionState(salvaCategoria, null);
  const id = (campo) => `${categoria.slug}-${campo}`;

  return (
    <form
      action={azione}
      className="rounded-[var(--radius-scheda)] border border-line bg-white p-4 sm:p-5"
    >
      <input type="hidden" name="slug" value={categoria.slug} />
      <input type="hidden" name="descrizione" defaultValue={categoria.descrizione || ""} />

      <p className="font-mono text-mini text-ink-500">{categoria.slug}</p>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,110px)]">
        <div>
          <label
            htmlFor={id("nome")}
            className="mb-1.5 block text-piccolo font-semibold text-ink-900"
          >
            Nome
          </label>
          <input
            id={id("nome")}
            name="nome"
            type="text"
            defaultValue={categoria.nome}
            className={CLASSI_CAMPO}
          />
        </div>

        <div>
          <label
            htmlFor={id("sottotitolo")}
            className="mb-1.5 block text-piccolo font-semibold text-ink-900"
          >
            Sottotitolo
          </label>
          <input
            id={id("sottotitolo")}
            name="sottotitolo"
            type="text"
            defaultValue={categoria.sottotitolo}
            className={CLASSI_CAMPO}
          />
        </div>

        <div>
          <label
            htmlFor={id("ordine")}
            className="mb-1.5 block text-piccolo font-semibold text-ink-900"
          >
            Ordine
          </label>
          <input
            id={id("ordine")}
            name="ordine"
            type="number"
            min="0"
            max="99"
            defaultValue={categoria.ordine}
            className={CLASSI_CAMPO}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor={id("pubblicata")}
          className="flex items-center gap-2 text-corrente text-ink-700"
        >
          <input
            id={id("pubblicata")}
            name="pubblicata"
            type="checkbox"
            defaultChecked={Boolean(categoria.pubblicata)}
            className="size-4 rounded-[var(--radius-controllo)] border-line text-brand-600 focus:outline-none"
          />
          Pubblicata sul sito
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {esito?.messaggio ? (
            <p
              className={cn(
                "text-piccolo font-medium",
                esito.ok ? "text-brand-700" : "text-red-600",
              )}
            >
              {esito.messaggio}
            </p>
          ) : null}
          <Bottone type="submit" variante="secondario" misura="sm" disabled={inCorso}>
            {inCorso ? "Salvataggio…" : "Salva"}
          </Bottone>
        </div>
      </div>
    </form>
  );
}
