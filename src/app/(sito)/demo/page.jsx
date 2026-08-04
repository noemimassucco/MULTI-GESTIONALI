import Link from "next/link";
import { Contenitore, Sezione, TitoloSezione } from "@/components/ui/Sezione";
import Bottone from "@/components/ui/Bottone";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";
import CtaBanner from "@/components/sito/CtaBanner";
import { getBasi, getGestionaliPerBase } from "@/lib/catalogo";

export const metadata = {
  title: "Demo",
  description:
    "Le basi gestionali su cui è costruito tutto il catalogo. Ogni demo si potrà provare liberamente con dati di esempio.",
};

export default function PaginaDemo() {
  const basi = getBasi();
  const pronte = basi.filter((b) => b.demoPronta);

  return (
    <>
      <section className="border-b border-line bg-surface-blue py-10 lg:py-14">
        <Contenitore>
          <Pastiglia variante="brand">
            <Icona misura="sm" nome="Blocks" />
            {basi.length} basi gestionali
          </Pastiglia>
          <h1 className="mt-5 max-w-2xl text-titolo font-extrabold leading-tight sm:text-mega">
            Le basi su cui è costruito tutto il catalogo
          </h1>
          <p className="mt-4 max-w-2xl text-testo leading-relaxed text-ink-500">
            I gestionali a catalogo non sono programmi tutti diversi fra loro: sono {basi.length}{" "}
            basi solide, ognuna adattata al settore. È il motivo per cui la personalizzazione costa
            poco e i tempi restano brevi.
          </p>

          {/* Dichiarazione onesta sullo stato delle demo */}
          {pronte.length === 0 ? (
            <div className="mt-8 flex max-w-2xl gap-3 rounded-[var(--radius-scheda)] border border-accento-200 bg-accento-50 p-4">
              <Icona misura="md" nome="Clock" className="mt-0.5 shrink-0 text-accento-600" />
              <p className="text-corrente leading-relaxed text-accento-700">
                <strong className="font-semibold">Le demo non sono ancora online.</strong> Sto
                costruendo la prima, quella della base &ldquo;Clienti e attività&rdquo;. Nel
                frattempo, se vuoi vedere un gestionale vero al lavoro, scrivimi e te lo mostro in
                una videochiamata di venti minuti.
              </p>
            </div>
          ) : null}
        </Contenitore>
      </section>

      <Sezione sfondo="bianco">
        <div className="grid gap-5 lg:grid-cols-2">
          {basi.map((base) => {
            const collegati = getGestionaliPerBase(base.slug);
            return (
              <article
                key={base.slug}
                className="flex flex-col rounded-[var(--radius-scheda)] border border-line bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-600">
                      <Icona misura="md" nome="Blocks" />
                    </span>
                    <h2 className="text-t3 font-bold leading-tight">{base.nome}</h2>
                  </div>
                  {base.demoPronta ? (
                    <Pastiglia variante="successo">Demo online</Pastiglia>
                  ) : (
                    <Pastiglia variante="attesa">In preparazione</Pastiglia>
                  )}
                </div>

                <p className="mt-4 text-corrente leading-relaxed text-ink-500">{base.descrizione}</p>

                <div className="mt-5">
                  <p className="text-piccolo font-semibold text-ink-900">Cosa contiene</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {base.funzioni.slice(0, 8).map((f) => (
                      <li
                        key={f}
                        className="rounded-[var(--radius-controllo)] bg-surface-alt px-2 py-1 text-mini font-medium text-ink-600"
                      >
                        {f}
                      </li>
                    ))}
                    {base.funzioni.length > 8 ? (
                      <li className="px-1 py-1 text-mini text-ink-400">
                        +{base.funzioni.length - 8}
                      </li>
                    ) : null}
                  </ul>
                </div>

                <div className="mt-5">
                  <p className="text-piccolo font-semibold text-ink-900">Adatta a</p>
                  <p className="mt-1.5 text-piccolo leading-relaxed text-ink-500">
                    {base.adattoA.join(" · ")}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-5">
                  {collegati.length ? (
                    <Link
                      href={`/gestionali?base=${base.slug}`}
                      className="text-piccolo font-semibold text-brand-700 hover:text-brand-800"
                    >
                      {collegati.length}{" "}
                      {collegati.length === 1 ? "gestionale usa" : "gestionali usano"} questa base
                    </Link>
                  ) : (
                    <span className="text-piccolo text-ink-400">Settori in preparazione</span>
                  )}
                  {base.demoPronta && base.demoPath ? (
                    <Bottone href={base.demoPath} misura="sm">
                      <Icona misura="sm" nome="PlayCircle" />
                      Apri la demo
                    </Bottone>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </Sezione>

      <Sezione sfondo="alt">
        <TitoloSezione
          titolo="Come saranno le demo"
          testo="Non un video registrato: un gestionale vero, con dati inventati, in cui puoi cliccare ovunque."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            {
              icona: "Database",
              titolo: "Dati di esempio",
              testo: "Clienti, attività e documenti inventati ma realistici. Nessun dato vero di nessuno.",
            },
            {
              icona: "Settings2",
              titolo: "Tutto cliccabile",
              testo: "Puoi filtrare, aprire schede, cambiare stati, aggiungere righe.",
            },
            {
              icona: "RefreshCw",
              titolo: "Si azzera da sola",
              testo: "Al ricaricamento della pagina torna com'era: non puoi rovinare niente.",
            },
          ].map((c) => (
            <div key={c.titolo} className="rounded-[var(--radius-scheda)] border border-line bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-[var(--radius-scheda)] bg-brand-50 text-brand-600">
                <Icona misura="md" nome={c.icona} />
              </span>
              <h3 className="mt-4 text-testo font-semibold">{c.titolo}</h3>
              <p className="mt-2 text-piccolo leading-relaxed text-ink-500">{c.testo}</p>
            </div>
          ))}
        </div>
      </Sezione>

      <CtaBanner
        titolo="Vuoi vederlo davvero al lavoro?"
        testo="Finché le demo non sono online, te lo mostro io in una videochiamata di venti minuti, sul tuo settore."
        azione={{ href: "/contatti", label: "Fissiamo una chiamata" }}
        secondaria={{ href: "/gestionali", label: "Intanto guarda il catalogo" }}
      />
    </>
  );
}
