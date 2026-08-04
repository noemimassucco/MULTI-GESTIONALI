"use client";

import { useCallback, useRef, useState } from "react";
import AnteprimaDashboard from "@/components/sito/AnteprimaDashboard";

/* ------------------------------------------------------------------ */
/*  Il lato "PRIMA": il disordine vero di un martedì mattina.          */
/*  Foglietti posizionati in percentuale così funzionano a ogni       */
/*  larghezza. Ruotati a mano, come sulla scrivania.                  */
/* ------------------------------------------------------------------ */

function Foglietto({ stile, ruota, tipo = "carta", children }) {
  const fondi = {
    carta: "bg-white border-[#ddd5c4]",
    giallo: "bg-[var(--foglietto-giallo)] border-[#e8d98f]",
    rosa: "bg-[var(--foglietto-rosa)] border-[#efc2ba]",
  };
  return (
    <div
      style={{ ...stile, rotate: `${ruota}deg` }}
      className={`absolute w-[168px] rounded-[3px] border px-3 py-2.5 shadow-[0_5px_14px_rgba(70,60,40,0.16)] sm:w-[188px] ${fondi[tipo]}`}
    >
      {children}
    </div>
  );
}

function Etichetta({ children }) {
  return (
    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#77704f]">
      {children}
    </p>
  );
}

function LatoPrima() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--carta-prima)]">
      {/* trama leggera da scrivania */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,105,80,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <span className="absolute left-4 top-4 rounded-full bg-ink-900/80 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-white">
        Oggi, martedì · 7:30
      </span>

      <Foglietto stile={{ left: "3%", top: "19%" }} ruota={-2.5}>
        <Etichetta>Ore operai — lun</Etichetta>
        <p className="text-mini leading-snug text-[#4a4438]">
          Rossi 8 · Bianchi 6 · Neri&nbsp;?
          <br />
          <span className="text-[#6e6650]">(chiedere a Marco)</span>
        </p>
      </Foglietto>

      <Foglietto stile={{ left: "20%", top: "48%" }} ruota={1.8} tipo="giallo">
        <p className="text-mini font-semibold leading-snug text-[#5c5230]">
          RICORDARSI caldaia
          <br />
          Via Milano — scaduta??
        </p>
      </Foglietto>

      <Foglietto stile={{ left: "42%", top: "12%" }} ruota={2.2}>
        <Etichetta>WhatsApp · 07:42</Etichetta>
        <p className="rounded-[10px] rounded-tl-[2px] bg-[#dcf2d0] px-2.5 py-1.5 text-mini leading-snug text-[#3c4a34]">
          «mandami la foto del quadro elettrico»
        </p>
      </Foglietto>

      <Foglietto stile={{ left: "56%", top: "56%" }} ruota={-1.6} tipo="rosa">
        <p className="text-mini font-semibold leading-snug text-[#7a4238]">
          FATTURARE??
          <br />
          Condominio Verdi — controllare
        </p>
      </Foglietto>

      <Foglietto stile={{ left: "68%", top: "24%" }} ruota={-2}>
        <Etichetta>Excel</Etichetta>
        <p className="break-all text-[11px] leading-snug text-[#4a4438]">
          cantieri_2026_def_
          <br />
          FINALE_ok(3).xlsx
        </p>
      </Foglietto>

      <Foglietto stile={{ left: "6%", top: "70%" }} ruota={1.4}>
        <Etichetta>Da richiamare</Etichetta>
        <p className="text-mini leading-snug text-[#4a4438]">
          sig.ra Conti 340 …
          <br />
          <span className="text-[#6e6650]">perdita bagno, urgente</span>
        </p>
      </Foglietto>

      <Foglietto stile={{ left: "82%", top: "68%" }} ruota={2.6} tipo="giallo">
        <p className="text-mini font-semibold leading-snug text-[#5c5230]">
          portare bolla
          <br />
          in ufficio!!
        </p>
      </Foglietto>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Il confronto trascinabile.                                         */
/* ------------------------------------------------------------------ */

/**
 * Prima/Dopo: a sinistra il lavoro com'è oggi, a destra lo stesso
 * martedì dentro il gestionale. La linea gialla si trascina (mouse,
 * dito o frecce della tastiera).
 */
export default function PrimaDopo() {
  const [pct, setPct] = useState(46);
  const [inTrascinamento, setInTrascinamento] = useState(false);
  const contenitore = useRef(null);

  const aggiorna = useCallback((clientX) => {
    const box = contenitore.current?.getBoundingClientRect();
    if (!box) return;
    const nuovo = ((clientX - box.left) / box.width) * 100;
    setPct(Math.min(92, Math.max(8, nuovo)));
  }, []);

  const giu = (e) => {
    e.preventDefault();
    setInTrascinamento(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    aggiorna(e.clientX);
  };

  return (
    <div
      ref={contenitore}
      onPointerMove={(e) => inTrascinamento && aggiorna(e.clientX)}
      onPointerUp={() => setInTrascinamento(false)}
      onPointerCancel={() => setInTrascinamento(false)}
      className="relative h-[400px] select-none overflow-hidden rounded-[var(--radius-scheda)] border border-line shadow-[var(--shadow-lift)] sm:h-[460px]"
    >
      {/* PRIMA — sotto, sempre a piena larghezza */}
      <LatoPrima />

      {/* DOPO — sopra, rivelato da destra */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
        <div className="absolute inset-0 bg-surface-alt p-3 sm:p-5">
          <span className="absolute right-4 top-4 z-10 rounded-full bg-brand-600 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-white">
            Con il gestionale
          </span>
          <div className="mx-auto h-full max-w-3xl overflow-hidden pt-8">
            <AnteprimaDashboard />
          </div>
        </div>
      </div>

      {/* La linea gialla: firma del marchio e maniglia del confronto */}
      <div
        onPointerDown={giu}
        style={{ left: `${pct}%` }}
        className="absolute inset-y-0 z-20 -ml-[22px] w-11 cursor-ew-resize touch-none"
        aria-hidden="true"
      >
        <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-sole-500" />
        <span
          className={`absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sole-500 text-ink-900 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-transform ${
            inTrascinamento ? "scale-110" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
          </svg>
        </span>
      </div>

      {/* Comando da tastiera, invisibile ma raggiungibile col Tab */}
      <input
        type="range"
        min="8"
        max="92"
        value={Math.round(pct)}
        onChange={(e) => setPct(Number(e.target.value))}
        aria-label="Confronto fra il lavoro di oggi e il gestionale: sposta la linea"
        className="sr-only"
      />
    </div>
  );
}
