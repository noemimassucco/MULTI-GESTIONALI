"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Icona from "@/components/ui/Icona";
import { useDemo } from "@/components/demo/StatoDemo";
import { SOGLIA_CERTEZZA } from "@/data/demo/archivio-esempio";

/* ------------------------------------------------------------------ */
/*  IL CARICAMENTO ASSISTITO                                           */
/*                                                                     */
/*  È la cosa che nessun concorrente fa vedere, ed è il motivo per cui  */
/*  un'azienda accetta di cambiare gestionale: il passato entra da solo.*/
/*                                                                     */
/*  Qui è una DIMOSTRAZIONE, e lo diciamo: i file sono finti e le       */
/*  risposte sono già nei dati. Nel gestionale vero i documenti li      */
/*  legge davvero. Quello che è identico è il comportamento: legge,     */
/*  decide, archivia, e quando non è sicuro si ferma e chiede.          */
/* ------------------------------------------------------------------ */

const FASI = {
  fermo: "fermo",
  lettura: "lettura",
  revisione: "revisione",
  fatto: "fatto",
};

function Percentuale({ valore }) {
  const pct = Math.round(valore * 100);
  const sicuro = valore >= SOGLIA_CERTEZZA;
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${
        sicuro
          ? "bg-brand-50 text-brand-800 ring-brand-100"
          : "bg-accento-50 text-accento-700 ring-accento-100"
      }`}
    >
      {sicuro ? "sicuro" : "da confermare"} {pct}%
    </span>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.apri
 * @param {() => void} props.onChiudi
 * @param {object[]} props.archivio  i file finti da leggere
 * @param {(dati: object, documento: object) => string|null} [props.collegamento]
 *        frase che descrive a cosa il sistema propone di agganciare il file
 *        (l'impianto per gli interventi, il cantiere per le commesse)
 */
export default function CaricamentoAssistito({
  apri,
  onChiudi,
  archivio,
  collegamento,
}) {
  const { dati, aggiungi } = useDemo();
  const [fase, setFase] = useState(FASI.fermo);
  const [letti, setLetti] = useState([]);
  const [decisioni, setDecisioni] = useState({});
  const timer = useRef(null);

  const fermo = useReducedMotion();
  const totale = archivio.length;
  const nomeCliente = (id) =>
    dati.clienti?.find((c) => c.id === id)?.nome || null;

  /* La lettura procede un file alla volta: si deve vedere il lavoro. */
  useEffect(() => {
    if (fase !== FASI.lettura) return;
    if (letti.length >= totale) {
      timer.current = setTimeout(() => setFase(FASI.revisione), 420);
      return () => clearTimeout(timer.current);
    }
    timer.current = setTimeout(
      () => setLetti((p) => [...p, archivio[p.length]]),
      letti.length === 0 ? 500 : 260,
    );
    return () => clearTimeout(timer.current);
  }, [fase, letti.length, archivio, totale]);

  const avvia = useCallback(() => {
    setLetti([]);
    setDecisioni({});
    setFase(FASI.lettura);
  }, []);

  const chiudi = useCallback(() => {
    clearTimeout(timer.current);
    setFase(FASI.fermo);
    setLetti([]);
    setDecisioni({});
    onChiudi?.();
  }, [onChiudi]);

  if (!apri) return null;

  const sicuri = letti.filter((d) => d.sicurezza >= SOGLIA_CERTEZZA);
  const incerti = letti.filter((d) => d.sicurezza < SOGLIA_CERTEZZA);
  const daDecidere = incerti.filter((d) => !decisioni[d.nome]);

  /** Archivia davvero nella demo i documenti riconosciuti. */
  const archivia = () => {
    const daArchiviare = [
      ...sicuri,
      ...incerti.filter((d) => decisioni[d.nome] === "conferma"),
    ];
    daArchiviare.forEach((d) => {
      /* peso, sicurezza e perché servono solo alla dimostrazione: nel
         documento archiviato non ci finiscono. */
      const { peso, sicurezza, perche, ...campi } = d;
      aggiungi("documenti", {
        ...campi,
        tipo: d.tipo || "Da classificare",
        caricatoIl: new Date().toISOString().slice(0, 10),
        dimensione: peso,
      });
    });
    setFase(FASI.fatto);
  };

  const archiviati =
    sicuri.length +
    incerti.filter((d) => decisioni[d.nome] === "conferma").length;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Chiudi"
        onClick={chiudi}
        className="absolute inset-0 bg-ink-900/60"
      />

      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[var(--radius-scheda)] bg-white shadow-[var(--shadow-lift)] sm:max-w-3xl sm:rounded-[var(--radius-scheda)]">
        {/* ------------------------------------------------ testata */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <p className="occhiello text-brand-700">Caricamento assistito</p>
            <h2 className="mt-1 text-t3 font-bold text-ink-900">
              Porta dentro l&apos;archivio di dieci anni
            </h2>
          </div>
          <button
            type="button"
            onClick={chiudi}
            aria-label="Chiudi"
            className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] text-ink-500 hover:bg-surface-alt"
          >
            <Icona misura="sm" nome="X" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {/* ---------------------------------------------- 1. fermo */}
          {fase === FASI.fermo ? (
            <>
              <div className="rounded-[var(--radius-scheda)] border-2 border-dashed border-line bg-surface-alt px-6 py-10 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-[var(--radius-scheda)] bg-white text-brand-600 shadow-[var(--shadow-soft)]">
                  <Icona misura="lg" nome="Upload" />
                </span>
                <p className="mt-4 text-testo font-semibold text-ink-900">
                  Trascina qui la cartella condivisa, o un archivio ZIP
                </p>
                <p className="mx-auto mt-2 max-w-md text-corrente leading-relaxed text-ink-500">
                  Senza rinominare niente, senza ordinarli prima. Ci pensa il
                  sistema a capire cos&apos;è ogni file e a chi appartiene.
                </p>
                <button
                  type="button"
                  onClick={avvia}
                  data-comando
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-[var(--radius-controllo)] bg-accento-500 px-5 text-corrente font-semibold text-ink-900 hover:bg-accento-400"
                >
                  <Icona misura="sm" nome="FolderOpen" />
                  Simula: cartella con {totale} documenti
                </button>
              </div>

              <p className="mt-4 flex gap-2 rounded-[var(--radius-controllo)] bg-surface-alt px-4 py-3 text-piccolo leading-relaxed text-ink-600">
                <Icona
                  misura="sm"
                  nome="AlertTriangle"
                  className="mt-0.5 shrink-0 text-ink-500"
                />
                <span>
                  <strong className="font-semibold text-ink-900">
                    Questa è una simulazione.
                  </strong>{" "}
                  I file non esistono e le risposte sono già scritte nella demo.
                  Nel gestionale vero i documenti vengono letti davvero: quello
                  che è identico è il comportamento — legge, decide, archivia, e
                  dove non è sicuro si ferma e chiede a te.
                </span>
              </p>
            </>
          ) : null}

          {/* -------------------------------------------- 2. lettura */}
          {fase === FASI.lettura ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-corrente font-semibold text-ink-900">
                  Sto leggendo i documenti…
                </p>
                <p className="text-corrente font-bold text-brand-700">
                  {letti.length} / {totale}
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-200"
                  style={{ width: `${(letti.length / totale) * 100}%` }}
                />
              </div>

              <ul className="mt-5 space-y-2">
                <AnimatePresence initial={false}>
                  {[...letti].reverse().map((d) => (
                    <motion.li
                      key={d.nome}
                      layout={!fermo}
                      initial={fermo ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: fermo ? 0 : 0.16,
                        ease: "easeOut",
                      }}
                      className="flex items-start gap-3 rounded-[var(--radius-controllo)] border border-line bg-white px-4 py-3"
                    >
                      <Icona
                        misura="sm"
                        nome={
                          d.sicurezza >= SOGLIA_CERTEZZA
                            ? "CheckCircle2"
                            : "AlertTriangle"
                        }
                        className={`mt-0.5 shrink-0 ${
                          d.sicurezza >= SOGLIA_CERTEZZA
                            ? "text-brand-600"
                            : "text-accento-600"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-mini text-ink-500">
                          {d.nome}
                        </p>
                        <p className="mt-0.5 text-corrente font-medium text-ink-900">
                          {d.tipo || "Non riconosciuto"}
                          {nomeCliente(d.clienteId) ? (
                            <span className="font-normal text-ink-500">
                              {" "}
                              → {nomeCliente(d.clienteId)}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <Percentuale valore={d.sicurezza} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </>
          ) : null}

          {/* ------------------------------------------ 3. revisione */}
          {fase === FASI.revisione ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-scheda)] border border-brand-100 bg-brand-50 p-4">
                  <p className="text-t2 font-bold text-brand-800">
                    {sicuri.length}
                  </p>
                  <p className="mt-0.5 text-corrente font-medium text-brand-800">
                    archiviati da soli
                  </p>
                  <p className="mt-1 text-piccolo text-ink-600">
                    Riconosciuti e collegati alla scheda giusta senza chiedere
                    niente.
                  </p>
                </div>
                <div className="rounded-[var(--radius-scheda)] border border-accento-200 bg-accento-50 p-4">
                  <p className="text-t2 font-bold text-accento-700">
                    {incerti.length}
                  </p>
                  <p className="mt-0.5 text-corrente font-medium text-accento-700">
                    da confermare
                  </p>
                  <p className="mt-1 text-piccolo text-ink-600">
                    Il sistema non è sicuro: decidi tu, e la prossima volta lo
                    sa.
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-corrente font-bold text-ink-900">
                Questi hanno bisogno di te
              </h3>
              <ul className="mt-3 space-y-2">
                {incerti.map((d) => {
                  const scelta = decisioni[d.nome];
                  return (
                    <li
                      key={d.nome}
                      className="rounded-[var(--radius-scheda)] border border-line bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-mono text-mini text-ink-500">
                            {d.nome}
                          </p>
                          <p className="mt-0.5 text-corrente font-medium text-ink-900">
                            {d.tipo || "Tipo non riconosciuto"}
                            {nomeCliente(d.clienteId)
                              ? ` → ${nomeCliente(d.clienteId)}`
                              : ""}
                          </p>
                          <p className="mt-1 text-piccolo leading-relaxed text-ink-500">
                            {d.perche}
                          </p>
                          {collegamento?.(dati, d) ? (
                            <p className="mt-1 text-mini text-ink-500">
                              {collegamento(dati, d)}
                            </p>
                          ) : null}
                        </div>
                        <Percentuale valore={d.sicurezza} />
                      </div>

                      {scelta ? (
                        <p
                          className={`mt-3 flex items-center gap-2 text-piccolo font-semibold ${
                            scelta === "conferma"
                              ? "text-brand-700"
                              : "text-ink-500"
                          }`}
                        >
                          <Icona
                            misura="sm"
                            nome={scelta === "conferma" ? "Check" : "X"}
                            className="size-3.5"
                          />
                          {scelta === "conferma"
                            ? "Confermato, verrà archiviato"
                            : "Lasciato da parte"}
                        </p>
                      ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDecisioni((p) => ({
                                ...p,
                                [d.nome]: "conferma",
                              }))
                            }
                            data-comando
                            className="flex h-9 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-brand-600 px-3 text-piccolo font-semibold text-white hover:bg-brand-700"
                          >
                            <Icona
                              misura="sm"
                              nome="Check"
                              className="size-3.5"
                            />
                            Va bene così
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDecisioni((p) => ({
                                ...p,
                                [d.nome]: "scarta",
                              }))
                            }
                            data-comando
                            className="flex h-9 items-center rounded-[var(--radius-controllo)] px-3 text-piccolo font-medium text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
                          >
                            Lo guardo dopo
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}

          {/* ---------------------------------------------- 4. fatto */}
          {fase === FASI.fatto ? (
            <div className="py-6 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-700">
                <Icona misura="lg" nome="CheckCircle2" />
              </span>
              <h3 className="mt-4 text-t3 font-bold text-ink-900">
                {archiviati} documenti archiviati
              </h3>
              <p className="mx-auto mt-2 max-w-md text-corrente leading-relaxed text-ink-500">
                Ognuno è collegato al cliente e all&apos;impianto giusto. Li
                trovi nelle rispettive schede: non dovrai più cercarli in una
                cartella.
              </p>
              <p className="mx-auto mt-4 max-w-md rounded-[var(--radius-controllo)] bg-surface-alt px-4 py-3 text-piccolo leading-relaxed text-ink-600">
                A mano, {totale} documenti sono circa mezz&apos;ora di lavoro.
                Un archivio vero ne ha qualche migliaio: è il motivo per cui
                quasi nessuno lo porta dentro.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={chiudi}
                  data-comando
                  className="flex h-11 items-center rounded-[var(--radius-controllo)] bg-brand-700 px-5 text-corrente font-semibold text-white hover:bg-brand-600"
                >
                  Torna al gestionale
                </button>
                <Link
                  href="/richiedi"
                  data-comando
                  className="flex h-11 items-center rounded-[var(--radius-controllo)] px-5 text-corrente font-semibold text-ink-700 ring-1 ring-inset ring-line hover:bg-surface-alt"
                >
                  Voglio questo per la mia azienda
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* ------------------------------------------------ comandi */}
        {fase === FASI.revisione ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-alt px-6 py-4">
            <p className="text-piccolo text-ink-600">
              {daDecidere.length
                ? `${daDecidere.length} ancora da decidere`
                : "Tutto deciso, si può archiviare"}
            </p>
            <button
              type="button"
              onClick={archivia}
              data-comando
              className="flex h-11 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-600 px-5 text-corrente font-semibold text-white hover:bg-brand-700"
            >
              Archivia{" "}
              {sicuri.length +
                incerti.filter((d) => decisioni[d.nome] === "conferma")
                  .length}{" "}
              documenti
              <Icona misura="sm" nome="ArrowRight" className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
