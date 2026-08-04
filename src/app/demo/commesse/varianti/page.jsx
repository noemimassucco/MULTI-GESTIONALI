"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import {
  IntestazioneDemo,
  ModaleDemo,
  CampoDemo,
  classiInputDemo,
} from "@/components/demo/ElementiDemo";
import { StatoVariante } from "@/components/demo/ElementiCommesse";
import { schemaVariante } from "@/lib/schemi-demo";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/commesse";

/* L'ordine in cui vanno guardate: prima quelle che vi stanno costando. */
const PESO = { eseguita: 0, proposta: 1, approvata: 2, rifiutata: 3 };

const MODULO_VUOTO = {
  commessaId: "",
  titolo: "",
  descrizione: "",
  importo: "",
  costoStimato: "",
};

/** Le varianti: il lavoro in più, e chi lo deve pagare. */
export default function PaginaVarianti() {
  const { dati, aggiorna, aggiungi } = useDemo();
  const [moduloAperto, setModuloAperto] = useState(false);

  /* Il modulo lo tiene react-hook-form, le regole restano in Zod: così il
     messaggio d'errore è scritto in un posto solo. */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaVariante),
    defaultValues: MODULO_VUOTO,
    mode: "onTouched",
  });

  const commessa = (id) => dati.commesse.find((k) => k.id === id);
  const nomeCliente = (id) => dati.clienti.find((c) => c.id === id)?.nome || "—";

  const varianti = [...dati.varianti].sort((a, b) => {
    const p = (PESO[a.stato] ?? 9) - (PESO[b.stato] ?? 9);
    return p !== 0 ? p : a.data.localeCompare(b.data);
  });

  const scoperte = varianti.filter((v) => v.stato === "eseguita");
  const valoreScoperto = scoperte.reduce((s, v) => s + v.importo, 0);
  const costoScoperto = scoperte.reduce((s, v) => s + v.costoStimato, 0);

  const cantieriAperti = dati.commesse.filter(
    (k) => k.stato === "in_corso" || k.stato === "in_preventivo",
  );

  const chiudiModulo = () => {
    reset(MODULO_VUOTO);
    setModuloAperto(false);
  };

  /* Arriva qui solo quando Zod ha detto di sì: i valori sono già del tipo giusto. */
  const salva = (valori) => {
    aggiungi("varianti", {
      commessaId: valori.commessaId,
      titolo: valori.titolo,
      descrizione: valori.descrizione || "",
      importo: valori.importo,
      costoStimato: valori.costoStimato || Math.round(valori.importo * 0.7),
      data: new Date().toISOString().slice(0, 10),
      stato: "proposta",
    });
    toast.success("Variante proposta al cliente", {
      description: `${euro(valori.importo)} · finché non la approva non entra nel ricavo del cantiere.`,
    });
    chiudiModulo();
  };

  /** Il lavoro fatto senza carta diventa esigibile. */
  const approva = (v) => {
    aggiorna("varianti", v.id, { stato: "approvata" });
    toast.success("Variante approvata", {
      description: `${euro(v.importo)} entrano nel ricavo e nel prossimo stato di avanzamento.`,
    });
  };

  return (
    <>
      <IntestazioneDemo
        titolo="Varianti"
        sottotitolo="Il lavoro fatto in più che nessuno ha messo per iscritto."
      >
        <button
          type="button"
          onClick={() => setModuloAperto(true)}
          data-comando
          className="flex h-10 items-center gap-2 rounded-[var(--radius-controllo)] bg-accento-500 px-4 text-piccolo font-semibold text-ink-900 hover:bg-accento-400"
        >
          <Icona misura="sm" nome="Plus" className="size-3.5" />
          Nuova variante
        </button>
      </IntestazioneDemo>

      {/* ------------------------------------------- il buco, spiegato */}
      {scoperte.length ? (
        <div className="mb-5 rounded-[var(--radius-scheda)] border border-[#f2d9d6] bg-[#fbeceb] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-corrente font-bold text-critico">
                {scoperte.length === 1
                  ? "Un lavoro è già stato eseguito senza approvazione"
                  : `${scoperte.length} lavori sono già stati eseguiti senza approvazione`}
              </h2>
              <p className="mt-1.5 max-w-2xl text-corrente leading-relaxed text-critico">
                In cantiere si trova l&apos;imprevisto, si risolve e si va avanti: è il mestiere. Il
                problema è dopo, quando bisogna farselo pagare e non c&apos;è niente di scritto.
                Questi lavori vi sono costati {euro(costoScoperto)} in ore e materiali, e a oggi
                nessuno li deve.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-t1 font-bold leading-none text-critico">
                {euro(valoreScoperto)}
              </p>
              <p className="mt-1 text-mini font-medium text-critico">non esigibili</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-[var(--radius-scheda)] border border-brand-100 bg-brand-50 p-5">
          <h2 className="text-corrente font-bold text-brand-900">
            Nessun lavoro fuori contratto senza approvazione
          </h2>
          <p className="mt-1.5 max-w-2xl text-corrente leading-relaxed text-brand-800">
            Ogni cosa fatta in più è stata proposta, approvata o rifiutata. È la condizione in cui
            un cantiere dovrebbe sempre trovarsi.
          </p>
        </div>
      )}

      {/* ------------------------------------------------ l'elenco vero */}
      <ul className="space-y-3">
        {varianti.map((v) => {
          const k = commessa(v.commessaId);
          return (
            <li
              key={v.id}
              className={`rounded-[var(--radius-scheda)] border bg-white p-5 ${
                v.stato === "eseguita" ? "border-[#f2d9d6]" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatoVariante stato={v.stato} />
                    <span className="text-mini text-ink-500">{dataBreve(v.data)}</span>
                  </div>
                  <p className="mt-1.5 text-testo font-semibold text-ink-900">{v.titolo}</p>
                  {k ? (
                    <Link
                      href={`${BASE}/commesse/${k.id}`}
                      className="mt-0.5 inline-block text-mini text-ink-500 hover:text-brand-700"
                    >
                      {k.numero} · {k.titolo} · {nomeCliente(k.clienteId)}
                    </Link>
                  ) : null}
                  <p className="mt-2 max-w-2xl text-corrente leading-relaxed text-ink-600">
                    {v.descrizione}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-t3 font-bold leading-none text-ink-900">{euro(v.importo)}</p>
                  <p className="mt-1 text-mini text-ink-500">vi costa {euro(v.costoStimato)}</p>
                  <p
                    className={`mt-1 text-mini font-semibold ${
                      v.importo - v.costoStimato > 0 ? "text-brand-700" : "text-critico"
                    }`}
                  >
                    {euro(v.importo - v.costoStimato)} di margine
                  </p>
                </div>
              </div>

              {/* ------------------------------------------ i comandi */}
              {v.stato === "eseguita" ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-4">
                  <p className="mr-auto min-w-0 text-piccolo text-ink-600">
                    Mandare il documento adesso è ancora possibile. Fra sei mesi diventa una
                    discussione.
                  </p>
                  <button
                    type="button"
                    onClick={() => approva(v)}
                    data-comando
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-brand-600 px-4 text-piccolo font-semibold text-white hover:bg-brand-700"
                  >
                    <Icona misura="sm" nome="Check" className="size-3.5" />
                    Il cliente ha firmato
                  </button>
                </div>
              ) : null}

              {v.stato === "proposta" ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-4">
                  <p className="mr-auto min-w-0 text-piccolo text-ink-600">
                    Proposta al cliente, in attesa di risposta.
                  </p>
                  <button
                    type="button"
                    onClick={() => approva(v)}
                    data-comando
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-controllo)] bg-brand-600 px-4 text-piccolo font-semibold text-white hover:bg-brand-700"
                  >
                    <Icona misura="sm" nome="Check" className="size-3.5" />
                    Accettata
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      aggiorna("varianti", v.id, { stato: "rifiutata" });
                      toast("Variante rifiutata", {
                        description: "Resta nello storico del cantiere: serve a spiegare i tempi.",
                      });
                    }}
                    data-comando
                    className="flex h-10 shrink-0 items-center rounded-[var(--radius-controllo)] px-4 text-piccolo font-medium text-ink-600 ring-1 ring-inset ring-line hover:bg-surface-alt"
                  >
                    Rifiutata
                  </button>
                </div>
              ) : null}

              {v.stato === "approvata" ? (
                <p className="mt-4 flex items-center gap-2 border-t border-line-soft pt-4 text-piccolo font-medium text-brand-700">
                  <Icona misura="sm" nome="Check" className="size-3.5" />
                  Entra nel ricavo del cantiere e nel prossimo stato di avanzamento.
                </p>
              ) : null}
            </li>
          );
        })}

        {!varianti.length ? (
          <li className="rounded-[var(--radius-scheda)] border border-line bg-white px-6 py-12 text-center text-corrente text-ink-500">
            Nessuna variante registrata.
          </li>
        ) : null}
      </ul>

      {/* ------------------------------------------- modale nuova voce */}
      <ModaleDemo aperta={moduloAperto} titolo="Nuova variante" onChiudi={chiudiModulo}>
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

            <CampoDemo etichetta="Cosa è stato chiesto in più" errore={errors.titolo?.message}>
              <input
                type="text"
                {...register("titolo")}
                placeholder="Es. Rifacimento scarico non previsto"
                className={classiInputDemo}
              />
            </CampoDemo>

            <CampoDemo etichetta="Descrizione" errore={errors.descrizione?.message}>
              <textarea
                rows={3}
                {...register("descrizione")}
                placeholder="Com'è nata e cosa comporta."
                className="w-full rounded-[var(--radius-controllo)] border border-line bg-white px-3 py-2.5 text-corrente text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
              />
            </CampoDemo>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CampoDemo etichetta="Prezzo al cliente (€)" errore={errors.importo?.message}>
                <input type="number" min="0" {...register("importo")} className={classiInputDemo} />
              </CampoDemo>
              <CampoDemo etichetta="Costo per voi (€)" errore={errors.costoStimato?.message}>
                <input
                  type="number"
                  min="0"
                  {...register("costoStimato")}
                  placeholder="se vuoto, il 70%"
                  className={classiInputDemo}
                />
              </CampoDemo>
            </div>
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
              Proponi al cliente
            </button>
          </div>
        </form>
      </ModaleDemo>
    </>
  );
}
