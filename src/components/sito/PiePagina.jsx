import Link from "next/link";
import { piePagina, sito } from "@/lib/sito";
import { Contenitore } from "@/components/ui/Sezione";
import Marchio from "@/components/sito/Marchio";
import Icona from "@/components/ui/Icona";

export default function PiePagina({ categorie = [], gestionali = [] }) {
  const anno = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-alt">
      <Contenitore className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Marchio />
            <p className="mt-4 max-w-xs text-corrente leading-relaxed text-ink-500">
              Gestionali già pronti come base, personalizzati sul modo di lavorare della tua
              attività.
            </p>
            <a
              href={`mailto:${sito.email}`}
              className="mt-5 inline-flex items-center gap-2 text-corrente font-medium text-brand-700 hover:text-brand-800"
            >
              <Icona misura="sm" nome="Mail" />
              {sito.email}
            </a>
          </div>

          <div>
            <h3 className="text-piccolo font-semibold uppercase tracking-wide text-ink-900">
              Categorie
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categorie.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categorie/${c.slug}`}
                    className="text-corrente text-ink-500 hover:text-brand-700"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categorie" className="text-corrente font-medium text-brand-700">
                  Tutte le categorie
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-piccolo font-semibold uppercase tracking-wide text-ink-900">
              Gestionali
            </h3>
            <ul className="mt-4 space-y-2.5">
              {gestionali.slice(0, 6).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/gestionali/${g.slug}`}
                    className="text-corrente text-ink-500 hover:text-brand-700"
                  >
                    {g.nome.replace("Gestionale ", "")}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gestionali" className="text-corrente font-medium text-brand-700">
                  Tutti i gestionali
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-piccolo font-semibold uppercase tracking-wide text-ink-900">
              Informazioni
            </h3>
            <ul className="mt-4 space-y-2.5">
              {piePagina.informazioni.map((v) => (
                <li key={v.href}>
                  <Link href={v.href} className="text-corrente text-ink-500 hover:text-brand-700">
                    {v.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/richiedi" className="text-corrente font-medium text-brand-700">
                  Richiedi il tuo gestionale
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-piccolo text-ink-500">
            © {anno} {sito.nome} — {sito.autore}, {sito.citta}
          </p>
          <ul className="flex flex-wrap gap-5">
            {piePagina.legali.map((v) => (
              <li key={v.href}>
                <Link href={v.href} className="text-piccolo text-ink-500 hover:text-brand-700">
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Contenitore>
    </footer>
  );
}
