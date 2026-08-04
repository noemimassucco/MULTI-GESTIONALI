"use client";

import { useState } from "react";
import Link from "next/link";
import { useDemo, dataBreve, euro } from "@/components/demo/StatoDemo";
import { IntestazioneDemo, RicercaDemo, FiltriDemo } from "@/components/demo/ElementiDemo";
import { StatoIntervento, totaleIntervento } from "@/components/demo/ElementiInterventi";
import Icona from "@/components/ui/Icona";

const BASE = "/demo/interventi";

/* Prima quello che è in mano ai tecnici, poi quello che è già archivio:
   in corso, programmati, e in fondo i chiusi dal più recente. */
function rango(i) {
  if (i.stato === "in_corso") return 0;
  if (i.stato === "programmato") return 1;
  return 2;
}

/** Elenco degli interventi: quelli aperti sopra, lo storico sotto. */
export default function PaginaInterventi() {
  const { dati } = useDemo();
  const [ricerca, setRicerca] = useState("");
  const [filtro, setFiltro] = useState("");

  const cliente = (id) => dati.clienti.find((c) => c.id === id);
  const tecnico = (id) => dati.tecnici.find((t) => t.id === id);

  const conta = (valore) =>
    dati.interventi.filter((i) => {
      if (valore === "fatturato") return i.fatturato;
      if (valore === "chiuso") return i.stato === "chiuso" && !i.fatturato;
      return i.stato === valore;
    }).length;

  const testo = ricerca.trim().toLowerCase();
  const filtrati = dati.interventi.filter((i) => {
    if (filtro === "fatturato" && !i.fatturato) return false;
    if (filtro === "chiuso" && (i.stato !== "chiuso" || i.fatturato)) return false;
    if ((filtro === "programmato" || filtro === "in_corso") && i.stato !== filtro) return false;
    if (!testo) return true;
    const nome = cliente(i.clienteId)?.nome || "";
    return (
      i.titolo.toLowerCase().includes(testo) ||
      i.numero.toLowerCase().includes(testo) ||
      nome.toLowerCase().includes(testo)
    );
  });

  const ordinati = [...filtrati].sort((a, b) => {
    const ra = rango(a);
    const rb = rango(b);
    if (ra !== rb) return ra - rb;
    const quando = `${a.data} ${a.ora}`.localeCompare(`${b.data} ${b.ora}`);
    return ra === 2 ? -quando : quando;
  });

  const aperti = dati.interventi.filter((i) => i.stato !== "chiuso");

  return (
    <>
      <IntestazioneDemo
        titolo="Interventi"
        sottotitolo={
          aperti.length
            ? `${aperti.length} ancora aperti, su ${dati.interventi.length} in elenco`
            : `Nessun intervento aperto: tutti e ${dati.interventi.length} sono chiusi`
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RicercaDemo
          valore={ricerca}
          onCambia={setRicerca}
          placeholder="Cerca per titolo, numero o cliente…"
        />
        <FiltriDemo
          voci={[
            { valore: "", testo: "Tutti", conteggio: dati.interventi.length },
            { valore: "programmato", testo: "Programmati", conteggio: conta("programmato") },
            { valore: "in_corso", testo: "In corso", conteggio: conta("in_corso") },
            { valore: "chiuso", testo: "Chiusi", conteggio: conta("chiuso") },
            { valore: "fatturato", testo: "Fatturati", conteggio: conta("fatturato") },
          ]}
          attivo={filtro}
          onScegli={setFiltro}
        />
      </div>

      <div className="rounded-[var(--radius-scheda)] border border-line bg-white">
        <ul className="divide-y divide-line-soft">
          {ordinati.map((i) => {
            const c = cliente(i.clienteId);
            const t = tecnico(i.tecnicoId);
            const chiuso = i.stato === "chiuso";
            return (
              <li key={i.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-mini text-ink-500">{i.numero}</p>
                  <Link
                    href={`${BASE}/interventi/${i.id}`}
                    className="block truncate text-corrente font-bold text-ink-900 hover:text-brand-700"
                  >
                    {i.titolo}
                  </Link>
                  <p className="truncate text-mini text-ink-500">
                    {c?.nome || "—"} · {t?.nome || "Da assegnare"} · {dataBreve(i.data)} alle {i.ora}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {chiuso ? (
                    <span className="text-corrente font-semibold text-ink-900">
                      {euro(totaleIntervento(i).totale)}
                    </span>
                  ) : null}
                  <StatoIntervento intervento={i} />
                  <Icona misura="sm" nome="ChevronRight" className="size-3.5 text-ink-400" />
                </div>
              </li>
            );
          })}
          {!ordinati.length ? (
            <li className="px-5 py-10 text-center text-corrente text-ink-500">
              {testo || filtro
                ? "Nessun intervento corrisponde alla ricerca. Prova a cambiare filtro o parola."
                : "Nessun intervento in elenco: si creano programmando una richiesta."}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  );
}
