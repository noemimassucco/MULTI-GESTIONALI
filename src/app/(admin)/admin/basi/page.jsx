import Link from "next/link";
import { tutteLeBasi, tuttiIGestionali } from "@/lib/contenuti-store";
import Icona from "@/components/ui/Icona";
import Pastiglia from "@/components/ui/Pastiglia";

/** Le basi gestionali: si guardano, non si modificano da qui. */
export default async function PaginaBasi() {
  const [basi, gestionali] = await Promise.all([tutteLeBasi(), tuttiIGestionali()]);
  const quante = (slug) => gestionali.filter((g) => g.baseSlug === slug).length;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-t1 font-bold text-ink-900">Basi</h1>
        <p className="mt-1 text-corrente text-ink-500">
          {basi.length} basi: sono i gestionali già funzionanti che vengono duplicati e adattati a
          ogni cliente. Qui si consultano soltanto.
        </p>
      </header>

      <div className="space-y-4">
        {basi.map((b) => (
          <article
            key={b.slug}
            className="rounded-[var(--radius-scheda)] border border-line bg-white p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-t3 font-bold text-ink-900">{b.nome}</h2>
                <p className="font-mono text-mini text-ink-500">{b.slug}</p>
              </div>
              <Pastiglia variante={b.demoPronta ? "successo" : "neutra"}>
                {b.demoPronta ? "Demo pronta" : "Demo da fare"}
              </Pastiglia>
            </div>

            <p className="mt-3 text-corrente leading-relaxed text-ink-600">{b.descrizione}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-piccolo text-ink-500">
                Schede che la usano:{" "}
                <span className="font-semibold text-ink-800">{quante(b.slug)}</span>
              </span>
              {b.demoPronta && b.demoPath ? (
                <Link
                  href={b.demoPath}
                  className="inline-flex items-center gap-1.5 text-piccolo font-semibold text-brand-700 hover:text-brand-800"
                >
                  <Icona misura="sm" nome="PlayCircle" />
                  Apri la demo
                </Link>
              ) : (
                <span className="text-piccolo text-ink-400">Demo non ancora disponibile</span>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 flex items-start gap-2 text-piccolo leading-relaxed text-ink-500">
        <Icona misura="sm" nome="Blocks" className="mt-0.5 shrink-0 text-ink-400" />
        Le basi si modificano nel codice: non sono contenuti del sito ma la struttura stessa dei
        gestionali — entità, campi, schermate. Cambiarle da qui vorrebbe dire cambiare il programma,
        non il testo che lo descrive.
      </p>
    </>
  );
}
