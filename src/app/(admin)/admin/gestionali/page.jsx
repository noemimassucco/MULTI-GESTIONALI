import { tutteLeBasi, tutteLeCategorie, tuttiIGestionali } from "@/lib/contenuti-store";
import ElencoGestionali from "./ElencoGestionali";

/** Elenco delle schede gestionali: qui si pubblica, si ritira e si apre l'editor. */
export default async function PaginaGestionali() {
  const [gestionali, categorie, basi] = await Promise.all([
    tuttiIGestionali(),
    tutteLeCategorie(),
    tutteLeBasi(),
  ]);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-t1 font-bold text-ink-900">Gestionali</h1>
        <p className="mt-1 text-corrente text-ink-500">
          {gestionali.length} schede in catalogo. Apri il nome per modificare i testi, oppure
          pubblica e ritira direttamente da qui.
        </p>
      </header>

      <ElencoGestionali gestionali={gestionali} categorie={categorie} basi={basi} />
    </>
  );
}
