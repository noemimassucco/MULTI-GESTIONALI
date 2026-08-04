import Icona from "@/components/ui/Icona";

const kpi = [
  { etichetta: "Attività da fare", valore: "24", nota: "6 in scadenza" },
  { etichetta: "Scadenze", valore: "7", nota: "2 in ritardo", allerta: true },
  { etichetta: "Interventi", valore: "15", nota: "3 da chiudere" },
  { etichetta: "Da fatturare", valore: "28.540 €", nota: "questo mese" },
];

const scadenze = [
  { titolo: "Consegna materiali", dove: "Cantiere Via Roma", quando: "24 mag", stato: "ritardo" },
  { titolo: "Manutenzione impianto", dove: "Condominio Verdi", quando: "25 mag", stato: "oggi" },
  { titolo: "Pagamento fattura", dove: "Cliente Bianchi", quando: "27 mag", stato: "prossima" },
  { titolo: "Sopralluogo", dove: "Via Milano 123", quando: "28 mag", stato: "prossima" },
];

const coloriStato = {
  ritardo: { punto: "bg-accento-500", testo: "text-accento-700", bg: "bg-accento-50" },
  oggi: { punto: "bg-accento-300", testo: "text-ink-700", bg: "bg-surface-alt" },
  prossima: { punto: "bg-brand-400", testo: "text-brand-700", bg: "bg-brand-50" },
};

/* Andamento fittizio ma coerente, disegnato a mano per non dipendere da librerie */
const punti = [12, 20, 16, 28, 24, 38, 34, 46, 52, 48, 62, 70];

function Grafico() {
  const larghezza = 320;
  const altezza = 96;
  const max = Math.max(...punti);
  const passo = larghezza / (punti.length - 1);
  const coord = punti.map((p, i) => [i * passo, altezza - (p / max) * (altezza - 10)]);
  const linea = coord
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${linea} L${larghezza},${altezza} L0,${altezza} Z`;

  return (
    <svg viewBox={`0 0 ${larghezza} ${altezza}`} className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="riempimento" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#234f45" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#234f45" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#riempimento)" />
      <path d={linea} fill="none" stroke="#234f45" strokeWidth="2" strokeLinecap="round" />
      {coord.slice(-1).map(([x, y]) => (
        <circle key="ultimo" cx={x} cy={y} r="3.5" fill="#234f45" stroke="white" strokeWidth="2.5" />
      ))}
    </svg>
  );
}

/**
 * Anteprima statica di una dashboard, usata nella home.
 * Non è una demo: è un'illustrazione dell'interfaccia. I dati sono di esempio.
 *
 * Le colonne rispondono alla larghezza del riquadro, non a quella della
 * finestra: qui dentro sta in un pannello stretto anche su uno schermo
 * grande, e con le classi normali si sarebbe schiacciato.
 */
export default function AnteprimaDashboard() {
  return (
    <div className="@container overflow-hidden rounded-[var(--radius-scheda)] border border-line bg-white shadow-[var(--shadow-soft)]">
      {/* barra superiore */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-50 ring-1 ring-inset ring-brand-100">
          <span className="size-3 rounded-[3px] border-[1.5px] border-brand-600" />
        </span>
        <span className="text-corrente font-semibold text-ink-900">Dashboard</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-[var(--radius-controllo)] text-ink-400">
            <Icona misura="sm" nome="Search" />
          </span>
          <span className="hidden items-center gap-2 rounded-[var(--radius-controllo)] bg-surface-alt py-1 pl-1 pr-2.5 @md:flex">
            <span className="flex size-6 items-center justify-center rounded-[var(--radius-controllo)] bg-brand-100 text-micro font-bold text-brand-700">
              MR
            </span>
            <span className="text-mini font-medium text-ink-700">Mario Rossi</span>
          </span>
        </span>
      </div>

      <div className="flex">
        {/* colonna icone */}
        <div className="hidden w-11 shrink-0 flex-col items-center gap-2.5 bg-brand-900 py-4 @sm:flex">
          {["LayoutGrid", "Users", "Clock", "FolderOpen", "MessageSquare", "Settings2"].map(
            (nome, i) => (
              <span
                key={nome}
                className={`flex size-7 items-center justify-center rounded-[var(--radius-controllo)] ${
                  i === 0 ? "bg-white/10 text-accento-300" : "text-white/35"
                }`}
              >
                <Icona misura="md" nome={nome} />
              </span>
            ),
          )}
        </div>

        <div className="min-w-0 flex-1 bg-surface-alt p-3.5">
          {/* KPI */}
          <div className="grid grid-cols-2 gap-2.5 @lg:grid-cols-4">
            {kpi.map((k) => (
              <div
                key={k.etichetta}
                className="rounded-[var(--radius-controllo)] border border-line bg-white p-3"
              >
                <p className="truncate text-micro font-medium text-ink-500">{k.etichetta}</p>
                <p className="cifre mt-1.5 truncate text-guida font-bold leading-none text-ink-900">
                  {k.valore}
                </p>
                <p
                  className={`mt-1.5 truncate text-micro font-medium ${
                    k.allerta ? "text-accento-600" : "text-ink-500"
                  }`}
                >
                  {k.nota}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-2.5 grid gap-2.5 @lg:grid-cols-[1.25fr_1fr]">
            {/* grafico */}
            <div className="rounded-[var(--radius-controllo)] border border-line bg-white p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-mini font-semibold text-ink-900">Andamento attività</p>
                <span className="shrink-0 rounded-[var(--radius-controllo)] bg-surface-alt px-1.5 py-0.5 text-micro font-medium text-ink-500">
                  30 giorni
                </span>
              </div>
              <div className="mt-2 h-[80px]">
                <Grafico />
              </div>
              <div className="mt-1 flex justify-between text-micro text-ink-500">
                <span>01 mag</span>
                <span>14 mag</span>
                <span>28 mag</span>
              </div>
            </div>

            {/* scadenze */}
            <div className="rounded-[var(--radius-controllo)] border border-line bg-white p-3.5">
              <p className="text-mini font-semibold text-ink-900">Prossime scadenze</p>
              <ul className="mt-2.5 space-y-2">
                {scadenze.map((s) => {
                  const c = coloriStato[s.stato];
                  return (
                    <li key={s.titolo} className="flex items-start gap-2.5">
                      <span className={`mt-1 size-1.5 shrink-0 rounded-full ${c.punto}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-mini font-medium text-ink-800">
                          {s.titolo}
                        </span>
                        <span className="block truncate text-micro text-ink-500">{s.dove}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-[var(--radius-controllo)] px-1.5 py-0.5 text-micro font-semibold ${c.bg} ${c.testo}`}
                      >
                        {s.quando}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* azioni rapide */}
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 @lg:grid-cols-4">
            {[
              { label: "Nuova attività", icona: "Check" },
              { label: "Nuovo cliente", icona: "Users" },
              { label: "Nuovo intervento", icona: "Wrench" },
              { label: "Carica documenti", icona: "Upload" },
            ].map((a) => (
              <span
                key={a.label}
                className="flex items-center gap-2 rounded-[var(--radius-controllo)] border border-line bg-white px-2.5 py-2 text-micro font-medium text-ink-700"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-brand-50 text-brand-600">
                  <Icona misura="sm" nome={a.icona} className="size-3.5" />
                </span>
                <span className="truncate">{a.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
