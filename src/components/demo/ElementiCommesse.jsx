"use client";

import Icona from "@/components/ui/Icona";
import { euro } from "@/components/demo/StatoDemo";
import { MARGINE_ATTESO } from "@/data/demo/commesse";

/* ------------------------------------------------------------------ */
/*  I pezzi propri del mestiere: avanzamento, stati del cantiere e —   */
/*  soprattutto — il conto vero di quanto una commessa sta rendendo.   */
/*                                                                     */
/*  Questo file è il cuore della base: tutte le pagine leggono da qui, */
/*  così il numero del margine è uno solo e non si contraddice mai.    */
/* ------------------------------------------------------------------ */

/**
 * Avanzamento della commessa: media delle fasi pesata sul peso di ognuna.
 * @returns {number} 0-100
 */
export function avanzamentoDi(commessa) {
  const fasi = commessa.fasi || [];
  const pesoTotale = fasi.reduce((s, f) => s + f.peso, 0);
  if (!pesoTotale) return 0;
  return Math.round(fasi.reduce((s, f) => s + f.peso * f.avanzamento, 0) / pesoTotale);
}

/**
 * Il conto della commessa, come lo farebbe il titolare la domenica sera.
 *
 * Ricavo  = contratto + varianti che il cliente ha approvato
 * Costo   = ore × costo orario della squadra + materiali + subappalti
 * Prodotto= quanto vale il lavoro realmente eseguito, all'avanzamento di oggi
 *
 * Le varianti eseguite ma non approvate NON entrano nel ricavo: il costo
 * l'abbiamo già sostenuto, l'incasso non è garantito da niente. È
 * esattamente il modo in cui un cantiere perde margine senza accorgersene.
 *
 * @param {object} commessa
 * @param {object} dati stato della demo
 */
export function contiCommessa(commessa, dati) {
  const mie = (elenco) => (elenco || []).filter((x) => x.commessaId === commessa.id);

  const costoSquadra = (id) => dati.squadre?.find((s) => s.id === id)?.costoOrario || 0;

  const righeOre = mie(dati.ore);
  const oreTotali = righeOre.reduce((s, r) => s + r.ore, 0);
  const manodopera = righeOre.reduce((s, r) => s + r.ore * costoSquadra(r.squadraId), 0);

  const acquisti = mie(dati.acquisti);
  const materiali = acquisti.filter((a) => a.tipo === "materiale").reduce((s, a) => s + a.importo, 0);
  const subappalti = acquisti.filter((a) => a.tipo === "subappalto").reduce((s, a) => s + a.importo, 0);

  const varianti = mie(dati.varianti);
  const variantiApprovate = varianti.filter((v) => v.stato === "approvata");
  const variantiScoperte = varianti.filter((v) => v.stato === "eseguita");

  const costo = manodopera + materiali + subappalti;
  const ricavo = commessa.importoContratto + variantiApprovate.reduce((s, v) => s + v.importo, 0);

  const avanzamento = avanzamentoDi(commessa);
  const prodotto = Math.round((ricavo * avanzamento) / 100);

  const righeSal = mie(dati.sal);
  const fatturato = righeSal.filter((q) => q.fatturato).reduce((s, q) => s + q.importo, 0);
  const salDaFatturare = righeSal.filter((q) => !q.fatturato).reduce((s, q) => s + q.importo, 0);

  /* Il margine che si calcola in ufficio: contratto meno quello che è
     uscito finora. A metà cantiere è sempre bello, e non vuol dire niente. */
  const margine = ricavo - costo;
  const marginePct = ricavo ? Math.round((margine / ricavo) * 100) : 0;

  /* Il margine vero: se il cantiere continua a costare al ritmo di adesso,
     quanto sarà costato alla fine. Sotto il 10% di avanzamento la
     proiezione non ha senso e non la facciamo. */
  const proiettabile = avanzamento >= 10;
  const costoAFinire = proiettabile ? Math.round(costo / (avanzamento / 100)) : costo;
  const marginePrevisto = ricavo - costoAFinire;
  const marginePrevistoPct = ricavo ? Math.round((marginePrevisto / ricavo) * 100) : 0;

  /* Quanto sto spendendo rispetto a quanto ho prodotto: sopra 1 vuol dire
     che il cantiere sta consumando più di quello che ha realizzato. */
  const consumo = prodotto ? costo / prodotto : 0;

  return {
    oreTotali,
    manodopera,
    materiali,
    subappalti,
    costo,
    ricavo,
    avanzamento,
    prodotto,
    fatturato,
    salDaFatturare,
    daFatturare: Math.max(0, prodotto - fatturato),
    margine,
    marginePct,
    proiettabile,
    costoAFinire,
    marginePrevisto,
    marginePrevistoPct,
    consumo,
    variantiScoperte,
    valoreScoperto: variantiScoperte.reduce((s, v) => s + v.importo, 0),
    costoScoperto: variantiScoperte.reduce((s, v) => s + v.costoStimato, 0),
    ritenuta: Math.round((fatturato * (commessa.ritenutaGaranzia || 0)) / 100),
  };
}

