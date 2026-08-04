import { Contenitore, Sezione } from "@/components/ui/Sezione";
import CategoriaCard from "@/components/sito/CategoriaCard";
import CtaBanner from "@/components/sito/CtaBanner";
import { getCategorieConGestionali, getStatistiche } from "@/lib/catalogo";

export const metadata = {
  title: "Categorie",
  description:
    "Tutti i settori coperti dal catalogo: immobili, edilizia, manutenzione, servizi alle aziende, studi professionali, commercio, trasporti e altri.",
};

export default function PaginaCategorie() {
  const categorie = getCategorieConGestionali();
  const stat = getStatistiche();

  return (
    <>
      <section className="border-b border-line bg-surface-blue py-12 sm:py-16">
        <Contenitore>
          <h1 className="max-w-2xl text-[32px] font-extrabold leading-tight sm:text-[42px]">
            Scegli il tuo settore
          </h1>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-500 sm:text-base">
            {stat.categorie} categorie di attività, {stat.gestionali} gestionali pubblicati. Parti
            dal settore più vicino al tuo: la base è la stessa, cambia il modo in cui viene
            adattata.
          </p>
        </Contenitore>
      </section>

      <Sezione sfondo="bianco">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categorie.map((c) => (
            <CategoriaCard key={c.slug} categoria={c} />
          ))}
        </div>
      </Sezione>

      <CtaBanner />
    </>
  );
}
