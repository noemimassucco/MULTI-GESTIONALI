import { Contenitore } from "@/components/ui/Sezione";
import CatalogoFiltrato from "@/components/sito/CatalogoFiltrato";
import CtaBanner from "@/components/sito/CtaBanner";
import {
  getBasi,
  getCategorieConGestionali,
  getFunzionalita,
  getGestionali,
  getStatistiche,
} from "@/lib/catalogo";

export const metadata = {
  title: "Tutti i gestionali",
  description:
    "Il catalogo completo dei gestionali su misura, filtrabile per categoria e per funzioni. Ogni gestionale è una base già funzionante da personalizzare.",
};

export default function PaginaGestionali() {
  const gestionali = getGestionali();
  const categorie = getCategorieConGestionali();
  const basi = getBasi();
  const funzionalita = getFunzionalita();
  const stat = getStatistiche();

  return (
    <>
      <section className="border-b border-line bg-surface-blue py-12 sm:py-16">
        <Contenitore>
          <h1 className="max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[42px]">
            Tutti i gestionali
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-500 sm:text-base">
            {stat.gestionali} gestionali pubblicati, costruiti su {stat.basi} basi riutilizzabili.
            Filtra per settore o per quello che ti serve gestire: ogni scheda spiega cosa fa la base
            e cosa si può aggiungere per te.
          </p>
          {stat.inArrivo > 0 ? (
            <p className="mt-3 text-[13.5px] text-ink-400">
              Altri {stat.inArrivo} settori sono in preparazione. Se il tuo non è ancora in elenco,
              scrivimi: si parte dal gestionale più simile.
            </p>
          ) : null}
        </Contenitore>
      </section>

      <div className="bg-white py-12 sm:py-14">
        <Contenitore>
          <CatalogoFiltrato
            gestionali={gestionali}
            categorie={categorie}
            basi={basi}
            funzionalita={funzionalita}
          />
        </Contenitore>
      </div>

      <CtaBanner />
    </>
  );
}
