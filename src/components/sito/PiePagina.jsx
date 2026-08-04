import Link from "next/link";
import { piePagina, sito } from "@/lib/sito";
import { Contenitore } from "@/components/ui/Sezione";
import Marchio from "@/components/sito/Marchio";
import Icona from "@/components/ui/Icona";

export default function PiePagina({ categorie = [], gestionali = [] }) {
  const anno = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <Contenitore className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Marchio />
            <p className="mt-6 max-w-xs text-corrente leading-relaxed text-ink-600">
              Gestionali già pronti come base, personalizzati sul modo di lavorare della tua
              attività.
            </p>
            <a
              href={`mailto:${sito.email}`}
              className="mt-6 inline-flex items-center gap-2 text-corrente font-semibold text-brand-700 hover:text-brand-800"
            >
              <Icona misura="sm" nome="Mail" />
              {sito.email}
            </a>
          </div>

          <div>
            <h3 className="occhiello text-ink-500">
              Categorie
            </h3>
            <ul className="mt-6 space-y-3">
              {categorie.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categorie/${c.slug}`}
                    className="text-corrente text-ink-600 hover:text-brand-700"
                  >
                    {c.nome}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categorie" className="text-corrente font-semibold text-brand-700">
                  Tutte le categorie
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="occhiello text-ink-500">
              Gestionali
            </h3>
            <ul className="mt-6 space-y-3">
              {gestionali.slice(0, 6).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/gestionali/${g.slug}`}
                    className="text-corrente text-ink-600 hover:text-brand-700"
                  >
                    {g.nome.replace("Gestionale ", "")}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gestionali" className="text-corrente font-semibold text-brand-700">
                  Tutti i gestionali
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="occhiello text-ink-500">
              Informazioni
            </h3>
            <ul className="mt-6 space-y-3">
              {piePagina.informazioni.map((v) => (
                <li key={v.href}>
                  <Link href={v.href} className="text-corrente text-ink-600 hover:text-brand-700">
                    {v.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/richiedi" className="text-corrente font-semibold text-brand-700">
                  Richiedi il tuo gestionale
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
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
