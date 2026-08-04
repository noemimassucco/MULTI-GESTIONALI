import Link from "next/link";
import {
  contaModifiche,
  richiesteRicevute,
  tutteLeBasi,
  tutteLeCategorie,
  tuttiIGestionali,
} from "@/lib/contenuti-store";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";

/** Data leggibile, senza secondi: serve solo per capire quando è arrivata. */
function dataOra(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Riquadro con un numero grosso e una riga di spiegazione. */
function Riquadro({ icona, etichetta, numero, nota }) {
  return (
    <div className="rounded-[var(--radius-scheda)] border border-line bg-white p-5">
      <div className="flex items-center gap-2 text-ink-500">
        <Icona misura="sm" nome={icona} className="text-ink-400" />
        <span className="text-mini font-semibold uppercase tracking-wide">{etichetta}</span>
      </div>
      <p className="mt-2 text-t1 font-bold text-ink-900">{numero}</p>
      {nota ? <p className="mt-1 text-piccolo text-ink-500">{nota}</p> : null}
    </div>
  );
}

/** Prima pagina dell'amministrazione: quanti contenuti ci sono e cosa è arrivato. */
export default async function PaginaRiepilogo() {
  const [gestionali, categorie, basi, richieste, modifiche] = await Promise.all([
    tuttiIGestionali(),
    tutteLeCategorie(),
    tutteLeBasi(),
    richiesteRicevute(),
    contaModifiche(),
  ]);

  const pubblicati = gestionali.filter((g) => g.stato === "pubblicato").length;
  const bozze = gestionali.length - pubblicati;
  const basiPronte = basi.filter((b) => b.demoPronta).length;
  const ultime = richieste.slice(0, 5);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-t1 font-bold text-ink-900">Riepilogo</h1>
        <p className="mt-1 text-corrente text-ink-500">
          Lo stato dei contenuti del sito e le richieste arrivate dal modulo.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Riquadro
          icona="FileStack"
          etichetta="Gestionali"
          numero={pubblicati}
          nota={`pubblicati · ${bozze} in bozza`}
        />
        <Riquadro
          icona="Shapes"
          etichetta="Categorie"
          numero={categorie.length}
          nota={`${categorie.filter((c) => c.pubblicata).length} pubblicate`}
        />
        <Riquadro
          icona="Blocks"
          etichetta="Basi con demo"
          numero={basiPronte}
          nota={`su ${basi.length} basi in catalogo`}
        />
        <Riquadro
          icona="Mail"
          etichetta="Richieste"
          numero={richieste.length}
          nota="arrivate dal modulo del sito"
        />
      </div>

      {/* ------------------------------------------- ultime richieste */}
      <section className="mt-8 rounded-[var(--radius-scheda)] border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-testo font-bold text-ink-900">Ultime richieste</h2>
          <Link
            href="/admin/richieste"
            className="inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
          >
            Vedi tutte
            <Icona misura="sm" nome="ArrowRight" />
          </Link>
        </div>

        {ultime.length ? (
          <ul className="divide-y divide-line-soft">
            {ultime.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-corrente font-semibold text-ink-900">
                    {r.nome}
                    {r.azienda ? (
                      <span className="ml-2 font-medium text-ink-500">{r.azienda}</span>
                    ) : null}
                  </p>
                  <a
                    href={`mailto:${r.email}`}
                    className="text-piccolo text-brand-700 hover:text-brand-800"
                  >
                    {r.email}
                  </a>
                </div>
                <span className="shrink-0 text-piccolo text-ink-500">{dataOra(r.ricevutaIl)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-12 text-center text-corrente text-ink-500">
            Non è ancora arrivata nessuna richiesta dal modulo del sito.
          </p>
        )}
      </section>

      {/* ------------------------------------------- modifiche in sospeso */}
      <section className="mt-6 rounded-[var(--radius-scheda)] border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-testo font-bold text-ink-900">
            Modifiche non ancora committate: {modifiche}
          </h2>
          <Pastiglia variante={modifiche ? "attesa" : "neutra"}>
            {modifiche ? "da portare su GitHub" : "tutto allineato"}
          </Pastiglia>
        </div>
        <p className="mt-2 text-corrente leading-relaxed text-ink-600">
          Quello che modifichi da qui finisce nel file{" "}
          <span className="font-mono text-mini text-ink-800">src/data/contenuti.json</span>. Finché
          non lo porti su GitHub con GitHub Desktop — fai commit e poi push — le modifiche restano
          solo sul tuo computer e il sito online continua a mostrare i testi di prima.
        </p>
      </section>
    </>
  );
}