/**
 * Come sta andando: il semaforo guarda il margine PREVISTO, non quello
 * che risulta oggi. È tutta la differenza.
 */
export function salute(conti) {
  const pct = conti.marginePrevistoPct;
  if (pct < 0) return "perdita";
  if (pct < MARGINE_ATTESO * 0.5) return "critico";
  if (pct < MARGINE_ATTESO) return "attenzione";
  return "buono";
}

const SALUTE = {
  perdita: { testo: "In perdita", classi: "bg-[#fbeceb] text-critico ring-[#f2d9d6]", icona: "TrendingDown" },
  critico: { testo: "Margine eroso", classi: "bg-[#fbeceb] text-critico ring-[#f2d9d6]", icona: "AlertTriangle" },
  attenzione: { testo: "Sotto le attese", classi: "bg-accento-50 text-accento-700 ring-accento-100", icona: "AlertTriangle" },
  buono: { testo: "In linea", classi: "bg-brand-50 text-brand-800 ring-brand-100", icona: "Check" },
};

/** Pastiglia del semaforo economico. */
export function Salute({ conti }) {
  const s = SALUTE[salute(conti)];
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${s.classi}`}
    >
      <Icona misura="sm" nome={s.icona} className="size-3" />
      {s.testo}
    </span>
  );
}

const STATI = {
  in_preventivo: { testo: "In preventivo", classi: "bg-surface-alt text-ink-700 ring-line" },
  in_corso: { testo: "Cantiere aperto", classi: "bg-accento-50 text-accento-700 ring-accento-100" },
  consegnata: { testo: "Consegnata", classi: "bg-brand-50 text-brand-700 ring-brand-100" },
  chiusa: { testo: "Chiusa", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
};

/** Stato del cantiere. */
export function StatoCommessa({ stato }) {
  const s = STATI[stato] || STATI.in_preventivo;
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${s.classi}`}
    >
      {s.testo}
    </span>
  );
}

const STATI_VARIANTE = {
  proposta: { testo: "Proposta", classi: "bg-surface-alt text-ink-700 ring-line" },
  eseguita: { testo: "Fatta, non approvata", classi: "bg-[#fbeceb] text-critico ring-[#f2d9d6]" },
  approvata: { testo: "Approvata", classi: "bg-brand-50 text-brand-800 ring-brand-100" },
  rifiutata: { testo: "Rifiutata", classi: "bg-surface-alt text-ink-600 ring-line" },
};

export function StatoVariante({ stato }) {
  const s = STATI_VARIANTE[stato] || STATI_VARIANTE.proposta;
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2 text-mini font-semibold leading-none ring-1 ring-inset ${s.classi}`}
    >
      {s.testo}
    </span>
  );
}

/** Barra di avanzamento con la percentuale accanto. */
export function BarraAvanzamento({ valore, tono = "brand" }) {
  const colori = { brand: "bg-brand-600", sole: "bg-accento-500", rosso: "bg-critico" };
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
        <div
          className={`h-full rounded-full ${colori[tono] || colori.brand}`}
          style={{ width: `${Math.min(100, Math.max(0, valore))}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-mini font-semibold tabular-nums text-ink-600">
        {valore}%
      </span>
    </div>
  );
}

