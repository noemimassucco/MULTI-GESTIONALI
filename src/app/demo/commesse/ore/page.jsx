"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDemo, dataBreve, euro, giorniDaOggi } from "@/components/demo/StatoDemo";
import { toast } from "sonner";
import {
  IntestazioneDemo,
  KpiDemo,
  ModaleDemo,
  CampoDemo,
  FiltriDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import TabellaOrdinabile from "@/components/ui/TabellaOrdinabile";
import { schemaOre } from "@/lib/schemi-demo";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

const MODULO_VUOTO = { commessaId: "", squadraId: "", fase: "", ore: "" };

/** Le ore: la voce di costo che decide se un cantiere guadagna. */
export default function PaginaOre() {
  const { dati, aggiungi } = useDemo();
  const [filtro, setFiltro] = useState("");
  const [moduloAperto, setModuloAperto] = useState(false);

  /* Il modulo lo tiene react-hook-form, le regole restano in Zod. */
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaOre),
    defaultValues: MODULO_VUOTO,
    mode: "onTouched",
  });
  const scelte = useWatch({ control });

  const commessa = (id) => dati.commesse.find((k) => k.id === id);
  const squadra = (id) => dati.squadre.find((s) => s.id === id);

  const cantieriAperti = dati.commesse.filter((k) => k.stato === "in_corso");

  const righe = [...dati.ore]
    .filter((r) => !filtro || r.commessaId === filtro)
    .sort((a, b) => b.data.localeCompare(a.data));

  const costoRiga = (r) => r.ore * (squadra(r.squadraId)?.costoOrario || 0);

  /* Il mese in corso: è il numero che il titolare guarda per primo. */
  const ultimi30 = dati.ore.filter((r) => giorniDaOggi(r.data) >= -30);
  const oreMese = ultimi30.reduce((s, r) => s + r.ore, 0);
  const costoMese = ultimi30.reduce((s, r) => s + costoRiga(r), 0);

  const oreTotali = righe.reduce((s, r) => s + r.ore, 0);
  const costoTotale = righe.reduce((s, r) => s + costoRiga(r), 0);

  /* Da quanto non si registra niente su ogni cantiere aperto. */
  const scoperti = cantieriAperti
    .map((k) => {
      const sue = dati.ore.filter((r) => r.commessaId === k.id);
      const ultima = [...sue].sort((a, b) => b.data.localeCompare(a.data))[0];
      return { k, giorni: ultima ? -giorniDaOggi(ultima.data) : null };
    })
    .filter(({ giorni: g }) => g === null || g > 10);

  const fasiDisponibili = scelte.commessaId ? commessa(scelte.commessaId)?.fasi || [] : [];

  /* Anteprima del costo mentre si scrive: è il punto della schermata. */
  const costoInCorso =
    scelte.squadraId && Number(scelte.ore) > 0
      ? Number(scelte.ore) * (squadra(scelte.squadraId)?.costoOrario || 0)
      : 0;

  const chiudiModulo = () => {
    reset(MODULO_VUOTO);
    setModuloAperto(false);
  };

  /* Arriva qui solo quando Zod ha detto di sì. */
  const salva = (valori) => {
    const costo = valori.ore * (squadra(valori.squadraId)?.costoOrario || 0);
    aggiungi("ore", {
      commessaId: valori.commessaId,
      squadraId: valori.squadraId,
      ore: valori.ore,
      fase: valori.fase || commessa(valori.commessaId)?.fasi?.[0]?.nome || "",
      data: new Date().toISOString().slice(0, 10),
    });
    toast.success(`${valori.ore} ore registrate`, {
      description: `${euro(costo)} entrano subito nel costo di ${commessa(valori.commessaId)?.numero}.`,
    });
    chiudiModulo();
  };

  const vuoto = "Nessuna ora registrata su questo cantiere.";

  const colonne = [
    {
      chiave: "data",
      testo: "Data",
      valore: (r) => r.data,
      cella: (r) => dataBreve(r.data),
      classiCella: "whitespace-nowrap text-piccolo text-ink-600",
    },
    {
      chiave: "cantiere",
      testo: "Cantiere",
      valore: (r) => commessa(r.commessaId)?.numero || "",
      cella: (r) => {
        const k = commessa(r.commessaId);
        return k ? (
          <Link href={`${BASE}/commesse/${k.id}`} className="block min-w-0">
            <span className="block font-mono text-mini text-ink-500">{k.numero}</span>
            <span className="block truncate text-corrente text-ink-900">{k.titolo}</span>
          </Link>
        ) : (
          <span className="text-piccolo text-ink-500">—</span>
        );
      },
    },
    {
      chiave: "squadra",
      testo: "Squadra",
      valore: (r) => squadra(r.squadraId)?.nome || "",
      classiCella: "text-piccolo text-ink-700",
    },
    { chiave: "fase", testo: "Fase", valore: (r) => r.fase, classiCella: "text-piccolo text-ink-600" },
    {
      chiave: "ore",
      testo: "Ore",
      valore: (r) => r.ore,
      cella: (r) => `${r.ore} h`,
      classiCella: "whitespace-nowrap text-corrente font-semibold tabular-nums text-ink-900",
    },
    {
      chiave: "costo",
      testo: "Costo",
      valore: (r) => costoRiga(r),
      cella: (r) => euro(costoRiga(r)),
      classiCella: "whitespace-nowrap text-piccolo tabular-nums text-ink-700",
    },
  ];

  return (
    <>
      <IntestazioneDemo
        titolo="Ore di squadra"
        sottotitolo="Ogni ora ha un costo aziendale: finché non è registrata, il cantiere sembra andare meglio di così."
      >
        <button
          type="button"
          onClick={() => setModuloAperto(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-sole-500 px-4 text-piccolo font-semibold text-ink-900 hover:bg-sole-400"
        >
          <Icona misura="sm" nome="Plus" className="size-3.5" />
          Registra ore
        </button>
      </IntestazioneDemo>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiDemo etichetta="Ore ultimi 30 giorni" valore={`${oreMese} h`} nota="su tutti i cantieri" />
        <KpiDemo etichetta="Costo ultimi 30 giorni" valore={euro(costoMese)} nota="manodopera aziendale" />
        <KpiDemo
          etichetta="Cantieri scoperti"
          valore={scoperti.length}
          nota={scoperti.length ? "senza registrazioni recenti" : "tutti aggiornati"}
          tono={scoperti.length ? "allerta" : "ok"}
        />
        <KpiDemo
          etichetta="Squadre"
          valore={dati.squadre.length}
          nota={`${dati.squadre.reduce((s, q) => s + q.persone, 0)} persone in cantiere`}
        />
      </div>

      {scoperti.length ? (
        <div className="mt-3 rounded-[var(--radius-scheda)] border border-sole-200 bg-sole-50 p-4">
          <p className="text-corrente font-bold text-ink-900">
            Su {scoperti.length === 1 ? "un cantiere" : `${scoperti.length} cantieri`} non si
            registrano ore da più di dieci giorni
          </p>
          <ul className="mt-2 space-y-1">
            {scoperti.map(({ k, giorni: g }) => (
              <li key={k.id} className="text-corrente text-ink-700">
                <Link
                  href={`${BASE}/commesse/${k.id}`}
                  className="font-medium text-ink-900 hover:text-brand-700"
                >
                  {k.numero} — {k.titolo}
                </Link>
                <span className="text-ink-600">
                  {" "}
                  · {g === null ? "nessuna ora registrata" : `ultima registrazione ${g} giorni fa`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* -------------------------------------------------- le squadre */}
      <section className="mt-4 rounded-[var(--radius-scheda)] border border-line bg-white">
        <header className="border-b border-line-soft px-5 py-3.5">
          <h2 className="text-testo font-bold text-ink-900">Le squadre</h2>
          <p className="mt-1 text-piccolo text-ink-500">
            Il costo orario è quello aziendale: paga, contributi e mezzi. Non la busta paga.
          </p>
        </header>
        <ul className="grid grid-cols-1 divide-y divide-line-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {dati.squadre.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-piccolo font-bold text-sole-400">
                {s.iniziali}
              </span>
              <div className="min-w-0">
                <p className="truncate text-corrente font-semibold text-ink-900">{s.nome}</p>
                <p className="truncate text-mini text-ink-500">
                  {s.capo} · {s.persone} persone · {euro(s.costoOrario)}/h
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------- registrazioni */}
      <div className="mb-4 mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-corrente text-ink-600">
          {oreTotali} ore registrate ·{" "}
          <span className="font-semibold text-ink-900">{euro(costoTotale)}</span> di costo
        </p>
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti i cantieri", conteggio: dati.ore.length },
            ...cantieriAperti.map((k) => ({
              valore: k.id,
              testo: k.numero,
              conteggio: dati.ore.filter((r) => r.commessaId === k.id).length,
            })),
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <TabellaOrdinabile righe={righe} chiaveIniziale="data" colonne={colonne} vuota={vuoto} />

      {/* --------------------------------------------- modale nuove ore */}
      <ModaleDemo aperta={moduloAperto} titolo="Registra le ore" onChiudi={chiudiModulo}>
        <form onSubmit={handleSubmit(salva)} noValidate>
          <div className="space-y-4">
            <CampoDemo etichetta="Cantiere" errore={errors.commessaId?.message}>
              <select {...register("commessaId")} className={classiInputDemo}>
                <option value="">Scegli il cantiere…</option>
                {cantieriAperti.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.numero} — {k.titolo}
                  </option>
                ))}
              </select>
            </CampoDemo>

            <CampoDemo etichetta="Squadra" errore={errors.squadraId?.message}>
              <select {...register("squadraId")} className={classiInputDemo}>
                <option value="">Scegli la squadra…</option>
                {dati.squadre.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} — {euro(s.costoOrario)}/h
                  </option>
                ))}
              </select>
            </CampoDemo>

            {fasiDisponibili.length ? (
              <CampoDemo etichetta="Fase" errore={errors.fase?.message}>
                <select {...register("fase")} className={classiInputDemo}>
                  {fasiDisponibili.map((f) => (
                    <option key={f.nome} value={f.nome}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </CampoDemo>
            ) : null}

            <CampoDemo etichetta="Ore uomo della settimana" errore={errors.ore?.message}>
              <input
                type="number"
                min="0"
                step="4"
                {...register("ore")}
                placeholder="Es. 96"
                className={classiInputDemo}
              />
            </CampoDemo>

            {costoInCorso > 0 ? (
              <p className="rounded-[var(--radius-controllo)] bg-surface-alt px-4 py-3 text-corrente text-ink-700">
                Costo che entra nel cantiere:{" "}
                <strong className="font-bold text-ink-900">{euro(costoInCorso)}</strong>
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={chiudiModulo}
              data-comando
              className="flex h-11 items-center rounded-[var(--radius-controllo)] px-4 text-corrente font-medium text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              data-comando
              className="flex h-11 items-center rounded-[var(--radius-controllo)] bg-brand-600 px-5 text-corrente font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-300"
            >
              Registra
            </button>
          </div>
        </form>
      </ModaleDemo>
    </>
  );
}
