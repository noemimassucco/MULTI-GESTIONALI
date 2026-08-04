"use client";

import Link from "next/link";
import { useDemo } from "@/components/demo/StatoDemo";
import Icona from "@/components/ui/Icona";

/* ------------------------------------------------------------------ */
/*  L'assistente: non risponde a domande, guarda i dati e dice quello  */
/*  che vede. Le regole arrivano da fuori (src/lib/regole-assistente), */
/*  qui c'è solo il modo di mostrarle.                                 */
/* ------------------------------------------------------------------ */

const PESO = { alta: 0, media: 1, info: 2 };

const TONI = {
  alta: {
    icona: "AlertTriangle",
    riquadro: "bg-red-50 text-red-700",
    valore: "text-red-700",
  },
  media: {
    icona: "Clock",
    riquadro: "bg-sole-100 text-amber-700",
    valore: "text-amber-700",
  },
  info: {
    icona: "Sparkles",
    riquadro: "bg-brand-50 text-brand-700",
    valore: "text-brand-700",
  },
};

/** Una cosa notata: cosa, perché, quanto vale, dove si va a sistemarla. */
function RigaAvviso({ avviso }) {
  const tono = TONI[avviso.gravita] || TONI.info;
  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 px-4 py-4 sm:px-5">
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] ${tono.riquadro}`}
      >
        <Icona misura="sm" nome={tono.icona} className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-corrente font-bold text-ink-900">{avviso.titolo}</p>
        <p className="mt-1 text-piccolo leading-relaxed text-ink-600">{avviso.testo}</p>
        {avviso.azione ? (
          <Link
            href={avviso.azione.href}
            className="mt-2 inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
          >
            {avviso.azione.testo}
            <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
          </Link>
        ) : null}
      </div>

      {avviso.valore ? (
        <span className={`ml-auto shrink-0 text-t3 font-bold leading-none ${tono.valore}`}>
          {avviso.valore}
        </span>
      ) : null}
    </li>
  );
}

/**
 * Pannello dell'assistente.
 * `regole`: funzioni pure (dati) => avviso | null.
 */
export default function Assistente({ regole = [] }) {
  const { dati } = useDemo();

  const avvisi = regole
    .map((regola) => regola(dati))
    .filter(Boolean)
    .sort((a, b) => (PESO[a.gravita] ?? 2) - (PESO[b.gravita] ?? 2));

  return (
    <section className="mt-4 rounded-[var(--radius-scheda)] border border-line bg-white">
      <header className="border-b border-line-soft px-4 py-4 sm:px-5">
        <p className="occhiello text-brand-700">Suggerimenti</p>
        <h2 className="mt-1 text-t3 font-bold text-ink-900">L&apos;assistente ha notato</h2>
        <p className="mt-1 max-w-2xl text-piccolo leading-relaxed text-ink-500">
          Nessuno ha chiesto niente: sono cose che il gestionale vede da solo guardando i tuoi dati.
        </p>
      </header>

      {avvisi.length ? (
        <ul className="divide-y divide-line-soft">
          {avvisi.map((a) => (
            <RigaAvviso key={a.id} avviso={a} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-3 px-4 py-6 sm:px-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-50 text-brand-700">
            <Icona misura="sm" nome="CheckCircle2" className="size-4" />
          </span>
          <p className="text-corrente text-ink-600">
            Per ora non c&apos;è niente che richieda attenzione.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line-soft bg-surface-alt px-4 py-3 sm:px-5">
        <p className="text-mini text-ink-500">
          Questi suggerimenti nascono da regole scritte sul tuo modo di lavorare: si aggiungono e si
          tolgono.
        </p>
        <Link
          href="/personalizzazioni"
          className="inline-flex shrink-0 items-center gap-1.5 text-mini font-semibold text-brand-700 hover:text-brand-800"
        >
          Come si scrivono le regole
          <Icona misura="sm" nome="ArrowRight" className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
