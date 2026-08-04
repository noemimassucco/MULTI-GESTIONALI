import { getCategorieConGestionali, getGestionali } from "@/lib/catalogo";
import Navbar from "@/components/sito/Navbar";
import BarraLaterale from "@/components/sito/BarraLaterale";
import PiePagina from "@/components/sito/PiePagina";

/**
 * Cornice del sito pubblico: barra in alto, colonna di icone, piè di pagina.
 * Le demo dei gestionali stanno FUORI da questo gruppo e hanno la loro
 * interfaccia a schermo pieno.
 */
export default function LayoutSito({ children }) {
  const categorie = getCategorieConGestionali();
  const gestionali = getGestionali();

  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-controllo)] focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Vai al contenuto
      </a>
      <BarraLaterale />
      {/* Un solo incolonnamento per barra, contenuto e piè di pagina. */}
      <div className="2xl:pl-[var(--rail)]">
        <Navbar categorie={categorie} />
        <main id="contenuto">{children}</main>
        <PiePagina categorie={categorie} gestionali={gestionali} />
      </div>
    </>
  );
}
