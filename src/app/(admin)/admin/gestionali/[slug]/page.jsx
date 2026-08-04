import { notFound } from "next/navigation";
import { tutteLeBasi, tutteLeCategorie, unGestionale } from "@/lib/contenuti-store";
import ModuloGestionale from "./ModuloGestionale";

/** Editor di una singola scheda gestionale. */
export default async function PaginaEditorGestionale({ params }) {
  const { slug } = await params;
  const gestionale = await unGestionale(slug);
  if (!gestionale) notFound();

  const [categorie, basi] = await Promise.all([tutteLeCategorie(), tutteLeBasi()]);
  const categoria = categorie.find((c) => c.slug === gestionale.categoriaSlug);
  const base = basi.find((b) => b.slug === gestionale.baseSlug);

  return (
    <ModuloGestionale
      /* La chiave cambia quando cambiano i testi salvati: così dopo un
         ripristino il modulo si ricarica invece di mostrare il testo vecchio. */
      key={`${gestionale.slug}-${gestionale.nome}-${gestionale.metaTitle}`}
      gestionale={gestionale}
      nomeCategoria={categoria?.nome || gestionale.categoriaSlug}
      nomeBase={base?.nome || gestionale.baseSlug}
    />
  );
}
