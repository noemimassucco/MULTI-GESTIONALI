"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import { CampoDemo, classiInputDemo } from "@/components/demo/ElementiDemo";
import {
  BarraPassaggi,
  RiepilogoCosti,
  StatoIntervento,
} from "@/components/demo/ElementiInterventi";
import { listinoMateriali } from "@/data/demo/interventi";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/interventi";

const TIPI = {
  riparazione: "Riparazione",
  manutenzione: "Manutenzione",
  installazione: "Installazione",
};

/** Riga di informazione con l'icona a sinistra. */
function Riga({ icona, etichetta, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icona misura="sm" nome={icona} className="mt-0.5 shrink-0 text-ink-400" />
      <div className="min-w-0">
        <p className="text-mini text-ink-500">{etichetta}</p>
        <div className="text-corrente text-ink-900">{children}</div>
      </div>
    </div>
  );
}

/** Titoletto dei pannelli. */
function TitoloPannello({ testo, nota }) {
  return (
    <div className="mb-4">
      <h2 className="text-testo font-bold text-ink-900">{testo}</h2>
      {nota ? <p className="mt-1 text-piccolo text-ink-500">{nota}</p> : null}
    </div>
  );
}

/** Elenco dei materiali usati, in sola lettura. */
function ElencoMateriali({ materiali }) {
  if (!materiali.length) {
    return <p className="text-corrente text-ink-500">Nessun materiale usato.</p>;
  }
  return (
    <ul className="divide-y divide-line-soft">
      {materiali.map((m, indice) => (
        <li key={`${m.nome}-${indice}`} className="flex items-center justify-between gap-3 py-2">
          <span className="min-w-0 truncate text-corrente text-ink-900">
            {m.nome}
            <span className="text-ink-500">
              {" "}
              · {m.quantita} × {euro(m.prezzo)}
            </span>
          </span>
          <span className="shrink-0 text-corrente font-medium text-ink-900">
            {euro(m.prezzo * m.quantita)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Scheda dell'intervento: dove si va, chi ci va e il rapportino. */
export default function SchedaIntervento() {
  const { id } = useParams();
  const { dati, aggiorna } = useDemo();
  const [sceltoListino, setSceltoListino] = useState("0");
  const [quantita, setQuantita] = useState("1");

  const i = dati.interventi.find((x) => x.id === id);

  if (!i) {
    return (
      <div className="rounded-[var(--radius-scheda)] border border-line bg-white px-6 py-12 text-center">
        <p className="text-corrente text-ink-700">
          Intervento non trovato: forse è stato rimosso.
        </p>
        <Link
          href={`${BASE}/interventi`}
          className="mt-3 inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
        >
          <Icona misura="sm" nome="ArrowLeft" className="size-3.5" />
          Torna all&apos;elenco interventi
        </Link>
      </div>
    );
  }

  const cliente = dati.clienti.find((c) => c.id === i.clienteId);
  const tecnico = dati.tecnici.find((t) => t.id === i.tecnicoId);
  const impianto = i.impiantoId ? dati.impianti.find((p) => p.id === i.impiantoId) : null;
  const materiali = i.materiali || [];

  const salvaOre = (valore) =>
    aggiorna("interventi", i.id, { durataOre: valore === "" ? null : Number(valore) });

  const aggiungiMateriale = () => {
    const voce = listinoMateriali[Number(sceltoListino)];
    if (!voce) return;
    const q = Math.max(1, Math.round(Number(quantita) || 1));
    aggiorna("interventi", i.id, {
      materiali: [...materiali, { nome: voce.nome, quantita: q, prezzo: voce.prezzo }],
    });
    setQuantita("1");
  };

  const togliMateriale = (indice) =>
    aggiorna("interventi", i.id, { materiali: materiali.filter((_, k) => k !== indice) });

  const puoChiudere = Number(i.durataOre) > 0;

  return (
    <>
      {/* ------------------------------------------------ intestazione */}
      <Link
        href={`${BASE}/interventi`}
        className="mb-3 inline-flex items-center gap-1.5 text-piccolo font-semibold text-ink-500 hover:text-ink-800"
      >
        <Icona misura="sm" nome="ArrowLeft" className="size-3.5" />
        Tutti gli interventi
      </Link>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-mini text-ink-500">{i.numero}</p>
          <h1 className="mt-0.5 text-t2 font-bold text-ink-900">{i.titolo}</h1>
        </div>
        <StatoIntervento intervento={i} />
      </div>

      <div className="mb-5">
        <BarraPassaggi intervento={i} />
      </div>

      {/* --------------------------------------------- dove e da chi */}
      <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
        <TitoloPannello testo="Dove e da chi" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Riga icona="Users" etichetta="Cliente">
            <span className="font-semibold">{cliente?.nome || "—"}</span>
            {cliente?.referente ? (
              <span className="block text-piccolo text-ink-600">{cliente.referente}</span>
            ) : null}
          </Riga>
          <Riga icona="Phone" etichetta="Telefono">
            {cliente?.telefono || "—"}
          </Riga>
          <Riga icona="MapPin" etichetta="Indirizzo">
            {cliente?.indirizzo || "—"}
          </Riga>
          <Riga icona="Clock" etichetta="Quando">
            {dataBreve(i.data)} alle {i.ora}
          </Riga>
          <div className="flex items-start gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-mini font-bold text-brand-700">
              {tecnico?.iniziali || "—"}
            </span>
            <div className="min-w-0">
              <p className="text-mini text-ink-500">Tecnico assegnato</p>
              <p className="text-corrente font-semibold text-ink-900">
                {tecnico?.nome || "Da assegnare"}
              </p>
              {tecnico?.specialita ? (
                <p className="text-piccolo text-ink-600">{tecnico.specialita}</p>
              ) : null}
            </div>
          </div>
          <Riga icona="Wrench" etichetta="Tipo di intervento">
            {TIPI[i.tipo] || i.tipo}
          </Riga>
        </div>

        {impianto ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
            <div className="flex items-start gap-2.5">
              <Icona misura="sm" nome="Blocks" className="mt-0.5 shrink-0 text-ink-400" />
              <div className="min-w-0">
                <p className="text-mini text-ink-500">Impianto</p>
                <p className="text-corrente text-ink-900">
                  {impianto.marca} {impianto.modello}
                  <span className="text-ink-500">
                    {" "}
                    · matricola{" "}
                    <span className="font-mono text-mini">{impianto.matricola}</span> ·{" "}
                    {impianto.ubicazione}
                  </span>
                </p>
              </div>
            </div>
            <Link
              href={`${BASE}/impianti`}
              className="inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Vedi gli impianti
              <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
            </Link>
          </div>
        ) : null}
      </div>

      {/* ------------------------------------ programmato: si comincia */}
      {i.stato === "programmato" ? (
        <div className="mt-4 rounded-[var(--radius-scheda)] border border-line bg-white p-6">
          <TitoloPannello
            testo="Il rapportino"
            nota="Il tecnico apre l'intervento dal telefono quando arriva sul posto."
          />
          <button
            type="button"
            onClick={() => aggiorna("interventi", i.id, { stato: "in_corso" })}
            data-comando
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-controllo)] bg-brand-600 px-5 text-testo font-semibold text-white hover:bg-brand-700 sm:w-auto"
          >
            <Icona misura="sm" nome="Wrench" className="size-4" />
            Il tecnico è arrivato
          </button>
        </div>
      ) : null}

      {/* ------------------------------------- in corso: il rapportino */}
      {i.stato === "in_corso" ? (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
            <TitoloPannello
              testo="Rapportino"
              nota="Si compila mentre si lavora: ore, ricambi, note, foto e firma."
            />

            <div className="max-w-64">
              <CampoDemo etichetta="Ore lavorate">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={i.durataOre ?? ""}
                  onChange={(e) => salvaOre(e.target.value)}
                  placeholder="Es. 1,5"
                  className={classiInputDemo}
                />
              </CampoDemo>
            </div>

            {/* ------------------------------------------- materiali */}
            <div className="mt-5 border-t border-line-soft pt-5">
              <h3 className="mb-2 text-corrente font-bold text-ink-900">Materiali usati</h3>
              {materiali.length ? (
                <ul className="divide-y divide-line-soft">
                  {materiali.map((m, indice) => (
                    <li
                      key={`${m.nome}-${indice}`}
                      className="flex items-center gap-3 py-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-corrente text-ink-900">
                        {m.nome}
                        <span className="text-ink-500">
                          {" "}
                          · {m.quantita} × {euro(m.prezzo)}
                        </span>
                      </span>
                      <span className="shrink-0 text-corrente font-medium text-ink-900">
                        {euro(m.prezzo * m.quantita)}
                      </span>
                      <button
                        type="button"
                        onClick={() => togliMateriale(indice)}
                        title="Togli dal rapportino"
                        aria-label={`Togli dal rapportino: ${m.nome}`}
                        className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] text-ink-500 hover:bg-surface-alt hover:text-critico"
                      >
                        <Icona misura="sm" nome="X" className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-corrente text-ink-500">
                  Ancora nessun ricambio. Si prendono dal listino qui sotto.
                </p>
              )}

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,5.5rem)_minmax(0,auto)]">
                <select
                  value={sceltoListino}
                  onChange={(e) => setSceltoListino(e.target.value)}
                  aria-label="Materiale dal listino"
                  className={classiInputDemo}
                >
                  {listinoMateriali.map((v, indice) => (
                    <option key={v.nome} value={String(indice)}>
                      {v.nome} — {euro(v.prezzo)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantita}
                  onChange={(e) => setQuantita(e.target.value)}
                  aria-label="Quantità"
                  className={classiInputDemo}
                />
                <button
                  type="button"
                  onClick={aggiungiMateriale}
                  data-comando
                  className="h-11 rounded-[var(--radius-controllo)] bg-brand-700 px-4 text-piccolo font-semibold text-white hover:bg-brand-600"
                >
                  Aggiungi
                </button>
              </div>
            </div>

            {/* ----------------------------------------------- note */}
            <div className="mt-5 border-t border-line-soft pt-5">
              <CampoDemo etichetta="Note del tecnico">
                <textarea
                  key={i.id}
                  rows={3}
                  defaultValue={i.note}
                  onBlur={(e) => aggiorna("interventi", i.id, { note: e.target.value })}
                  placeholder="Cosa è stato trovato, cosa è stato fatto, cosa consigliare al cliente."
                  className="w-full rounded-[var(--radius-controllo)] border border-line bg-white p-3 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
                />
              </CampoDemo>
            </div>

            {/* ---------------------------------------- foto e firma */}
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-line-soft pt-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <CampoDemo etichetta="Foto scattate">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={i.foto ?? 0}
                  onChange={(e) =>
                    aggiorna("interventi", i.id, { foto: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className={classiInputDemo}
                />
              </CampoDemo>
              <div>
                <span className="mb-1.5 block text-piccolo font-semibold text-ink-900">
                  Firma del cliente
                </span>
                {i.firmato ? (
                  <p className="flex h-11 items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-50 px-3 text-corrente font-semibold text-brand-800">
                    <Icona misura="sm" nome="Check" className="size-4" />
                    Firmato dal cliente
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => aggiorna("interventi", i.id, { firmato: true })}
                    data-comando
                    className="h-11 w-full rounded-[var(--radius-controllo)] border border-line bg-white px-4 text-piccolo font-semibold text-ink-800 hover:bg-surface-alt"
                  >
                    Fai firmare il cliente
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* -------------------------------- conto che si aggiorna */}
          <div>
            <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
              <TitoloPannello testo="Il conto" nota="Si aggiorna mentre compili il rapportino." />
              <RiepilogoCosti intervento={i} />
              <button
                type="button"
                disabled={!puoChiudere}
                onClick={() => aggiorna("interventi", i.id, { stato: "chiuso" })}
                data-comando
                className={`mt-5 h-12 w-full rounded-[var(--radius-controllo)] px-5 text-corrente font-semibold ${
                  puoChiudere
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "bg-surface-alt text-ink-400"
                }`}
              >
                Chiudi l&apos;intervento
              </button>
              {!puoChiudere ? (
                <p className="mt-2 text-mini text-ink-500">
                  Per chiudere servono le ore lavorate: senza quelle il conto non sta in piedi.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------- chiuso: sola lettura */}
      {i.stato === "chiuso" ? (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
            <TitoloPannello
              testo="Rapportino"
              nota="Compilato dal tecnico sul posto. Resta com'è: fa fede."
            />
            <div className="space-y-4">
              <div>
                <p className="text-mini text-ink-500">Ore lavorate</p>
                <p className="text-corrente font-semibold text-ink-900">
                  {i.durataOre ? `${i.durataOre} h` : "—"}
                </p>
              </div>
              <div className="border-t border-line-soft pt-4">
                <p className="mb-1 text-mini text-ink-500">Materiali usati</p>
                <ElencoMateriali materiali={materiali} />
              </div>
              <div className="border-t border-line-soft pt-4">
                <p className="mb-1 text-mini text-ink-500">Note del tecnico</p>
                <p className="text-corrente text-ink-800">
                  {i.note || "Nessuna nota."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line-soft pt-4">
                <span className="flex items-center gap-2 text-corrente text-ink-800">
                  <Icona misura="sm" nome="Smartphone" className="size-4 text-ink-400" />
                  {i.foto ? `${i.foto} foto allegate` : "Nessuna foto"}
                </span>
                {i.firmato ? (
                  <span className="flex items-center gap-2 text-corrente font-semibold text-brand-800">
                    <Icona misura="sm" nome="Check" className="size-4" />
                    Firmato dal cliente
                  </span>
                ) : (
                  <span className="text-corrente text-ink-500">Firma non raccolta</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
              <TitoloPannello testo="Il conto" />
              <RiepilogoCosti intervento={i} />
              {i.fatturato ? (
                <p className="mt-5 flex items-center gap-2 rounded-[var(--radius-controllo)] bg-brand-50 px-3 py-2.5 text-corrente font-semibold text-brand-700">
                  <Icona misura="sm" nome="FileStack" className="size-4" />
                  Già fatturato
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => aggiorna("interventi", i.id, { fatturato: true })}
                    data-comando
                    className="mt-5 h-12 w-full rounded-[var(--radius-controllo)] bg-ink-900 px-5 text-corrente font-semibold text-white hover:bg-ink-800"
                  >
                    Segna fatturato
                  </button>
                  <p className="mt-2 text-mini text-ink-500">
                    Finché non è segnato, resta tra le cose da fatturare.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* --------------------------------------------- rimando discreto */}
      <div className="mt-6 rounded-[var(--radius-scheda)] bg-surface-alt px-5 py-4">
        <p className="text-piccolo text-ink-600">
          Nel gestionale vero il rapportino si compila dal telefono, in cantiere: le voci del
          listino, i campi e la firma si adattano al tuo modo di lavorare.{" "}
          <Link
            href="/personalizzazioni"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Scopri le personalizzazioni
          </Link>
        </p>
      </div>
    </>
  );
}
