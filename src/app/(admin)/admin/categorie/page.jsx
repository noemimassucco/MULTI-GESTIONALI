import { tutteLeCategorie, tuttiIGestionali } from "@/lib/contenuti-store";
import ModuloCategoria from "./ModuloCategoria";

/** Le categorie del catalogo: nome, sottotitolo, ordine e se si vedono. */
export default async function PaginaCategorie() {
  const [categorie, gestionali] = await Promise.all([tutteLeCategorie(), tuttiIGestionali()]);
  const quante = (slug) => gestionali.filter((g) => g.categoriaSlug === slug).length;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-t1 font-bold text-ink-900">Categorie</h1>
        <p className="mt-1 text-corrente text-ink-500">
          {categorie.length} categorie. Ognuna raccoglie i gestionali che le appartengono: se la
          togli dalla pubblicazione spariscono dal catalogo anche le sue schede.
        </p>
      </header>

      <div className="space-y-4">
        {categorie.map((c) => (
          <div key={c.slug}>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-testo font-bold text-ink-900">{c.nome}</h2>
              <span className="text-piccolo text-ink-500">
                {quante(c.slug)} gestionali in questa categoria
              </span>
            </div>
            <ModuloCategoria
              /* Dopo un salvataggio i valori arrivano aggiornati dal server. */
              key={`${c.slug}-${c.nome}-${c.ordine}`}
              categoria={c}
            />
          </div>
        ))}
      </div>
    </>
  );
}
