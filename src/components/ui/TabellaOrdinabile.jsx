"use client";

import { useMemo } from "react";
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import Icona from "@/components/ui/Icona";

/* ------------------------------------------------------------------ */
/*  Tabella ordinabile, con la stessa pelle di TabellaDemo.            */
/*                                                                     */
/*  Il motivo per cui esiste: su un elenco di venti righe la prima     */
/*  cosa che si fa è ordinarlo — per importo, per data, per margine.   */
/*  L'ordinamento lo tiene TanStack Table; qui c'è solo il disegno.    */
/*                                                                     */
/*  Per elenchi cortissimi resta giusta TabellaDemo: non serve un      */
/*  motore per cinque righe.                                           */
/* ------------------------------------------------------------------ */

/** Solo l'ordinamento, con i comparatori che servono davvero. */
const funzionalita = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

const VUOTO = [];

/**
 * @param {object} props
 * @param {Array} props.righe  i dati
 * @param {Array} props.colonne
 *   [{ chiave, testo, valore?, cella?, ordinabile?, classi?, classiCella? }]
 *   - `valore(riga)`  il dato su cui si ordina (default: riga[chiave])
 *   - `cella(riga)`   cosa si vede (default: il valore)
 * @param {string} [props.chiaveIniziale]  colonna di partenza
 * @param {boolean} [props.decrescente]    parte dal più grande
 * @param {string} [props.vuota]           frase quando non c'è niente
 * @param {(riga: object) => string} [props.classiRiga]
 */
export default function TabellaOrdinabile({
  righe,
  colonne,
  chiaveIniziale,
  decrescente = true,
  vuota,
  classiRiga,
}) {
  /* Le pagine ricostruiscono `colonne` a ogni render, ed è giusto così: le
     celle sono funzioni che leggono lo stato vivo della demo. Ma le colonne
     del motore devono restare le stesse, altrimenti l'ordinamento perde il
     filo a ogni battuta di tasto.

     Quindi si separano i due mestieri: qui si calcolano una volta i valori
     su cui ordinare, e le colonne del motore diventano semplici chiavi.
     Niente funzioni che cambiano identità, niente tabella ricostruita. */
  const datiOrdinabili = useMemo(() => {
    const partenza = righe?.length ? righe : VUOTO;
    return partenza.map((riga) => {
      const valori = { riga };
      colonne.forEach((c) => {
        valori[c.chiave] = c.valore ? c.valore(riga) : riga[c.chiave];
      });
      return valori;
    });
  }, [righe, colonne]);

  const firma = colonne.map((c) => `${c.chiave}|${c.testo}|${c.ordinabile !== false}`).join("~");

  const colonneTabella = useMemo(() => {
    const aiuto = createColumnHelper();
    return aiuto.columns(
      firma.split("~").map((voce) => {
        const [chiave, testo, ordinabile] = voce.split("|");
        return aiuto.accessor((valori) => valori[chiave], {
          id: chiave,
          header: testo,
          enableSorting: ordinabile === "true",
        });
      }),
    );
  }, [firma]);

  const inizio = useMemo(
    () => (chiaveIniziale ? { sorting: [{ id: chiaveIniziale, desc: decrescente }] } : undefined),
    [chiaveIniziale, decrescente],
  );

  const tabella = useTable({
    features: funzionalita,
    columns: colonneTabella,
    data: datiOrdinabili,
    initialState: inizio,
    enableSortingRemoval: false,
  });

  const perChiave = Object.fromEntries(colonne.map((c) => [c.chiave, c]));

  return (
    <div className="overflow-hidden rounded-[var(--radius-scheda)] border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            {tabella.getHeaderGroups().map((gruppo) => (
              <tr key={gruppo.id} className="border-b border-line bg-surface-alt">
                {gruppo.headers.map((intestazione) => {
                  const c = perChiave[intestazione.column.id] || {};
                  const ordinabile = intestazione.column.getCanSort();
                  const verso = intestazione.column.getIsSorted();
                  return (
                    <th
                      key={intestazione.id}
                      scope="col"
                      aria-sort={
                        verso === "asc"
                          ? "ascending"
                          : verso === "desc"
                            ? "descending"
                            : ordinabile
                              ? "none"
                              : undefined
                      }
                      className={`whitespace-nowrap p-0 text-mini font-semibold uppercase tracking-wide text-ink-500 ${
                        c.classi || ""
                      }`}
                    >
                      {ordinabile ? (
                        <button
                          type="button"
                          onClick={() => intestazione.column.toggleSorting()}
                          className="flex h-10 w-full items-center gap-1.5 px-4 text-left uppercase transition-colors hover:bg-line-soft hover:text-ink-700"
                        >
                          {c.nascondiTesto ? (
                            <span className="sr-only">{c.testo}</span>
                          ) : (
                            c.testo
                          )}
                          <Icona
                            misura="sm"
                            nome={
                              verso === "asc"
                                ? "ChevronUp"
                                : verso === "desc"
                                  ? "ChevronDown"
                                  : "ChevronsUpDown"
                            }
                            className={`size-3 ${verso ? "text-brand-600" : "text-ink-300"}`}
                          />
                        </button>
                      ) : (
                        <span className="flex h-10 items-center px-4">
                          {c.nascondiTesto ? <span className="sr-only">{c.testo}</span> : c.testo}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-line-soft">
            {tabella.getRowModel().rows.map((riga) => (
              <tr
                key={riga.original.riga.id ?? riga.original.riga.slug ?? riga.id}
                className={`transition-colors hover:bg-surface-alt ${
                  classiRiga?.(riga.original.riga) || ""
                }`}
              >
                {colonne.map((c) => (
                  <td key={c.chiave} className={`px-4 py-3 ${c.classiCella || ""}`}>
                    {c.cella ? c.cella(riga.original.riga) : riga.original[c.chiave]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!datiOrdinabili.length && vuota ? (
        <p className="px-6 py-12 text-center text-corrente text-ink-500">{vuota}</p>
      ) : null}
    </div>
  );
}
