"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import { CampoDemo, ModaleDemo } from "@/components/demo/ElementiDemo";
import {
  BarraAvanzamento,
  RiepilogoCommessa,
  Salute,
  StatoCommessa,
  StatoVariante,
  contiCommessa,
} from "@/components/demo/ElementiCommesse";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

/** Titoletto dei pannelli. */
function TitoloPannello({ testo, nota, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-testo font-bold text-ink-900">{testo}</h2>
        {nota ? <p className="mt-1 text-piccolo text-ink-500">{nota}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Pannello({ children }) {
  return (
    <section className="rounded-[var(--radius-scheda)] border border-line bg-white p-5">
      {children}
    </section>
  );
}

/** La scheda del cantiere: fasi, conti veri, ore, acquisti, varianti, SAL. */
export default function SchedaCommessa() {
  const { id } = useParams();
  const { dati, aggiorna } = useDemo();
  const [fasePerAvanzamento, setFasePerAvanzamento] = useState(null);
  const [nuovoAvanzamento, setNuovoAvanzamento] = useState(0);

  const commessa = dati.commesse.find((k) => k.id === id);

  if (!commessa) {
    return (
      <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-8 text-center">
        <p className="text-corrente text-ink-600">Questa commessa non esiste più nella demo.</p>
        <Link
          href={`${BASE}/commesse`}
          className="mt-3 inline-block text-corrente font-semibold text-brand-700 hover:text-brand-800"
        >
          Torna all&apos;elenco
        </Link>
      </div>
    );
  }

  const conti = contiCommessa(commessa, dati);
  const cliente = dati.clienti.find((c) => c.id === commessa.clienteId);
  const mie = (elenco) => elenco.filter((x) => x.commessaId === commessa.id);

  const righeOre = mie(dati.ore).sort((a, b) => b.data.localeCompare(a.data));
  const acquisti = mie(dati.acquisti).sort((a, b) => b.data.localeCompare(a.data));
  const varianti = mie(dati.varianti).sort((a, b) => b.data.localeCompare(a.data));
  const righeSal = mie(dati.sal).sort((a, b) => b.data.localeCompare(a.data));
  const documenti = mie(dati.documenti);

  const nomeSquadra = (idSquadra) =>
    dati.squadre.find((s) => s.id === idSquadra)?.nome || "Squadra";

  /** Sposta l'avanzamento di una fase: è il gesto che il capocantiere fa davvero. */
  const salvaAvanzamento = () => {
    const fasi = commessa.fasi.map((f) =>
      f.nome === fasePerAvanzamento ? { ...f, avanzamento: Number(nuovoAvanzamento) } : f,
    );
    aggiorna("commesse", commessa.id, { fasi });
    setFasePerAvanzamento(null);
  };

  return (
    <>
      {/* ------------------------------------------------------ testata */}
      <Link
        href={`${BASE}/commesse`}
        className="mb-4 inline-flex items-center gap-1.5 text-piccolo font-semibold text-ink-500 hover:text-ink-900"
      >
        <Icona misura="sm" nome="ArrowLeft" className="size-3.5" />
        Tutte le commesse
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-mini font-semibold text-ink-500">
              {commessa.numero}
            </span>
            <StatoCommessa stato={commessa.stato} />
            {commessa.stato !== "in_preventivo" ? <Salute conti={conti} /> : null}
          </div>
          <h1 className="mt-1.5 text-t2 font-bold text-ink-900">{commessa.titolo}</h1>
          <p className="mt-1 text-corrente text-ink-500">
            {cliente?.nome} · {commessa.indirizzo}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-mini text-ink-500">Consegna prevista</p>
          <p className="text-testo font-bold text-ink-900">
            {commessa.finePrevista ? dataBreve(commessa.finePrevista) : "da definire"}
          </p>
          {commessa.inizio ? (
            <p className="mt-0.5 text-mini text-ink-500">aperto il {dataBreve(commessa.inizio)}</p>
          ) : null}
        </div>
      </div>

      {/* -------------------------------------------------------- conti */}
      <RiepilogoCommessa conti={conti} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* -------------------------------------------------- le fasi */}
        <Pannello>
          <TitoloPannello
            testo="Fasi di lavorazione"
            nota={`Avanzamento complessivo ${conti.avanzamento}%. Ogni fase pesa in modo diverso sul totale.`}
          />
          <ul className="divide-y divide-line-soft">
            {commessa.fasi.map((f) => (
              <li key={f.nome} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="min-w-0 text-corrente font-medium text-ink-900">{f.nome}</p>
                  <span className="shrink-0 text-mini text-ink-500">peso {f.peso}%</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <BarraAvanzamento valore={f.avanzamento} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFasePerAvanzamento(f.nome);
                      setNuovoAvanzamento(f.avanzamento);
                    }}
                    data-comando
                    className="flex h-8 shrink-0 items-center rounded-[var(--radius-controllo)] px-2.5 text-mini font-semibold text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
                  >
                    Aggiorna
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Pannello>

        {/* ---------------------------------------------- stato lavori */}
        <Pannello>
          <TitoloPannello
            testo="Cosa è già stato chiesto al cliente"
            nota="Il SAL nasce dall'avanzamento, non da un foglio a parte."
          />
          <dl className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-corrente text-ink-500">Lavoro prodotto</dt>
              <dd className="text-corrente font-semibold tabular-nums text-ink-900">
                {euro(conti.prodotto)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-corrente text-ink-500">Già fatturato</dt>
              <dd className="text-corrente font-semibold tabular-nums text-ink-900">
                {euro(conti.fatturato)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
              <dt className="text-corrente font-bold text-ink-900">Da mettere in un SAL</dt>
              <dd
                className={`text-testo font-bold tabular-nums ${
                  conti.daFatturare > 0 ? "text-amber-700" : "text-brand-700"
                }`}
              >
                {euro(conti.daFatturare)}
              </dd>
            </div>
            {commessa.ritenutaGaranzia ? (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-piccolo text-ink-500">
                  Ritenuta a garanzia {commessa.ritenutaGaranzia}%
                </dt>
                <dd className="text-piccolo tabular-nums text-ink-600">{euro(conti.ritenuta)}</dd>
              </div>
            ) : null}
          </dl>

          {righeSal.length ? (
            <ul className="mt-4 divide-y divide-line-soft border-t border-line-soft pt-1">
              {righeSal.map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block text-corrente text-ink-900">{q.numero}</span>
                    <span className="block text-mini text-ink-500">
                      {dataBreve(q.data)} · al {q.percentuale}%
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-corrente font-medium tabular-nums text-ink-900">
                      {euro(q.importo)}
                    </span>
                    <span
                      className={`block text-mini font-semibold ${
                        q.fatturato ? "text-brand-700" : "text-amber-700"
                      }`}
                    >
                      {q.fatturato ? "fatturato" : "da fatturare"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 border-t border-line-soft pt-4 text-corrente text-ink-500">
              Nessuno stato di avanzamento emesso.
            </p>
          )}

          <Link
            href={`${BASE}/avanzamento`}
            className="mt-4 inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
          >
            Vai all&apos;avanzamento
            <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
          </Link>
        </Pannello>
      </div>

      {/* ----------------------------------------------------- varianti */}
      <div className="mt-4">
        <Pannello>
          <TitoloPannello
            testo="Varianti"
            nota="Quello che è stato fatto in più rispetto al contratto."
          >
            <Link
              href={`${BASE}/varianti`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Gestisci le varianti
            </Link>
          </TitoloPannello>

          {varianti.length ? (
            <ul className="divide-y divide-line-soft">
              {varianti.map((v) => (
                <li key={v.id} className="flex flex-wrap items-start gap-x-4 gap-y-2 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-corrente font-medium text-ink-900">{v.titolo}</p>
                      <StatoVariante stato={v.stato} />
                    </div>
                    <p className="mt-1 text-piccolo leading-relaxed text-ink-500">
                      {v.descrizione}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-corrente font-semibold tabular-nums text-ink-900">
                      {euro(v.importo)}
                    </p>
                    <p className="text-mini text-ink-500">costo {euro(v.costoStimato)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-corrente text-ink-500">
              Nessuna variante su questo cantiere: il contratto è stato rispettato.
            </p>
          )}
        </Pannello>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ----------------------------------------------------- ore */}
        <Pannello>
          <TitoloPannello
            testo="Ore di squadra"
            nota={`${conti.oreTotali} ore per ${euro(conti.manodopera)} di costo aziendale.`}
          >
            <Link
              href={`${BASE}/ore`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Registra ore
            </Link>
          </TitoloPannello>

          {righeOre.length ? (
            <ul className="divide-y divide-line-soft">
              {righeOre.slice(0, 6).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-corrente text-ink-900">
                      {nomeSquadra(r.squadraId)}
                    </span>
                    <span className="block truncate text-mini text-ink-500">
                      {dataBreve(r.data)} · {r.fase}
                    </span>
                  </span>
                  <span className="shrink-0 text-corrente font-medium tabular-nums text-ink-900">
                    {r.ore} h
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-corrente text-ink-500">
              Nessuna ora registrata: il costo di questo cantiere sembra più basso del vero.
            </p>
          )}
          {righeOre.length > 6 ? (
            <p className="mt-3 text-mini text-ink-500">
              e altre {righeOre.length - 6} registrazioni.
            </p>
          ) : null}
        </Pannello>

        {/* ------------------------------------------------ acquisti */}
        <Pannello>
          <TitoloPannello
            testo="Materiali e subappalti"
            nota={`${euro(conti.materiali)} di materiali, ${euro(conti.subappalti)} di subappalti.`}
          >
            <Link
              href={`${BASE}/acquisti`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Tutti gli acquisti
            </Link>
          </TitoloPannello>

          {acquisti.length ? (
            <ul className="divide-y divide-line-soft">
              {acquisti.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate text-corrente text-ink-900">
                      {a.fornitore}
                    </span>
                    <span className="block truncate text-mini text-ink-500">
                      {a.descrizione} · {a.documento}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-corrente font-medium tabular-nums text-ink-900">
                      {euro(a.importo)}
                    </span>
                    {!a.fattura ? (
                      <span className="block text-mini font-semibold text-amber-700">
                        senza fattura
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-corrente text-ink-500">Nessun acquisto registrato.</p>
          )}
          {acquisti.length > 6 ? (
            <p className="mt-3 text-mini text-ink-500">e altre {acquisti.length - 6} righe.</p>
          ) : null}
        </Pannello>
      </div>

      {/* --------------------------------------------------- documenti */}
      <div className="mt-4">
        <Pannello>
          <TitoloPannello
            testo="Documenti del cantiere"
            nota="Contratto, pratiche, sicurezza, foto: attaccati alla commessa, non in una cartella."
          >
            <Link
              href={`${BASE}/documenti`}
              className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
            >
              Archivio documenti
            </Link>
          </TitoloPannello>

          {documenti.length ? (
            <ul className="divide-y divide-line-soft">
              {documenti.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="flex min-w-0 items-start gap-2.5">
                    <Icona misura="sm" nome="FileStack" className="mt-0.5 shrink-0 text-ink-400" />
                    <span className="min-w-0">
                      <span className="block truncate text-corrente text-ink-900">{d.nome}</span>
                      <span className="block text-mini text-ink-500">{d.tipo}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-mini text-ink-500">
                    {dataBreve(d.caricatoIl)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-corrente text-ink-500">
              Nessun documento collegato a questo cantiere.
            </p>
          )}
        </Pannello>
      </div>

      {/* --------------------------------------- modale: sposta la fase */}
      <ModaleDemo
        aperta={Boolean(fasePerAvanzamento)}
        titolo="Aggiorna l'avanzamento"
        onChiudi={() => setFasePerAvanzamento(null)}
      >
        <p className="mb-4 text-corrente leading-relaxed text-ink-600">
          {fasePerAvanzamento}. Spostando questa percentuale cambiano il valore prodotto e il
          margine del cantiere: è per questo che il capocantiere la aggiorna ogni venerdì.
        </p>

        <CampoDemo etichetta={`Avanzamento: ${nuovoAvanzamento}%`}>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={nuovoAvanzamento}
            onChange={(e) => setNuovoAvanzamento(e.target.value)}
            className="h-11 w-full accent-[var(--color-brand-600)]"
          />
        </CampoDemo>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setFasePerAvanzamento(null)}
            data-comando
            className="flex h-11 items-center rounded-[var(--radius-controllo)] px-4 text-corrente font-medium text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={salvaAvanzamento}
            data-comando
            className="flex h-11 items-center rounded-[var(--radius-controllo)] bg-brand-600 px-5 text-corrente font-semibold text-white hover:bg-brand-700"
          >
            Salva
          </button>
        </div>
      </ModaleDemo>
    </>
  );
}