/**
 * Il riquadro dei conti, e il motivo per cui esiste questa base.
 *
 * A sinistra il margine come lo calcola l'ufficio: contratto meno quello
 * che è uscito finora. A metà cantiere è sempre bello.
 * A destra lo stesso cantiere proiettato al ritmo di spesa di adesso: è
 * il numero che si scoprirebbe a fine lavori, quando non si può più fare
 * niente. Vederli affiancati è tutto il valore del gestionale.
 */
export function RiepilogoCommessa({ conti }) {
  const stato = salute(conti);
  const tono =
    stato === "buono" ? "text-brand-700" : stato === "attenzione" ? "text-accento-600" : "text-critico";
  const sfondo =
    stato === "buono" ? "bg-brand-50" : stato === "attenzione" ? "bg-accento-50" : "bg-[#fbeceb]";

  const voci = [
    { etichetta: "Manodopera", valore: conti.manodopera, nota: `${conti.oreTotali} ore registrate` },
    { etichetta: "Materiali", valore: conti.materiali },
    { etichetta: "Subappalti", valore: conti.subappalti },
    { etichetta: "Costo sostenuto a oggi", valore: conti.costo, forte: true },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--radius-scheda)] border border-line bg-white">
      <div className="grid grid-cols-1 divide-y divide-line-soft lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* ------------------------- come sembra guardando il contratto */}
        <div className="p-5">
          <p className="occhiello text-ink-500">Come sembra oggi</p>
          <p className="mt-2 text-t1 font-bold leading-none text-ink-900">
            {euro(conti.margine)}
          </p>
          <p className="mt-1.5 text-corrente font-semibold text-ink-600">
            {conti.marginePct}% di margine
          </p>
          <p className="mt-2 text-piccolo leading-relaxed text-ink-500">
            {euro(conti.ricavo)} di contratto meno {euro(conti.costo)} già spesi. È il conto che si
            fa in ufficio, e a cantiere aperto dice sempre di sì.
          </p>
        </div>

        {/* ---------------------------- come finirà, a questo ritmo */}
        <div className={`p-5 ${sfondo}`}>
          <p className={`occhiello ${tono}`}>Come finirà, a questo ritmo</p>
          <p className={`mt-2 text-t1 font-bold leading-none ${tono}`}>
            {euro(conti.marginePrevisto)}
          </p>
          <p className={`mt-1.5 text-corrente font-semibold ${tono}`}>
            {conti.marginePrevistoPct}% di margine · atteso {MARGINE_ATTESO}%
          </p>
          <p className="mt-2 text-piccolo leading-relaxed text-ink-600">
            {conti.proiettabile ? (
              <>
                Al {conti.avanzamento}% avete speso {euro(conti.costo)}: allo stesso ritmo il
                cantiere costerà {euro(conti.costoAFinire)}.
              </>
            ) : (
              <>
                Il cantiere è appena partito: sotto il 10% di avanzamento una proiezione non
                direbbe niente di attendibile.
              </>
            )}
          </p>
        </div>
      </div>

      <dl className="border-t border-line-soft px-5 py-3.5">
        {voci.map((v) => (
          <div
            key={v.etichetta}
            className={`flex items-baseline justify-between gap-4 py-1 ${
              v.forte ? "mt-1 border-t border-line-soft pt-2" : ""
            }`}
          >
            <dt className={v.forte ? "text-corrente font-semibold text-ink-900" : "text-corrente text-ink-500"}>
              {v.etichetta}
              {v.nota ? <span className="ml-2 text-mini text-ink-400">{v.nota}</span> : null}
            </dt>
            <dd
              className={`shrink-0 tabular-nums ${
                v.forte ? "text-corrente font-bold text-ink-900" : "text-corrente font-medium text-ink-900"
              }`}
            >
              {euro(v.valore)}
            </dd>
          </div>
        ))}
      </dl>

      {conti.variantiScoperte.length ? (
        <p className="flex gap-2 border-t border-line-soft bg-[#fbeceb] px-5 py-3 text-piccolo leading-relaxed text-critico">
          <Icona misura="sm" nome="AlertTriangle" className="mt-0.5 shrink-0" />
          <span>
            Fuori da questo conto ci sono {euro(conti.valoreScoperto)} di lavori già eseguiti e mai
            approvati per iscritto: sono costati {euro(conti.costoScoperto)} e oggi nessuno li deve.
          </span>
        </p>
      ) : null}
    </div>
  );
}
